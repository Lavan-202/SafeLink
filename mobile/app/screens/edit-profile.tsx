import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BackButton } from '../../components/ui/BackButton';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { PageTitle } from '../../components/ui/PageTitle';
import { Screen } from '../../components/ui/Screen';
import { colors } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import { updateProfile } from '../../services/authService';

export default function EditProfileScreen() {
  const { user, setUser } = useAuth();
  const { t } = useTranslation();
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [role, setRole] = useState(user?.role ?? 'University Student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const initial = (name || user?.name || 'S').slice(0, 1).toUpperCase();

  async function save() {
    setError('');
    if (name.trim().length < 2 || phone.trim().length < 8 || !email.trim() || role.trim().length < 2) {
      setError(t('editProfile.validation'));
      return;
    }
    setLoading(true);
    try {
      const updated = await updateProfile({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role: role.trim(),
      });
      setUser(updated);
      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('editProfile.failed'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <BackButton />
      <PageTitle eyebrow={t('editProfile.eyebrow')} title={t('editProfile.title')} />
      <View style={styles.avatar}>
        <Text style={styles.initial}>{initial}</Text>
      </View>
      <Text style={styles.photo}>{t('editProfile.photo')}</Text>
      <Input label={t('editProfile.name')} value={name} onChangeText={setName} autoCapitalize="words" />
      <Input label={t('editProfile.email')} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <Input label={t('editProfile.phone')} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <Input label={t('editProfile.role')} value={role} onChangeText={setRole} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button label={t('editProfile.save')} onPress={save} loading={loading} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.avatar,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  initial: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.navy,
  },
  photo: {
    textAlign: 'center',
    color: colors.teal,
    fontWeight: '700',
    marginTop: -8,
  },
  error: {
    color: colors.sos,
  },
});
