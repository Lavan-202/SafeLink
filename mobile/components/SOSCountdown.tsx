import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/theme';
import { useCountdown } from '../hooks/useCountdown';

type Props = {
  seconds?: number;
  onComplete: () => void;
};

export function SOSCountdown({ seconds = 5, onComplete }: Props) {
  const remaining = useCountdown(seconds, onComplete);

  return (
    <View style={styles.wrap}>
      <Text style={styles.remaining}>{Math.max(remaining, 0)}</Text>
      <Text style={styles.caption}>{remaining > 0 ? 'Sending unless you cancel' : 'Sending alert'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.sosSoft,
    borderWidth: 8,
    borderColor: colors.sos,
    alignItems: 'center',
    justifyContent: 'center',
  },
  remaining: {
    fontSize: 84,
    fontWeight: '800',
    color: colors.sos,
  },
  caption: {
    color: colors.ink,
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});
