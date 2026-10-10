# SafeLink API

Base URL: `http://localhost:4000`

Authenticated routes expect `Authorization: Bearer <token>`.

Success responses use `{ "data": ... }`. Errors use `{ "error": { "message": "..." } }`.

## Health

`GET /health`

Returns `{ "status": "ok", "service": "safelink-api" }`.

## Auth

| Method | Path | Body |
| --- | --- | --- |
| POST | `/api/auth/register` | `name`, `email`, `phone`, `password` |
| POST | `/api/auth/login` | `email`, `password` |
| POST | `/api/auth/forgot-password` | `email` |
| POST | `/api/auth/reset-password` | `email`, `token`, `password` |
| GET | `/api/auth/me` | Auth required |

Register and login return `{ token, user }`.

## Profile

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/api/users/me` | Current profile |
| PATCH | `/api/users/me` | `name`, `phone` |

## Trusted contacts

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/api/contacts` | Contacts for the signed-in user |
| POST | `/api/contacts` | `name`, `phone`, `relationship`, `notifyOnSos`, `isPrimary` |
| PATCH | `/api/contacts/:id` | Same fields, all optional |
| DELETE | `/api/contacts/:id` | Removes one contact |

A user can save up to 10 contacts. Only that user's contacts are visible.

## SOS

| Method | Path | Notes |
| --- | --- | --- |
| POST | `/api/sos` | Starts an alert. Body: `latitude`, `longitude`, `accuracy` |
| GET | `/api/sos/active` | Current active alert, or `null` |
| GET | `/api/sos/:id` | One alert owned by the user |
| POST | `/api/sos/:id/location` | Live update: `latitude`, `longitude`, `accuracy` |
| POST | `/api/sos/:id/resolve` | Marks the user safe |
| POST | `/api/sos/:id/cancel` | Cancels an active alert |

The mobile app runs the 5-second countdown before it calls `POST /api/sos`. A second active alert is rejected with `409` and the existing alert id.

The response includes `smsConfigured`. When that is `false`, the app should open the device SMS composer.

## Location link

`GET /api/location/live/:token`

Public read of one SOS share token. Returns the latest location and whether the alert is still active. Tokens are random and are not listed.

`GET /track/:token`

Simple HTML page for the same token, so a contact can open the link from an SMS.

## History

`GET /api/history`

Recent SOS alerts for the signed-in user, newest first.

## Emergency numbers

`GET /api/emergency/services`

Returns the directory selected by `EMERGENCY_REGION` (`LK`, `IN`, or `GENERIC`).

## Safety tips

`GET /api/safety-tips`

Tips are seeded into MongoDB the first time the API starts.

## Privacy

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/api/privacy` | Location and SMS preferences |
| PATCH | `/api/privacy` | Any of the fields below |

Fields:

- `shareLiveLocation` (boolean)
- `sharePreciseLocation` (boolean). When false, coordinates are rounded to about 1 km.
- `smsFallback` (boolean)
- `notifyAllContacts` (boolean). When false, only contacts marked "notify on SOS" are alerted.
- `locationUpdateIntervalSec` (5–120)
