# ⚡ Quick Start: Deploy n8n in 3 Commands

Perfect for experienced developers who just want to get started quickly!

## Prerequisites ✓
- GitHub account
- Render account
- This repo cloned locally

## Steps

### 1️⃣ Push to GitHub
```bash
git init
git add .
git commit -m "n8n deployment"
git remote add origin https://github.com/YOUR_USERNAME/n8n-render-deployment.git
git push -u origin main
```

### 2️⃣ Deploy on Render
1. Go to [render.com](https://dashboard.render.com) → New → Blueprint
2. Connect your repo
3. Add these secrets before deploying:
   - `N8N_BASIC_AUTH_USER`: your username
   - `N8N_BASIC_AUTH_PASSWORD`: strong password
   - `N8N_ENCRYPTION_KEY`: random 32-char string
4. Click "Apply"

### 3️⃣ Access n8n
1. Wait 5-10 mins for deployment
2. Visit your Render service URL
3. Login with your credentials
4. Start automating! 🎉

---

**Need detailed steps?** See [DEPLOYMENT.md](./DEPLOYMENT.md) for the full walkthrough.
**Need more info?** See [README.md](./README.md) for configuration options.

