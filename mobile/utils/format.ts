const localeMap = { en: 'en-GB', ta: 'ta-LK', si: 'si-LK' } as const;

export function formatWhen(value?: string | null, language: keyof typeof localeMap = 'en') {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(localeMap[language], {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export function formatNoticeTime(value?: string | null, language: keyof typeof localeMap = 'en') {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const now = new Date();
  const sameDay = now.toDateString() === date.toDateString();
  return new Intl.DateTimeFormat(localeMap[language], {
    day: sameDay ? undefined : '2-digit',
    month: sameDay ? undefined : 'short',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export function greetingKey(): 'morning' | 'afternoon' | 'evening' {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

export function greetingLabel() {
  const hour = new Date().getHours();
  if (hour < 12) return 'GOOD MORNING';
  if (hour < 17) return 'GOOD AFTERNOON';
  return 'GOOD EVENING';
}

export function accuracyKey(meters: number | null | undefined): 'high' | 'medium' | 'low' | 'unknown' {
  if (meters == null) return 'unknown';
  if (meters <= 20) return 'high';
  if (meters <= 80) return 'medium';
  return 'low';
}

export function accuracyLabel(meters: number | null | undefined) {
  if (meters == null) return 'Unknown';
  if (meters <= 20) return 'High';
  if (meters <= 80) return 'Medium';
  return 'Low';
}

export function formatCoordinates(latitude: number, longitude: number) {
  return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
}

export function mapsUrl(latitude: number, longitude: number) {
  return `https://maps.google.com/?q=${latitude},${longitude}`;
}

export function buildLocalSosMessage(name: string, latitude: number, longitude: number, liveUrl?: string) {
  const live = liveUrl ? ` Live updates: ${liveUrl}` : '';
  return `SafeLink SOS: ${name} needs help. Map: ${mapsUrl(latitude, longitude)}.${live}`;
}
