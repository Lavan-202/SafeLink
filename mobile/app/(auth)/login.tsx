import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { PageTitle } from '../../components/ui/PageTitle';
import { Screen } from '../../components/ui/Screen';
import { colors } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import * as authService from '../../services/authService';
import { getLanguage } from '../../utils/storage';

export default function LoginScreen() {
  const { setUser } = useAuth();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setError('');
    if (!email.trim() || !password) {
      setError(t('login.validation'));
      return;
    }

    setLoading(true);
    try {
      const user = await authService.login(email.trim(), password);
      const language = await getLanguage();
      const nextUser = language && user.preferredLanguage !== language ? await authService.updateProfile({ preferredLanguage: language }) : user;
      setUser(nextUser);
      router.replace('/(tabs)');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('login.failed'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen contentStyle={styles.content}>
      <PageTitle eyebrow={t('login.eyebrow')} title={t('login.title')} subtitle={t('login.subtitle')} />
      <Input label={t('login.email')} value={email} onChangeText={setEmail} placeholder="you@example.com" autoCapitalize="none" keyboardType="email-address" />
      <Input label={t('login.password')} value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry autoCapitalize="none" />
      <Link href="/(auth)/forgot-password" style={styles.forgot}>
        {t('login.forgot')}
      </Link>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button label={t('login.submit')} onPress={onSubmit} loading={loading} />
      <Pressable
        onPress={() => {
          setEmail('nisha@example.com');
          setPassword('safelink123');
        }}
      >
        <Text style={styles.sample}>{t('login.sample')}</Text>
      </Pressable>
      <View style={styles.footerRow}>
        <Text style={styles.footerText}>{t('login.noAccount')} </Text>
        <Pressable onPress={() => router.push('/(auth)/register')}>
          <Text style={styles.footerLink}>{t('login.createAccount')}</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 36,
    gap: 18,
  },
  forgot: {
    alignSelf: 'flex-end',
    color: colors.body,
    fontWeight: '600',
    marginTop: -6,
  },
  error: {
    color: colors.sos,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  footerText: {
    color: colors.ink,
    fontSize: 15,
  },
  footerLink: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '800',
  },
  sample: {
    textAlign: 'center',
    color: colors.teal,
    fontWeight: '700',
    marginTop: 4,
  },
});
