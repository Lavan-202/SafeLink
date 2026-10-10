import bcrypt from 'bcryptjs';
import { AppNotification } from '../../models/AppNotification.model';
import { EmergencyContact } from '../../models/EmergencyContact.model';
import { SOSAlert } from '../../models/SOSAlert.model';
import { User } from '../../models/User.model';

const SAMPLE_EMAIL = 'nisha@example.com';
const SAMPLE_PASSWORD = 'safelink123';

const contacts = [
  { name: 'Mother', phone: '+94 77 123 4567', relationship: 'Mother', notifyOnSos: true, preselectLocation: true },
  { name: 'Father', phone: '+94 71 987 6543', relationship: 'Father', notifyOnSos: true, preselectLocation: true },
  { name: 'Friend', phone: '+94 76 555 0102', relationship: 'Friend', notifyOnSos: true, preselectLocation: false },
  { name: 'Sister', phone: '+94 75 220 4418', relationship: 'Sister', notifyOnSos: true, preselectLocation: false },
];

export async function seedSampleData() {
  let user = await User.findOne({ email: SAMPLE_EMAIL });
  if (!user) {
    user = await User.create({
      name: 'Nisha Ravi',
      email: SAMPLE_EMAIL,
      phone: '+94 77 123 4567',
      role: 'University Student',
      preferredLanguage: 'en',
      passwordHash: await bcrypt.hash(SAMPLE_PASSWORD, 10),
      privacy: {
        shareLiveLocation: true,
        sharePreciseLocation: true,
        smsFallback: true,
        notifyAllContacts: true,
        locationUpdateIntervalSec: 15,
        autoShareOnSos: true,
        showSharingStatus: false,
        sharingDuration: 'until',
      },
    });
  }

  for (const contact of contacts) {
    const exists = await EmergencyContact.findOne({ userId: user._id, phone: contact.phone });
    if (!exists) {
      await EmergencyContact.create({ userId: user._id, ...contact });
    }
  }

  const savedContacts = await EmergencyContact.find({ userId: user._id });
  const byName = (name: string) => savedContacts.find((contact) => contact.name === name);

  const mother = byName('Mother');
  const father = byName('Father');
  const friend = byName('Friend');
  const sister = byName('Sister');

  const notified = [mother, father, friend, sister].filter(Boolean).map((contact) => ({
    contactId: contact!._id,
    name: contact!.name,
    phone: contact!.phone,
    channel: 'sms' as const,
    status: 'sent' as const,
    detail: 'Sent',
  }));

  const colombo = { latitude: 6.9271, longitude: 79.8612, accuracy: 12 };

  const alerts = [
    {
      shareToken: 'sample-sos-2026-09-08',
      status: 'resolved' as const,
      kind: 'sos' as const,
      triggeredAt: new Date('2026-09-08T15:12:00.000Z'),
      resolvedAt: new Date('2026-09-08T15:40:00.000Z'),
      cancelledAt: null,
      notifiedContacts: notified,
    },
    {
      shareToken: 'sample-sos-2026-09-02',
      status: 'cancelled' as const,
      kind: 'sos' as const,
      triggeredAt: new Date('2026-09-02T16:45:00.000Z'),
      resolvedAt: null,
      cancelledAt: new Date('2026-09-02T16:46:00.000Z'),
      notifiedContacts: notified.slice(0, 2),
    },
    {
      shareToken: 'sample-check-2026-08-28',
      status: 'resolved' as const,
      kind: 'safety-check' as const,
      triggeredAt: new Date('2026-08-28T14:00:00.000Z'),
      resolvedAt: new Date('2026-08-28T14:05:00.000Z'),
      cancelledAt: null,
      notifiedContacts: notified.slice(0, 1),
    },
  ];

  for (const alert of alerts) {
    const exists = await SOSAlert.findOne({ shareToken: alert.shareToken });
    if (exists) continue;
    await SOSAlert.create({
      userId: user._id,
      ...alert,
      lastLocation: { ...colombo, recordedAt: alert.triggeredAt },
    });
  }

  const todayEvening = new Date();
  todayEvening.setHours(20, 44, 0, 0);

  const notes = [
    {
      sampleKey: 'mother-viewed',
      title: 'Mother viewed your live location',
      type: 'location-view' as const,
      occurredAt: todayEvening,
    },
    {
      sampleKey: 'sos-ended',
      title: 'SOS ended — marked safe',
      type: 'sos-ended' as const,
      occurredAt: new Date('2026-09-08T15:40:00.000Z'),
    },
    {
      sampleKey: 'battery-low',
      title: 'Battery below 20% — charge your phone',
      type: 'battery' as const,
      occurredAt: new Date('2026-09-08T12:32:00.000Z'),
    },
  ];

  for (const note of notes) {
    const exists = await AppNotification.findOne({ userId: user._id, sampleKey: note.sampleKey });
    if (exists) continue;
    await AppNotification.create({ userId: user._id, ...note });
  }

  console.log(`Sample account ready: ${SAMPLE_EMAIL} / ${SAMPLE_PASSWORD}`);
}
