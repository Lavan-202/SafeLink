import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LocationMap } from '../../components/LocationMap';
import { OfflineBanner } from '../../components/OfflineBanner';
import { ShareSheet } from '../../components/ShareSheet';
import { BackButton } from '../../components/ui/BackButton';
import { Button } from '../../components/ui/Button';
import { emoji } from '../../constants/emoji';
import { colors } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import { listContacts, updateContact } from '../../services/contactService';
import { useOnlineStatus } from '../../services/connectivity';
import { checkForegroundPermission, getCurrentCoordinates } from '../../services/locationService';
import { getActiveSos, updatePrivacy } from '../../services/sosService';
import { useShare } from '../../store/shareStore';
import type { Contact, SharingDuration } from '../../types';
import { accuracyKey } from '../../utils/format';

export default function LocationScreen() {
  const insets = useSafeAreaInsets();
  const { user, setUser } = useAuth();
  const { session, start, stopOne: stopShared, stopAll: stopSharedAll } = useShare();
  const { t } = useTranslation();
  const online = useOnlineStatus();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [duration, setDuration] = useState<SharingDuration>(user?.privacy.sharingDuration ?? 'until');
  const [accuracy, setAccuracy] = useState(t('accuracy.unknown'));
  const [permissionOn, setPermissionOn] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [activeSos, setActiveSos] = useState(false);
  const [stoppedNote, setStoppedNote] = useState('');

  const load = useCallback(() => {
    let alive = true;
    listContacts()
      .then((data) => {
        if (!alive) return;
        setContacts(data);
      })
      .catch((err: unknown) => {
        if (alive) setError(err instanceof Error ? err.message : t('location.loadFailed'));
      });
    getActiveSos()
      .then((alert) => {
        if (alive) setActiveSos(Boolean(alert && alert.status === 'active'));
      })
      .catch(() => {
        if (alive) setActiveSos(false);
      });
    checkForegroundPermission()
      .then(async (granted) => {
        if (!alive) return;
        setPermissionOn(granted);
        if (!granted) {
          setAccuracy(t('location.unavailable'));
          return;
        }
        try {
          const point = await getCurrentCoordinates();
          if (alive) setAccuracy(t(`accuracy.${accuracyKey(point.accuracy)}`));
        } catch {
          if (alive) setAccuracy(t('location.unavailable'));
        }
      })
      .catch(() => {
        if (alive) setPermissionOn(false);
      });
    return () => {
      alive = false;
    };
  }, [t]);

  useFocusEffect(load);

  const sharingIds = session?.ids ?? [];
  const visibleSharing = sharingIds.length > 0 && Boolean(user?.privacy.shareLiveLocation);

  function openSheet() {
    const preset = contacts.filter((contact) => contact.preselectLocation).map((contact) => contact.id);
    setSelectedIds(sharingIds.length > 0 ? sharingIds : preset);
    setDuration(session?.duration ?? user?.privacy.sharingDuration ?? 'until');
    setSheetOpen(true);
  }

  async function confirmShare() {
    setBusy(true);
    setError('');
    setStoppedNote('');
    try {
      await Promise.all(
        contacts.map((contact) =>
          updateContact(contact.id, { preselectLocation: selectedIds.includes(contact.id) }),
        ),
      );
      const privacy = await updatePrivacy({ shareLiveLocation: true, sharingDuration: duration });
      if (user) setUser({ ...user, privacy });
      start(selectedIds, duration);
      setSheetOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('location.startFailed'));
    } finally {
      setBusy(false);
    }
  }

  async function stopOne(id: string) {
    try {
      await updateContact(id, { preselectLocation: false });
      stopShared(id);
      setStoppedNote(t('location.stopped'));
    } catch (err) {
      setError(err instanceof Error ? err.message : t('location.stopFailed'));
    }
  }

  async function stopAll() {
    try {
      await Promise.all(sharingIds.map((id) => updateContact(id, { preselectLocation: false })));
      if (user) {
        const privacy = await updatePrivacy({ shareLiveLocation: false });
        setUser({ ...user, privacy });
      }
      stopSharedAll();
      setStoppedNote(t('location.stopped'));
    } catch (err) {
      setError(err instanceof Error ? err.message : t('location.stopFailed'));
    }
  }

  const activeDuration = session?.duration ?? duration;
  const durationLabel = activeDuration === '30' ? t('shareSheet.min30') : activeDuration === '60' ? t('shareSheet.hour1') : t('shareSheet.until');

  return (
    <View style={styles.screen}>
      <LocationMap />
      <View style={[styles.back, { top: insets.top + 8 }]}>
        <BackButton onPress={() => router.navigate('/(tabs)')} />
      </View>
      <ScrollView style={styles.panel} contentContainerStyle={styles.panelContent}>
        <Text style={styles.status}>{permissionOn ? t('location.permissionOn') : t('location.permissionOff')}</Text>
        {!online ? <OfflineBanner message={t('location.offline')} /> : null}
        {visibleSharing ? (
          <>
            <Text style={styles.eyebrow}>{t('location.sharingWith', { duration: durationLabel })}</Text>
            <View style={styles.card}>
              {contacts
                .filter((contact) => sharingIds.includes(contact.id))
                .map((contact, index, list) => (
                  <View key={contact.id} style={[styles.person, index < list.length - 1 && styles.personBorder]}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>{contact.name.slice(0, 1).toUpperCase()}</Text>
                    </View>
                    <View style={styles.personCopy}>
                      <Text style={styles.personName}>{contact.name}</Text>
                      <Text style={styles.live}>{activeSos ? t('location.liveNow') : t('location.ready')}</Text>
                    </View>
                    <Pressable style={styles.stop} onPress={() => stopOne(contact.id)}>
                      <Text style={styles.stopText}>{t('common.stop')}</Text>
                    </Pressable>
                  </View>
                ))}
            </View>
            <Text style={styles.accuracyRow}>
              {t('location.accuracy')} <Text style={styles.accuracyValue}>{accuracy}</Text>
            </Text>
            <Button label={t('location.addPeople')} variant="secondary" onPress={openSheet} />
            <Button label={t('location.stopAll')} variant="dangerText" onPress={stopAll} />
          </>
        ) : (
          <>
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>{emoji.location} {t('location.emptyTitle')}</Text>
              <Text style={styles.emptyBody}>{t('location.emptyBody')}</Text>
            </View>
            <Button label={t('location.share')} variant="teal" onPress={openSheet} />
          </>
        )}
        {stoppedNote ? <Text style={styles.stopped}>{stoppedNote}</Text> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </ScrollView>
      <ShareSheet
        visible={sheetOpen}
        mode="location"
        contacts={contacts}
        selectedIds={selectedIds}
        duration={duration}
        busy={busy}
        onToggle={(id) =>
          setSelectedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
        }
        onDuration={setDuration}
        onConfirm={confirmShare}
        onClose={() => setSheetOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  back: {
    position: 'absolute',
    left: 18,
  },
  panel: {
    flex: 1,
  },
  panelContent: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 28,
    gap: 14,
  },
  status: {
    color: colors.body,
    fontSize: 14,
    lineHeight: 20,
  },
  eyebrow: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 22,
    paddingHorizontal: 14,
  },
  person: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },
  personBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.avatar,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.navy,
    fontWeight: '800',
  },
  personCopy: {
    flex: 1,
    gap: 2,
  },
  personName: {
    color: colors.ink,
    fontWeight: '800',
    fontSize: 16,
  },
  live: {
    color: colors.success,
    fontSize: 13,
    fontWeight: '600',
  },
  stop: {
    backgroundColor: colors.sosSoft,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    minHeight: 40,
    justifyContent: 'center',
  },
  stopText: {
    color: colors.sos,
    fontWeight: '700',
  },
  accuracyRow: {
    color: colors.muted,
    fontSize: 13,
  },
  accuracyValue: {
    color: colors.ink,
    fontWeight: '700',
  },
  emptyCard: {
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 18,
    gap: 6,
  },
  emptyTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '800',
  },
  emptyBody: {
    color: colors.body,
    lineHeight: 20,
  },
  stopped: {
    color: colors.success,
  },
  error: {
    color: colors.sos,
  },
});
