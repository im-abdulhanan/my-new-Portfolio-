# API Documentation

## Endpoints Overview

| Method | Endpoint | Description | Rate Limit |
|---|---|---|---|
| `GET` | `/health` | Server status, version, and uptime check | None |
| `POST` | `/api/contact` | Submit contact inquiry form | 5 req / 15 min per IP |

---

## 1. Health Status Check

### `GET /health`

Returns operational telemetry and status of the backend API.

#### Response Example (`200 OK`)

```json
{
  "status": "ok",
  "version": "1.0.0",
  "environment": "production",
  "uptime": 142.85,
  "timestamp": "2026-07-31T15:20:00.000Z"
}
```

---

## 2. Submit Contact Inquiry

### `POST /api/contact`

Submits a new project inquiry, triggers an admin notification email to `imhanan.mail@gmail.com`, and sends an auto-reply email to the visitor.

#### Headers

```http
Content-Type: application/json
```

#### Request Payload Schema

```typescript
{
  fullName: string;        // Required (2-100 characters)
  email: string;           // Required (Valid Email)
  company?: string;        // Optional (Max 100 characters)
  projectType: string;     // Required
  budget?: string;         // Optional
  projectDetails: string;  // Required (10-5000 characters)
  website?: string;        // Optional Honeypot (MUST BE EMPTY OR OMITTED)
  loadedAt?: number;       // Optional Timestamp (MUST BE > 2.5s OLD)
}
```

#### Sample Request Body

```json
{
  "fullName": "Alex Mercer",
  "email": "alex@company.com",
  "company": "Acme Studio",
  "projectType": "SaaS Dashboard",
  "budget": "$1,500 – $5,000",
  "projectDetails": "We need a modern, high-performance SaaS dashboard built with Next.js and Tailwind CSS.",
  "website": "",
  "loadedAt": 1785500000000
}
```

#### Success Response (`200 OK`)

```json
{
  "success": true,
  "message": "Thank you. Your inquiry has been received.",
  "requestId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "timestamp": "2026-07-31T15:20:01.123Z"
}
```

#### Validation Error Response (`400 Bad Request`)

```json
{
  "success": false,
  "message": "Validation failed. Please check your inputs.",
  "requestId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "timestamp": "2026-07-31T15:20:01.123Z",
  "errors": {
    "email": ["Invalid Email Address"],
    "projectDetails": ["Project Details must be at least 10 characters"]
  }
}
```

#### Rate Limit Exceeded Response (`429 Too Many Requests`)

```json
{
  "success": false,
  "message": "Too many contact requests from this IP. Please try again after 15 minutes.",
  "timestamp": "2026-07-31T15:20:01.123Z"
}
```
