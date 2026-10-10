# Setup

## Requirements

- Node.js 20 or newer
- npm
- MongoDB 6 or newer (local) or a MongoDB Atlas connection string
- Expo Go on a phone, or an Android/iOS simulator

## Backend

```bash
cd backend
copy .env.example .env
npm install
npm run dev
```

The API listens on `http://localhost:4000`.

Check it:

```bash
curl http://localhost:4000/health
```

Run tests (no database required):

```bash
npm test
```

### Environment

| Variable | Purpose |
| --- | --- |
| `PORT` | API port, default `4000` |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for login tokens. Change this before any real deployment. |
| `JWT_EXPIRES_IN` | Token lifetime, default `7d` |
| `CLIENT_ORIGIN` | Allowed browser origin. `*` is fine for local Expo. |
| `PUBLIC_APP_URL` | Base URL placed in SOS messages, for example `http://192.168.1.20:4000` |
| `EMERGENCY_REGION` | `LK`, `IN`, or `GENERIC` |
| `TWILIO_ACCOUNT_SID` | Optional. Enables server-sent SMS. |
| `TWILIO_AUTH_TOKEN` | Optional Twilio auth token. |
| `TWILIO_FROM_NUMBER` | Optional Twilio sender number. |

`PUBLIC_APP_URL` must be reachable by the people who receive an SOS, so use your computer's LAN address when you test from a phone.

In development, forgot-password returns a reset token in the JSON response so you can try the flow without email. Do not enable that behavior in production; send the token by email or SMS instead.

## Mobile

```bash
cd mobile
copy .env.example .env
npm install
npx expo start
```

Set `EXPO_PUBLIC_API_URL` in `mobile/.env`.

- iOS simulator: `http://localhost:4000/api`
- Android emulator: `http://10.0.2.2:4000/api`
- Physical phone: `http://YOUR_LAN_IP:4000/api`

Restart Expo after changing `.env`.

On a phone, allow location permission when asked. SOS and live location need it.

## First walkthrough

1. Register an account.
2. Add at least one trusted contact with a real phone number you can check.
3. Open Home and tap SOS.
4. Wait for the countdown, or press Cancel to stop it.
5. After the alert starts, open the live link from the SOS screen. It updates while the alert is active.
6. Press "I'm safe" to resolve the alert.

## SMS

- With Twilio configured, the API sends the SOS text after the countdown.
- Without Twilio, or when the phone cannot reach the API, the app opens the device SMS composer to the selected contacts. Sending still depends on the phone and the network.
