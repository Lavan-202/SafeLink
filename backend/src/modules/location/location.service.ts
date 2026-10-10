import { env } from '../../config/env';
import { SOSAlert } from '../../models/SOSAlert.model';
import { User } from '../../models/User.model';
import { AppError } from '../../utils/AppError';
import { escapeHtml } from '../../utils/sosMessage';

export async function getLiveShare(token: string) {
  const alert = await SOSAlert.findOne({ shareToken: token });
  if (!alert) throw new AppError('This location link is not available', 404);

  const user = await User.findById(alert.userId);
  return {
    name: user?.name ?? 'SafeLink user',
    status: alert.status,
    latitude: alert.lastLocation.latitude,
    longitude: alert.lastLocation.longitude,
    accuracy: alert.lastLocation.accuracy,
    updatedAt: alert.lastLocation.recordedAt,
    liveUrl: `${env.publicAppUrl}/track/${alert.shareToken}`,
  };
}

export function renderTrackPage(share: Awaited<ReturnType<typeof getLiveShare>>) {
  const name = escapeHtml(share.name);
  const active = share.status === 'active';
  const statusLabel = active ? 'SOS is active' : share.status === 'resolved' ? 'This person marked themselves safe' : 'This SOS was cancelled';
  const mapUrl = `https://maps.google.com/?q=${share.latitude},${share.longitude}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  ${active ? '<meta http-equiv="refresh" content="15" />' : ''}
  <title>SafeLink location</title>
  <style>
    body { font-family: Georgia, serif; background: #f4f7fb; color: #0f2744; margin: 0; }
    main { max-width: 32rem; margin: 0 auto; padding: 2rem 1.25rem; }
    h1 { font-size: 1.8rem; margin-bottom: 0.25rem; }
    .status { display: inline-block; padding: 0.35rem 0.7rem; border-radius: 999px; background: ${active ? '#fee2e2' : '#d1fae5'}; color: ${active ? '#9f1239' : '#065f46'}; font-family: sans-serif; font-size: 0.85rem; }
    a.button { display: inline-block; margin-top: 1.25rem; background: #0f2744; color: white; text-decoration: none; padding: 0.9rem 1.1rem; border-radius: 0.8rem; font-family: sans-serif; }
    p { line-height: 1.5; }
  </style>
</head>
<body>
  <main>
    <p class="status">${statusLabel}</p>
    <h1>${name}</h1>
    <p>Last shared location: ${share.latitude}, ${share.longitude}</p>
    <p>Updated ${escapeHtml(new Date(share.updatedAt).toLocaleString())}. ${active ? 'This page refreshes every 15 seconds while the alert is active.' : 'Live updates have stopped.'}</p>
    <a class="button" href="${mapUrl}">Open in maps</a>
  </main>
</body>
</html>`;
}
