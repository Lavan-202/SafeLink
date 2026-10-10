# SafeLink

SafeLink is a personal safety app for university students, people travelling alone, and anyone who wants a fast way to ask trusted people for help.

Tap the SOS button, get a five-second countdown you can cancel, then alert selected trusted contacts with your current or live location. If the server cannot deliver an SMS, the phone can open the device SMS composer when that feature is available.

## What it includes

- Prominent SOS action with a cancellable 5-second countdown
- Trusted contact management
- Live location updates while an SOS alert is active
- Emergency service numbers for your configured region
- SOS history
- Personal safety tips
- Profile, privacy, and location-sharing settings
- SMS delivery through Twilio when configured, with an on-device SMS fallback

## Stack

- Mobile: React Native and Expo
- API: Node.js and Express
- Database: MongoDB

## Project layout

```text
SafeLink/
├── mobile/     Expo app
├── backend/    Express API
└── docs/       API, database, and setup notes
```

## Run it locally

See [docs/SETUP.md](docs/SETUP.md).

Short version:

```bash
# API
cd backend
npm install
npm run dev

# App
cd mobile
npm install
npx expo start
```

MongoDB should be running locally, or set `MONGODB_URI` in `backend/.env`.

## Safety notes

- An SOS alert is sent only after the countdown finishes. Cancel stops it.
- Location is shared with contacts the user saved, and only under the privacy settings they chose.
- Emergency numbers depend on the region in `EMERGENCY_REGION`. Confirm them before relying on the app.
- Server SMS needs Twilio credentials. Without them, the app asks the phone to open an SMS message instead.
