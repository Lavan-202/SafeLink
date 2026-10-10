import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../../constants/theme';

type Variant = 'primary' | 'teal' | 'danger' | 'secondary' | 'ghost' | 'dangerText';

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
};

export function Button({ label, onPress, variant = 'primary', disabled, loading }: Props) {
  const lightText = variant === 'primary' || variant === 'teal' || variant === 'danger';
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && styles.pressed,
        (disabled || loading) && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={lightText ? colors.white : colors.ink} />
      ) : (
        <Text
          style={[
            styles.label,
            variant === 'secondary' || variant === 'ghost' ? styles.darkLabel : null,
            variant === 'dangerText' ? styles.dangerLabel : null,
            lightText ? styles.lightLabel : null,
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    alignSelf: 'stretch',
  },
  primary: {
    backgroundColor: colors.navy,
  },
  teal: {
    backgroundColor: colors.teal,
  },
  danger: {
    backgroundColor: colors.sos,
  },
  secondary: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: '#D9E0EA',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  dangerText: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: '#D9E0EA',
  },
  pressed: {
    opacity: 0.88,
  },
  disabled: {
    opacity: 0.55,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
  },
  lightLabel: {
    color: colors.white,
  },
  darkLabel: {
    color: colors.ink,
  },
  dangerLabel: {
    color: colors.sos,
  },
});
