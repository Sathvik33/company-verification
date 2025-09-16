# Company Registration & Verification Module

A full-stack web application for seamless and secure **company registration, profile management, and admin verification**.

---

## 🚀 Project Overview
This application provides:

- **User Authentication** (Firebase + JWT)
- **Multi-Company Profile Management**
- **Admin Verification Workflow**
- **Cloud-based File Storage** for company logos/banners

Frontend is built with **React (Vite)** for a dynamic UI, and the backend uses **Node.js + Express** with a **PostgreSQL** database.  
The system is scalable, maintainable, and ready for future enhancements.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18+ (Vite)
- **State Management:** Redux Toolkit
- **UI Library:** Material-UI (MUI)
- **Forms:** React Hook Form
- **API Calls:** Axios
- **Routing:** React Router DOM
- **Notifications:** React Toastify
- **Authentication Client:** Firebase Authentication SDK

### Backend
- **Runtime / Framework:** Node.js + Express
- **Database:** PostgreSQL 15
- **Authentication:** Firebase Admin SDK (token verification)
- **Session Management:** JSON Web Tokens (JWT)
- **Security:** Helmet, CORS, sanitize-html
- **Validation:** express-validator
- **Password Management:** Firebase (bcrypt)
- **Image Storage:** Cloudinary

---

## 📂 Folder Structure

```text
company-registration-verification/
├── .gitignore
├── README.md
│
├── company-verification-backend/
│   ├── .env                 # Backend environment variables
│   ├── package.json         # Backend dependencies
│   ├── server.js            # Main backend entry point
│   └── backend/
│       ├── config/
│       │   └── serviceAccountKey.json  # Firebase service account (local only)
│       ├── controllers/
│       ├── middlewares/
│       ├── routes/
│       └── utils/
│
└── company-verification-frontend/
    ├── .env.local           # Frontend environment variables
    ├── package.json         # Frontend dependencies
    ├── index.html           # Main HTML entry
    └── src/
        ├── api/
        ├── app/
        ├── components/
        ├── features/
        ├── pages/
        └── ...
```
⚙️ Setup & Installation
1️⃣ Backend Setup
cd company-verification-backend
npm install


Create a .env file in company-verification-backend/:

# Server
PORT=5000

# Firebase Admin SDK
GOOGLE_APPLICATION_CREDENTIALS=./backend/config/serviceAccountKey.json

# Database
DB_URL=postgresql://YOUR_USER:YOUR_PASSWORD@YOUR_HOST:5432/YOUR_DB_NAME

# JWT
JWT_SECRET=your_super_secret_and_long_jwt_key
JWT_EXPIRES_IN=90d


Firebase Service Account

Firebase Console → Project Settings → Service accounts.

Generate a private key, rename to serviceAccountKey.json.

Place it in backend/config/.

PostgreSQL Database

Ensure PostgreSQL is running.

Create a new database, e.g. company_module.

Run the provided SQL schema to create tables.

Start the backend:

npm run dev


Backend runs at http://localhost:5000
.

2️⃣ Frontend Setup
cd company-verification-frontend
npm install


Create a .env.local file in company-verification-frontend/:

# Firebase Config
VITE_FIREBASE_API_KEY="your_api_key"
VITE_FIREBASE_AUTH_DOMAIN="your_auth_domain"
VITE_FIREBASE_PROJECT_ID="your_project_id"
VITE_FIREBASE_STORAGE_BUCKET="your_storage_bucket"
VITE_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
VITE_FIREBASE_APP_ID="your_app_id"

# Backend API
VITE_API_BASE_URL=http://localhost:5000/api

# Cloudinary
VITE_CLOUDINARY_CLOUD_NAME="your_cloud_name"
VITE_CLOUDINARY_UPLOAD_PRESET="your_upload_preset"


Start the frontend:

npm run dev


Frontend is accessible at http://localhost:3000
 (or next available port).
 

🔐 Authentication Flow

Registration

Frontend sends email & password to Firebase Authentication.

Firebase creates the user and emails verification.

Frontend posts user details + firebase_uid to /api/auth/register.

Backend stores user in PostgreSQL.


Login

Frontend sends credentials to Firebase.

Firebase returns a short-lived ID Token.

Frontend sends ID Token to /api/auth/login.

Backend verifies ID Token → retrieves firebase_uid.

Backend issues a 90-day JWT.

Frontend stores JWT (Redux + Local Storage).

Protected Routes

Every API request includes Authorization: Bearer <JWT>.

Backend middleware verifies JWT and identifies the user.

