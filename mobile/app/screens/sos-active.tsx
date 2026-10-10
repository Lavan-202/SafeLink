import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EndSosDialog } from '../../components/EndSosDialog';
import { ShareSheet } from '../../components/ShareSheet';
import { BackButton } from '../../components/ui/BackButton';
import { Button } from '../../components/ui/Button';
import { emoji } from '../../constants/emoji';
import { fallbackEmergencyDirectory } from '../../constants/emergency';
import { colors } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';
import { useLiveLocation } from '../../hooks/useLiveLocation';
import { useTranslation } from '../../hooks/useTranslation';
import { api } from '../../services/apiClient';
import { listContacts, updateContact } from '../../services/contactService';
import { callNumber, openSmsTo, openSosSms } from '../../services/notificationService';
import { getSos, resolveSos, updatePrivacy, updateSosLocation } from '../../services/sosService';
import { useShare } from '../../store/shareStore';
import type { Contact, Coordinates, EmergencyDirectory, SharingDuration, SosAlert } from '../../types';
import { buildLocalSosMessage } from '../../utils/format';
import { deliveryLabelKey, deliveryMetaKey, formatElapsed, headerStatusKey } from '../../utils/sosStatus';

export default function SosActiveScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, setUser } = useAuth();
  const { session, start, stopAll } = useShare();
  const { t } = useTranslation();
  const [alert, setAlert] = useState<SosAlert | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [directory, setDirectory] = useState<EmergencyDirectory>(fallbackEmergencyDirectory);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [duration, setDuration] = useState<SharingDuration>(user?.privacy.sharingDuration ?? 'until');
  const [elapsed, setElapsed] = useState('0:00');

  useEffect(() => {
    if (!id) return;
    getSos(id)
      .then((data) => {
        setAlert(data);
        if (user?.privacy.autoShareOnSos && data.status === 'active' && !session) {
          listContacts().then((people) => {
            const ids = people.filter((contact) => contact.preselectLocation).map((contact) => contact.id);
            if (ids.length > 0) start(ids, user.privacy.sharingDuration);
          });
        }
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : t('sosActive.loadFailed')));
    listContacts()
      .then((people) => {
        setContacts(people);
        setSelectedIds(people.filter((contact) => contact.preselectLocation).map((contact) => contact.id));
      })
      .catch(() => setContacts([]));
    api<EmergencyDirectory>('/emergency/services', { auth: false })
      .then(setDirectory)
      .catch(() => setDirectory(fallbackEmergencyDirectory));
  }, [id]);

  useEffect(() => {
    const tick = () => setElapsed(formatElapsed(alert?.triggeredAt));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [alert?.triggeredAt]);

  const sharing = Boolean(session && session.ids.length > 0 && user?.privacy.shareLiveLocation && alert?.status === 'active');

  const onPoint = useCallback(
    (point: Coordinates) => {
      if (!id || !alert || alert.status !== 'active' || !sharing) return;
      updateSosLocation(id, point)
        .then(setAlert)
        .catch((err: unknown) => setError(err instanceof Error ? err.message : t('sosActive.updateFailed')));
    },
    [alert, id, sharing, t],
  );

  useLiveLocation(sharing, user?.privacy.locationUpdateIntervalSec ?? 15, onPoint);

  async function markSafe() {
    if (!id) return;
    setBusy(true);
    try {
      const updated = await resolveSos(id);
      setAlert(updated);
      stopAll();
      setEndOpen(false);
      router.replace('/(tabs)');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('sosActive.resolveFailed'));
    } finally {
      setBusy(false);
    }
  }

  async function confirmShare() {
    setBusy(true);
    setError('');
    try {
      await Promise.all(contacts.map((contact) => updateContact(contact.id, { preselectLocation: selectedIds.includes(contact.id) })));
      const privacy = await updatePrivacy({ shareLiveLocation: true, sharingDuration: duration });
      if (user) setUser({ ...user, privacy });
      start(selectedIds, duration);
      setSheetOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('sosActive.shareFailed'));
    } finally {
      setBusy(false);
    }
  }

  const police = directory.services.find((service) => service.id === 'police');
  const ambulance = directory.services.find((service) => service.id === 'ambulance');
  const active = alert?.status === 'active';
  const deliveries = alert?.notifiedContacts ?? [];
  const sosMessage = alert
    ? alert.message ??
      buildLocalSosMessage(user?.name ?? 'A SafeLink user', alert.lastLocation.latitude, alert.lastLocation.longitude, alert.liveUrl)
    : '';

  async function messageAll() {
    const phones = deliveries.map((contact) => contact.phone).filter(Boolean);
    if (phones.length === 0) return;
    await openSosSms(phones, sosMessage);
  }
  const title =
    alert?.status === 'resolved' ? t('sosActive.titleResolved') : alert?.status === 'cancelled' ? t('sosActive.titleCancelled') : active ? t('sosActive.titleActive') : t('sosActive.title');

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerRow}>
            <BackButton onPress={() => router.back()} />
            <View style={styles.headerCopy}>
              <Text style={styles.siren}>{emoji.sos}</Text>
              <Text style={styles.headerTitle}>{title}</Text>
            </View>
            <View style={styles.headerSpacer} />
          </View>
          <Text style={styles.headerSub}>{t(headerStatusKey(alert, active))}</Text>
          {active ? <Text style={styles.elapsed}>{t('sosActive.elapsed', { time: elapsed })}</Text> : null}
        </SafeAreaView>
      </View>
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.section}>{t('sosActive.delivery')}</Text>
        <View style={styles.card}>
          {deliveries.length === 0 ? (
            <Text style={styles.empty}>{t('sosActive.empty')}</Text>
          ) : (
            deliveries.map((contact, index) => (
              <View key={contact.contactId} style={[styles.delivery, index < deliveries.length - 1 && styles.border]}>
                <Ionicons
                  name={contact.status === 'failed' ? 'alert-circle' : contact.status === 'sent' ? 'checkmark-circle' : 'time'}
                  size={22}
                  color={contact.status === 'failed' ? colors.warning : contact.status === 'sent' ? colors.success : colors.body}
                />
                <View style={styles.deliveryCopy}>
                  <Text style={styles.deliveryName}>
                    {contact.name} · {t(deliveryLabelKey(contact.status))}
                  </Text>
                  <Text style={styles.deliveryMeta}>{contact.detail || t(deliveryMetaKey(contact.status))}</Text>
                </View>
                <Pressable style={styles.mini} onPress={() => void callNumber(contact.phone)} accessibilityLabel={t('common.call')}>
                  <Text>{emoji.phone}</Text>
                </Pressable>
                <Pressable style={styles.mini} onPress={() => void openSmsTo(contact.phone, sosMessage)} accessibilityLabel={t('common.message')}>
                  <Text>💬</Text>
                </Pressable>
              </View>
            ))
          )}
        </View>

        {active ? (
          <>
            <Text style={styles.section}>{t('sosActive.liveLocation')}</Text>
            <View style={[styles.badge, sharing && styles.badgeOn]}>
              <Text style={[styles.badgeText, sharing && styles.badgeTextOn]}>
                {sharing ? t('sosActive.sharing') : t('sosActive.notSharing')}
              </Text>
            </View>
            <Button
              label={sharing ? t('sosActive.manage') : t('sosActive.share')}
              variant="teal"
              onPress={() => (sharing ? router.push('/(tabs)/location') : setSheetOpen(true))}
            />
            {deliveries.length > 0 ? (
              <Button label={`💬 ${t('sosActive.messageAll')}`} variant="secondary" onPress={() => void messageAll()} />
            ) : null}
            <Text style={styles.section}>{t('sosActive.moreHelp')}</Text>
            <View style={styles.quickRow}>
              <Pressable style={styles.quick} onPress={() => police && Linking.openURL(`tel:${police.number}`)}>
                <Text style={styles.quickText}>{emoji.police} {t('sosActive.police', { number: police?.number ?? '119' })}</Text>
              </Pressable>
              <Pressable style={styles.quick} onPress={() => ambulance && Linking.openURL(`tel:${ambulance.number}`)}>
                <Text style={styles.quickText}>{emoji.ambulance} {t('sosActive.ambulance', { number: ambulance?.number ?? '1990' })}</Text>
              </Pressable>
            </View>
            <Pressable onPress={() => router.push('/screens/emergency-services')}>
              <Text style={styles.link}>{t('sosActive.allServices')}</Text>
            </Pressable>
            <Button label={t('sosActive.endSos')} variant="dangerText" onPress={() => setEndOpen(true)} />
          </>
        ) : (
          <Button label={t('common.backHome')} variant="secondary" onPress={() => router.replace('/(tabs)')} />
        )}
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </ScrollView>
      <ShareSheet
        visible={sheetOpen}
        mode="sos"
        contacts={contacts}
        selectedIds={selectedIds}
        duration={duration}
        busy={busy}
        onToggle={(contactId) =>
          setSelectedIds((current) => (current.includes(contactId) ? current.filter((item) => item !== contactId) : [...current, contactId]))
        }
        onDuration={setDuration}
        onConfirm={confirmShare}
        onClose={() => setSheetOpen(false)}
      />
      <EndSosDialog visible={endOpen} busy={busy} onConfirm={markSafe} onClose={() => setEndOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.sos,
    paddingHorizontal: 22,
    paddingBottom: 22,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerCopy: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    flex: 1,
  },
  headerSpacer: {
    width: 44,
  },
  siren: {
    fontSize: 18,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  headerSub: {
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 20,
  },
  elapsed: {
    color: colors.white,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '700',
  },
  body: {
    padding: 22,
    gap: 12,
    paddingBottom: 40,
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
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.line,
  },
  empty: {
    color: colors.body,
    paddingVertical: 16,
    lineHeight: 20,
  },
  delivery: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    paddingVertical: 12,
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  deliveryCopy: {
    flex: 1,
    gap: 2,
  },
  deliveryName: {
    color: colors.ink,
    fontWeight: '800',
    fontSize: 16,
  },
  deliveryMeta: {
    color: colors.muted,
    fontSize: 13,
  },
  mini: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.chip,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.peach,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeOn: {
    backgroundColor: colors.successSoft,
  },
  badgeText: {
    color: colors.warning,
    fontWeight: '700',
    fontSize: 13,
  },
  badgeTextOn: {
    color: '#15803D',
  },
  quickRow: {
    flexDirection: 'row',
    gap: 10,
  },
  quick: {
    flex: 1,
    backgroundColor: colors.navy,
    borderRadius: 16,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  quickText: {
    color: colors.white,
    fontWeight: '700',
    textAlign: 'center',
  },
  link: {
    textAlign: 'center',
    color: colors.body,
    fontWeight: '600',
    marginVertical: 4,
  },
  error: {
    color: colors.sos,
  },
});
