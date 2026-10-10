import { Tabs } from 'expo-router';
import { AppTabBar } from '../../components/AppTabBar';
import { colors } from '../../constants/theme';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <AppTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="location" options={{ title: 'Location' }} />
      <Tabs.Screen name="contacts" options={{ title: 'Contacts' }} />
      <Tabs.Screen name="history" options={{ title: 'History' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
