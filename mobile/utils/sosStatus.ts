import type { SosAlert } from '../types';

export type DeliveryTone = 'none' | 'sent' | 'pending' | 'failed' | 'mixed';

export function deliveryTone(alert: SosAlert | null): DeliveryTone {
  const items = alert?.notifiedContacts ?? [];
  if (items.length === 0) return 'none';
  const sent = items.filter((item) => item.status === 'sent').length;
  const failed = items.filter((item) => item.status === 'failed').length;
  const pending = items.length - sent - failed;
  if (sent === items.length) return 'sent';
  if (failed === items.length) return 'failed';
  if (pending === items.length) return 'pending';
  return 'mixed';
}

export function deliveryLabelKey(status: string) {
  if (status === 'sent') return 'sosActive.statusSent';
  if (status === 'failed') return 'sosActive.statusFailed';
  if (status === 'skipped') return 'sosActive.statusSkipped';
  return 'sosActive.statusPending';
}

export function deliveryMetaKey(status: string) {
  if (status === 'sent') return 'sosActive.metaSent';
  if (status === 'failed') return 'sosActive.metaFailed';
  return 'sosActive.metaPending';
}

export function headerStatusKey(alert: SosAlert | null, active: boolean) {
  if (!active) return 'sosActive.headerInactive';
  const tone = deliveryTone(alert);
  if (tone === 'none') return 'sosActive.headerNone';
  if (tone === 'sent') return 'sosActive.headerSent';
  if (tone === 'failed') return 'sosActive.headerFailed';
  if (tone === 'pending') return 'sosActive.headerPending';
  return 'sosActive.headerMixed';
}

export function formatElapsed(startedAt?: string | null) {
  if (!startedAt) return '0:00';
  const start = new Date(startedAt).getTime();
  if (Number.isNaN(start)) return '0:00';
  const total = Math.max(0, Math.floor((Date.now() - start) / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = String(total % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}
