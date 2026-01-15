# Deployment Guide: Frontend on Vercel + Backend on Render

## Backend Deployment on Render

### Step 1: Prepare Backend for Render
1. Create a `render.yaml` file in the root directory (optional, for better config management)
2. Ensure your `.env` file has all required variables ready

### Step 2: Deploy Backend to Render
1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `chat-app-backend` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node backend/index.js`
   - **Region**: Choose the closest to your users
5. Add Environment Variables in Render dashboard:
   ```
   PORT=8080
   MONGO_URL=<your_mongodb_connection_string>
   JWT_SECRET=<your_jwt_secret>
   FRONTEND_URL=https://<your-vercel-domain>.vercel.app
   TWILIO_ACCOUNT_SID=<if_using>
   TWILIO_AUTH_TOKEN=<if_using>
   TWILIO_PHONE_NUMBER=<if_using>
   ```
6. Click "Deploy"
7. Note your backend URL (e.g., `https://chat-app-backend.onrender.com`)

---

## Frontend Deployment on Vercel

### Step 1: Prepare Frontend for Vercel
1. Create a `.env.local` file in the frontend directory (for local development):
   ```
   VITE_API_URL=http://localhost:8080
   ```

### Step 2: Deploy Frontend to Vercel
1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (Vercel may auto-detect this)
   - **Output Directory**: `dist`
5. Add Environment Variables:
   ```
   VITE_API_URL=https://<your-render-backend>.onrender.com
   ```
6. Click "Deploy"
7. Note your frontend URL (e.g., `https://your-project.vercel.app`)

---

## Step 3: Update Backend FRONTEND_URL

Once you have your Vercel frontend URL:
1. Go to your Render dashboard
2. Open your backend service settings
3. Update the `FRONTEND_URL` environment variable to your Vercel domain
4. Redeploy the backend

---

## Verification Checklist

- [ ] Backend API is accessible at your Render URL
- [ ] Frontend loads without CORS errors
- [ ] Frontend can communicate with backend API
- [ ] WebSocket connections work (real-time messaging)
- [ ] Authentication works (login/signup)
- [ ] Messages load and send correctly

---

## Troubleshooting

### CORS Errors
- Ensure `FRONTEND_URL` in backend matches your Vercel domain exactly
- Check that `VITE_API_URL` in frontend matches your Render backend URL

### Socket.IO Connection Issues
- Verify the backend CORS includes your frontend domain
- Check browser console for specific socket connection errors

### Build Failures on Vercel
- Ensure the root directory in Vercel project is set to `frontend`
- Check that `vite.config.js` is properly configured

### Render Cold Start
- Render may take 30-50 seconds to wake up a free tier service
- Consider upgrading to a paid plan for consistent performance

---

## Environment Variables Reference

### Backend (.env)
```
PORT=8080
MONGO_URL=mongodb+srv://user:password@cluster.mongodb.net/dbname
JWT_SECRET=your_secret_key_here
FRONTEND_URL=https://your-vercel-domain.vercel.app
TWILIO_ACCOUNT_SID=optional
TWILIO_AUTH_TOKEN=optional
TWILIO_PHONE_NUMBER=optional
```

### Frontend (.env.local or Vercel)
```
VITE_API_URL=https://your-render-backend.onrender.com
```

---

## Important Notes

1. **Socket.IO**: The backend automatically uses the `FRONTEND_URL` for CORS, which is required for real-time messaging
2. **Static Files**: The backend serves the frontend from `/frontend/dist`, but since you're deploying separately, you can optionally remove this
3. **Database**: Ensure your MongoDB connection string is correct and allows connections from Render's IP addresses
4. **Cold Starts**: Render free tier services sleep after 15 minutes of inactivity. Your frontend will make requests that wake up the backend
