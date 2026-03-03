# Affy

Affy is a role-based booking and affiliate attribution platform for service merchants and creators.
It combines scheduling, referral distribution, and commission tracking into one product so growth can be measured from the first booking.
**Merchant publishes a slot -> Agent shares a referral link -> Public user books -> commission is automatically recorded**.

Repository: [github.com/farisdanish/Affy](https://github.com/farisdanish/Affy)

## What Is a Slot?

A **slot** is a single bookable offer created by a merchant (for example, a consultation, service session, or appointment window).

## Current Status

### Sprint 1 (Auth & Foundation)

- [x] User registration and login (JWT)
- [x] Basic role recognition (Admin, Agent, Merchant, User)
- [ ] Auth middleware (protect routes by role)
- [ ] CI/CD pipeline via GitHub Actions
- [ ] Deploy to Vercel

Login is working. Sprint 1 is close to complete.

### Immediate Next Task

Implement auth middleware so protected routes can enforce login + role checks.

```bash
mkdir -p middleware
touch middleware/auth.js
```

Why this is next:
- Every Sprint 2 route depends on route protection
- It establishes simple RBAC early without over-engineering

## Sprint Plan

### Walking Skeleton (pre-Sprint 1)
- React frontend online
- One Express endpoint live
- MongoDB connected
- Deploy early (working software over feature completeness)

### Sprint 1 - Auth & Foundation
- JWT registration/login
- Basic role recognition
- CI/CD with GitHub Actions
- Early deployment to Vercel

### Sprint 2 - Core Affiliate Loop
- Merchant API: CRUD booking slots
- Agent API: referral link generation (`?ref=agent123`)
- Public booking flow capturing `ref` and saving it
- End of Sprint 2 target: first demoable product

### Sprint 3 - First Complete User Journey
- Public user browses listings and books end-to-end
- Mock payment confirm flow (no Stripe yet)

### Sprint 4 - Affiliate Layer
- Commission tracking and calculation
- Basic agent dashboard
- Payment integration (ToyyibPay/FPX/Stripe)

### Deferred
- Admin dashboard/internal tooling
- Mall directory / indoor navigation
- UI polish and animations

## User Roles

- **Admin**: full system access, analytics, payout management
- **Agent/Influencer**: generates referral links, tracks commissions
- **Merchant**: manages listings and booking slots
- **Public User**: browses and books services

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js + Express
- **Database**: MongoDB (Atlas)
- **Auth**: JWT
- **Maps**: Google Maps API (later phase)
- **Hosting**: Vercel

## Project Structure

```text
affy-app/
  client/          # React frontend
  server/          # Express server entry
  routes/          # API routes (auth, slots)
  models/          # Mongoose models
```

## Local Development

### 1. Install dependencies

From project root:

```bash
npm install
```

For frontend:

```bash
cd client
npm install
```

### 2. Environment variables

Create `.env` in project root:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 3. Run backend

From project root:

```bash
node server/server.js
```

### 4. Run frontend

From `client/`:

```bash
npm start
```

## Current API Endpoints

- `POST /auth/register`
- `POST /auth/login`
- `GET /slots`
- `POST /slots`

## Build Approach

- Keep schemas evolving with features (avoid heavy upfront schema design)
- Implement simple RBAC first, refine later
- Use vertical slices (end-to-end features) instead of layer-by-layer development

## License

MIT (see [`LICENSE`](./LICENSE)).
