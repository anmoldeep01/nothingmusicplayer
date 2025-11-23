# Fresh Push to Bitbucket (Without Large Files)

The issue is that large music files are in your git history. Here's how to push without them:

## Option 1: Create Fresh Repository (Easiest)

```bash
# Create a new folder for clean code
cd ..
mkdir music-player-clean
cd music-player-clean

# Copy only source code (not .git folder)
xcopy "..\music player\client" "client\" /E /I /H /Y
xcopy "..\music player\server" "server\" /E /I /H /Y
xcopy "..\music player\.gitignore" ".gitignore*" /Y
xcopy "..\music player\netlify.toml" "netlify.toml*" /Y
xcopy "..\music player\vercel.json" "vercel.json*" /Y
xcopy "..\music player\*.md" "." /Y

# Initialize fresh git
git init
git add .
git commit -m "Initial commit - Music player with Nothing UI"

# Push to Bitbucket
git remote add origin https://bitbucket.org/demo1155/musicplayer.git
git branch -M master
git push -u origin master --force
```

## Option 2: Use BFG Repo-Cleaner (Advanced)

```bash
# Download BFG from https://rtyley.github.io/bfg-repo-cleaner/
# Then run:
java -jar bfg.jar --delete-files "*.mp3" .
java -jar bfg.jar --delete-files "*.mp4" .
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push origin master --force
```

## Option 3: Enable Git LFS on Bitbucket

1. Go to your Bitbucket repository settings
2. Enable "Large File Storage (LFS)"
3. Then push again

## Recommended: Option 1

It's the cleanest and fastest solution. Your music files will stay on your local machine but won't be pushed to Bitbucket.

## After Pushing

Your music files will be in `.gitignore`, so they won't be tracked. To use them in production:
- Upload music files to cloud storage (AWS S3, Cloudinary, etc.)
- Update your backend to stream from cloud storage
