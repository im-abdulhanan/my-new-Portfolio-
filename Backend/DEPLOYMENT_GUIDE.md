# Backend Deployment Guide

This service is fully containerized and cloud-ready for immediate zero-downtime deployment on **Railway**, **Render**, or **Fly.io**.

---

## 1. Railway Deployment (Recommended)

1. Sign in to [Railway.app](https://railway.app).
2. Click **New Project** → **Deploy from GitHub repo**.
3. Select your repository `im-abdulhanan/my-new-Portfolio-`.
4. Set the **Root Directory** to `Backend`.
5. Add the following **Environment Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `CORS_ORIGIN`: `https://my-new-portfolio-gold.vercel.app`
   - `RESEND_API_KEY`: `re_your_actual_resend_api_key`
   - `ADMIN_EMAIL`: `imhanan.mail@gmail.com`
   - `SENDER_EMAIL`: `contact@yourdomain.com` (or `onboarding@resend.dev`)
6. Railway will automatically execute `npm run build` and `npm start`.

---

## 2. Render Deployment

1. Sign in to [Render.com](https://render.com).
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository.
4. Set **Root Directory** to `Backend`.
5. Configure settings:
   - **Environment**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
6. Add environment variables under **Environment**:
   - `NODE_ENV`: `production`
   - `CORS_ORIGIN`: `https://my-new-portfolio-gold.vercel.app`
   - `RESEND_API_KEY`: `re_your_actual_resend_api_key`
7. Click **Create Web Service**.

---

## 3. Fly.io Deployment

1. Install Fly CLI: `flyctl auth login`
2. In the `Backend` directory, run:
   ```bash
   fly launch
   ```
3. Set secrets:
   ```bash
   fly secrets set RESEND_API_KEY=re_your_key CORS_ORIGIN=https://my-new-portfolio-gold.vercel.app
   ```
4. Deploy:
   ```bash
   fly deploy
   ```

---

## 4. Connect Frontend on Vercel

Once your backend is live (e.g. `https://portfolio-backend-production.up.railway.app`), update your frontend environment variables in Vercel:

```env
VITE_API_URL=https://portfolio-backend-production.up.railway.app
```
