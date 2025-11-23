# Push Code to Bitbucket

## Step 1: Create a Bitbucket Repository

1. Go to https://bitbucket.org
2. Click "Create" → "Repository"
3. Enter repository name (e.g., `music-player`)
4. Choose "Private" or "Public"
5. Click "Create repository"
6. Copy the repository URL (e.g., `https://bitbucket.org/YOUR_USERNAME/music-player.git`)

---

## Step 2: Initialize Git (if not already done)

```bash
# Check if git is initialized
git status

# If not initialized, run:
git init
git add .
git commit -m "Initial commit"
```

---

## Step 3: Push to Bitbucket

```bash
# Add Bitbucket as remote
git remote add origin https://bitbucket.org/YOUR_USERNAME/music-player.git

# Or if you already have a remote, replace it:
git remote set-url origin https://bitbucket.org/YOUR_USERNAME/music-player.git

# Push to Bitbucket
git branch -M main
git push -u origin main
```

---

## Step 4: Enter Credentials

When prompted:
- **Username**: Your Bitbucket username
- **Password**: Use an App Password (not your account password)

### Create App Password:
1. Go to https://bitbucket.org/account/settings/app-passwords/
2. Click "Create app password"
3. Give it a label (e.g., "Git Push")
4. Select permissions: "Repositories: Write"
5. Click "Create"
6. Copy the password and use it when pushing

---

## Alternative: Using SSH

```bash
# Generate SSH key (if you don't have one)
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy your public key
cat ~/.ssh/id_ed25519.pub

# Add to Bitbucket:
# 1. Go to https://bitbucket.org/account/settings/ssh-keys/
# 2. Click "Add key"
# 3. Paste your public key

# Add Bitbucket remote with SSH
git remote add origin git@bitbucket.org:YOUR_USERNAME/music-player.git

# Push
git push -u origin main
```

---

## Future Updates

After initial push, just use:

```bash
git add .
git commit -m "Your commit message"
git push
```

---

## Troubleshooting

### Error: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://bitbucket.org/YOUR_USERNAME/music-player.git
```

### Error: "failed to push some refs"
```bash
# Pull first, then push
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Large files error
```bash
# Check file sizes
find . -type f -size +50M

# Add large files to .gitignore
echo "server/music/*.mp3" >> .gitignore
git rm --cached -r server/music/
git commit -m "Remove large music files"
git push
```

---

## What Gets Pushed

✅ All source code
✅ Configuration files
✅ Documentation
❌ node_modules (excluded by .gitignore)
❌ .env files (excluded by .gitignore)
❌ Large music files (if added to .gitignore)

---

## Next Steps After Push

1. **Deploy to Vercel/Netlify**: Connect your Bitbucket repo
2. **Set up CI/CD**: Use Bitbucket Pipelines
3. **Invite collaborators**: Share the repository
