import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BackButton } from '../../components/ui/BackButton';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { PageTitle } from '../../components/ui/PageTitle';
import { Screen } from '../../components/ui/Screen';
import { emoji } from '../../constants/emoji';
import { colors } from '../../constants/theme';
import { useTranslation } from '../../hooks/useTranslation';
import { api } from '../../services/apiClient';

const faqKeys = ['sos', 'location', 'offline'] as const;

export default function HelpScreen() {
  const { t } = useTranslation();
  const [open, setOpen] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function send() {
    if (message.trim().length < 8) {
      setError(t('help.tooShort'));
      setSent('');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api<{ received: boolean }>('/support', { method: 'POST', body: { message: message.trim() } });
      setSent(t('help.sent'));
      setMessage('');
    } catch (err) {
      setSent('');
      setError(err instanceof Error ? err.message : t('help.failed'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <BackButton />
      <PageTitle eyebrow={t('help.eyebrow')} title={`${emoji.help} ${t('help.title')}`} />
      <View style={styles.card}>
        {faqKeys.map((key, index) => (
          <View key={key} style={index < faqKeys.length - 1 ? styles.border : undefined}>
            <Pressable style={styles.row} onPress={() => setOpen(open === index ? null : index)}>
              <Text style={styles.question}>{t(`help.faqs.${key}.title`)}</Text>
              <Ionicons name="chevron-forward" size={18} color="#C5CDD8" />
            </Pressable>
            {open === index ? <Text style={styles.answer}>{t(`help.faqs.${key}.body`)}</Text> : null}
          </View>
        ))}
      </View>
      <Input label={t('help.describe')} value={message} onChangeText={setMessage} placeholder={t('help.placeholder')} multiline />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {sent ? <Text style={styles.sent}>{sent}</Text> : null}
      <Button label={t('help.send')} onPress={send} loading={loading} />
      <Text style={styles.version}>{t('help.version')}</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 22,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    gap: 12,
    minHeight: 52,
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  question: {
    flex: 1,
    color: colors.ink,
    fontWeight: '700',
    fontSize: 16,
  },
  answer: {
    color: colors.body,
    lineHeight: 20,
    paddingBottom: 14,
  },
  error: {
    color: colors.sos,
  },
  sent: {
    color: colors.success,
  },
  version: {
    textAlign: 'center',
    color: colors.muted,
    marginTop: 8,
  },
});
