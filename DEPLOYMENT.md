# Deployment Guide

## Option 1: Deploy Frontend Only to Netlify (Recommended for Testing)

### Prerequisites
- GitHub account
- Netlify account (free)

### Steps:

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy to Netlify**
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select your repository
   - Netlify will auto-detect the settings from `netlify.toml`
   - Click "Deploy site"

3. **Note**: The frontend will deploy, but you'll need to deploy the backend separately (see Option 2)

---

## Option 2: Full Stack Deployment

### Frontend (Netlify)
Follow Option 1 above

### Backend Options:

#### A. Deploy Backend to Render (Free)
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Configure:
   - **Name**: music-player-api
   - **Root Directory**: server
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. Add environment variables from your `.env` file
6. Click "Create Web Service"
7. Copy your Render URL (e.g., `https://music-player-api.onrender.com`)

#### B. Deploy Backend to Railway (Free)
1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Configure:
   - **Root Directory**: server
   - **Start Command**: `npm start`
5. Add environment variables
6. Deploy and copy your Railway URL

### Update Frontend to Use Backend API

After deploying the backend, update your frontend API URL:

1. Create `client/.env.production`:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   ```

2. Update your API calls in the frontend to use `import.meta.env.VITE_API_URL`

3. Redeploy frontend to Netlify

---

## Option 3: Deploy Everything to Vercel

1. Go to https://vercel.com
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: client
   - **Build Command**: `npm run build`
   - **Output Directory**: dist
4. For the backend, create a separate Vercel project pointing to the `server` directory

---

## Quick Deploy (Frontend Only - No Backend)

If you just want to test the UI without the backend:

```bash
cd client
npm run build
npx netlify-cli deploy --prod
```

Follow the prompts and your site will be live!

---

## Important Notes

⚠️ **Backend Considerations:**
- Free tier backends (Render/Railway) may sleep after inactivity
- First request after sleep takes 30-60 seconds to wake up
- For production, consider paid hosting or serverless functions

⚠️ **Music Files:**
- Your music files need to be accessible via URL
- Consider using cloud storage (AWS S3, Cloudinary, etc.)
- Update the backend to point to your music storage location

⚠️ **Environment Variables:**
- Never commit `.env` files
- Add all environment variables in your hosting platform's dashboard
- Update API URLs for production

---

## Testing Locally Before Deploy

```bash
# Terminal 1 - Backend
cd server
npm install
npm start

# Terminal 2 - Frontend
cd client
npm install
npm run dev
```

Visit http://localhost:5173
