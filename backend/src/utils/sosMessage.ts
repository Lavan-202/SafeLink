export function applyLocationPrecision(latitude: number, longitude: number, precise: boolean) {
  if (precise) {
    return { latitude, longitude };
  }

  return {
    latitude: Math.round(latitude * 100) / 100,
    longitude: Math.round(longitude * 100) / 100,
  };
}

export function buildSosMessage(input: { name: string; latitude: number; longitude: number; liveUrl: string }) {
  const mapUrl = `https://maps.google.com/?q=${input.latitude},${input.longitude}`;
  return `SafeLink SOS: ${input.name} needs help. Map: ${mapUrl} Live updates: ${input.liveUrl}`;
}

export function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
