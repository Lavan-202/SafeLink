import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../constants/theme';
import { useTranslation } from '../hooks/useTranslation';

const items = [
  { name: 'index', key: 'tabs.home', icon: 'home-outline', iconOn: 'home' },
  { name: 'location', key: 'tabs.location', icon: 'location-outline', iconOn: 'location' },
  { name: 'contacts', key: 'tabs.contacts', icon: 'people-outline', iconOn: 'people' },
  { name: 'history', key: 'tabs.history', icon: 'time-outline', iconOn: 'time' },
  { name: 'profile', key: 'tabs.profile', icon: 'person-outline', iconOn: 'person' },
] as const;

export function AppTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {items.map((item) => {
        const routeIndex = state.routes.findIndex((route) => route.name === item.name);
        if (routeIndex < 0) return null;
        const active = state.index === routeIndex;
        const label = t(item.key);
        return (
          <Pressable
            key={item.name}
            accessibilityRole="button"
            accessibilityLabel={label}
            accessibilityState={{ selected: active }}
            onPress={() => {
              const route = state.routes[routeIndex];
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!active && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            }}
            style={styles.item}
          >
            <View style={[styles.iconWrap, active && styles.iconWrapOn]}>
              <Ionicons
                name={active ? item.iconOn : item.icon}
                size={22}
                color={active ? colors.white : '#8B95A6'}
              />
            </View>
            <Text style={[styles.label, active && styles.labelOn]} numberOfLines={1}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: '#EEF1F6',
    paddingTop: 8,
    shadowColor: '#152033',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 12,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    minHeight: 52,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapOn: {
    backgroundColor: colors.navy,
  },
  label: {
    fontSize: 11,
    color: '#A0A8B6',
    fontWeight: '600',
  },
  labelOn: {
    color: colors.navy,
    fontWeight: '800',
  },
});
