# GV Florida Transport — Bus Operation Ecosystem

## Overview
A comprehensive, all-in-one bus operation ecosystem for **GV Florida Transport, Inc.** — a major provincial bus company operating routes from Manila (Sampaloc Terminal) to Northern Luzon destinations including Tuguegarao, Tabuk, Baguio, Santiago, and more.

The ecosystem consists of **6 interconnected components**: a public website, backend API, admin web dashboard, passenger mobile app, staff mobile app, and a self-service kiosk application.

## Architecture
```
┌─────────────────────────────────────────────────────────────────────┐
│                     GV Florida Ecosystem                            │
├─────────────┬──────────────┬───────────────┬───────────────────────┤
│  User App   │  Staff App   │  Admin Web    │   Kiosk System        │
│(React Native)│(React Native)│   (React)     │  (React/Tablet)      │
├─────────────┴──────────────┴───────────────┴───────────────────────┤
│                     Unified Backend API                             │
│              (Node.js + Express + PostgreSQL)                       │
├─────────────────────────────────────────────────────────────────────┤
│  Payment Gateway │ GPS Tracking │ Push Notifications │ Analytics    │
└─────────────────────────────────────────────────────────────────────┘
```

## Components

| Component | Directory | Tech Stack | Users |
|-----------|-----------|------------|-------|
| Website | `/GV Florida Website` | HTML / CSS / JS | Public visitors |
| Backend API | `/Backend` | Node.js, Express, PostgreSQL, Socket.IO | All systems |
| Admin Web App | `/AdminWebApp` | React 18, Tailwind CSS, Chart.js, Leaflet | Operators, Managers, HR |
| User App | `/UserApp` | React Native (Expo 50), React Navigation | Passengers |
| Staff App | `/StaffApp` | React Native (Expo 50), Barcode Scanner, GPS | Drivers, Conductors, Inspectors |
| Kiosk App | `/KioskApp` | React 18, QR Code, Touch-optimized UI | Walk-in passengers |

---

## 1. Public Website (`/GV Florida Website`)
Static website replicating the official GV Florida Transport site.
- **Pages:** Home, About, Services, Fleet, Contact, Booking
- **Features:** Responsive design, Poppins font, animated sections, route schedules, fleet showcase
- **Tech:** HTML5, CSS3, Vanilla JavaScript, Font Awesome icons

## 2. Backend API (`/Backend`)
Centralized REST API powering all frontend applications.
- **Runtime:** Node.js + Express 4.18
- **Database:** PostgreSQL via Knex.js 3.1 (17+ tables)
- **Auth:** JWT tokens with role-based access control
- **Real-time:** Socket.IO 4.7.4 for live tracking and notifications
- **API Routes (14 modules):**
  - Auth, Users, Buses, Routes, Trips, Bookings, Payments
  - Employees, Payroll, Maintenance, Incidents, Notifications
  - Tracking (GPS), Analytics/Reports
- **Database Tables:** users, buses, routes, trips, bookings, payments, employees, payroll, maintenance_records, incidents, notifications, tracking_logs, wallet_transactions, promotions, lost_found_items, audit_logs, settings

## 3. Admin Web App (`/AdminWebApp`)
Full-featured management dashboard for operations staff.
- **Tech:** React 18.2, React Router 6, Tailwind CSS 3.4, Chart.js 4, Leaflet Maps
- **15 Pages:**
  - **Dashboard** — KPI cards, revenue charts, real-time stats
  - **Fleet Management** — Bus registry, status tracking, assignment
  - **Employee Management** — Staff records, roles, schedules
  - **Trip Management** — Trip creation, scheduling, status monitoring
  - **Booking Management** — Reservation list, search, status updates
  - **Payroll** — Salary processing, deductions, pay slips
  - **Reports** — Revenue, ridership, performance analytics
  - **Live Map** — Real-time bus positions on Leaflet map
  - **Routes** — Route configuration, stops, fare matrix
  - **Maintenance** — Service records, schedules, parts tracking
  - **Lost & Found** — Item registry, claim management
  - **Promotions** — Discount codes, campaigns, marketing
  - **Notifications** — Broadcast alerts, user targeting
  - **Audit Log** — System activity trail
  - **Settings** — System configuration, user preferences

## 4. User App (`/UserApp`)
Passenger-facing mobile application for booking and trip management.
- **Tech:** React Native 0.73, Expo 50, React Navigation 6, react-native-maps
- **14 Screens:**
  - **Login / Register** — Phone/email auth, social login ready
  - **Home** — Wallet card, popular routes, quick actions, terminals
  - **Search** — Destination search with chips, real-time results
  - **Booking** — Trip details, bus info, amenities, fare display
  - **Seat Selection** — Interactive 45-seat grid, visual seat map
  - **Payment** — 5 methods (Wallet, GCash, PayMaya, Card, Counter)
  - **Booking Confirmation** — QR code ticket, booking code, share
  - **Tracking** — Real-time bus map with ETA, speed, progress bar
  - **My Trips** — Upcoming / Completed / Cancelled tabs
  - **Trip Detail** — Full ticket view, QR code, rating system
  - **Wallet** — Balance, quick top-up (₱100–₱5000), transaction history
  - **Profile** — Loyalty program (Bronze/Silver/Gold), personal info
  - **Notifications** — Type-coded alerts with unread indicators

## 5. Staff App (`/StaffApp`)
Mobile application for on-ground staff operations.
- **Tech:** React Native 0.73, Expo 50, expo-barcode-scanner, expo-location
- **Roles:** Driver, Conductor, Inspector, Dispatcher
- **13 Files / 10 Screens:**
  - **Login** — Staff-only portal with role validation
  - **Dashboard** — SOS button, shift card, quick actions, assigned trips
  - **Trip Management** — Active / Upcoming / Completed trips, start/end controls
  - **Trip Detail** — Stats grid, schedule timeline, action buttons
  - **Passenger List** — Searchable manifest, boarding status, seat badges
  - **Ticket Scanner** — Barcode/QR scanner with result validation
  - **Incident Report** — 8 incident types, 4 severity levels, GPS location
  - **Shift Log** — Duty status, hours tracking, shift history
  - **Geo Tag Check-in** — Map with 7 route checkpoints, GPS check-in
  - **Profile** — Staff info, role badge, menu items

## 6. Kiosk App (`/KioskApp`)
Self-service terminal application for bus station walk-in passengers.
- **Tech:** React 18.2, React Router 6, qrcode.react, date-fns
- **UI:** Tablet-optimized with large touch targets, no text selection, idle timeout reset
- **10 Screens:**
  - **Welcome** — Full-screen landing with 4 main actions, clock, company branding
  - **Destination Selection** — 12 destinations with search, popular picks, price/duration
  - **Trip Selection** — 7-day date picker, 9 daily departures, bus type/amenity filters
  - **Seat Selection** — Visual seat map with legend, booking summary sidebar
  - **Passenger Info** — Multi-passenger form, ID type selection, discount badges (Senior/PWD/Student)
  - **Payment** — 5 methods (Cash, Wallet, GCash, Maya, Card), QR scan modal
  - **Ticket** — QR code ticket, print button, booking code, passenger list
  - **Account** — Sign in / Register / Booking lookup with on-screen keypad
  - **Wallet Top-Up** — Phone verification, preset amounts, payment method selection
  - **Station Info** — 4-tab view (Schedules, Terminal, Policies, Routes), expandable schedule cards

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL 15+
- Expo CLI (`npm install -g expo-cli`) for mobile apps
- Android Studio / Xcode for mobile emulators

### Backend Setup
```bash
cd Backend
cp .env.example .env    # Configure database credentials
npm install
npm run migrate         # Create database tables
npm run dev             # Start API server (port 5000)
```

### Admin Web App
```bash
cd AdminWebApp
npm install
npm start               # Opens on http://localhost:3000
```

### User App (Mobile)
```bash
cd UserApp
npm install
npx expo start          # Scan QR with Expo Go app
# or: npx expo run:android / npx expo run:ios
```

### Staff App (Mobile)
```bash
cd StaffApp
npm install
npx expo start          # Scan QR with Expo Go app
```

### Kiosk App
```bash
cd KioskApp
npm install
npm start               # Opens on http://localhost:3000
# Deploy in kiosk mode: npm run build → serve on tablet browser
```

---

## Project Structure
```
GV Florida Transport Inc/
├── GV Florida Website/     # Public website (6 HTML pages)
├── Backend/                # REST API + WebSocket server
│   ├── src/server.js
│   ├── src/database/       # Migration & connection
│   ├── src/middleware/      # JWT auth middleware
│   └── src/routes/         # 14 route handler files
├── AdminWebApp/            # React admin dashboard
│   └── src/
│       ├── pages/          # 15 page components
│       ├── components/     # Layout, shared components
│       ├── services/       # API & Socket.IO services
│       └── context/        # Auth context
├── UserApp/                # React Native passenger app
│   └── src/
│       ├── screens/        # 14 screen components
│       ├── services/       # API service
│       └── context/        # Auth context
├── StaffApp/               # React Native staff app
│   └── src/
│       ├── screens/        # 10 screen components
│       ├── services/       # API service
│       └── context/        # Auth context
├── KioskApp/               # React kiosk app
│   └── src/
│       ├── screens/        # 10 screen components
│       ├── components/     # KioskHeader
│       └── services/       # API service
└── README.md
```

## Tech Stack Summary
| Layer | Technology |
|-------|-----------|
| Frontend (Web) | HTML5, CSS3, JavaScript, React 18, Tailwind CSS |
| Frontend (Mobile) | React Native 0.73, Expo 50, React Navigation 6 |
| Backend | Node.js, Express 4.18, Socket.IO 4.7 |
| Database | PostgreSQL, Knex.js 3.1 |
| Auth | JWT, bcrypt, role-based access |
| Maps | Leaflet (web), react-native-maps (mobile) |
| Charts | Chart.js 4 |
| QR Codes | qrcode.react, react-native-qrcode-svg |
| Payments | GCash, Maya/PayMaya, Credit/Debit Card, Digital Wallet |

## Contact
- **Company:** GV Florida Transport, Inc.
- **Address:** 832 AH Lacson Ave. Cor. Earnshaw St. Sampaloc, Manila 1008
- **Phone:** 02-493-7956
- **Email:** gvfloridatrans@gmail.com
- **Facebook:** [GV Florida Transport Inc.](https://www.facebook.com/gvfloridatransportinc/)
