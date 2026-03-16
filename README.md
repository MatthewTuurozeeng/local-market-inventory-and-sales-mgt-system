# Local Market Inventory & Sales Management System

A student software engineering project that helps Ghanaian market vendors manage inventory, record sales, track orders, and view analytics. The focus is a lightweight, mobile‑friendly web app that works well on low‑end phones.

## Features
- Product management (add/edit/remove items)
- Sales recording and daily summaries
- Customer order tracking
- Low‑stock notifications
- Analytics dashboard (top sellers, trends)

## Tech Stack
- **Frontend:** React (mobile‑first web)
- **Backend:** Node.js + Express
- **Database:** MongoDB (Atlas)
- **Auth:** JWT
- **CI/CD:** GitHub Actions

## Project Docs
- `docs/trello-board.md` — Trello board setup & sprint card templates
- `docs/backlog.md` — Product backlog with epics & story points
- `docs/api-spec.md` — API endpoints and schemas

## Getting Started 
> This repo currently contains project planning artifacts. The landing page scaffold is now available in `frontend/`.

When implementation begins, the repo will include:
- `frontend/` React app (landing page scaffolded)
- `backend/` Express API

##  Definition of Done (DoD)
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

This folder contains a Vite + React landing page for the Local Market Inventory & Sales Management System.

## Quick start
```zsh
npm install
npm run dev
```

## Notes
- The landing page lives in `src/App.jsx` with shared styles in `src/index.css`.
- Color palette: #734A3B, #593F24, #E6F4FF, #122E16.
## License
Student project for CS 415 (Software Engineering).