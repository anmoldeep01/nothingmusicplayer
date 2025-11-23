# Deploy to Railway

Railway is perfect for full-stack apps. Here's how to deploy your music player:

## Quick Deploy (Easiest Method)

### Step 1: Sign Up
1. Go to https://railway.app
2. Sign up with GitHub or email
3. You get **$5 free credit** (no credit card needed)

### Step 2: Deploy from Bitbucket/GitHub

#### Option A: Via Railway Dashboard
1. Click "New Project"
2. Select "Deploy from GitHub repo" or "Deploy from repo"
3. Connect your Bitbucket account
4. Select `demo1155/musicplayer`
5. Railway auto-detects and deploys!

#### Option B: Via Railway CLI
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Link to your repo
railway link

# Deploy
railway up
```

---

## Configuration Files Created

✅ `railway.json` - Railway configuration
✅ `nixpacks.toml` - Build configuration
✅ Environment variables guide below

---

## Environment Variables

After deployment, add these in Railway dashboard:

### Required Variables:
```
NODE_ENV=production
PORT=3000
```

### Optional (from your .env):
```
LASTFM_API_KEY=your_key_here
LASTFM_SECRET=your_secret_here
```

### Add Variables:
1. Go to your Railway project
2. Click on your service
3. Go to "Variables" tab
4. Click "New Variable"
5. Add each variable

---

## Deploy Both Frontend & Backend

Railway can host both in one project:

### Option 1: Monorepo (Current Setup)
Railway will:
- Build client: `cd client && npm run build`
- Start server: `cd server && npm start`
- Server serves both API and static files

### Option 2: Separate Services
Deploy as two separate Railway services:

**Service 1: Backend**
- Root directory: `server`
- Start command: `npm start`
- Port: 3000

**Service 2: Frontend**
- Root directory: `client`
- Build command: `npm run build`
- Start command: `npx serve dist`

---

## Update Server to Serve Frontend

Add this to `server/server.js`:

```javascript
// Serve static files from React app
const path = require('path');
app.use(express.static(path.join(__dirname, '../client/dist')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});
```

---

## Deployment Steps

### 1. Commit Configuration Files
```bash
cd C:\Users\gamer\Downloads\music-player-clean
git add railway.json nixpacks.toml
git commit -m "Add Railway configuration"
git push origin master
```

### 2. Deploy on Railway
1. Go to https://railway.app/new
2. Click "Deploy from GitHub repo"
3. Select your repository
4. Railway will:
   - Detect Node.js
   - Install dependencies
   - Build frontend
   - Start backend
   - Assign a URL

### 3. Get Your URL
- Railway provides: `https://your-app.railway.app`
- Custom domain available (free)

---

## Cost

**Free Tier:**
- $5 credit/month (no card needed)
- ~500 hours of runtime
- Perfect for hobby projects

**Usage:**
- Your app: ~$0.01/hour
- $5 = ~500 hours = ~20 days of 24/7 runtime

---

## Troubleshooting

### Build fails?
Check Railway logs:
1. Go to your project
2. Click "Deployments"
3. View build logs

### Port issues?
Railway assigns PORT automatically. Update `server.js`:
```javascript
const PORT = process.env.PORT || 3000;
```

### Music files not loading?
- Railway has storage limits
- Consider using cloud storage (S3, Cloudinary)
- Or use Git LFS (already configured)

---

## Alternative: Deploy Backend Only

If you deployed frontend to Netlify/Vercel:

1. **Deploy only backend to Railway**
   - Root: `server`
   - Start: `npm start`

2. **Update frontend API URL**
   ```javascript
   // In client/.env.production
   VITE_API_URL=https://your-backend.railway.app
   ```

3. **Enable CORS in backend**
   ```javascript
   // server/server.js
   app.use(cors({
     origin: 'https://your-frontend.netlify.app'
   }));
   ```

---

## Quick Commands

```bash
# Deploy
railway up

# View logs
railway logs

# Open in browser
railway open

# Add environment variable
railway variables set KEY=value

# Link to existing project
railway link
```

---

## Next Steps

1. ✅ Commit config files
2. ✅ Push to Bitbucket
3. ✅ Deploy on Railway
4. ✅ Add environment variables
5. ✅ Test your live app!

Your music player will be live at: `https://your-app.railway.app` 🚀
