# Rare Medicine Locator

A full-stack web app that helps people find rare or hard-to-get medicines at pharmacies near them. The idea came from a simple frustration — when someone needs a specific medicine urgently, they usually end up calling pharmacy after pharmacy to check stock. This app fixes that.

Pharmacies manage their own inventory on the platform. Users search for medicines and instantly see which pharmacies have it, at what price, and how much stock is left. Everything updates in real time, so if a pharmacy just restocked something, you'll see it without refreshing the page.

---

## The problem it solves

Finding rare medicines in India usually means:
- Calling 5-6 pharmacies one by one
- Getting told "not available, try somewhere else"
- Wasting time when time actually matters

This app puts all that information in one place, with a map so you know exactly where to go.

---

## Features

**For users**
- Search medicines by name or category across all registered pharmacies
- See stock levels, price, and expiry info at a glance
- View nearby pharmacies on a Google Map and check what they carry
- Get real-time toast notifications when stock changes for a medicine you're looking at

**For pharmacies**
- Separate pharmacy account with its own dashboard
- Add, edit, and delete medicines from inventory
- Set a low stock threshold — get an email alert automatically when stock drops below it
- See warnings for medicines expiring within 30 days
- Dashboard shows total stock, low stock count, out of stock count, and expiring soon count at a glance

---

## Tech stack

- **Frontend** — React, React Router, Context API for state, Socket.io client
- **Backend** — Node.js, Express, MongoDB with Mongoose
- **Auth** — JWT with role-based access (user vs pharmacy)
- **Real-time** — Socket.io for live stock update notifications
- **Email** — Nodemailer with Gmail SMTP for low stock alerts
- **Maps** — Google Maps JavaScript API with geolocation for nearby search

---

## Project structure

```
rare-medicine-locator/
├── backend/
│   ├── config/        # Nodemailer setup
│   ├── controllers/   # Auth, medicine, pharmacy logic
│   ├── middleware/    # JWT auth middleware
│   ├── models/        # User and Medicine schemas
│   ├── routes/        # API routes
│   └── server.js      # Entry point, Socket.io setup
└── frontend/
    └── src/
        ├── components/   # Navbar, MedicineCard, MedicineForm
        ├── context/      # AuthContext, SocketContext
        ├── pages/        # All page components
        └── utils/        # Axios API calls
```

---

## Running locally

You'll need Node.js and a MongoDB Atlas account.

**Backend**
```bash
cd backend
npm install
copy .env.example .env
# fill in your .env values
npm run dev
```

**Frontend**
```bash
cd frontend
npm install
copy .env.example .env
# add your Google Maps API key
npm start
```

Backend runs on port 5000, frontend on port 3000.

**Environment variables**

Backend `.env`:
```
MONGO_URI=        # MongoDB Atlas connection string
JWT_SECRET=       # any random string
EMAIL_USER=       # your Gmail
EMAIL_PASS=       # Gmail App Password (not your real password)
CLIENT_URL=http://localhost:3000
```

Frontend `.env`:
```
REACT_APP_GOOGLE_MAPS_API_KEY=   # Google Cloud Console
REACT_APP_API_URL=http://localhost:5000/api
```

---

## API overview

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register as user or pharmacy |
| POST | `/api/auth/login` | Login |
| GET | `/api/medicines/search` | Search medicines by name/category |
| GET | `/api/medicines/nearby` | Get medicines at pharmacies within radius |
| POST | `/api/medicines` | Add medicine (pharmacy only) |
| PUT | `/api/medicines/:id` | Update stock (triggers socket event + email if low) |
| DELETE | `/api/medicines/:id` | Remove medicine |
| GET | `/api/pharmacies/dashboard` | Pharmacy stats |

---

## Notes

- The nearby map requires a Google Maps API key with the Maps JavaScript API enabled.
- Gmail App Passwords are required for email alerts — regular Gmail passwords won't work.