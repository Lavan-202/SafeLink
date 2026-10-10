import { StyleSheet, Text, View } from 'react-native';
import { emoji } from '../constants/emoji';
import { colors } from '../constants/theme';

export function OfflineBanner({ message }: { message: string }) {
  return (
    <View style={styles.banner} accessibilityRole="text">
      <Text style={styles.text}>{emoji.offline} {message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.peach,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  text: {
    color: colors.warning,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
});
