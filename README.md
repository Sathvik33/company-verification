Company Registration & Verification Module
1. Project Overview
The Company Registration & Verification Module is a comprehensive full-stack web application designed to provide a seamless and secure platform for companies to register, manage their profiles, and for administrators to verify them. This application features a complete user authentication system, multi-company profile management for each user, and integration with modern cloud services for authentication and file storage.

The frontend is built with React, offering a dynamic and responsive user experience, while the backend is powered by Node.js and Express, providing a robust and secure REST API. The entire system is designed to be scalable, maintainable, and ready for future feature enhancements.

2. Tech Stack
This project utilizes a modern and powerful tech stack for both the frontend and backend.

Frontend
Framework: React 18+ (with Vite)

State Management: Redux Toolkit

UI Library: Material-UI (MUI)

Form Management: React Hook Form

API Communication: Axios

Routing: React Router DOM

Notifications: React Toastify

Authentication Client: Firebase Authentication SDK

Backend
Framework: Node.js with Express

Database: PostgreSQL 15

Authentication: Firebase Admin SDK (for token verification)

Session Management: JSON Web Tokens (JWT)

Security: Helmet, CORS, sanitize-html

Validation: express-validator

Password Management: Handled by Firebase (bcrypt)

External Services
Authentication: Google Firebase (Email/Password)

Image Storage: Cloudinary (for company logos and banners)

3. Project Structure
This project is structured as a monorepo, with the frontend and backend codebases kept separate within a single root directory for easy management.

├── .gitignore          # Specifies files and folders to be ignored by Git
├── README.md           # This file
├── company-verification-backend/
│   ├── .env            # Backend environment variables
│   ├── package.json    # Backend dependencies
│   ├── server.js       # Main backend server entry point
│   └── backend/
│       ├── config/
│       ├── controllers/
│       ├── middlewares/
│       ├── routes/
│       └── utils/
└── company-verification-frontend/
    ├── .env.local      # Frontend environment variables
    ├── package.json    # Frontend dependencies
    ├── index.html      # Main HTML entry point
    └── src/
        ├── api/
        ├── app/
        ├── components/
        ├── features/
        ├── pages/
        └── ...
4. Setup and Installation
To run this project locally, you will need to set up both the backend and frontend servers.

Backend Setup
Navigate to the backend directory:
cd company-verification-backend

Install dependencies:

npm install

Set up Environment Variables: Create a file named .env in the company-verification-backend root and add the following variables:

# Server Configuration
PORT=5000

# Firebase Admin SDK Credentials Path
GOOGLE_APPLICATION_CREDENTIALS=./backend/config/serviceAccountKey.json

# Database Configuration (replace with your details)
DB_URL=postgresql://YOUR_USER:YOUR_PASSWORD@YOUR_HOST:5432/YOUR_DB_NAME

# JSON Web Token (JWT) Configuration
JWT_SECRET=your_super_secret_and_long_jwt_key
JWT_EXPIRES_IN=90d

Set up Firebase Service Account:

Go to your Firebase Project Settings > Service accounts.

Generate a new private key and download the JSON file.

Rename the file to serviceAccountKey.json and place it inside the company-verification-backend/backend/config/ directory.

Set up PostgreSQL Database:

Ensure PostgreSQL is installed and running.

Create a new database (e.g., company_module).

Run the SQL script located in the project's root to create the necessary tables.

Run the backend server:

npm run dev

The server will be running on http://localhost:5000.

Frontend Setup
Navigate to the frontend directory:

cd company-verification-frontend

Install dependencies:

npm install

Set up Environment Variables: Create a file named .env.local in the company-verification-frontend root and add the following variables:

# Firebase Configuration (get these from your Firebase project settings)
VITE_FIREBASE_API_KEY="your_api_key"
VITE_FIREBASE_AUTH_DOMAIN="your_auth_domain"
VITE_FIREBASE_PROJECT_ID="your_project_id"
VITE_FIREBASE_STORAGE_BUCKET="your_storage_bucket"
VITE_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
VITE_FIREBASE_APP_ID="your_app_id"

# Backend API URL
VITE_API_BASE_URL=http://localhost:5000/api

# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME="your_cloud_name"
VITE_CLOUDINARY_UPLOAD_PRESET="your_upload_preset"

Run the frontend server:

npm run dev



The application will be accessible at http://localhost:3000 (or another port if 3000 is busy).

Authentication Flow
The application uses a secure, two-token system for authentication.

Registration:

The frontend sends the user's email and password to Firebase Authentication.

Firebase creates the user and sends a verification email.

The frontend then sends the user's details (including the firebase_uid) to our backend's /api/auth/register endpoint to be saved in the PostgreSQL database.

Login:

The frontend sends the user's email and password to Firebase Authentication.

If successful, Firebase returns a short-lived ID Token to the frontend.

The frontend sends this ID Token to our backend's /api/auth/login endpoint.

The backend decodes this ID Token to get the user's firebase_uid.

It then finds the user in our PostgreSQL database and generates our own long-lived (90-day) JWT.

This JWT is sent back to the frontend.

Protected Routes:

The frontend stores this JWT in Redux and Local Storage.

For every subsequent request to a protected API route (e.g., getting company profiles), the frontend includes this JWT in the Authorization: Bearer [token] header.

The backend's protect middleware intercepts every request, verifies the JWT, and identifies the user, ensuring the routes are secure.
