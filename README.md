# Affy

Affy is a role-based booking and affiliate attribution platform for service merchants and creators.
It combines scheduling, referral distribution, and commission tracking into one product so growth can be measured from the first booking.
**Merchant publishes a slot -> Agent shares a referral link -> Public user books -> commission is automatically recorded**.

Repository: [github.com/farisdanish/Affy](https://github.com/farisdanish/Affy)

## What Is a Slot?

A **slot** is a single bookable offer created by a merchant (for example, a consultation, service session, or appointment window).

## Current Status

### Sprint 1 (Auth & Foundation) ✅

- [x] User registration and login (JWT)
- [x] Basic role recognition (Admin, Agent, Merchant, User)
- [x] Auth middleware (protect routes by role)
- [x] Frontend: Login, Register, and Dashboard pages (MUI + Lucide React + Inter font)
- [x] CI/CD pipeline via GitHub Actions
- [x] Deployed to Vercel (frontend) and Render (backend)
- [x] Admin user seeder

Sprint 1 is complete. Moving to Sprint 2.

### Sprint 2 (Core Affiliate Loop) ✅

- [x] Merchant dashboard: CRUD booking slots
- [x] Agent dashboard: referral link generation (`?ref=agent123`)
- [x] Public booking flow capturing `ref` and saving it
- [x] Role-specific layouts and navigation (Navbar, Sidebar)
- [x] Reusable UI components (`components/common/`)
- [x] Custom hooks for data fetching (`hooks/`)
- [x] Activity logging model + read API

Sprint 2 is functionally complete. Moving to Sprint 3.

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

### Sprint 3 - Booking Lifecycle + Commission Baseline
- Merchant booking operations (view queue, confirm/reject bookings)
- Public booking UX completion (success state + booking reference + duplicate-booking guidance)
- Agent attribution analytics (per-link/per-slot conversion summary)
- Commission baseline rules (record commission-ready events on confirmed bookings)
- CI quality hardening (required status checks + regression smoke coverage)

### Sprint 4 - Affiliate Layer
- Payment integration planning/prototype (ToyyibPay/FPX/Stripe)
- Commission payout workflow draft
- Admin reporting/dashboard iteration

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

- **Frontend**: React.js, Material UI, Lucide React, Inter Font
- **Backend**: Node.js + Express
- **Database**: MongoDB (Atlas)
- **Auth**: JWT
- **Maps**: Google Maps API (later phase)
- **Hosting**: Vercel (frontend), Render (backend)

## Deployment

| Service | Platform | URL |
|---|---|---|
| Frontend | Vercel | [affy-three.vercel.app](https://affy-three.vercel.app) |
| Backend API | Render | [affy.onrender.com](https://affy.onrender.com) |
| Database | MongoDB Atlas | M0 free cluster |

## Project Structure

```text
affy-app/
  client/            # React frontend (Vercel)
    src/
      context/       # React Contexts (AuthContext)
      pages/         # Page components (auth/, dashboard/)
      routes/        # Route guards (ProtectedRoute)
      services/      # API service layer (Axios)
  server/            # Express server entry
  routes/            # API routes (auth, slots)
  models/            # Mongoose models (User, Slot, Booking)
  middleware/        # Auth middleware (JWT + role checks)
  seeders/           # Database seeders (admin user)
  .github/workflows/ # CI/CD pipeline
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
HEALTHZ_TOKEN=your_healthz_token_optional
APP_PUBLIC_URL=https://affy-three.vercel.app
```

Create `.env` in `client/` (or set in Vercel dashboard):

```env
REACT_APP_API_URL=http://localhost:5000
```

### 3. Run with Docker (Recommended for testing on a different device)

You can quickly spin up the entire application stack (Frontend, Backend, and a local MongoDB instance) using Docker Compose.

Make sure you have [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed.
From the project root, run:

```bash
docker compose up --build
```

- The React frontend will be available at `http://localhost:3000`
- The Express backend API will be available at `http://localhost:5000`
- The local MongoDB instance will be available on port `27018`
- Hot-reloading is enabled for both frontend and backend through volume mounts.

To stop the containers, press `Ctrl+C` or run:

```bash
docker compose down
```

### 4. Run backend manually

From project root:

```bash
node server/server.js
```

### 5. Run frontend

From `client/`:

```bash
npm start
```

### 6. Seed admin user

```bash
npm run seed:admin
```

Default admin: `admin@affy.com` / `admin123`

## Current API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/` | Public | Health check |
| `GET` | `/healthz` | Public* | Health check with MongoDB status (`HEALTHZ_TOKEN` protected when configured) |
| `POST` | `/auth/register` | Public | Register a new user |
| `POST` | `/auth/login` | Public | Login, returns JWT + user |
| `GET` | `/slots/public` | Public | List active public slots |
| `GET` | `/slots/mine` | Merchant/Admin/Developer | List slots in actor scope |
| `GET` | `/slots` | Merchant/Admin/Developer | List all slots (restricted) |
| `POST` | `/slots` | Merchant/Admin/Developer | Create slot |
| `PUT` | `/slots/:id` | Merchant owner/Admin/Developer | Update slot |
| `DELETE` | `/slots/:id` | Merchant owner/Admin/Developer | Soft delete slot (`isActive=false`) |
| `POST` | `/bookings` | Public/Auth | Create booking (guest/auth, referral attribution) |
| `GET` | `/referrals/my-code` | Agent | Get agent referral code (auto-generate if missing) |
| `POST` | `/referrals/link` | Agent | Generate share URL for a slot |
| `GET` | `/activity-logs` | Admin/Developer | Paginated activity logs |

## Build Approach

- Keep schemas evolving with features (avoid heavy upfront schema design)
- Implement simple RBAC first, refine later
- Use vertical slices (end-to-end features) instead of layer-by-layer development

## License

MIT (see [`LICENSE`](./LICENSE)).
