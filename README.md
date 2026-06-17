# G-TECH Innovation E-Commerce Platform

Welcome to the production-ready business management and full-stack e-commerce retail platform built for **G-TECH Innovation**, Chennai. This repository contains a high-performance Node/Express/Prisma REST API (`backend`) on port `5050` and a responsive React/Vite/Tailwind CSS user experience (`frontend`).

---

## 🏛️ System Architecture

The following diagram outlines the system connectivity and commerce pipelines:

```mermaid
graph TD
  User[Client Storefront / Admin Panel] -->|HTTPS Requests| FE[Vite / React SPA]
  FE -->|Axios REST Queries + Auth Tokens| BE[Node.js / Express API]
  BE -->|Multer / Cloudinary SDK| Cloudinary[(Cloudinary Cloud Storage)]
  BE -->|Razorpay Verification Gateway| Razorpay[Razorpay Gateway API]
  BE -->|Prisma Client ORM| DB[(Neon Serverless PostgreSQL)]
```

---

## 💻 Technology Stack

### Backend Engine
- **Framework**: Node.js & Express.js (configured with Helmet security headers & express-rate-limit).
- **Database Engine**: Neon Serverless PostgreSQL.
- **ORM Interface**: Prisma Client.
- **Authentication**: JWT stateless auth with Access Tokens (15m) & Refresh Tokens (7d), plus bcrypt password hashing.
- **Validations**: Strict schemas via Zod middleware.
- **Gateway Integrations**: Cloudinary image uploads & Razorpay payment confirmations.

### Frontend Client
- **Framework**: React 19 & Vite 8 (with Tailwind CSS v3).
- **State managers**: AuthContext (token/role retention) & CartContext (calculations, shipping & GST tax aggregators).
- **Router Guarding**: Client-side role-based protected routes (`GTECH_ADMIN` vs `CUSTOMER`).
- **Icons**: Lucide React.
- **HTTP Client**: Axios with interceptor-driven request queues for token refresh requests.

---

## 🔑 Environment Configurations

### Backend Configurations (`/backend/.env`)
Create a `.env` in the `backend` folder:
```env
PORT=5050
DATABASE_URL="postgresql://username:password@hostname/dbname?sslmode=require"
JWT_SECRET="gtech_jwt_access_secret_chennai_2026"
JWT_REFRESH_SECRET="gtech_jwt_refresh_secret_chennai_2026"

# Cloudinary Integration
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Razorpay Integration
RAZORPAY_KEY_ID="rzp_test_your_key_id"
RAZORPAY_KEY_SECRET="your_key_secret"
```

### Frontend Configurations (`/frontend/.env`)
Create a `.env` in the `frontend` folder:
```env
VITE_API_URL="http://localhost:5050/api"
VITE_RAZORPAY_KEY_ID="rzp_test_your_key_id"
```

---

## 🔌 API Route Schema

### 1. Authentication
- `POST /api/auth/register` - Create customer account.
- `POST /api/auth/login` - Sign in, returns Access Token & Refresh Token.
- `POST /api/auth/refresh` - Swap Refresh Token for new Access Token.
- `POST /api/auth/logout` - Invalidate session refresh keys.
- `GET /api/auth/me` - Retrieve active session details.

### 2. Product Catalog
- `GET /api/products` - Filter products by search, categories, brands, price range, and sort orders.
- `GET /api/products/:id` - Fetch detailed specifications.
- `POST /api/products` - Admin: Create new product listing (supports multiple image uploads).
- `PUT /api/products/:id` - Admin: Update specifications and inventory.
- `DELETE /api/products/:id` - Admin: Remove product listing.

### 3. Shopping Cart
- `GET /api/cart` - Retrieve active customer cart items.
- `POST /api/cart/add` - Add item to cart with stock validation checks.
- `PUT /api/cart/update` - Adjust cart quantities.
- `DELETE /api/cart/remove` - Remove item from cart.

### 4. Checkout & Orders
- `POST /api/orders` - Initialize order, calculates GST & flat shipping, decrements stock transactionally. Creates Razorpay payment order.
- `GET /api/orders/my-orders` - Fetch personal customer order history.
- `POST /api/payment/verify` - Verify Razorpay transaction signatures and update statuses.

### 5. Admin Controls
- `GET /api/admin/dashboard` - Stats aggregation (total users, products, orders, revenue).
- `GET /api/admin/orders` - View all store orders.
- `PUT /api/admin/orders/:id/status` - Update shipping stage (`PLACED`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`).
- `PUT /api/admin/orders/:id/payment` - Update transaction stage (`PENDING`, `SUCCESS`, `FAILED`).
- `GET /api/admin/users` - View customer directory.
- `PUT /api/admin/users/:id/status` - Block/unblock customer account status.

---

## 🛠️ Step-by-Step Installation

### 1. Database Setup
Ensure PostgreSQL is running locally or online. Update the `DATABASE_URL` in `/backend/.env`. Run the following to push the schema:
```bash
cd backend
npx prisma db push
```

### 2. Seed Database
Run seed to generate default administrator credentials (`admin@gtech.com` / `AdminPass123!`), categories, and product catalogs:
```bash
npx prisma db seed
```

### 3. Running Development Servers
- **Backend (Port 5050)**:
  ```bash
  cd backend
  npm run dev
  ```
- **Frontend (Vite Server)**:
  ```bash
  cd frontend
  npm run dev
  ```

---

## 🚀 Deployment Specifications

### Backend Deployment (Render / Railway)
1. Set Build command to: `npm install && npx prisma generate`
2. Set Start command to: `npm start`
3. Configure environment variables in dashboard settings.

### Frontend Deployment (Vercel / Netlify)
1. Select Vite framework preset.
2. Set Build command to: `npm run build`
3. Configure `VITE_API_URL` pointing to production API.
