import { useEffect, useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { OfflineBanner } from '../../components/OfflineBanner';
import { BackButton } from '../../components/ui/BackButton';
import { PageTitle } from '../../components/ui/PageTitle';
import { Screen } from '../../components/ui/Screen';
import { emoji } from '../../constants/emoji';
import { fallbackEmergencyDirectory } from '../../constants/emergency';
import { colors } from '../../constants/theme';
import { useTranslation } from '../../hooks/useTranslation';
import { api } from '../../services/apiClient';
import { useOnlineStatus } from '../../services/connectivity';
import type { EmergencyDirectory } from '../../types';

const presentation = [
  { id: 'police', titleKey: 'emergency.police', bodyKey: 'emergency.policeBody', mark: emoji.police, tint: '#E7F0FA' },
  { id: 'ambulance', titleKey: 'emergency.ambulance', bodyKey: 'emergency.ambulanceBody', mark: emoji.ambulance, tint: '#FFF1F2' },
  { id: 'fire', titleKey: 'emergency.fire', bodyKey: 'emergency.fireBody', mark: emoji.fire, tint: '#FFF6E8' },
];

export default function EmergencyServicesScreen() {
  const { t } = useTranslation();
  const online = useOnlineStatus();
  const [directory, setDirectory] = useState<EmergencyDirectory>(fallbackEmergencyDirectory);

  useEffect(() => {
    api<EmergencyDirectory>('/emergency/services', { auth: false })
      .then(setDirectory)
      .catch(() => setDirectory(fallbackEmergencyDirectory));
  }, []);

  return (
    <Screen>
      <BackButton />
      <PageTitle eyebrow={t('emergency.eyebrow', { region: directory.label.toUpperCase() })} title={`${emoji.phone} ${t('emergency.title')}`} />
      {!online ? <OfflineBanner message={t('emergency.offline')} /> : null}
      {presentation.map((item) => {
        const service = directory.services.find((entry) => entry.id === item.id);
        const number = service?.number ?? (item.id === 'police' ? '119' : item.id === 'ambulance' ? '1990' : '110');
        return (
          <View key={item.id} style={styles.card}>
            <View style={[styles.icon, { backgroundColor: item.tint }]}>
              <Text style={styles.mark}>{item.mark}</Text>
            </View>
            <View style={styles.copy}>
              <Text style={styles.name}>{t(item.titleKey)}</Text>
              <Text style={styles.body}>{t(item.bodyKey)}</Text>
            </View>
            <Text style={styles.number}>{number}</Text>
            <Pressable style={styles.call} onPress={() => Linking.openURL(`tel:${number}`)} accessibilityRole="button" accessibilityLabel={`${t('common.call')} ${number}`}>
              <Text style={styles.callText}>{emoji.phone} {t('common.call')}</Text>
            </Pressable>
          </View>
        );
      })}
      <Text style={styles.note}>{t('emergency.note')}</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mark: {
    fontSize: 22,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  name: {
    color: colors.ink,
    fontWeight: '800',
    fontSize: 16,
  },
  body: {
    color: colors.muted,
    fontSize: 13,
  },
  number: {
    color: colors.ink,
    fontWeight: '800',
    fontSize: 18,
  },
  call: {
    backgroundColor: colors.navy,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    minHeight: 40,
    justifyContent: 'center',
  },
  callText: {
    color: colors.white,
    fontWeight: '700',
  },
  note: {
    color: colors.muted,
    lineHeight: 20,
    marginTop: 4,
  },
});
