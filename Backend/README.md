# Portfolio Backend Service

Production-ready, modular, and secure Node.js + Express + TypeScript backend API built for **Abdul Hanan's Cinematic Portfolio** contact inquiry system.

## 🚀 Features

- **Architecture**: Modular structure separating controllers, routes, middleware, providers, schemas, services, and templates.
- **Validation**: Strict schema validation using Zod.
- **Security**: Hardened using Helmet security headers, CORS protection, and request ID tracking.
- **Rate Limiting**: IP-based rate limiting (5 submissions per 15 minutes).
- **Anti-Spam**: Double-layered protection with hidden honeypot fields and submission speed timing detection.
- **Email Delivery**: Provider-based email architecture featuring Resend (easily swappable for SendGrid, AWS SES, or Mailgun).
- **Logging**: High-performance structured logging powered by Pino.
- **Graceful Shutdown**: Native support for SIGTERM and SIGINT process termination signals.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js (>= 18.0.0)
- **Framework**: Express.js
- **Language**: TypeScript
- **Validation**: Zod
- **Email Provider**: Resend SDK
- **Security**: Helmet, CORS, express-rate-limit

---

## 📦 Project Structure

```
Backend/
├── src/
│   ├── config/              # Environment variables & configuration
│   ├── controllers/         # Request handling & HTTP controllers
│   ├── middleware/          # Security, validation, anti-spam, error handling
│   ├── providers/           # Email provider interface & implementations (Resend)
│   ├── routes/              # Express API route definitions
│   ├── schemas/             # Zod validation schemas
│   ├── services/            # Business logic & email orchestration
│   ├── templates/           # Responsive HTML email templates
│   ├── types/               # TypeScript interfaces & types
│   ├── utils/               # Pino logger & response helpers
│   ├── app.ts               # Express application initialization
│   └── server.ts            # Server listener & graceful shutdown
├── .env.example             # Environment variable template
├── API_DOCUMENTATION.md     # Detailed API endpoints documentation
├── DEPLOYMENT_GUIDE.md      # Deployment guide for Railway, Render, Fly.io
├── package.json
├── postman_collection.json  # Postman API test collection
└── tsconfig.json
```

---

## 💻 Quick Start

### 1. Install Dependencies

```bash
cd Backend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and supply your Resend API Key:

```bash
cp .env.example .env
```

```env
NODE_ENV=development
PORT=5000
CORS_ORIGIN=https://my-new-portfolio-gold.vercel.app,http://localhost:3000
RESEND_API_KEY=re_your_resend_api_key
ADMIN_EMAIL=imhanan.mail@gmail.com
SENDER_EMAIL=onboarding@resend.dev
```

### 3. Run Development Server

```bash
npm run dev
```

### 4. Build & Start Production Server

```bash
npm run build
npm start
```
