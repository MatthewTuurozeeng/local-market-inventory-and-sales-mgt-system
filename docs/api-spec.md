# API Specification — Local Market Inventory & Sales Management System

Base URL: `/api/v1`

## Authentication
**Header:** `Authorization: Bearer <token>`

### Auth Endpoints
#### POST `/auth/register`
Create a new vendor account.
- **Body**
  - `name` (string, required)
  - `email` (string, required)
  - `phone` (string, optional)
  - `password` (string, required)
- **Response 201**
```json
{ "id": "u_123", "name": "Ama", "email": "ama@market.com" }
```

#### POST `/auth/login`
Login and receive JWT.
- **Body**
  - `email` (string, required)
  - `password` (string, required)
- **Response 200**
```json
{ "token": "jwt_token", "user": { "id": "u_123", "name": "Ama" } }
```

## Products
#### GET `/products`
List products (supports pagination + search).
- **Query**: `q`, `page`, `limit`
- **Response 200**
```json
{ "items": [ { "id": "p1", "name": "Tomato", "sku": "TOM-1", "price": 5, "stock": 20 } ], "page": 1, "limit": 10, "total": 1 }
```

#### POST `/products`
Create product.
- **Body**: `name`, `sku`, `price`, `stock`, `lowStockThreshold`
- **Response 201**
```json
{ "id": "p1", "name": "Tomato", "sku": "TOM-1", "price": 5, "stock": 20 }
```

#### PATCH `/products/:id`
Update product.
- **Body**: `name?`, `price?`, `stock?`, `lowStockThreshold?`, `archived?`
- **Response 200**
```json
{ "id": "p1", "name": "Tomato", "price": 6, "stock": 15 }
```

#### DELETE `/products/:id`
Soft delete a product.
- **Response 204** (no body)

## Sales
#### POST `/sales`
Record a sale (reduces stock).
- **Body**
  - `items`: [{ `productId`, `quantity`, `priceAtSale` }]
  - `saleDate` (ISO string)
- **Response 201**
```json
{ "id": "s1", "total": 120, "saleDate": "2026-03-16" }
```

#### GET `/sales/summary`
Daily sales summary.
- **Query**: `date` (YYYY-MM-DD)
- **Response 200**
```json
{ "date": "2026-03-16", "totalRevenue": 120, "itemsSold": 20 }
```

## Orders
#### POST `/orders`
Create customer order.
- **Body**
  - `customerName`
  - `phone`
  - `items`: [{ `productId`, `quantity` }]
- **Response 201**
```json
{ "id": "o1", "status": "pending", "trackingCode": "MK-1234" }
```

#### PATCH `/orders/:id/status`
Update order status.
- **Body**: `status` (pending|ready|completed|cancelled)
- **Response 200**
```json
{ "id": "o1", "status": "ready" }
```

#### GET `/orders/track/:trackingCode`
Public tracking endpoint.
- **Response 200**
```json
{ "trackingCode": "MK-1234", "status": "ready" }
```

## Notifications
#### GET `/notifications`
List low‑stock alerts.
- **Response 200**
```json
{ "items": [ { "productId": "p1", "name": "Tomato", "stock": 3 } ] }
```

## Analytics
#### GET `/analytics/top-products`
Top‑selling products.
- **Query**: `from`, `to`
- **Response 200**
```json
{ "items": [ { "productId": "p1", "name": "Tomato", "unitsSold": 120 } ] }
```

#### GET `/analytics/sales-trends`
Weekly trends.
- **Query**: `weeks` (default 4)
- **Response 200**
```json
{ "weeks": [ { "week": "2026-W10", "totalRevenue": 400 } ] }
```

## Error Format
All errors return:
```json
{ "error": { "code": "VALIDATION_ERROR", "message": "Stock must be >= 0" } }
```

## Status Codes
- `200` OK
- `201` Created
- `204` No Content
- `400` Validation Error
- `401` Unauthorized
- `403` Forbidden
- `404` Not Found
- `409` Conflict
- `500` Server Error
