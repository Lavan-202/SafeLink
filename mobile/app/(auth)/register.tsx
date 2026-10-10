import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { BackButton } from '../../components/ui/BackButton';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { PageTitle } from '../../components/ui/PageTitle';
import { Screen } from '../../components/ui/Screen';
import { colors } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage } from '../../providers/LanguageProvider';
import * as authService from '../../services/authService';

export default function RegisterScreen() {
  const { setUser } = useAuth();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setError('');
    if (name.trim().length < 2 || !email.trim() || phone.trim().length < 8 || password.length < 8) {
      setError(t('register.validation'));
      return;
    }
    if (password !== confirm) {
      setError(t('register.mismatch'));
      return;
    }

    setLoading(true);
    try {
      const user = await authService.register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        preferredLanguage: language,
      });
      setUser(user);
      router.replace('/(tabs)');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('register.failed'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <BackButton />
      <PageTitle eyebrow={t('register.eyebrow')} title={t('register.title')} />
      <Input label={t('register.name')} value={name} onChangeText={setName} placeholder={t('register.name')} autoCapitalize="words" />
      <Input label={t('register.email')} value={email} onChangeText={setEmail} placeholder={t('register.email')} autoCapitalize="none" keyboardType="email-address" />
      <Input label={t('register.phone')} value={phone} onChangeText={setPhone} placeholder="+94 7X XXX XXXX" keyboardType="phone-pad" />
      <Input label={t('register.password')} value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry autoCapitalize="none" />
      <Input label={t('register.confirm')} value={confirm} onChangeText={setConfirm} placeholder="••••••••" secureTextEntry autoCapitalize="none" />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button label={t('register.submit')} onPress={onSubmit} loading={loading} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  error: {
    color: colors.sos,
  },
});
