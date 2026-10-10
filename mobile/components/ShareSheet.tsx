import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/theme';
import { useTranslation } from '../hooks/useTranslation';
import type { Contact, SharingDuration } from '../types';
import { Button } from './ui/Button';
import { CheckBox } from './ui/Controls';

type Props = {
  visible: boolean;
  contacts: Contact[];
  selectedIds: string[];
  duration: SharingDuration;
  onToggle: (id: string) => void;
  onDuration: (duration: SharingDuration) => void;
  onConfirm: () => void;
  onClose: () => void;
  busy?: boolean;
  mode?: 'sos' | 'location';
};

export function ShareSheet({
  visible,
  contacts,
  selectedIds,
  duration,
  onToggle,
  onDuration,
  onConfirm,
  onClose,
  busy,
  mode = 'location',
}: Props) {
  const { t } = useTranslation();
  const durations: Array<{ id: SharingDuration; key: string }> = [
    { id: '30', key: 'shareSheet.min30' },
    { id: '60', key: 'shareSheet.hour1' },
    { id: 'until', key: 'shareSheet.until' },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.title}>{t('shareSheet.title')}</Text>
        <Text style={styles.lead}>{mode === 'sos' ? t('shareSheet.leadSos') : t('shareSheet.leadLocation')}</Text>
        <View style={styles.list}>
          {contacts.map((contact) => {
            const checked = selectedIds.includes(contact.id);
            return (
              <Pressable key={contact.id} style={styles.person} onPress={() => onToggle(contact.id)}>
                <CheckBox checked={checked} onPress={() => onToggle(contact.id)} />
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{contact.name.slice(0, 1).toUpperCase()}</Text>
                </View>
                <Text style={styles.name}>{contact.name}</Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={styles.durationLabel}>{t('shareSheet.duration')}</Text>
        <View style={styles.durationRow}>
          {durations.map((item) => {
            const active = duration === item.id;
            return (
              <Pressable key={item.id} onPress={() => onDuration(item.id)} style={[styles.chip, active && styles.chipOn]}>
                <Text style={[styles.chipText, active && styles.chipTextOn]}>{t(item.key)}</Text>
              </Pressable>
            );
          })}
        </View>
        <Button label={t('shareSheet.confirm')} variant="teal" onPress={onConfirm} loading={busy} disabled={selectedIds.length === 0} />
        <Pressable onPress={onClose}>
          <Text style={styles.later}>{t('shareSheet.later')}</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(21,32,51,0.35)',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 22,
    paddingBottom: 28,
    gap: 14,
  },
  handle: {
    alignSelf: 'center',
    width: 42,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E4E8EF',
    marginTop: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.ink,
  },
  lead: {
    color: colors.body,
    fontSize: 14,
    lineHeight: 20,
    marginTop: -6,
  },
  list: {
    gap: 14,
  },
  person: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.avatar,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.navy,
    fontWeight: '700',
  },
  name: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '700',
  },
  durationLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  durationRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.white,
  },
  chipOn: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  chipText: {
    color: colors.ink,
    fontWeight: '700',
    fontSize: 13,
  },
  chipTextOn: {
    color: colors.white,
  },
  later: {
    textAlign: 'center',
    color: colors.muted,
    fontWeight: '600',
    marginTop: 2,
  },
});
