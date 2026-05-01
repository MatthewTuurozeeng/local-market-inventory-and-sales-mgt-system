# Local Market Inventory & Sales Management System (Daakye Vendor Space)

A student software engineering project that helps Ghanaian market vendors manage inventory, record sales, track orders, and view analytics. The focus is a lightweight, mobile‑friendly web app that works well on low‑end phones.


**Live Demo:** [View Application](https://local-market-inventory-and-sales-mg.vercel.app/)


## Features

- Product management (add/edit/remove items)
- Sales recording and daily summaries
- Customer order tracking
- Low‑stock notifications
- Analytics dashboard (top sellers, trends)

## Tech Stack

- **Frontend:** Vite + React + TypeScript
- **Backend:** Node.js + Express
- **Database:** MongoDB (Atlas)
- **Auth:** JWT
- **CI/CD:** GitHub Actions

## Project Docs

- `docs/trello-board.md` — Trello board setup & sprint card templates
- `docs/backlog.md` — Product backlog with epics & story points
- `docs/api-spec.md` — API endpoints and schemas

## Design

- Figma: https://www.figma.com/design/uiAnS5NCsPxD9k4GVZ2EGK/Local-Market-Inventory-management?node-id=0-1&t=6xRPywUIBN2bmnH1-0

## Getting Started

This repo includes the frontend and backend apps.

### Frontend

```zsh
cd frontend
npm install
npm run dev
```

### Backend

```zsh
cd backend
npm install
npm run dev
```
## Frontend Architecture

The frontend uses a **React + TypeScript + Vite** structure with modular components and clear separation of concerns:

- `frontend/src/main.tsx` — Application entry point; renders the root React app.

- `frontend/src/App.tsx` — Root component; sets up global layout and routing structure.

- `frontend/src/pages/` — Page-level components mapped to routes (Home, Dashboard, Login, Signup, etc.).

- `frontend/src/components/`

  - `ProtectedRoute.tsx` — Route guard for authenticated access.

  - `settings/` — Modular UI components for user settings (Profile, Security, Notifications, Theme, etc.).

- `frontend/src/lib/`

  - `api.ts` — Centralized API request logic (handles backend communication).

  - `theme.tsx` — Theme configuration and context management.

- `frontend/src/index.css` — Global styles and base UI configuration.

- `frontend/public/` — Static assets (images, icons, backgrounds).

- `frontend/index.html` — HTML template used by Vite.

- `frontend/vite.config.js` — Vite configuration for build and development.

- `frontend/tsconfig.json` — TypeScript configuration for the frontend.

## Backend Architecture

The backend uses a TypeScript + Express structure with clear separation of responsibilities:

- `backend/src/index.ts` — Express app bootstrap, middleware registration, and route wiring.
- `backend/src/routes/` — HTTP route handlers (auth, vendors, products, sales, reports, summary).
- `backend/src/middleware/`
  - `auth/` — JWT auth middleware and token helpers.
  - `validators/` — request validation chains for routes.
- `backend/src/models/` — Mongoose schemas + database helpers.
- `backend/src/services/` — reusable business logic (e.g., report generation).
- `backend/src/types/` — shared TypeScript types + Express request augmentation.
- `backend/src/utils/` — scripts and utilities (e.g., seed data).

### Structure Overview

- `pages/` — Defines the main views and routing logic  

- `components/` — Reusable UI building blocks  

- `lib/` — Shared logic (API calls, theming, utilities)  

- `public/` — Static assets served directly  
## Project Structure

```bash
.
├── README.md
├── backend
│   ├── package-lock.json
│   ├── package.json
│   ├── src
│   │   ├── index.ts
│   │   ├── middleware
│   │   │   ├── auth
│   │   │   │   └── index.ts
│   │   │   └── validators
│   │   │       ├── authValidators.ts
│   │   │       ├── productValidators.ts
│   │   │       ├── reportValidators.ts
│   │   │       ├── salesValidators.ts
│   │   │       ├── settingsValidators.ts
│   │   │       └── vendorValidators.ts
│   │   ├── models
│   │   │   ├── data.json
│   │   │   └── database.ts
│   │   ├── routes
│   │   │   ├── auth.ts
│   │   │   ├── products.ts
│   │   │   ├── public.ts
│   │   │   ├── reports.ts
│   │   │   ├── sales.ts
│   │   │   ├── settings.ts
│   │   │   ├── summary.ts
│   │   │   └── vendors.ts
│   │   ├── services
│   │   │   ├── emailService.ts
│   │   │   ├── notificationService.ts
│   │   │   ├── publicStatsService.ts
│   │   │   ├── reportService.ts
│   │   │   └── smsService.ts
│   │   ├── types
│   │   │   ├── auth.ts
│   │   │   ├── express.d.ts
│   │   │   └── settings.ts
│   │   └── utils
│   │       ├── seed.ts
│   │       └── uploads.ts
│   ├── tsconfig.json
│   └── uploads
│       ├── avatar-1774224002049.jpg
│       └── avatar-1774453621852.png
├── docs
│   ├── class-diagram.png
│   ├── diagrams.md
│   ├── er-diagram.png
│   ├── frontend-components.png
│   ├── plantuml-er-diagram.puml
│   ├── plantuml-frontend-components.puml
│   ├── seq-diagram.png
│   └── use-case.png
├── frontend
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   │   ├── hero-background.svg
│   │   ├── hero-image.jpg
│   │   ├── inventory-vendor.png
│   │   ├── pexels-rethaferguson-4177710.jpg
│   │   └── vendor-dashboard.png
│   ├── src
│   │   ├── App.tsx
│   │   ├── components
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── settings
│   │   │       ├── InventorySettings.tsx
│   │   │       ├── NotificationSettings.tsx
│   │   │       ├── ProfileSettings.tsx
│   │   │       ├── SecuritySettings.tsx
│   │   │       ├── SettingsPage.tsx
│   │   │       └── ThemeSettings.tsx
│   │   ├── index.css
│   │   ├── lib
│   │   │   ├── api.ts
│   │   │   └── theme.tsx
│   │   ├── main.tsx
│   │   ├── pages
│   │   │   ├── About.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── DashboardSidebar.tsx
│   │   │   ├── Features.tsx
│   │   │   ├── GetStarted.tsx
│   │   │   ├── Home.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── Layout.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── NotFound.tsx
│   │   │   ├── Profile.tsx
│   │   │   ├── PublicReport.tsx
│   │   │   ├── ResetConfirm.tsx
│   │   │   ├── ResetPassword.tsx
│   │   │   ├── Routes.tsx
│   │   │   └── Signup.tsx
│   │   └── vite-env.d.ts
│   ├── tsconfig.json
│   ├── vercel.json
│   └── vite.config.js
└── structure.txt

20 directories, 83 files
```

### Seed sample data

```zsh
cd backend
npm run seed
```




## Definition of Done (DoD)

- Feature implemented and tested
- Code reviewed and approved
- Deployed to demo environment
- Documentation updated

## Team Roles

- **Scrum Master:** Matthew
- **Product Owner:** Deborah
- **Developers:** Clement, Hawa,Matthew

## Sprint Overview

- **Sprint 1:** Setup, auth, product management
- **Sprint 2:** Sales notifications
- **Sprint 3:** Analytics, UI polish, final testing

# Frontend (Landing Page)

The landing page lives in `frontend/` with shared styles in `src/index.css`.

## Notes

- Color palette: #734A3B, #593F24, #E6F4FF, #122E16.

## License

Final Semester for CS 415 (Software Engineering).
