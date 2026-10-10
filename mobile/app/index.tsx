import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BrandMark } from '../components/BrandMark';
import { emoji } from '../constants/emoji';
import { colors } from '../constants/theme';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../hooks/useTranslation';
import { getLanguage } from '../utils/storage';

export default function SplashScreen() {
  const { ready, user } = useAuth();
  const { t } = useTranslation();
  const [leaving, setLeaving] = useState(false);

  async function continueNext() {
    if (!ready || leaving) return;
    setLeaving(true);
    const language = await getLanguage();
    if (!language) {
      router.replace('/(auth)/language');
      return;
    }
    router.replace(user ? '/(tabs)' : '/(auth)/login');
  }

  return (
    <Pressable style={styles.screen} accessibilityRole="button" accessibilityLabel={t('common.tapToContinue')} onPress={continueNext}>
      <StatusBar style="light" />
      <View style={styles.center}>
        <BrandMark />
        <Text style={styles.name}>{t('appName')}</Text>
        <Text style={styles.tag}>{emoji.shield} {t('tagline')}</Text>
      </View>
      <Text style={styles.tap}>{ready ? t('common.tapToContinue') : t('common.loading')}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.splash,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 36,
  },
  center: {
    alignItems: 'center',
    gap: 14,
  },
  name: {
    color: colors.white,
    fontSize: 36,
    fontWeight: '800',
    marginTop: 8,
  },
  tag: {
    color: '#C5CEDD',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  tap: {
    position: 'absolute',
    bottom: 54,
    color: '#9AA6BA',
    letterSpacing: 1.4,
    fontSize: 13,
    fontWeight: '700',
  },
});
