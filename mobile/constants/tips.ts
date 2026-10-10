import type { SafetyTip } from '../types';

export const fallbackSafetyTips: SafetyTip[] = [
  {
    id: 'route',
    title: 'Share your route',
    body: 'Before you travel, tell a trusted person where you are going and when you expect to arrive.',
    category: 'Travel',
  },
  {
    id: 'battery',
    title: 'Keep your phone charged',
    body: 'A low battery can stop an SOS alert. Charge your phone before a late trip.',
    category: 'Preparedness',
  },
  {
    id: 'public',
    title: 'Use busy, well-lit places',
    body: 'If you feel unsafe, move toward a shop, station, or other public place with other people around.',
    category: 'Travel',
  },
  {
    id: 'instinct',
    title: 'Trust what feels wrong',
    body: 'Leave the situation and contact someone you trust. You do not need to explain a bad feeling.',
    category: 'Awareness',
  },
  {
    id: 'cancel',
    title: 'Cancel if you are safe',
    body: 'The SOS countdown lasts five seconds. Cancel it if you pressed the button by mistake.',
    category: 'SOS',
  },
];
