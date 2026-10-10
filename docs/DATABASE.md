# Database

MongoDB database name defaults to `safelink`.

## users

| Field | Notes |
| --- | --- |
| `name` | Display name |
| `email` | Unique, stored lowercase |
| `phone` | User's own phone |
| `passwordHash` | bcrypt hash, never returned by the API |
| `resetTokenHash` | SHA-256 hash of a password reset token |
| `resetTokenExpires` | Reset token expiry |
| `privacy.shareLiveLocation` | Allow updates after the first SOS location |
| `privacy.sharePreciseLocation` | Full GPS versus roughly 1 km |
| `privacy.smsFallback` | Allow the phone SMS composer when the server cannot send |
| `privacy.notifyAllContacts` | Alert every contact, or only opted-in contacts |
| `privacy.locationUpdateIntervalSec` | How often the app posts a new point |

## emergencycontacts

| Field | Notes |
| --- | --- |
| `userId` | Owner |
| `name` | Contact name |
| `phone` | Number used for SMS |
| `relationship` | Optional label such as Parent or Friend |
| `isPrimary` | Shown first in the app |
| `notifyOnSos` | Included when "notify all" is off |

Index: `{ userId: 1, phone: 1 }` unique.

## sosalerts

| Field | Notes |
| --- | --- |
| `userId` | Owner |
| `status` | `active`, `resolved`, or `cancelled` |
| `shareToken` | Unguessable token for the live link |
| `lastLocation` | Latest latitude, longitude, accuracy, and time |
| `notifiedContacts` | Who was included and whether SMS was sent, skipped, or failed |
| `triggeredAt` / `resolvedAt` / `cancelledAt` | Timeline |

Index: `{ shareToken: 1 }` unique. One active alert per user is enforced in the SOS service.

## locationshares

Each live update is appended here.

| Field | Notes |
| --- | --- |
| `userId` | Owner |
| `sosAlertId` | Parent alert |
| `latitude`, `longitude`, `accuracy` | Point after privacy rounding |
| `recordedAt` | Device/server time for that point |

## safetytips

| Field | Notes |
| --- | --- |
| `title`, `body` | Tip content |
| `category` | Short grouping such as travel or SOS |
| `priority` | Lower numbers are shown first |

The API seeds this collection when it is empty.
