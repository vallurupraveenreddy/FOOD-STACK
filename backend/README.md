# Food Ordering — Spring Boot Backend

A full REST backend for the React food ordering app: MySQL database via Spring Data JPA/Hibernate,
JWT-based authentication, and BCrypt password hashing with Spring Security.

## Tech stack
- Java 17, Spring Boot 3.3
- Spring Web, Spring Data JPA (Hibernate), Spring Security
- MySQL
- JWT (jjwt)

## Troubleshooting: "Field 'X' doesn't have a default value"

If you see an insert error mentioning a column that isn't in this project's code (for example
`placed_at`), it means your local `orders` (or another) table still has leftover columns from an
earlier schema — `spring.jpa.hibernate.ddl-auto=update` only ever *adds* columns, it never removes
or renames old ones. **This is why both COD and Online payment fail identically — they hit the same
insert statement.** Run this once, then restart the backend:

```sql
USE food_ordering_db;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS food_items; -- also needed to pick up newly added menu items below
```

Restarting the backend after this recreates all three tables from scratch and re-seeds the full
52-item menu, so you don't lose your users, coupons, or reviews.

## 1. Create the database
```sql
CREATE DATABASE food_ordering_db;
```
(The app can also auto-create it — see `application.properties` — but MySQL still needs to be running.)

## 2. Configure `src/main/resources/application.properties`
Update these to match your MySQL install:
```
spring.datasource.username=root
spring.datasource.password=root
```
Also change `jwt.secret` to your own long random string before deploying anywhere real.

## 3. Run it
```bash
cd backend
mvn spring-boot:run
```
The API starts on **http://localhost:8080**.

On first startup, `DataSeeder` automatically:
- inserts the same 32 menu items the React frontend already ships with, into the `food_items` table
- creates a default admin account: `admin@foodapp.com` / `Admin@12345`

## API overview

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | public | Create account, returns JWT |
| POST | `/api/auth/login` | public | Login, returns JWT |
| GET | `/api/food/list` | public | List all food items |
| POST | `/api/food/add` | ADMIN | Add a food item |
| PUT | `/api/food/{id}` | ADMIN | Update a food item |
| DELETE | `/api/food/{id}` | ADMIN | Delete a food item |
| GET | `/api/cart/get` | user | Get current user's cart |
| POST | `/api/cart/add` | user | `{ "foodItemId": 1 }` — add one unit |
| POST | `/api/cart/remove` | user | `{ "foodItemId": 1 }` — remove one unit |
| POST | `/api/order/place` | user | Place order from current cart + delivery address |
| GET | `/api/order/userorders` | user | Current user's order history |
| GET | `/api/order/list` | ADMIN | All orders |
| POST | `/api/order/status` | ADMIN | `{ "orderId": 1, "status": "OUT_FOR_DELIVERY" }` |
| GET | `/api/users/profile` | user | Get current user's profile |
| PUT | `/api/users/profile` | user | Update name/phone/address/city/state/zipCode |
| GET | `/api/coupons/active` | public | List active coupons (for a "Today's Offers" banner) |
| POST | `/api/coupons/apply` | user | `{ "code": "WELCOME50" }` — preview discount on current cart |
| GET | `/api/reviews/food/{id}` | public | All reviews for one food item |
| GET | `/api/reviews/summary` | public | `{ foodItemId: { average, count } }` for every rated item |
| POST | `/api/reviews` | user | `{ "foodItemId": 1, "rating": 5, "comment": "..." }` |
| GET | `/api/admin/dashboard` | ADMIN | Totals: users, orders, revenue, pending orders |
| GET | `/api/admin/users` | ADMIN | List all users |
| PATCH | `/api/admin/users/{id}/toggle` | ADMIN | Enable/disable a user (disabled users can't log in) |
| PUT | `/api/admin/users/{id}/role` | ADMIN | `{ "role": "ADMIN" }` — change a user's role |

### Order statuses
`PLACED → CONFIRMED → PREPARING → OUT_FOR_DELIVERY → DELIVERED` (or `CANCELLED` at any point).
Only an admin can move an order forward, via `/api/order/status`.

### Coupons seeded on first run
- `WELCOME50` — 50% off, capped at $10
- `FIRSTORDER` — $5 off orders over $20
- `FOOD20` — 20% off, capped at $15

Discounts are always recalculated server-side at both preview (`/api/coupons/apply`) and checkout
(`/api/order/place`) time — the frontend's number is never trusted directly.

Send the JWT on protected routes as:
```
Authorization: Bearer <token>
```

## Security notes
- Passwords are hashed with BCrypt — plaintext is never stored or returned.
- Sessions are stateless; every request is authenticated via the JWT.
- CORS is restricted to the Vite dev server origin (`http://localhost:5173`) via `app.cors.allowed-origin`.
- Admin-only endpoints (`/api/food` writes, `/api/order/list`, `/api/order/status`) require the `ADMIN` role.
