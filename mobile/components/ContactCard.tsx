import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../constants/theme';
import type { Contact } from '../types';

type Props = {
  contact: Contact;
  onEdit: () => void;
  onDelete: () => void;
};

export function ContactCard({ contact, onEdit, onDelete }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{contact.name.slice(0, 1).toUpperCase()}</Text>
        </View>
        <View style={styles.copy}>
          <Text style={styles.name}>{contact.name}</Text>
          <Text style={styles.phone}>{contact.phone}</Text>
          <Text style={styles.meta}>
            {contact.relationship || 'Trusted contact'}
            {contact.isPrimary ? ' · Primary' : ''}
            {contact.notifyOnSos ? ' · Gets SOS' : ' · SOS off'}
          </Text>
        </View>
      </View>
      <View style={styles.actions}>
        <Pressable onPress={onEdit} style={styles.action}>
          <Text style={styles.edit}>Edit</Text>
        </Pressable>
        <Pressable onPress={onDelete} style={styles.action}>
          <Text style={styles.delete}>Remove</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 18,
  },
  copy: {
    flex: 1,
  },
  name: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  phone: {
    color: colors.ink,
    marginTop: 2,
  },
  meta: {
    color: colors.muted,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  action: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: colors.background,
  },
  edit: {
    color: colors.ink,
    fontWeight: '700',
  },
  delete: {
    color: colors.sos,
    fontWeight: '700',
  },
});
