# G-TECH Innovation Platform

Welcome to the production-ready business management and customer lead tracking platform built for **G-TECH Innovation**, Chennai. This workspace is split into two primary components: a high-performance Node/Express/Prisma REST API (`backend`) and a dynamic React/Vite/Tailwind CSS user experience (`frontend`).

---

## 🏛️ System Architecture

The following diagram outlines the data flow between components:

```mermaid
graph TD
  User[Client Browser / Admin] -->|HTTPS Requests| FE[Vite / React SPA]
  FE -->|Axios REST Queries| BE[Node.js / Express API]
  BE -->|Multer Fallback / Cloudinary API| Cloudinary[(Cloudinary Cloud Storage)]
  BE -->|Nodemailer SMTP| SMTP[SMTP Mail Client / Gmail]
  BE -->|Prisma ORM Client| DB[(Neon PostgreSQL Database)]
```

---

## 💻 Technology Stack

### Backend
- **Core Engine**: Node.js & Express.js
- **Database Engine**: PostgreSQL (Neon Serverless)
- **ORM Interface**: Prisma v7.8.0
- **Security Protocols**: Stateless JWT (JSON Web Tokens) & `bcryptjs` password hashing
- **File Uploads**: `multer` with auto-upload to Cloudinary (fallback to Unsplash stock pictures if keys are unset)
- **Communications**: `nodemailer` SMTP system for lead alerts

### Frontend
- **Framework Scaffolding**: React 19 & Vite 8
- **Design styling**: Tailwind CSS v3
- **Animations & transitions**: Framer Motion
- **Form management**: React Hook Form
- **API client**: Axios with automatic Authorization header injection

---

## 🔑 Environment Configurations

Create `.env` files matching the instructions below.

### Backend Configurations (`/backend/.env`)
Create a `.env` in the `backend` folder:
```env
PORT=5000
DATABASE_URL="postgresql://username:password@hostname/dbname?sslmode=require"
JWT_SECRET="gtech_jwt_secret_token_Chennai_2026"
JWT_EXPIRES_IN="7d"

# Cloudinary Credentials (Optional - Falls back to Unsplash stock images)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# SMTP Credentials (Optional - Skips email triggering if empty)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="reach2gtech@gmail.com"
SMTP_PASS="your-app-password"
```

### Frontend Configurations (`/frontend/.env`)
Create a `.env` in the `frontend` folder:
```env
VITE_API_URL="http://localhost:5000/api"
```

---

## 🔌 API Route Schema

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/login` | Public | Authenticates admin, returns JWT. |
| **GET** | `/api/auth/me` | Admin | Fetches profile of current logged-in user. |
| **GET** | `/api/services` | Public | Returns all catalog services. |
| **POST** | `/api/services` | Admin | Creates service listing (supports Image Upload). |
| **PUT** | `/api/services/:id` | Admin | Modifies service specifications. |
| **DELETE** | `/api/services/:id` | Admin | Removes service listing. |
| **GET** | `/api/projects` | Public | Returns completed projects (supports category filters). |
| **POST** | `/api/projects` | Admin | Adds completed project log (supports Image Upload). |
| **PUT** | `/api/projects/:id` | Admin | Modifies completed project entry. |
| **DELETE** | `/api/projects/:id` | Admin | Removes project entry. |
| **GET** | `/api/testimonials` | Public | Retrieves customer review feed. |
| **POST** | `/api/testimonials` | Public | Submits customer review. |
| **PUT** | `/api/testimonials/:id` | Admin | Modifies review specifications / rating. |
| **DELETE** | `/api/testimonials/:id` | Admin | Removes review entry. |
| **POST** | `/api/contacts` | Public | Submits contact lead form (Sends email notification). |
| **GET** | `/api/contacts` | Admin | Lists all contact lead requests. |
| **PUT** | `/api/contacts/:id` | Admin | Cycles ticket status (*Submitted, Under Review, In Progress, Completed*). |
| **DELETE** | `/api/contacts/:id` | Admin | Removes lead ticket record. |
| **GET** | `/api/contacts/track/:id`| Public | Tracks status of ticket using UUID. |
| **GET** | `/api/dashboard/stats` | Admin | Returns system-wide statistics for dashboards. |

---

## 🛠️ Step-by-Step Installation

### 1. Database Setup
Ensure PostgreSQL is running locally or online. Update the `DATABASE_URL` in `/backend/.env`. Run the following to configure the database schema:
```bash
cd backend
npx prisma db push
```

### 2. Seed Database
Seeding creates initial services, projects, and the default Admin account (`reach2gtech@gmail.com` with password `GtechAdmin2026!`):
```bash
npm run seed
# or: node prisma/seed.js
```

### 3. Running Development Servers
To run the full stack locally:
- **Backend (Port 5000)**:
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
1. Add a **Web Service** pointing to your repository.
2. Set Build command to: `npm install && npx prisma generate`
3. Set Start command to: `npm start`
4. Set Environment Variables corresponding to `/backend/.env`.

### Frontend Deployment (Vercel / Netlify)
1. Import the `frontend` subfolder.
2. Set Framework Preset to **Vite**.
3. Set Build command to: `npm run build`
4. Set Output Directory to: `dist`
5. Configure `VITE_API_URL` environment variable pointing to the deployed backend.

---

## ⚙️ Security Policies
- **JWT stateless auth**: Transmitted via bearer tokens in standard Axios request headers.
- **RBAC protection**: Standard operations require admin authorization validation flags.
- **Form validations**: All inputs are checked on the frontend via `react-hook-form` regex patterns and verified with backend fallback filters.
