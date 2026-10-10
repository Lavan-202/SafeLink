import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env';
import { errorMiddleware, notFoundMiddleware } from './middleware/error.middleware';
import { authRouter } from './modules/auth/auth.routes';
import { contactsRouter } from './modules/contacts/contacts.routes';
import { emergencyRouter } from './modules/emergency/emergency.routes';
import { historyRouter } from './modules/history/history.routes';
import { locationRouter } from './modules/location/location.routes';
import { getLiveShare, renderTrackPage } from './modules/location/location.service';
import { notificationsRouter } from './modules/notifications/notifications.routes';
import { privacyRouter } from './modules/privacy/privacy.routes';
import { safetyTipsRouter } from './modules/safety-tips/safetyTips.routes';
import { sosRouter } from './modules/sos/sos.routes';
import { supportRouter } from './modules/support/support.routes';
import { usersRouter } from './modules/users/users.routes';
import { AppError } from './utils/AppError';

export const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin: env.clientOrigin === '*' ? true : env.clientOrigin.split(',').map((value) => value.trim()),
  }),
);
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'safelink-api' });
});

app.get('/track/:token', async (req, res, next) => {
  try {
    const share = await getLiveShare(req.params.token);
    res.type('html').send(renderTrackPage(share));
  } catch (error) {
    if (error instanceof AppError && error.statusCode === 404) {
      res.status(404).type('html').send('<h1>This SafeLink update is not available.</h1>');
      return;
    }
    next(error);
  }
});

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/contacts', contactsRouter);
app.use('/api/sos', sosRouter);
app.use('/api/location', locationRouter);
app.use('/api/emergency', emergencyRouter);
app.use('/api/history', historyRouter);
app.use('/api/safety-tips', safetyTipsRouter);
app.use('/api/privacy', privacyRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/support', supportRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);
