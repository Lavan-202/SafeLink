import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/theme';
import { useTranslation } from '../hooks/useTranslation';

export function LocationMap({ accuracy }: { accuracy?: string }) {
  const { t } = useTranslation();
  return (
    <View style={styles.map}>
      {Array.from({ length: 7 }).map((_, index) => (
        <View key={`h-${index}`} style={[styles.hLine, { top: `${(index + 1) * 12}%` }]} />
      ))}
      {Array.from({ length: 6 }).map((_, index) => (
        <View key={`v-${index}`} style={[styles.vLine, { left: `${(index + 1) * 16}%` }]} />
      ))}
      <View style={styles.halo}>
        <View style={styles.pin} />
      </View>
      <View style={styles.pill}>
        <Text style={styles.pillText}>{t('location.youAreHere')}</Text>
      </View>
      {accuracy ? <Text style={styles.accuracy}>{accuracy}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    height: 280,
    backgroundColor: '#EEF2F8',
    overflow: 'hidden',
  },
  hLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#E1E7F0',
  },
  vLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#E1E7F0',
  },
  halo: {
    position: 'absolute',
    top: 54,
    alignSelf: 'center',
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(23,35,58,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pin: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.navy,
  },
  pill: {
    position: 'absolute',
    top: 148,
    alignSelf: 'center',
    backgroundColor: colors.navy,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  pillText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  accuracy: {
    position: 'absolute',
    right: 16,
    bottom: 12,
    color: colors.muted,
    fontSize: 12,
    fontWeight: '600',
  },
});
