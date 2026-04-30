# Local Market Inventory & Sales Management System

A student software engineering project that helps Ghanaian market vendors manage inventory, record sales, track orders, and view analytics. The focus is a lightweight, mobile‑friendly web app that works well on low‑end phones.

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
cp .env.example .env
npm run dev
```

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

### Seed sample data (fixed login)

```zsh
cd backend
npm run seed
```

Sample login:

- Email: `vendor@market.com`
- Password: `Test@1234`

### Mock dashboard data (optional)

Set `VITE_USE_MOCKS=true` in `frontend/.env` to show hardcoded dashboard data without logging in.

## Definition of Done (DoD)

- Feature implemented and tested
- Code reviewed and approved
- Deployed to staging/demo environment
- Documentation updated

## Team Roles

- **Scrum Master:** Matthew
- **Product Owner:** Deborah
- **Developers:** Clement, Hawa

## Sprint Overview

- **Sprint 1:** Setup, auth, product management
- **Sprint 2:** Sales, order tracking, notifications
- **Sprint 3:** Analytics, UI polish, final testing

# Frontend (Landing Page)

The landing page lives in `frontend/` with shared styles in `src/index.css`.

## Notes

- Color palette: #734A3B, #593F24, #E6F4FF, #122E16.

## License

Student project for CS 415 (Software Engineering).
