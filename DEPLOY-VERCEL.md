# Deploy to Vercel (Easiest Method)

## Method 1: Via Vercel Website (Recommended)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push
```

### Step 2: Deploy on Vercel
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New Project"
4. Import your repository
5. Vercel auto-detects settings
6. Click "Deploy"
7. Wait 2 minutes - Done! 🎉

**Your app will be live at:** `https://your-project.vercel.app`

---

## Method 2: Via Vercel CLI (Faster)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (from project root)
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? music-player
# - Directory? ./
# - Override settings? No

# Deploy to production
vercel --prod
```

---

## What Gets Deployed

✅ **Frontend**: React app from `/client`
✅ **Backend**: Node.js API from `/server`
✅ **Database**: You'll need to add separately (see below)

---

## After Deployment

### Update API URL in Frontend

The backend will be at the same domain, so update your API calls:

**Option A: Use relative URLs (easiest)**
In your frontend code, change:
```javascript
// From:
fetch('http://localhost:3000/api/songs')

// To:
fetch('/api/songs')
```

**Option B: Use environment variable**
```javascript
const API_URL = import.meta.env.VITE_API_URL || '/api';
fetch(`${API_URL}/songs`)
```

---

## Environment Variables

Add in Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add your variables from `server/.env`
3. Redeploy

---

## Free Tier Limits

✅ **Unlimited** personal projects
✅ **100GB** bandwidth/month
✅ **100** deployments/day
✅ Automatic HTTPS
✅ Global CDN

---

## Troubleshooting

### Backend not working?
- Check Vercel Functions logs in dashboard
- Ensure `server/server.js` exports the Express app:
  ```javascript
  module.exports = app;
  ```

### Build fails?
```bash
# Test locally first
cd client && npm run build
cd ../server && npm start
```

### Need to update?
```bash
git add .
git commit -m "Update"
git push
# Vercel auto-deploys!
```

---

## Alternative: Deploy Only Frontend

If you just want to test the UI:

```bash
cd client
npm run build
npx vercel --prod
```

Then deploy backend separately to Render/Railway.

---

## Cost Comparison

| Service | Frontend | Backend | Database | Best For |
|---------|----------|---------|----------|----------|
| **Vercel** | Free | Free | Paid | Full-stack |
| **Netlify** | Free | No | No | Frontend only |
| **Render** | Free | Free | Free | Full-stack |
| **Railway** | Free | Free | Free | Full-stack |

**Winner for your app: Vercel or Render**
