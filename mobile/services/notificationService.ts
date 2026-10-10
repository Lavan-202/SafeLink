import * as Linking from 'expo-linking';
import * as SMS from 'expo-sms';

function digits(phone: string) {
  return phone.replace(/[^\d+]/g, '');
}

export async function callNumber(phone: string) {
  const number = digits(phone);
  if (!number) {
    return { opened: false, detail: 'Phone number is missing.' };
  }

  const url = `tel:${number}`;
  const supported = await Linking.canOpenURL(url);
  if (!supported) {
    return { opened: false, detail: 'This device cannot place a call.' };
  }

  await Linking.openURL(url);
  return { opened: true, detail: 'opened' };
}

async function openSmsUrl(phones: string[], message: string) {
  const recipients = phones.map(digits).filter(Boolean);
  if (recipients.length === 0) {
    return { opened: false, sent: false, cancelled: false, detail: 'Add a trusted contact before sending an SMS.' };
  }

  const body = encodeURIComponent(message);
  const first = recipients[0];
  const url = `sms:${first}${body ? `?body=${body}` : ''}`;
  const supported = await Linking.canOpenURL(url);
  if (!supported) {
    return { opened: false, sent: false, cancelled: false, detail: 'This device cannot send SMS.' };
  }

  await Linking.openURL(url);
  return { opened: true, sent: false, cancelled: false, detail: 'opened' };
}

export async function openSosSms(phones: string[], message: string) {
  const recipients = phones.map((phone) => phone.trim()).filter(Boolean);
  if (recipients.length === 0) {
    return { opened: false, sent: false, cancelled: false, detail: 'Add a trusted contact before sending an SMS.' };
  }

  try {
    const available = await SMS.isAvailableAsync();
    if (available) {
      const result = await SMS.sendSMSAsync(recipients, message);
      return {
        opened: result.result !== 'cancelled',
        sent: result.result === 'sent',
        cancelled: result.result === 'cancelled',
        detail: result.result,
      };
    }
  } catch {
    // Fall through to the phone SMS app.
  }

  return openSmsUrl(recipients, message);
}

export function openSmsTo(phone: string, message?: string) {
  return openSosSms([phone], message ?? '');
}
