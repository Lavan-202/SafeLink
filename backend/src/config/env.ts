import dotenv from 'dotenv';

dotenv.config();

const nodeEnv = process.env.NODE_ENV ?? 'development';

export const env = {
  nodeEnv,
  isProduction: nodeEnv === 'production',
  port: Number(process.env.PORT ?? 4000),
  mongoUri: process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/safelink',
  jwtSecret: process.env.JWT_SECRET ?? (nodeEnv === 'test' ? 'test-secret' : 'dev-only-change-me'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  clientOrigin: process.env.CLIENT_ORIGIN ?? '*',
  publicAppUrl: (process.env.PUBLIC_APP_URL ?? 'http://localhost:4000').replace(/\/$/, ''),
  emergencyRegion: (process.env.EMERGENCY_REGION ?? 'LK').toUpperCase(),
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID ?? '',
    authToken: process.env.TWILIO_AUTH_TOKEN ?? '',
    fromNumber: process.env.TWILIO_FROM_NUMBER ?? '',
  },
};

export function isSmsConfigured() {
  return Boolean(env.twilio.accountSid && env.twilio.authToken && env.twilio.fromNumber);
}
