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

### Sprint 2 (Core Affiliate Loop)

- [ ] Merchant dashboard: CRUD booking slots
- [ ] Agent dashboard: referral link generation (`?ref=agent123`)
- [ ] Public booking flow capturing `ref` and saving it
- [ ] Role-specific layouts and navigation (Navbar, Sidebar)
- [ ] Reusable UI components (`components/common/`)
- [ ] Custom hooks for data fetching (`hooks/`)
- [ ] Activity logging model

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
```

Create `.env` in `client/` (or set in Vercel dashboard):

```env
REACT_APP_API_URL=http://localhost:5000
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

### 5. Seed admin user

```bash
npm run seed:admin
```

Default admin: `admin@affy.com` / `admin123`

## Current API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/` | Public | Health check |
| `POST` | `/auth/register` | Public | Register a new user |
| `POST` | `/auth/login` | Public | Login, returns JWT + user |
| `GET` | `/slots` | Public | List all slots |
| `POST` | `/slots` | Merchant/Admin | Create a new slot |

## Build Approach

- Keep schemas evolving with features (avoid heavy upfront schema design)
- Implement simple RBAC first, refine later
- Use vertical slices (end-to-end features) instead of layer-by-layer development

## License

MIT (see [`LICENSE`](./LICENSE)).
