# Session Report — Dark Mode, Cart, Profile, Payments, Contact Page & More

This covers everything implemented in response to the full feature/bugfix spec.

## 1. Files changed

**Backend (new):**
- `config/SchemaFixer.java` — self-healing fix for the recurring `placed_at` DB error
- `model/ContactMessage.java`, `repository/ContactMessageRepository.java`,
  `dto/ContactMessageRequest.java`, `controller/ContactController.java` — Contact Us backend

**Backend (modified):**
- `config/DataSeeder.java` — `@Order(2)` added (runs after SchemaFixer), 12 more menu items seeded
- `config/SecurityConfig.java` — `/api/contact` (POST) made public

**Frontend (new):**
- `pages/Contact/Contact.jsx` + `.css` — dedicated Contact Us page
- `components/ScrollToTop/ScrollToTop.jsx` + `.css`
- `components/TodaysOffers/TodaysOffers.jsx` + `.css` — homepage offers banner
- `pages/NotFound/NotFound.jsx` + `.css` — 404 page

**Frontend (modified):**
- `components/Navbar.jsx` + `.css` — theme toggle moved beside cart icon, mobile hamburger menu added, Contact link now routes to `/contact`
- `pages/Placeorder/PlaceOrder.jsx` + `.css` — full payment flow rebuild (see below)
- `pages/cart/Cart.jsx` + `.css` — empty-cart state
- `pages/MyOrders/MyOrders.jsx` + `.css` — order ID/date/address shown, Reorder button
- `components/FoodDisplay/FoodDisplay.jsx` + `.css` — rating sort, Clear filters, broader search matching
- `pages/Home/Home.jsx` — Today's Offers section added
- `App.jsx` — new routes (`/contact`, `*` 404), `ScrollToTop` mounted globally
- `src/assets/assets.js` — 12 more menu items (52 total)

## 2. What was fixed

- **The recurring "Field 'placed_at' doesn't have a default value" error, permanently.** Root cause: a stale column from an earlier schema attempt, sitting in the local MySQL database, unrelated to any current entity. `SchemaFixer` now runs on every backend startup and automatically drops it (and its `order_items` counterpart) if found, via `information_schema` lookup + conditional `ALTER TABLE ... DROP COLUMN`. This fixes it even if a leftover `schema.sql` keeps recreating the column — no manual SQL needed, ever again.
- **Mobile navbar dead-end** — nav links used to just disappear below 750px width with no way to reach them at all. Added a working hamburger menu.
- **"View Menu" button** on the homepage hero was calling `document.getElementById("menu")` — that id never existed anywhere (the actual section id is `explore-menu`). Fixed.
- **Payment method section alignment** — rebuilt as clean, evenly-aligned selectable cards instead of a plain radio+label row.
- **Cart had no empty state** — now shows a proper "Your cart is empty" screen with a Browse Menu CTA.
- Verified **Edit Profile** — no actual code bug found; the flow (pre-filled form → edit → save → real PUT to `/api/users/profile` → immediate UI update) is correct as implemented in an earlier session.

## 3. New features added

- **Theme toggle beside the cart icon**, visible on every page (also still available in Profile as a secondary control)
- **Dedicated Contact Us page** (`/contact`): hero, info cards, working form that posts to a real backend endpoint and stores messages in MySQL, FAQ accordion, social icons
- **Real payment confirmation flow**:
  - COD → places order immediately → "Order Placed Successfully!" screen with order #, total, ETA
  - Online → simulated UPI/Card payment screen first → then the same success screen. Clearly labeled as a demo; no real gateway
- **Order History improvements**: Order ID, date/time, delivery address shown; **Reorder** button re-adds all items to cart
- **Today's Offers** banner on the homepage, pulling live active coupons from the backend
- **Scroll-to-top button**, appears after scrolling down
- **404 page** for unknown routes
- **Rating sort** and **Clear filters** on the menu, broader search matching (name/category/description)
- **52 total menu items** now (was 32 originally), spread correctly across all 8 categories

## 4. Database changes

- New table: `contact_messages` (id, name, email, subject, message, created_at) — auto-created by Hibernate on next startup
- `orders`/`order_items`: any stale `placed_at` column is now auto-removed on startup (see SchemaFixer above) — no manual migration needed
- `food_items`: 12 new rows seeded (only on an empty table — see "How to run" note below if you want them immediately)

## 5. APIs added/modified

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/contact` | public | Submit contact form, stored in MySQL |

No existing APIs were changed in a breaking way.

## 6. How to run — Frontend

```bash
cd "FOOD 2"
npm install
npm run dev
```

## 7. How to run — Backend

```bash
cd backend
mvn spring-boot:run
```

**To pick up the 12 new menu items and guarantee a fully clean schema**, drop `food_items` once (SchemaFixer handles `orders`/`order_items` automatically, but the food seeder only runs on an empty table):
```sql
USE food_ordering_db;
DROP TABLE IF EXISTS food_items;
```
Then start the backend — it recreates and re-seeds all 52 items automatically.

## 8. Remaining / deferred items (scope was very large — flagging honestly)

- Veg/Non-veg filtering — would need a new schema field on `FoodItem`, not implemented
- Address book / multiple saved delivery addresses
- Skeleton loaders (some loading states exist via "Loading..." text, not shimmer skeletons)
- Deeper homepage sections (customer reviews carousel, "Why choose us") — only Today's Offers was added
- Category dropdown directly in the navbar (category filtering exists via the homepage's ExploreMenu section instead)

## 9. Testing checklist

**Theme**
- [ ] Toggle beside cart icon switches light/dark instantly
- [ ] Refresh page — theme persists
- [ ] Navigate across Home/Cart/Profile/Order History/Contact — theme stays applied

**Cart**
- [ ] Add item from menu → cart icon badge updates
- [ ] Increase/decrease quantity in cart
- [ ] Remove an item
- [ ] Empty the cart fully → see the new empty-cart screen with Browse Menu button

**Profile**
- [ ] Open Profile → Edit Profile → change name/phone/address → Save → info updates immediately
- [ ] Refresh → changes persisted

**COD**
- [ ] Add food → checkout → select Cash on Delivery → Place Order → success screen appears → cart is cleared → order appears in My Orders

**Online (demo)**
- [ ] Add food → checkout → select Online Payment → fill UPI or Card fields → Pay → success screen appears → order appears in My Orders

**Order History**
- [ ] Order # and date/time are shown
- [ ] Reorder button re-adds items to cart

**Navbar / Mobile**
- [ ] Resize below 750px — hamburger menu appears and opens the nav links
- [ ] "Menu" link scrolls to the food list from any page
- [ ] Search box filters results by name/category/description

**Contact**
- [ ] Submit the contact form → success message appears → check `contact_messages` table in MySQL for the row

**Misc**
- [ ] Scroll down any page → scroll-to-top button appears and works
- [ ] Visit a nonexistent URL → 404 page appears
