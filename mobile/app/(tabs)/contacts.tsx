import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../../components/ui/Screen';
import { emoji } from '../../constants/emoji';
import { colors } from '../../constants/theme';
import { useTranslation } from '../../hooks/useTranslation';
import { listContacts } from '../../services/contactService';
import { callNumber, openSmsTo } from '../../services/notificationService';
import type { Contact } from '../../types';

export default function ContactsScreen() {
  const { t } = useTranslation();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [error, setError] = useState('');

  useFocusEffect(
    useCallback(() => {
      let active = true;
      listContacts()
        .then((data) => {
          if (active) {
            setContacts(data);
            setError('');
          }
        })
        .catch((err: unknown) => {
          if (active) setError(err instanceof Error ? err.message : t('contacts.loadFailed'));
        });
      return () => {
        active = false;
      };
    }, [t]),
  );

  return (
    <Screen edges={['top']} contentStyle={styles.content}>
      <Text style={styles.count}>{contacts.length === 1 ? t('contacts.countOne') : t('contacts.countMany', { count: contacts.length })}</Text>
      <Text style={styles.title}>{emoji.contacts} {t('contacts.title')}</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.card}>
        {contacts.length === 0 ? (
          <Text style={styles.empty}>{t('contacts.empty')}</Text>
        ) : (
          contacts.map((contact, index) => (
            <View key={contact.id} style={[styles.row, index < contacts.length - 1 && styles.rowBorder]}>
              <Pressable
                onPress={() => router.push({ pathname: '/screens/add-edit-contact', params: { id: contact.id } })}
                style={styles.person}
                accessibilityRole="button"
                accessibilityLabel={contact.name}
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{contact.name.slice(0, 1).toUpperCase()}</Text>
                </View>
                <View style={styles.copy}>
                  <Text style={styles.name}>{contact.name}</Text>
                  <Text style={styles.phone}>{contact.phone}</Text>
                  <View style={styles.chips}>
                    {contact.notifyOnSos ? (
                      <View style={styles.chip}>
                        <Text style={styles.chipText}>{t('contacts.sosChip')}</Text>
                      </View>
                    ) : null}
                    {contact.preselectLocation ? (
                      <View style={[styles.chip, styles.chipLive]}>
                        <Text style={[styles.chipText, styles.chipLiveText]}>{t('contacts.liveChip')}</Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              </Pressable>
              <Pressable
                style={styles.action}
                onPress={() => void callNumber(contact.phone)}
                accessibilityRole="button"
                accessibilityLabel={`${t('contacts.call')} ${contact.name}`}
              >
                <Text style={styles.actionEmoji}>{emoji.phone}</Text>
              </Pressable>
              <Pressable
                style={styles.action}
                onPress={() => void openSmsTo(contact.phone)}
                accessibilityRole="button"
                accessibilityLabel={`${t('contacts.message')} ${contact.name}`}
              >
                <Text style={styles.actionEmoji}>💬</Text>
              </Pressable>
            </View>
          ))
        )}
      </View>
      <Text style={styles.note}>{t('contacts.note')}</Text>
      <Pressable style={styles.fab} onPress={() => router.push('/screens/add-edit-contact')} accessibilityRole="button" accessibilityLabel={t('contactForm.titleNew')}>
        <Ionicons name="add" size={30} color={colors.white} />
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 96,
  },
  count: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  title: {
    color: colors.ink,
    fontSize: 32,
    fontWeight: '800',
    marginTop: -8,
  },
  error: {
    color: colors.sos,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 22,
    paddingHorizontal: 14,
  },
  empty: {
    color: colors.body,
    paddingVertical: 18,
    lineHeight: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  person: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.avatar,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.navy,
    fontWeight: '800',
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  name: {
    color: colors.ink,
    fontWeight: '800',
    fontSize: 16,
  },
  phone: {
    color: colors.muted,
    fontSize: 13,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  chip: {
    backgroundColor: colors.chip,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  chipText: {
    color: colors.body,
    fontSize: 11,
    fontWeight: '700',
  },
  chipLive: {
    backgroundColor: colors.successSoft,
  },
  chipLiveText: {
    color: '#15803D',
  },
  action: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.chip,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionEmoji: {
    fontSize: 18,
  },
  note: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  fab: {
    position: 'absolute',
    right: 22,
    bottom: 18,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.navy,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
});
