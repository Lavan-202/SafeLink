import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../../components/ui/Screen';
import { emoji } from '../../constants/emoji';
import { colors } from '../../constants/theme';
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage } from '../../providers/LanguageProvider';
import { getHistory } from '../../services/sosService';
import type { SosAlert } from '../../types';
import { formatWhen } from '../../utils/format';

export default function HistoryScreen() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [alerts, setAlerts] = useState<SosAlert[]>([]);
  const [error, setError] = useState('');

  useFocusEffect(
    useCallback(() => {
      let active = true;
      getHistory()
        .then((data) => {
          if (active) {
            setAlerts(data.alerts);
            setError('');
          }
        })
        .catch((err: unknown) => {
          if (active) setError(err instanceof Error ? err.message : t('history.loadFailed'));
        });
      return () => {
        active = false;
      };
    }, [t]),
  );

  return (
    <Screen edges={['top']} contentStyle={styles.content}>
      <Text style={styles.title}>{emoji.history} {t('history.title')}</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {alerts.length === 0 && !error ? <Text style={styles.empty}>{t('history.empty')}</Text> : null}
      {alerts.map((alert) => {
        const resolved = alert.status === 'resolved';
        const cancelled = alert.status === 'cancelled';
        const safetyCheck = alert.kind === 'safety-check';
        const mark = cancelled ? emoji.cancel : resolved || safetyCheck ? emoji.safe : emoji.sos;
        const detail =
          alert.status === 'active'
            ? t('history.active')
            : cancelled
              ? t('history.cancelled')
              : safetyCheck
                ? t('history.safe')
                : t('history.resolved');
        return (
          <Pressable key={alert.id} style={styles.card} onPress={() => router.push({ pathname: '/screens/sos-active', params: { id: alert.id } })}>
            <Text style={styles.mark}>{mark}</Text>
            <View style={styles.copy}>
              <Text style={styles.cardTitle}>{safetyCheck ? t('history.safetyCheck') : t('history.sosAlert')}</Text>
              <Text style={styles.when}>{formatWhen(alert.triggeredAt, language)}</Text>
              <Text style={styles.detail}>{detail}</Text>
            </View>
          </Pressable>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 14,
    paddingTop: 18,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 6,
  },
  error: {
    color: colors.sos,
  },
  empty: {
    color: colors.body,
    fontSize: 15,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  mark: {
    fontSize: 22,
    marginTop: 2,
  },
  copy: {
    flex: 1,
    gap: 3,
  },
  cardTitle: {
    color: colors.ink,
    fontWeight: '800',
    fontSize: 16,
  },
  when: {
    color: colors.muted,
    fontSize: 13,
  },
  detail: {
    color: colors.body,
    fontSize: 14,
  },
});
