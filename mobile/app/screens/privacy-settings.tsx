import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BackButton } from '../../components/ui/BackButton';
import { CheckBox, Radio, ToggleRow } from '../../components/ui/Controls';
import { PageTitle } from '../../components/ui/PageTitle';
import { Screen } from '../../components/ui/Screen';
import { colors } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import { listContacts, updateContact } from '../../services/contactService';
import { getPrivacy, updatePrivacy } from '../../services/sosService';
import { useShare } from '../../store/shareStore';
import type { Contact, PrivacySettings, SharingDuration } from '../../types';
import { defaultPrivacy } from '../../types';

export default function PrivacySettingsScreen() {
  const { user, setUser } = useAuth();
  const { session } = useShare();
  const { t } = useTranslation();
  const [settings, setSettings] = useState<PrivacySettings>(user?.privacy ?? defaultPrivacy);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [error, setError] = useState('');
  const durations: Array<{ id: SharingDuration; key: string }> = [
    { id: '30', key: 'privacy.min30' },
    { id: '60', key: 'privacy.hour1' },
    { id: 'until', key: 'privacy.until' },
  ];

  useEffect(() => {
    getPrivacy()
      .then((privacy) => setSettings({ ...defaultPrivacy, ...privacy }))
      .catch((err: unknown) => setError(err instanceof Error ? err.message : t('privacy.loadFailed')));
    listContacts()
      .then(setContacts)
      .catch(() => setContacts([]));
  }, [t]);

  async function patch(next: Partial<PrivacySettings>) {
    const previous = settings;
    const merged = { ...settings, ...next };
    setSettings(merged);
    try {
      const privacy = await updatePrivacy(next);
      const full = { ...defaultPrivacy, ...privacy };
      setSettings(full);
      if (user) setUser({ ...user, privacy: full });
    } catch (err) {
      setSettings(previous);
      setError(err instanceof Error ? err.message : t('privacy.saveFailed'));
    }
  }

  async function toggleContact(contact: Contact) {
    const next = !contact.preselectLocation;
    setContacts((current) => current.map((item) => (item.id === contact.id ? { ...item, preselectLocation: next } : item)));
    try {
      await updateContact(contact.id, { preselectLocation: next });
    } catch (err) {
      setContacts((current) => current.map((item) => (item.id === contact.id ? contact : item)));
      setError(err instanceof Error ? err.message : t('privacy.contactFailed'));
    }
  }

  return (
    <Screen>
      <BackButton />
      <PageTitle eyebrow={t('privacy.eyebrow')} title={t('privacy.title')} />
      <Text style={styles.explain}>{t('privacy.explain')}</Text>
      <ToggleRow
        title={t('privacy.liveTitle')}
        subtitle={t('privacy.liveBody')}
        value={settings.shareLiveLocation}
        onValueChange={(value) => patch({ shareLiveLocation: value })}
      />
      <ToggleRow
        title={t('privacy.autoTitle')}
        subtitle={t('privacy.autoBody')}
        value={settings.autoShareOnSos}
        onValueChange={(value) => patch({ autoShareOnSos: value })}
      />
      <View style={styles.divider} />
      <Text style={styles.section}>{t('privacy.who')}</Text>
      {contacts.map((contact) => (
        <Pressable key={contact.id} style={styles.person} onPress={() => toggleContact(contact)}>
          <CheckBox checked={contact.preselectLocation} onPress={() => toggleContact(contact)} />
          <Text style={styles.personName}>{contact.name}</Text>
        </Pressable>
      ))}
      {contacts.length === 0 ? <Text style={styles.hint}>{t('privacy.noContacts')}</Text> : null}
      <Text style={styles.section}>{t('privacy.duration')}</Text>
      {durations.map((item) => (
        <Pressable key={item.id} style={styles.person} onPress={() => patch({ sharingDuration: item.id })}>
          <Radio selected={settings.sharingDuration === item.id} onPress={() => patch({ sharingDuration: item.id })} />
          <Text style={styles.personName}>{t(item.key)}</Text>
        </Pressable>
      ))}
      <View style={styles.divider} />
      <ToggleRow
        title={t('privacy.showStatus')}
        subtitle={
          settings.showSharingStatus
            ? session
              ? t('privacy.sharingNow', { count: session.ids.length })
              : t('privacy.notSharing')
            : undefined
        }
        value={settings.showSharingStatus}
        onValueChange={(value) => patch({ showSharingStatus: value })}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  explain: {
    color: colors.body,
    lineHeight: 21,
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: colors.line,
    marginVertical: 4,
  },
  section: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  person: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 44,
  },
  personName: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '700',
  },
  hint: {
    color: colors.body,
  },
  error: {
    color: colors.sos,
  },
});
