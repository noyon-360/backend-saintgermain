# Lumora Backend

Node.js / Express / MongoDB backend for the **Lumora** mindfulness & meditation app (built to match the provided Figma design).

## Setup

```bash
npm install
cp .env.example .env   # then fill in real values
npm run seed            # populate sample meditation/inspiration/learn/notification data
npm run dev              # or: npm start
```

Server runs on `http://localhost:5000`, all routes are prefixed with `/api/v1`.

## Auth flow (matches Splash → Onboarding → Sign in/up screens)

- `POST /api/v1/auth/register` `{ userName, email, password, confirmPassword }`
- `POST /api/v1/auth/verify-email` `{ email, otp }`
- `POST /api/v1/auth/resend-otp` `{ email }`
- `POST /api/v1/auth/login` `{ email, password }`
- `POST /api/v1/auth/forget-password` `{ email }`
- `POST /api/v1/auth/verify-reset-otp` `{ email, otp }`
- `POST /api/v1/auth/reset-password` `{ email, otp, password, confirmPassword }`
- `POST /api/v1/auth/logout` (auth required)

## Home screen

- `GET /api/v1/home` — greeting, today's reflection quote, 28-day challenge progress, today's meditations, today's action (inspiration + journal prompt), latest announcement.

## Meditation / Yoga screens

- `GET /api/v1/meditation` — today's scheduled meditations + inspirations
- `GET /api/v1/meditation/all?category=yoga` — browse all poses
- `GET /api/v1/meditation/:id` — pose detail (process, duration, benefits)
- `PATCH /api/v1/meditation/:id/complete` — "Mark as complete"

## Inspiration (audio player)

- `GET /api/v1/inspiration/:id`
- `PATCH /api/v1/inspiration/:id/heard` — "Mark as heard"
- `PATCH /api/v1/inspiration/:id/favorite` — heart icon toggle

## Journey / Journal

- `GET /api/v1/journal?date=YYYY-MM-DD` — today's activity checklist, meditations, inspirations, journal prompt (auto-creates the day's record + advances the 28-day challenge)
- `GET /api/v1/journal/calendar?month=7&year=2026` — calendar screen data
- `PATCH /api/v1/journal/activity` `{ activityIndex, completed }`
- `POST /api/v1/journal/prompt` `{ answer }` — journal prompt modal "Save"

## Learn (Book / Video tabs)

- `GET /api/v1/learn?type=book|video&search=&page=&limit=`
- `GET /api/v1/learn/:id`
- `PATCH /api/v1/learn/:id/like`
- `PATCH /api/v1/learn/:id/download`
- `PATCH /api/v1/learn/:id/share`

## Community

- `GET /api/v1/community` — "Coming Soon" status
- `POST /api/v1/community/notify-me` — toggle "Notify me" checkbox

## Notifications

- `GET /api/v1/notification` — grouped into `today` / `previous`
- `PATCH /api/v1/notification/:id/read`

## Profile

- `GET /api/v1/user/profile`
- `PUT /api/v1/user/profile` (multipart, field `profileImage`) `{ userName, phone, address }`
- `PUT /api/v1/user/account/change-password` `{ currentPassword, newPassword, confirmPassword }`
- `DELETE /api/v1/user/account` `{ reason }`

All protected routes require header: `Authorization: Bearer <accessToken>`
