import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BackButton } from '../../components/ui/BackButton';
import { Screen } from '../../components/ui/Screen';
import { emoji } from '../../constants/emoji';
import { colors } from '../../constants/theme';
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage } from '../../providers/LanguageProvider';
import { api } from '../../services/apiClient';
import { getHistory } from '../../services/sosService';
import type { SosAlert } from '../../types';
import { formatNoticeTime } from '../../utils/format';

type Notice = {
  id: string;
  title: string;
  time: string;
  icon: keyof typeof Ionicons.glyphMap;
  tint: string;
  color: string;
};

function fromAlerts(alerts: SosAlert[], t: (key: string) => string, language: 'en' | 'ta' | 'si'): Notice[] {
  return alerts.flatMap((alert) => {
    const items: Notice[] = [];
    if (alert.status === 'resolved') {
      items.push({
        id: `${alert.id}-safe`,
        title: t('notifications.ended'),
        time: formatNoticeTime(alert.resolvedAt || alert.triggeredAt, language),
        icon: 'checkmark-circle',
        tint: colors.successSoft,
        color: colors.success,
      });
    }
    if (alert.status === 'cancelled') {
      items.push({
        id: `${alert.id}-cancel`,
        title: t('notifications.cancelled'),
        time: formatNoticeTime(alert.cancelledAt || alert.triggeredAt, language),
        icon: 'close-circle',
        tint: colors.chip,
        color: colors.body,
      });
    }
    if (alert.lastLocation && alert.status === 'active') {
      items.push({
        id: `${alert.id}-active`,
        title: t('notifications.stillActive'),
        time: formatNoticeTime(alert.triggeredAt, language),
        icon: 'warning',
        tint: colors.peach,
        color: colors.warning,
      });
    }
    return items;
  });
}

export default function NotificationsScreen() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [items, setItems] = useState<Notice[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api<Array<{ id: string; title: string; type: 'location-view' | 'sos-ended' | 'battery'; occurredAt: string }>>('/notifications')
      .then((notes) => {
        if (notes.length === 0) {
          return getHistory().then((data) => setItems(fromAlerts(data.alerts, t, language)));
        }
        setItems(
          notes.map((note) => ({
            id: note.id,
            title:
              note.type === 'sos-ended'
                ? t('notifications.ended')
                : note.type === 'location-view'
                  ? t('notifications.locationShared')
                  : note.title,
            time: formatNoticeTime(note.occurredAt, language),
            ...(note.type === 'sos-ended'
              ? { icon: 'checkmark-circle' as const, tint: colors.successSoft, color: colors.success }
              : note.type === 'battery'
                ? { icon: 'battery-charging' as const, tint: colors.successSoft, color: colors.success }
                : { icon: 'eye' as const, tint: '#E7F0FA', color: '#3B82C4' }),
          })),
        );
      })
      .catch((err: unknown) => {
        getHistory()
          .then((data) => setItems(fromAlerts(data.alerts, t, language)))
          .catch(() => setError(err instanceof Error ? err.message : t('notifications.loadFailed')));
      });
  }, [language, t]);

  return (
    <Screen>
      <BackButton />
      <Text style={styles.title}>{emoji.bell} {t('notifications.title')}</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.card}>
        {items.length === 0 && !error ? <Text style={styles.empty}>{t('notifications.empty')}</Text> : null}
        {items.map((item, index) => (
          <View key={item.id} style={[styles.row, index < items.length - 1 && styles.border]}>
            <View style={[styles.icon, { backgroundColor: item.tint }]}>
              <Ionicons name={item.icon} size={18} color={item.color} />
            </View>
            <View style={styles.copy}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.ink,
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
    gap: 12,
    alignItems: 'center',
    paddingVertical: 14,
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  itemTitle: {
    color: colors.ink,
    fontWeight: '800',
    fontSize: 15,
  },
  time: {
    color: colors.muted,
    fontSize: 13,
  },
});
