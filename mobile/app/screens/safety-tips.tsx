import { StyleSheet, Text, View } from 'react-native';
import { BackButton } from '../../components/ui/BackButton';
import { PageTitle } from '../../components/ui/PageTitle';
import { Screen } from '../../components/ui/Screen';
import { emoji } from '../../constants/emoji';
import { colors } from '../../constants/theme';
import { useTranslation } from '../../hooks/useTranslation';

const tips = [
  { key: 'night', mark: emoji.night, tint: '#E7F8EF' },
  { key: 'battery', mark: emoji.battery, tint: '#E7F8EF' },
  { key: 'share', mark: emoji.location, tint: '#FFF1F2' },
  { key: 'aware', mark: emoji.aware, tint: '#E7F0FA' },
  { key: 'route', mark: emoji.route, tint: '#E7F8EF' },
  { key: 'cancel', mark: emoji.sos, tint: '#FFF6E8' },
];

export default function SafetyTipsScreen() {
  const { t } = useTranslation();
  return (
    <Screen>
      <BackButton />
      <PageTitle eyebrow={t('tips.eyebrow')} title={`${emoji.tips} ${t('tips.title')}`} />
      <View style={styles.card}>
        {tips.map((tip, index) => (
          <View key={tip.key} style={[styles.row, index < tips.length - 1 && styles.border]}>
            <View style={[styles.icon, { backgroundColor: tip.tint }]}>
              <Text style={styles.mark}>{tip.mark}</Text>
            </View>
            <View style={styles.copy}>
              <Text style={styles.title}>{t(`tips.items.${tip.key}.title`)}</Text>
              <Text style={styles.body}>{t(`tips.items.${tip.key}.body`)}</Text>
            </View>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 22,
    paddingHorizontal: 14,
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
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mark: {
    fontSize: 18,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  title: {
    color: colors.ink,
    fontWeight: '800',
    fontSize: 16,
  },
  body: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
});
