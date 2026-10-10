import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/theme';

type Props = {
  onPress: () => void;
  disabled?: boolean;
};

export function SOSButton({ onPress, disabled }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.ring} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Start SOS countdown"
        disabled={disabled}
        onPress={onPress}
        style={({ pressed }) => [styles.button, pressed && styles.pressed, disabled && styles.disabled]}
      >
        <Text style={styles.label}>SOS</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#fecdd3',
  },
  button: {
    width: 176,
    height: 176,
    borderRadius: 88,
    backgroundColor: colors.sos,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  pressed: {
    backgroundColor: colors.navy,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.6,
  },
  label: {
    color: colors.white,
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
