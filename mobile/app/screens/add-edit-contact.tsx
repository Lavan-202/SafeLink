import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BackButton } from '../../components/ui/BackButton';
import { Button } from '../../components/ui/Button';
import { ToggleRow } from '../../components/ui/Controls';
import { Input } from '../../components/ui/Input';
import { PageTitle } from '../../components/ui/PageTitle';
import { Screen } from '../../components/ui/Screen';
import { colors } from '../../constants/theme';
import { useTranslation } from '../../hooks/useTranslation';
import { createContact, deleteContact, listContacts, updateContact } from '../../services/contactService';

const relationships = ['Friend', 'Mother', 'Father', 'Sister', 'Brother', 'Partner', 'Other'] as const;

export default function AddEditContactScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { t } = useTranslation();
  const editing = Boolean(id);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState<(typeof relationships)[number]>('Friend');
  const [openList, setOpenList] = useState(false);
  const [notifyOnSos, setNotifyOnSos] = useState(true);
  const [preselectLocation, setPreselectLocation] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    listContacts()
      .then((contacts) => {
        const contact = contacts.find((item) => item.id === id);
        if (!contact) {
          setError(t('contactForm.notFound'));
          return;
        }
        setName(contact.name);
        setPhone(contact.phone);
        setRelationship((relationships.find((item) => item === contact.relationship) ?? 'Friend') as (typeof relationships)[number]);
        setNotifyOnSos(contact.notifyOnSos);
        setPreselectLocation(contact.preselectLocation);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : t('contactForm.loadFailed')));
  }, [id, t]);

  async function save() {
    setError('');
    if (name.trim().length < 2 || phone.trim().length < 8) {
      setError(t('contactForm.validation'));
      return;
    }
    setLoading(true);
    try {
      const input = {
        name: name.trim(),
        phone: phone.trim(),
        relationship,
        notifyOnSos,
        preselectLocation,
      };
      if (id) await updateContact(id, input);
      else await createContact(input);
      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('contactForm.saveFailed'));
    } finally {
      setLoading(false);
    }
  }

  async function remove() {
    if (!id) return;
    setLoading(true);
    try {
      await deleteContact(id);
      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('contactForm.removeFailed'));
      setLoading(false);
    }
  }

  return (
    <Screen>
      <BackButton />
      <PageTitle
        eyebrow={editing ? t('contactForm.eyebrowEdit') : t('contactForm.eyebrowNew')}
        title={editing ? t('contactForm.titleEdit') : t('contactForm.titleNew')}
      />
      <Input label={t('contactForm.name')} value={name} onChangeText={setName} placeholder={t('contactForm.name')} autoCapitalize="words" />
      <Input label={t('contactForm.phone')} value={phone} onChangeText={setPhone} placeholder="+94 7X XXX XXXX" keyboardType="phone-pad" />
      <View style={styles.field}>
        <Text style={styles.label}>{t('contactForm.relationship')}</Text>
        <Pressable style={styles.select} onPress={() => setOpenList((value) => !value)}>
          <Text style={styles.selectText}>{t(`relationships.${relationship}`)}</Text>
          <Text style={styles.caret}>{openList ? '▴' : '▾'}</Text>
        </Pressable>
        {openList ? (
          <View style={styles.menu}>
            {relationships.map((item) => (
              <Pressable
                key={item}
                style={styles.menuItem}
                onPress={() => {
                  setRelationship(item);
                  setOpenList(false);
                }}
              >
                <Text style={styles.menuText}>{t(`relationships.${item}`)}</Text>
              </Pressable>
            ))}
          </View>
        ) : null}
      </View>
      <ToggleRow
        title={t('contactForm.notifyTitle')}
        subtitle={t('contactForm.notifyBody')}
        value={notifyOnSos}
        onValueChange={setNotifyOnSos}
      />
      <ToggleRow
        title={t('contactForm.preselectTitle')}
        subtitle={t('contactForm.preselectBody')}
        value={preselectLocation}
        onValueChange={setPreselectLocation}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button label={editing ? t('contactForm.saveEdit') : t('contactForm.saveNew')} onPress={save} loading={loading} />
      {editing ? (
        <Pressable onPress={remove}>
          <Text style={styles.remove}>{t('contactForm.remove')}</Text>
        </Pressable>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 8,
  },
  label: {
    color: colors.ink,
    fontWeight: '600',
    fontSize: 14,
  },
  select: {
    minHeight: 54,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: {
    color: colors.ink,
    fontSize: 16,
  },
  caret: {
    color: colors.muted,
    fontSize: 16,
  },
  menu: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuText: {
    color: colors.ink,
    fontSize: 16,
  },
  error: {
    color: colors.sos,
  },
  remove: {
    textAlign: 'center',
    color: colors.sos,
    fontWeight: '700',
    fontSize: 16,
  },
});
