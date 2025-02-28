# AI-Powered Situational Awareness & Group Tracking Website

This project provides a **real-time AI-powered tracking system** for individuals and groups, enabling **secure, optimized, and privacy-first location tracking**.

## 1️⃣ Project Overview
- **Goal:** Build an AI-powered tracking solution with real-time location monitoring.
- **Features:** Group tracking, route optimization, geofencing alerts, and emergency notifications.

## 2️⃣ Tech Stack
- **Frontend:** React.js + TailwindCSS
- **Backend:** Node.js + Express.js
- **Database:** MongoDB Atlas (NoSQL)
- **Authentication:** JWT (JSON Web Tokens)
- **Maps API:** OpenStreetMap (Leaflet.js)
- **Hosting:** Vercel (Frontend) + Render (Backend)

## 3️⃣ System Architecture
- The **frontend (React.js)** interacts with the **backend (Node.js, Express.js)** via APIs.
- The **backend** processes user requests and fetches data from **MongoDB Atlas**.
- The **AI module** (TensorFlow.js or Scikit-learn) optimizes routes and predicts movement.
- **OpenStreetMap** provides real-time tracking and geolocation services.

```bash
# Clone the repository
git clone https://github.com/YOUR-USERNAME/Situational-Awareness-Tracking.git

# Install dependencies (backend)
cd backend
npm install

# Start backend server
node server.js

# Install dependencies (frontend)
cd ../frontend
npm install

# Start React app
npm start
