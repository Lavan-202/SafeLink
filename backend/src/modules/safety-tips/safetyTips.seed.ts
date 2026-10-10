import { SafetyTip } from '../../models/SafetyTip.model';

const tips = [
  {
    title: 'Share your route',
    body: 'Before you travel, tell a trusted person where you are going and when you expect to arrive.',
    category: 'Travel',
    priority: 1,
  },
  {
    title: 'Keep your phone charged',
    body: 'A low battery can stop an SOS alert. Charge your phone before a late trip and carry a backup battery if you can.',
    category: 'Preparedness',
    priority: 2,
  },
  {
    title: 'Use busy, well-lit places',
    body: 'If you feel unsafe, move toward a shop, station, or other public place with other people around.',
    category: 'Travel',
    priority: 3,
  },
  {
    title: 'Trust what feels wrong',
    body: 'You do not need to explain a bad feeling. Leave the situation and contact someone you trust.',
    category: 'Awareness',
    priority: 4,
  },
  {
    title: 'Save local emergency numbers',
    body: 'Check the emergency services list for your region and confirm the numbers before you need them.',
    category: 'Preparedness',
    priority: 5,
  },
  {
    title: 'Choose contacts carefully',
    body: 'Only people you trust should receive your location. You can turn live sharing off in Privacy.',
    category: 'Privacy',
    priority: 6,
  },
  {
    title: 'Cancel if you are safe',
    body: 'The SOS countdown lasts five seconds. Cancel it if you pressed the button by mistake.',
    category: 'SOS',
    priority: 7,
  },
  {
    title: 'Mark yourself safe',
    body: 'When the situation is over, resolve the alert so your contacts know you are safe and live updates stop.',
    category: 'SOS',
    priority: 8,
  },
];

export async function seedSafetyTips() {
  const count = await SafetyTip.countDocuments();
  if (count > 0) return;
  await SafetyTip.insertMany(tips);
}
