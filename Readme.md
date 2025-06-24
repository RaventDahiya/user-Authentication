# User Authentication Backend

A Node.js, Express, and MongoDB backend for user authentication, including registration, email verification, login, JWT-based session, protected profile route, logout, and password reset via email.

---

## Features

- User registration with email verification
- Secure login with JWT and HTTP-only cookies
- Protected profile route (middleware-based)
- Logout functionality
- Forgot password and reset password via email link
- Environment-based configuration
- Passwords hashed with bcrypt

---

## Tech Stack

- Node.js
- Express.js
- MongoDB & Mongoose
- JWT (jsonwebtoken)
- Nodemailer (Mailtrap for testing)
- bcryptjs
- dotenv
- cookie-parser
- cors

---

## Getting Started

### 1. Clone the repository

```sh
git clone <your-repo-url>
cd user-Authentication
```

### 2. Install dependencies

```sh
npm install
```

### 3. Configure Environment Variables

Copy `.env.sample` to `.env` and fill in your values:

```sh
cp .env.sample .env
```

- `PORT` - Server port (default: 3000)
- `CORS_ORIGIN` - Allowed frontend origin (e.g. http://localhost:3000)
- `MONGODB_URL` - Your MongoDB connection string
- `MAILTRAP_HOST`, `MAILTRAP_PORT`, `MAILTRAP_USERNAME`, `MAILTRAP_PASSWORD`, `MAILTRAP_SENDEREMAIL` - Mailtrap credentials for email testing
- `JWT_SECRET` - Secret for JWT signing

### 4. Start the server

```sh
npm start
```

---

## API Endpoints

### Auth & User

- `POST   /api/v1/users/register`  
  Register a new user (name, email, password)

- `GET    /api/v1/users/verify/:token`  
  Verify user email via token

- `POST   /api/v1/users/login`  
  Login (email, password), sets JWT cookie

- `GET    /api/v1/users/profile`  
  Get logged-in user's profile (protected)

- `GET    /api/v1/users/logout`  
  Logout (clears JWT cookie)

### Password Reset

- `GET    /api/v1/users/forgotPassword?email=...`  
  Send password reset link to email

- `POST   /api/v1/users/resetPassword/:token`  
  Reset password using token (body: `{ "NewPassword": "..." }`)

---

## Postman Collection

A ready-to-use [Postman collection](user_auth.postman_collection.json) is included in this repo:

- Import `user_auth.postman_collection.json` into Postman to test all endpoints quickly.

---

## Notes

- All passwords are hashed before saving.
- JWT is stored in an HTTP-only cookie for security.
- Email verification and password reset use Mailtrap for safe testing.
- Protected routes require a valid
