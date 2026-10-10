import crypto from 'crypto';
import mongoose from 'mongoose';
import { env } from '../../config/env';
import { LocationShare } from '../../models/LocationShare.model';
import { SOSAlert } from '../../models/SOSAlert.model';
import { User, type PrivacySettings, defaultPrivacy } from '../../models/User.model';
import { notifyTrustedContacts } from '../../services/notification.service';
import { AppError } from '../../utils/AppError';
import { applyLocationPrecision, buildSosMessage } from '../../utils/sosMessage';

type Coordinates = {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
};

function toAlert(alert: {
  _id: mongoose.Types.ObjectId;
  status: string;
  kind?: string;
  shareToken: string;
  lastLocation: { latitude: number; longitude: number; accuracy?: number | null; recordedAt: Date };
  notifiedContacts: Array<{
    contactId: mongoose.Types.ObjectId;
    name: string;
    phone: string;
    channel: string;
    status: string;
    detail?: string;
  }>;
  triggeredAt: Date;
  resolvedAt?: Date | null;
  cancelledAt?: Date | null;
  smsConfigured?: boolean;
}) {
  return {
    id: alert._id.toString(),
    status: alert.status,
    kind: alert.kind === 'safety-check' ? 'safety-check' : 'sos',
    shareToken: alert.shareToken,
    liveUrl: `${env.publicAppUrl}/track/${alert.shareToken}`,
    lastLocation: alert.lastLocation,
    notifiedContacts: alert.notifiedContacts.map((contact) => ({
      contactId: contact.contactId.toString(),
      name: contact.name,
      phone: contact.phone,
      channel: contact.channel,
      status: contact.status,
      detail: contact.detail ?? '',
    })),
    triggeredAt: alert.triggeredAt,
    resolvedAt: alert.resolvedAt ?? null,
    cancelledAt: alert.cancelledAt ?? null,
    smsConfigured: alert.smsConfigured,
  };
}

async function getOwnedAlert(userId: string, alertId: string) {
  const alert = await SOSAlert.findOne({ _id: alertId, userId });
  if (!alert) throw new AppError('SOS alert not found', 404);
  return alert;
}

async function getPrivacy(userId: string): Promise<PrivacySettings & { name: string }> {
  const user = await User.findById(userId);
  if (!user) throw new AppError('Account not found', 404);
  const stored = user.privacy as { toObject?: () => Record<string, unknown> } | Record<string, unknown> | null | undefined;
  const privacy = stored && typeof stored.toObject === 'function' ? stored.toObject() : (stored ?? {});
  return { name: user.name, ...defaultPrivacy(), ...privacy };
}

async function recordPoint(
  userId: string,
  alertId: mongoose.Types.ObjectId,
  point: { latitude: number; longitude: number; accuracy: number | null },
) {
  const recordedAt = new Date();
  await LocationShare.create({
    userId,
    sosAlertId: alertId,
    ...point,
    recordedAt,
  });
  return { ...point, recordedAt };
}

export async function createSos(userId: string, input: Coordinates) {
  const existing = await SOSAlert.findOne({ userId, status: 'active' });
  if (existing) {
    throw new AppError('An SOS alert is already active', 409, { activeAlertId: existing.id });
  }

  const privacy = await getPrivacy(userId);
  const point = applyLocationPrecision(input.latitude, input.longitude, privacy.sharePreciseLocation);
  const shareToken = crypto.randomBytes(24).toString('hex');
  const location = {
    latitude: point.latitude,
    longitude: point.longitude,
    accuracy: input.accuracy ?? null,
    recordedAt: new Date(),
  };

  const alert = await SOSAlert.create({
    userId,
    shareToken,
    lastLocation: location,
    notifiedContacts: [],
  });

  await LocationShare.create({
    userId,
    sosAlertId: alert._id,
    latitude: location.latitude,
    longitude: location.longitude,
    accuracy: location.accuracy,
    recordedAt: location.recordedAt,
  });

  const liveUrl = `${env.publicAppUrl}/track/${shareToken}`;
  const message = buildSosMessage({
    name: privacy.name,
    latitude: location.latitude,
    longitude: location.longitude,
    liveUrl,
  });

  const notification = await notifyTrustedContacts({
    userId,
    notifyAllContacts: privacy.notifyAllContacts,
    message,
  });

  alert.set('notifiedContacts', notification.notifiedContacts);
  await alert.save();

  return { ...toAlert(alert), smsConfigured: notification.smsConfigured, message };
}

export async function getActiveSos(userId: string) {
  const alert = await SOSAlert.findOne({ userId, status: 'active' }).sort({ triggeredAt: -1 });
  if (!alert) return null;
  const privacy = await getPrivacy(userId);
  return { ...toAlert(alert), smsConfigured: undefined, shareLiveLocation: privacy.shareLiveLocation, locationUpdateIntervalSec: privacy.locationUpdateIntervalSec };
}

export async function getSos(userId: string, alertId: string) {
  const alert = await getOwnedAlert(userId, alertId);
  return toAlert(alert);
}

export async function addLocation(userId: string, alertId: string, input: Coordinates) {
  const alert = await getOwnedAlert(userId, alertId);
  if (alert.status !== 'active') {
    throw new AppError('This SOS alert is no longer active', 400);
  }

  const privacy = await getPrivacy(userId);
  if (!privacy.shareLiveLocation) {
    throw new AppError('Live location sharing is turned off in privacy settings', 403);
  }

  const point = applyLocationPrecision(input.latitude, input.longitude, privacy.sharePreciseLocation);
  const lastLocation = await recordPoint(userId, alert._id, {
    latitude: point.latitude,
    longitude: point.longitude,
    accuracy: input.accuracy ?? null,
  });

  alert.lastLocation = lastLocation;
  await alert.save();
  return toAlert(alert);
}

async function closeAlert(userId: string, alertId: string, status: 'resolved' | 'cancelled') {
  const alert = await getOwnedAlert(userId, alertId);
  if (alert.status !== 'active') {
    throw new AppError('This SOS alert is no longer active', 400);
  }

  alert.status = status;
  if (status === 'resolved') alert.resolvedAt = new Date();
  if (status === 'cancelled') alert.cancelledAt = new Date();
  await alert.save();
  return toAlert(alert);
}

export function resolveSos(userId: string, alertId: string) {
  return closeAlert(userId, alertId, 'resolved');
}

export function cancelSos(userId: string, alertId: string) {
  return closeAlert(userId, alertId, 'cancelled');
}

export async function listHistory(userId: string) {
  const alerts = await SOSAlert.find({ userId }).sort({ triggeredAt: -1 }).limit(50);
  return alerts.map((alert) => toAlert(alert));
}
