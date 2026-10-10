import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { OfflineBanner } from '../../components/OfflineBanner';
import { Screen } from '../../components/ui/Screen';
import { emoji } from '../../constants/emoji';
import { colors } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import { listContacts } from '../../services/contactService';
import { useOnlineStatus } from '../../services/connectivity';
import { checkForegroundPermission } from '../../services/locationService';
import { getActiveSos, getHistory } from '../../services/sosService';
import { useShare } from '../../store/shareStore';
import { greetingKey } from '../../utils/format';

export default function HomeScreen() {
  const { user } = useAuth();
  const { session } = useShare();
  const { t } = useTranslation();
  const online = useOnlineStatus();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [contactCount, setContactCount] = useState(0);
  const [locationOn, setLocationOn] = useState(false);
  const [hasNotices, setHasNotices] = useState(false);
  const firstName = user?.name?.split(' ')[0] || t('home.fallbackName');
  const sharing = Boolean(session && session.ids.length > 0 && user?.privacy.shareLiveLocation);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      getActiveSos()
        .then((alert) => {
          if (active) setActiveId(alert?.id ?? null);
        })
        .catch(() => {
          if (active) setActiveId(null);
        });
      listContacts()
        .then((contacts) => {
          if (active) setContactCount(contacts.length);
        })
        .catch(() => {
          if (active) setContactCount(0);
        });
      checkForegroundPermission()
        .then((granted) => {
          if (active) setLocationOn(granted);
        })
        .catch(() => {
          if (active) setLocationOn(false);
        });
      getHistory()
        .then((data) => {
          if (active) setHasNotices(data.alerts.length > 0);
        })
        .catch(() => {
          if (active) setHasNotices(false);
        });
      return () => {
        active = false;
      };
    }, []),
  );

  return (
    <Screen edges={['top']} contentStyle={styles.content}>
      <View style={styles.top}>
        <View style={styles.greeting}>
          <Text style={styles.eyebrow}>
            {emoji[greetingKey()]} {t(`home.${greetingKey()}`)}
          </Text>
          <Text style={styles.name}>{firstName}</Text>
          <View style={styles.pills}>
            <View style={[styles.pill, !locationOn && styles.pillOff]}>
              <View style={[styles.pillDot, !locationOn && styles.pillDotOff]} />
              <Text style={[styles.pillText, !locationOn && styles.pillTextOff]}>
                {emoji.location} {locationOn ? t('home.permissionOn') : t('home.permissionOff')}
              </Text>
            </View>
            <View style={[styles.pill, !sharing && styles.pillOff]}>
              <View style={[styles.pillDot, !sharing && styles.pillDotOff]} />
              <Text style={[styles.pillText, !sharing && styles.pillTextOff]}>
                {emoji.offline} {sharing ? t('home.sharingOn') : t('home.sharingOff')}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.actions}>
          <Pressable accessibilityRole="button" accessibilityLabel={t('notifications.title')} style={styles.iconButton} onPress={() => router.push('/screens/notifications')}>
            <Ionicons name="notifications-outline" size={22} color={colors.ink} />
            {hasNotices ? <View style={styles.badge} /> : null}
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel={t('tabs.profile')} style={styles.iconButton} onPress={() => router.push('/(tabs)/profile')}>
            <Ionicons name="person-outline" size={22} color={colors.ink} />
          </Pressable>
        </View>
      </View>

      {!online ? <OfflineBanner message={t('home.offline')} /> : null}

      <Text style={styles.question}>{emoji.sos} {t('home.question')}</Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('home.sosLabel')}
        accessibilityHint={t('home.sosHintA11y')}
        onPress={() => {
          if (activeId) {
            router.push({ pathname: '/screens/sos-active', params: { id: activeId } });
            return;
          }
          router.push('/screens/sos-confirmation');
        }}
        style={styles.sosWrap}
      >
        <View style={styles.ringOuter}>
          <View style={styles.ringInner}>
            <View style={styles.sos}>
              <Text style={styles.sosText}>{emoji.sos} {t('home.sos')}</Text>
              <Text style={styles.sosHint}>{activeId ? t('home.sosActive') : t('home.sosHint')}</Text>
            </View>
          </View>
        </View>
      </Pressable>

      <Text style={styles.caption}>{t('home.caption')}</Text>

      <View style={styles.grid}>
        <HomeCard
          tint="#FFF1F2"
          emojiMark={emoji.location}
          title={t('home.location')}
          body={sharing ? t('home.sharingWith', { count: session?.ids.length ?? 0 }) : t('home.notSharing')}
          onPress={() => router.push('/(tabs)/location')}
        />
        <HomeCard
          tint="#E7F0FA"
          emojiMark={emoji.contacts}
          title={t('home.contacts')}
          body={contactCount === 1 ? t('home.contactOne') : t('home.contactMany', { count: contactCount })}
          onPress={() => router.push('/(tabs)/contacts')}
        />
        <HomeCard
          tint="#FFF6E8"
          emojiMark={emoji.ambulance}
          title={t('home.emergency')}
          body={t('home.emergencyBody')}
          onPress={() => router.push('/screens/emergency-services')}
        />
        <HomeCard
          tint="#E7F8EF"
          emojiMark={emoji.tips}
          title={t('home.tips')}
          body={t('home.tipsBody')}
          onPress={() => router.push('/screens/safety-tips')}
        />
      </View>
    </Screen>
  );
}

function HomeCard({
  tint,
  emojiMark,
  title,
  body,
  onPress,
}: {
  tint: string;
  emojiMark: string;
  title: string;
  body: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.card} onPress={onPress} accessibilityRole="button" accessibilityLabel={title}>
      <View style={[styles.cardIcon, { backgroundColor: tint }]}>
        <Text style={styles.cardEmoji}>{emojiMark}</Text>
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardBody}>{body}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 18,
    paddingBottom: 24,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    gap: 4,
    flex: 1,
  },
  eyebrow: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.1,
  },
  name: {
    color: colors.ink,
    fontSize: 34,
    fontWeight: '800',
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  pill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.successSoft,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  pillOff: {
    backgroundColor: colors.chip,
  },
  pillDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  pillDotOff: {
    backgroundColor: colors.muted,
  },
  pillText: {
    color: '#15803D',
    fontWeight: '700',
    fontSize: 13,
  },
  pillTextOff: {
    color: colors.body,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#152033',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.sos,
  },
  question: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.ink,
    marginTop: 6,
  },
  sosWrap: {
    alignItems: 'center',
    marginVertical: 4,
  },
  ringOuter: {
    width: 230,
    height: 230,
    borderRadius: 115,
    borderWidth: 1,
    borderColor: '#F7C9CE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringInner: {
    width: 196,
    height: 196,
    borderRadius: 98,
    borderWidth: 1,
    borderColor: '#F4B4BB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sos: {
    width: 158,
    height: 158,
    borderRadius: 79,
    backgroundColor: colors.sos,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.sos,
    shadowOpacity: 0.28,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  sosText: {
    color: colors.white,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 1,
  },
  sosHint: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginTop: 2,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  caption: {
    textAlign: 'center',
    color: colors.body,
    lineHeight: 22,
    fontSize: 15,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '47%',
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 16,
    minHeight: 132,
    gap: 8,
    shadowColor: '#152033',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  cardIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardEmoji: {
    fontSize: 18,
  },
  cardTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '800',
  },
  cardBody: {
    color: colors.muted,
    fontSize: 13,
  },
});
