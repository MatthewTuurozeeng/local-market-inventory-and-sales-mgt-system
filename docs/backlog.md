# Product Backlog — Local Market Inventory & Sales Management System

This backlog is organized by epics and prioritized for three sprints. Story points use a Fibonacci scale (1, 2, 3, 5, 8).

## Epic 1: Auth & Roles
1. **User Registration & Login** — 5 pts
   - As a vendor, I want to register/login so that my data is secure.
   - **Acceptance Criteria**
     - Validates email/phone + password rules
     - Returns JWT on successful login
     - Displays error on invalid credentials

2. **JWT Middleware & Role Guard** — 3 pts
   - As a system, I want to restrict access so that only authorized users can access vendor features.
   - **Acceptance Criteria**
     - Protected routes require valid token
     - Vendor role required for inventory/sales endpoints

## Epic 2: Product Management
3. **Create Product** — 3 pts
   - As a vendor, I want to add products so that inventory is up to date.
   - **Acceptance Criteria**
     - Requires name, SKU, price, stock
     - Duplicate SKU rejected

4. **Update/Delete Product** — 3 pts
   - As a vendor, I want to edit/remove products so that I can manage inventory changes.
   - **Acceptance Criteria**
     - Update stock/price/name
     - Delete performs soft‑delete (archived)

5. **Product List & Search** — 2 pts
   - As a vendor, I want to view and search products so that I can find items quickly.
   - **Acceptance Criteria**
     - Search by name/SKU
     - Supports pagination

## Epic 3: Sales Recording
6. **Record Sale** — 5 pts
   - As a vendor, I want to record daily sales so that revenue is tracked.
   - **Acceptance Criteria**
     - Sale reduces stock
     - Rejects if stock insufficient

7. **Daily Sales Summary** — 3 pts
   - As a vendor, I want daily totals so that I can review performance.
   - **Acceptance Criteria**
     - Total revenue + items sold
     - Filter by date

## Epic 4: Order Management
8. **Create Customer Order** — 5 pts
   - As a vendor, I want to create orders so that I can track customer pickups.
   - **Acceptance Criteria**
     - Status starts as "pending"
     - Supports multiple items

9. **Update Order Status** — 3 pts
   - As a vendor, I want to update order status so that customers are informed.
   - **Acceptance Criteria**
     - Status: pending → ready → completed

10. **Customer Order Tracking View** — 3 pts
   - As a customer, I want to track my order so that I know when it’s ready.
   - **Acceptance Criteria**
     - View status via order code

## Epic 5: Notifications
11. **Low‑Stock Alerts (In‑App)** — 3 pts
   - As a vendor, I want low‑stock alerts so that I restock in time.
   - **Acceptance Criteria**
     - Threshold configurable per product

## Epic 6: Analytics & Reports
12. **Top‑Selling Products Report** — 5 pts
   - As a vendor, I want best‑seller insights so that I can restock wisely.
   - **Acceptance Criteria**
     - Shows top 5 products for date range

13. **Sales Trends (Weekly)** — 5 pts
   - As a vendor, I want sales trends so that I can plan inventory.
   - **Acceptance Criteria**
     - Chart for last 4 weeks

## Epic 7: UX & Performance
14. **Mobile‑first UI** — 5 pts
   - As a vendor, I want a mobile‑friendly interface so that it works on low‑end phones.
   - **Acceptance Criteria**
     - Passes Lighthouse mobile accessibility > 80

15. **Error & Empty States** — 2 pts
   - As a user, I want clear error states so that I understand failures.
   - **Acceptance Criteria**
     - Friendly messages for all API errors

## Epic 8: DevOps & Docs
16. **CI Pipeline (lint + tests)** — 2 pts
17. **Deployment Prep Docs** — 2 pts
18. **User Guide (Demo Script)** — 2 pts

---

## Sprint Allocation (Suggested)
- **Sprint 1:** Stories 1–5, 16
- **Sprint 2:** Stories 6–11
- **Sprint 3:** Stories 12–15, 17–18
