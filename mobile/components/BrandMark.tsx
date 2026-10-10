import { StyleSheet, View } from 'react-native';
import { colors } from '../constants/theme';

export function BrandMark({ size = 92 }: { size?: number }) {
  const mark = size * 0.46;
  return (
    <View style={[styles.tile, { width: size, height: size, borderRadius: size * 0.28 }]}>
      <View style={[styles.shield, { width: mark * 0.86, height: mark }]}>
        <View style={styles.left} />
        <View style={styles.right} />
        <View style={styles.points}>
          <View style={styles.point} />
          <View style={styles.point} />
          <View style={styles.point} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shield: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  left: {
    flex: 1,
    backgroundColor: '#E24B4B',
  },
  right: {
    flex: 1,
    backgroundColor: '#D5DCE6',
  },
  points: {
    position: 'absolute',
    top: '28%',
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 3,
  },
  point: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.white,
  },
});
