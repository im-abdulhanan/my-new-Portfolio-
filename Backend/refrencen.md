# Portfolio Backend — Engineering Reference

## Objective

Build a production-ready backend for my portfolio contact form.

The backend should expose a REST API that receives project inquiries from the portfolio frontend and delivers them to my Gmail inbox using Nodemailer.

This backend should prioritize:

- Clean architecture
- TypeScript
- Security
- Performance
- Maintainability
- Production readiness

---

# Stack

Runtime

- Node.js LTS

Language

- TypeScript (strict mode)

Framework

- Express.js

Mailer

- Nodemailer

Configuration

- dotenv

Validation

- Zod

Security

- helmet
- cors
- express-rate-limit

Logging

- morgan

Deployment

- Render

Frontend

- React 19
- Vite
- Vercel

---

# Architecture

```
Frontend (Vercel)
        │
        ▼
POST /api/contact
        │
        ▼
Express API
        │
        ▼
Validation
        │
        ▼
Nodemailer
        │
        ▼
Gmail
```

The frontend and backend are separate projects.

Never place backend logic inside the frontend repository.

---

# Folder Structure

src/

config/
controllers/
middleware/
routes/
services/
validators/
types/
utils/

app.ts
server.ts

---

# API

POST

/api/contact

Body

```json
{
  "fullName": "",
  "email": "",
  "company": "",
  "projectType": "",
  "budget": "",
  "projectDetails": ""
}
```

Return JSON only.

Success

```json
{
    "success": true,
    "message": "Project inquiry sent successfully."
}
```

Failure

```json
{
    "success": false,
    "message": "Unable to send email."
}
```

---

# Contact Form Fields

Required

- Full Name
- Email Address
- Project Type
- Project Details

Optional

- Company
- Budget

---

# Email Format

Subject

```
🚀 New Portfolio Inquiry — {{fullName}}
```

Body

```
Name:
{{fullName}}

Email:
{{email}}

Company:
{{company}}

Project Type:
{{projectType}}

Budget:
{{budget}}

Message:

{{projectDetails}}
```

---

# Environment Variables

PORT

EMAIL_USER

EMAIL_PASS

CLIENT_URL

Never hardcode secrets.

Always use dotenv.

---

# Security

Use Helmet.

Use CORS.

Allow only my frontend origin.

https://my-new-portfolio-orcin-psi.vercel.app

Enable Rate Limiting.

Example

100 requests

per

15 minutes

Sanitize input.

Validate all request bodies with Zod.

Never trust client input.

---

# Coding Standards

TypeScript strict mode.

No any.

No default exports.

Named exports only.

Small reusable functions.

Single responsibility principle.

Clean separation of concerns.

Controllers should never contain SMTP configuration.

Routes should never contain business logic.

Services should contain email logic.

---

# Error Handling

Create centralized error middleware.

Return consistent JSON responses.

Never expose stack traces in production.

---

# Performance

Async/await only.

No callback hell.

Avoid blocking operations.

Keep API response under 500ms whenever possible.

---

# Deployment

Deploy backend separately on Render.

Environment variables are configured inside Render.

Frontend communicates with the deployed API.

---

# Future Features

Support automatic reply emails.

Google reCAPTCHA or Cloudflare Turnstile.

Request logging.

Analytics.

Admin dashboard.

Email templates.

Redis rate limiting.

Attachment support.

Webhook notifications.

Health endpoint

GET /health

Returns

```json
{
    "status":"ok"
}
```

---

# Goal

The backend should feel like production software, not a tutorial project.

Prioritize readability, scalability, security, and clean architecture.

Generate modular, maintainable code suitable for long-term portfolio growth.