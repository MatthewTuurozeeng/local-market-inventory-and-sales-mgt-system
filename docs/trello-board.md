# Trello Board Template — Local Market Inventory & Sales Management System

## Board Overview
This Trello board structure mirrors Scrum for a 3‑sprint student project. It includes lists, labels, and card templates so the team can start sprinting immediately.

## Lists
1. **Product Backlog**
2. **Sprint Backlog (Current Sprint)**
3. **In Progress**
4. **Code Review / QA**
5. **Blocked**
6. **Ready for Demo**
7. **Done**

## Labels (Suggested)
- **Epic: Auth & Roles** (blue)
- **Epic: Product Mgmt** (green)
- **Epic: Sales** (yellow)
- **Epic: Orders** (orange)
- **Epic: Notifications** (purple)
- **Epic: Analytics** (red)
- **Type: UI** (light blue)
- **Type: API** (light green)
- **Type: DB** (light yellow)
- **Type: Testing** (pink)
- **Type: Docs** (gray)
- **Risk: High** (black)

## Card Template (Copy into Trello “Card Templates”)
**Title:** <User Story Short Title>

**User Story**
As a <role>, I want <capability> so that <benefit>.

**Acceptance Criteria**
- [ ] AC1
- [ ] AC2
- [ ] AC3

**Definition of Done**
- [ ] Code implemented
- [ ] Unit tests added/updated
- [ ] Peer review approved
- [ ] Demo-ready
- [ ] Documentation updated

**Tasks**
- [ ] Task 1
- [ ] Task 2

**Estimate**
Story Points: <1|2|3|5|8>

**Notes / Risks**
- 

## Sprint 1 Cards (Seed Backlog)
- **Auth: User Login & Registration** (Epic: Auth & Roles, Type: API/UI)
- **Auth: JWT Middleware** (Epic: Auth & Roles, Type: API)
- **Products: CRUD Endpoints** (Epic: Product Mgmt, Type: API/DB)
- **Products: Inventory UI** (Epic: Product Mgmt, Type: UI)
- **Products: Validation & Error States** (Epic: Product Mgmt, Type: Testing)
- **CI: Basic Pipeline (lint/test)** (Type: Docs/Testing)

## Sprint 2 Cards (Seed Backlog)
- **Sales: Record Sale Endpoint** (Epic: Sales, Type: API/DB)
- **Sales: Daily Summary Report** (Epic: Sales, Type: API/UI)
- **Orders: Create & Update Status** (Epic: Orders, Type: API/DB)
- **Orders: Customer Order Tracking UI** (Epic: Orders, Type: UI)
- **Notifications: Low‑Stock Alerts** (Epic: Notifications, Type: API/UI)

## Sprint 3 Cards (Seed Backlog)
- **Analytics: Top Products & Trends** (Epic: Analytics, Type: API)
- **Analytics Dashboard UI** (Epic: Analytics, Type: UI)
- **Performance & Mobile UX Pass** (Type: UI)
- **Final QA + Bug Bash** (Type: Testing)
- **Deployment Prep** (Type: Docs)

## Board Workflow Tips
- Keep Sprint Backlog limited to sprint scope only.
- Move cards to **Ready for Demo** once acceptance criteria are met.
- Use **Blocked** for anything awaiting a decision or dependency.
