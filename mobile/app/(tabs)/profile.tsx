import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../../components/ui/Screen';
import { emoji } from '../../constants/emoji';
import { colors } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage } from '../../providers/LanguageProvider';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const initial = user?.name?.slice(0, 1).toUpperCase() || 'S';

  return (
    <Screen edges={['top']} contentStyle={styles.content}>
      <View style={styles.hero}>
        <View style={styles.avatar}>
          <Text style={styles.initial}>{initial}</Text>
        </View>
        <Text style={styles.name}>{user?.name || t('profile.fallbackName')}</Text>
        <Text style={styles.role}>{user?.role || 'University Student'}</Text>
      </View>

      <Text style={styles.section}>{t('profile.safety')}</Text>
      <View style={styles.card}>
        <Row mark={emoji.contacts} tint="#E7F0FA" label={t('profile.trustedContacts')} onPress={() => router.push('/(tabs)/contacts')} />
        <Row mark={emoji.lock} tint="#FFF6E8" label={t('profile.privacy')} onPress={() => router.push('/screens/privacy-settings')} />
        <Row mark={emoji.phone} tint="#E7F8EF" label={t('profile.emergency')} onPress={() => router.push('/screens/emergency-services')} />
        <Row mark={emoji.tips} tint="#E7F8EF" label={t('profile.tips')} onPress={() => router.push('/screens/safety-tips')} last />
      </View>

      <Text style={styles.section}>{t('profile.account')}</Text>
      <View style={styles.card}>
        <Row mark={emoji.profile} tint="#E7F0FA" label={t('profile.edit')} onPress={() => router.push('/screens/edit-profile')} />
        <Row mark={emoji.bell} tint="#FFF6E8" label={t('profile.notifications')} onPress={() => router.push('/screens/notifications')} />
        <Row mark={emoji.language} tint="#E7F8EF" label={t('profile.language', { language: t(`languages.${language}`) })} onPress={() => router.push({ pathname: '/(auth)/language', params: { from: 'profile' } })} last />
      </View>

      <Text style={styles.section}>{t('profile.support')}</Text>
      <View style={styles.card}>
        <Row mark={emoji.help} tint="#FDECEC" label={t('profile.help')} onPress={() => router.push('/screens/help')} />
        <Row
          mark={emoji.logout}
          tint="#FFF1F2"
          label={t('profile.logout')}
          danger
          last
          onPress={async () => {
            await signOut();
            router.replace('/(auth)/login');
          }}
        />
      </View>
    </Screen>
  );
}

function Row({
  mark,
  tint,
  label,
  onPress,
  last,
  danger,
}: {
  mark: string;
  tint: string;
  label: string;
  onPress: () => void;
  last?: boolean;
  danger?: boolean;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.row, !last && styles.rowBorder]} accessibilityRole="button" accessibilityLabel={label}>
      <View style={[styles.icon, { backgroundColor: tint }]}>
        <Text style={styles.mark}>{mark}</Text>
      </View>
      <Text style={[styles.label, danger && styles.danger]}>{label}</Text>
      {danger ? null : <Ionicons name="chevron-forward" size={18} color="#C5CDD8" />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 18,
    gap: 12,
  },
  hero: {
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.avatar,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.navy,
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.ink,
    marginTop: 6,
  },
  role: {
    color: colors.muted,
    fontSize: 14,
  },
  section: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 6,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 22,
    paddingHorizontal: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    minHeight: 52,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  icon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mark: {
    fontSize: 16,
  },
  label: {
    flex: 1,
    color: colors.ink,
    fontWeight: '700',
    fontSize: 16,
  },
  danger: {
    color: colors.sos,
  },
});
