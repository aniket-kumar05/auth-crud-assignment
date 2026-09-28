# Auth CRUD Assignment — Sheryians Coding School

A full-stack e-commerce REST API with secure JWT authentication and a React + Redux Toolkit frontend.

## Project Structure

```
assignment-auth-crud/
├── server/              # Express.js REST API
│   └── src/
│       ├── app/         # Express app setup & CORS
│       ├── config/      # MongoDB connection
│       ├── controller/  # Auth & Product controllers
│       ├── middleware/  # JWT auth middleware
│       ├── models/      # Mongoose User & Product schemas
│       ├── routes/      # Auth & Product routes
│       ├── utils/       # Token generation helpers
│       └── validator/   # express-validator rules
└── client/              # React + Redux Toolkit frontend
    └── src/
        ├── api/         # Axios instance with interceptors
        ├── components/  # Navbar, Hero, Modals, Cards
        └── redux/       # Auth & Product slices + store
```

## Tech Stack

**Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT, bcryptjs, express-validator, cookie-parser

**Frontend:** React 19, Redux Toolkit, TailwindCSS v4, React-Toastify, Axios, Vite

## Auth API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user (no tokens returned) |
| POST | `/api/auth/login` | Public | Login, returns access token + httpOnly refresh cookie |
| POST | `/api/auth/refresh-token` | Public* | Issue new access token via refresh cookie |
| POST | `/api/auth/logout` | Protected | Invalidate refresh token & clear cookie |
| GET | `/api/auth/me` | Protected | Get logged-in user's profile |

## Product API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/products` | Protected | Create a new product |
| GET | `/api/products` | Public | List all products |
| GET | `/api/products/:id` | Public | Get a single product |
| PUT | `/api/products/:id` | Protected | Update a product |
| DELETE | `/api/products/:id` | Protected | Delete a product |

## Setup

### Backend
```bash
cd server
npm install
# Create .env with:
# PORT=3000
# MONGO_URL=mongodb://localhost:27017/auth-assignment
# ACCESS_TOKEN_SECRET=your_secret
# REFRESH_TOKEN_SECRET=your_refresh_secret
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

## Security

- Passwords hashed with bcrypt (10 salt rounds)
- JWT secrets stored in `.env`
- Refresh tokens stored in DB for revocation
- `httpOnly` cookie for refresh token
- Auto refresh token rotation on every use
- Axios interceptor handles silent token refresh
