import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/ui/Button';
import { Screen } from '../../components/ui/Screen';
import { SOS_COUNTDOWN_SECONDS } from '../../constants/config';
import { emoji } from '../../constants/emoji';
import { colors } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';
import { useCountdown } from '../../hooks/useCountdown';
import { useTranslation } from '../../hooks/useTranslation';
import { ApiError } from '../../services/apiClient';
import { listContacts } from '../../services/contactService';
import { getCurrentCoordinates } from '../../services/locationService';
import { openSosSms } from '../../services/notificationService';
import { triggerSos } from '../../services/sosService';
import { buildLocalSosMessage } from '../../utils/format';

export default function SosConfirmationScreen() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const cancelled = useRef(false);
  const started = useRef(false);
  const [attempt, setAttempt] = useState(0);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [note, setNote] = useState('');
  const [cancelledView, setCancelledView] = useState(false);

  async function sendAlert() {
    if (cancelled.current || started.current) return;
    started.current = true;
    setSending(true);
    setError('');

    try {
      const location = await getCurrentCoordinates();
      const alert = await triggerSos(location);
      const phones = alert.notifiedContacts.map((contact) => contact.phone);
      if (phones.length > 0) {
        const message =
          alert.message ??
          buildLocalSosMessage(user?.name ?? 'A SafeLink user', location.latitude, location.longitude, alert.liveUrl);
        const sms = await openSosSms(phones, message);
        if (sms.cancelled) setNote(t('sosConfirm.phoneSmsCancelled'));
        else if (sms.opened && !sms.sent) setNote(t('sosConfirm.phoneSmsOpened'));
        else if (!sms.opened) setNote(sms.detail);
      }

      router.replace({ pathname: '/screens/sos-active', params: { id: alert.id } });
    } catch (err) {
      if (err instanceof Error && err.message === 'LOCATION_PERMISSION') {
        started.current = false;
        setError(t('sosConfirm.locationNeeded'));
        return;
      }

      if (err instanceof ApiError && err.status === 409 && err.activeAlertId) {
        router.replace({ pathname: '/screens/sos-active', params: { id: err.activeAlertId } });
        return;
      }

      if (err instanceof ApiError && err.status === 0) {
        try {
          const [location, contacts] = await Promise.all([getCurrentCoordinates(), listContacts()]);
          const phones = contacts
            .filter((contact) => user?.privacy.notifyAllContacts || contact.notifyOnSos)
            .map((contact) => contact.phone);
          const message = buildLocalSosMessage(user?.name ?? 'A SafeLink user', location.latitude, location.longitude);
          const sms = await openSosSms(phones, message);
          setNote(sms.opened ? t('sosConfirm.offlineSms') : sms.detail);
          setError(t('sosConfirm.notSaved'));
        } catch (smsError) {
          setError(smsError instanceof Error && smsError.message === 'LOCATION_PERMISSION' ? t('sosConfirm.locationNeeded') : t('sosConfirm.smsFailed'));
        }
        started.current = false;
        return;
      }

      started.current = false;
      setError(err instanceof Error ? err.message : t('sosConfirm.sendFailed'));
    } finally {
      setSending(false);
    }
  }

  if (cancelledView) {
    return (
      <Screen contentStyle={styles.content}>
        <View style={styles.iconWrap}>
          <Ionicons name="checkmark-circle" size={28} color={colors.success} />
        </View>
        <Text style={styles.title}>{emoji.safe} {t('sosConfirm.cancelledTitle')}</Text>
        <Text style={styles.lead}>{t('sosConfirm.cancelledBody')}</Text>
        <View style={styles.actions}>
          <Button label={t('common.backHome')} onPress={() => router.replace('/(tabs)')} />
        </View>
      </Screen>
    );
  }

  return (
    <CountdownBody
      key={attempt}
      sending={sending}
      error={error}
      note={note}
      onSend={sendAlert}
      onCancel={() => {
        cancelled.current = true;
        setCancelledView(true);
      }}
      onRetry={() => {
        started.current = false;
        cancelled.current = false;
        setError('');
        setAttempt((value) => value + 1);
      }}
    />
  );
}

function CountdownBody({
  sending,
  error,
  note,
  onSend,
  onCancel,
  onRetry,
}: {
  sending: boolean;
  error: string;
  note: string;
  onSend: () => void;
  onCancel: () => void;
  onRetry: () => void;
}) {
  const { t } = useTranslation();
  const remaining = useCountdown(SOS_COUNTDOWN_SECONDS, onSend);
  const label = String(remaining).padStart(2, '0');

  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.iconWrap}>
        <Ionicons name="warning" size={28} color="#C45C1A" />
      </View>
      <Text style={styles.title}>{emoji.sos} {t('sosConfirm.title')}</Text>
      <Text style={styles.lead}>{t('sosConfirm.lead')}</Text>
      <View style={styles.timer} accessibilityRole="timer" accessibilityLabel={String(remaining)}>
        <Text style={styles.timerText}>{label}</Text>
      </View>
      <Text style={styles.timerHint}>{remaining === 1 ? t('sosConfirm.sendsInOne', { count: remaining }) : t('sosConfirm.sendsIn', { count: remaining })}</Text>
      {sending ? <Text style={styles.lead}>{t('sosConfirm.sending')}</Text> : null}
      {note ? <Text style={styles.note}>{note}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.actions}>
        {error ? <Button label={t('common.retry')} onPress={onRetry} /> : <Button label={t('sosConfirm.sendNow')} variant="danger" onPress={onSend} loading={sending} />}
        <Button label={t('common.cancel')} variant="secondary" onPress={onCancel} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    gap: 16,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFF1E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.ink,
    textAlign: 'center',
  },
  lead: {
    color: colors.body,
    textAlign: 'center',
    lineHeight: 22,
    fontSize: 15,
    paddingHorizontal: 8,
  },
  timer: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 3,
    borderColor: colors.sos,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  timerText: {
    color: colors.sos,
    fontSize: 32,
    fontWeight: '800',
  },
  timerHint: {
    color: colors.muted,
    fontSize: 14,
    textAlign: 'center',
  },
  note: {
    color: colors.warning,
    textAlign: 'center',
  },
  error: {
    color: colors.sos,
    textAlign: 'center',
  },
  actions: {
    alignSelf: 'stretch',
    gap: 12,
    marginTop: 12,
  },
});
