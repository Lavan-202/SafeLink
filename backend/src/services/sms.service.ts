import { isSmsConfigured, env } from '../config/env';

export type SmsResult = {
  delivered: boolean;
  status: 'sent' | 'skipped' | 'failed';
  detail: string;
};

export async function sendSms(to: string, body: string): Promise<SmsResult> {
  if (!isSmsConfigured()) {
    return {
      delivered: false,
      status: 'skipped',
      detail: 'SMS provider is not configured',
    };
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${env.twilio.accountSid}/Messages.json`;
  const credentials = Buffer.from(`${env.twilio.accountSid}:${env.twilio.authToken}`).toString('base64');
  const form = new URLSearchParams({
    To: to,
    From: env.twilio.fromNumber,
    Body: body,
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: form,
    });

    if (!response.ok) {
      const detail = await response.text();
      return { delivered: false, status: 'failed', detail: detail.slice(0, 300) };
    }

    return { delivered: true, status: 'sent', detail: 'Sent' };
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'SMS request failed';
    return { delivered: false, status: 'failed', detail };
  }
}
