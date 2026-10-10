import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { BackButton } from '../../components/ui/BackButton';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { PageTitle } from '../../components/ui/PageTitle';
import { Screen } from '../../components/ui/Screen';
import { colors } from '../../constants/theme';
import { useTranslation } from '../../hooks/useTranslation';
import * as authService from '../../services/authService';

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState(false);

  async function requestToken() {
    setError('');
    setMessage('');
    if (!email.trim()) {
      setError(t('forgot.emailRequired'));
      return;
    }

    setLoading(true);
    try {
      const result = await authService.forgotPassword(email.trim());
      setRequested(true);
      setMessage(result.message);
      if (result.resetToken) setToken(result.resetToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('forgot.startFailed'));
    } finally {
      setLoading(false);
    }
  }

  async function updatePassword() {
    setError('');
    if (!token.trim() || password.length < 8) {
      setError(t('forgot.tokenRequired'));
      return;
    }

    setLoading(true);
    try {
      const result = await authService.resetPassword({
        email: email.trim(),
        token: token.trim(),
        password,
      });
      setMessage(result.message);
      router.replace('/(auth)/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('forgot.resetFailed'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <BackButton />
      <PageTitle eyebrow={t('forgot.eyebrow')} title={t('forgot.title')} subtitle={t('forgot.subtitle')} />
      <Input label={t('forgot.email')} value={email} onChangeText={setEmail} placeholder="you@example.com" autoCapitalize="none" keyboardType="email-address" />
      <Button label={t('forgot.sendToken')} onPress={requestToken} loading={loading && !requested} />
      {requested ? (
        <>
          <Input label={t('forgot.token')} value={token} onChangeText={setToken} autoCapitalize="none" />
          <Input label={t('forgot.newPassword')} value={password} onChangeText={setPassword} secureTextEntry autoCapitalize="none" />
          <Button label={t('forgot.update')} onPress={updatePassword} loading={loading} />
        </>
      ) : null}
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  message: {
    color: colors.success,
    lineHeight: 20,
  },
  error: {
    color: colors.sos,
  },
});
