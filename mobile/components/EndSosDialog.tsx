import { Modal, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/theme';
import { useTranslation } from '../hooks/useTranslation';
import { BrandMark } from './BrandMark';
import { Button } from './ui/Button';

type Props = {
  visible: boolean;
  onConfirm: () => void;
  onClose: () => void;
  busy?: boolean;
};

export function EndSosDialog({ visible, onConfirm, onClose, busy }: Props) {
  const { t } = useTranslation();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <BrandMark size={54} />
          <Text style={styles.title}>{t('endSos.title')}</Text>
          <Text style={styles.lead}>{t('endSos.lead')}</Text>
          <Button label={t('endSos.confirm')} onPress={onConfirm} loading={busy} />
          <Button label={t('endSos.keep')} variant="secondary" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(21,32,51,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 22,
    gap: 14,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.ink,
    textAlign: 'center',
  },
  lead: {
    color: colors.body,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: -6,
  },
});
