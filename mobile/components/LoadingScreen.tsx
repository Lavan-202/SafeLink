import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/theme';

export function LoadingScreen({ label = 'Opening SafeLink' }: { label?: string }) {
  return (
    <View style={styles.screen}>
      <Text style={styles.mark}>SafeLink</Text>
      <Text style={styles.label}>{label}</Text>
      <ActivityIndicator color={colors.white} size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
  },
  mark: {
    color: colors.white,
    fontSize: 36,
    fontWeight: '800',
  },
  label: {
    color: '#D6E0EE',
    fontSize: 16,
    marginBottom: 12,
  },
});
