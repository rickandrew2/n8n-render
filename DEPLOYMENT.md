# Step-by-Step Deployment Guide for n8n on Render

This guide will walk you through deploying n8n on Render, step by step.

## Part 1: GitHub Setup (5 minutes)

### Step 1.1: Initialize Git Repository
```bash
git init
git add .
git commit -m "Initial commit: n8n deployment setup"
```

### Step 1.2: Create GitHub Repository
1. Go to [GitHub](https://github.com/new)
2. Create a new repository (name: `n8n-render-deployment`)
3. **DO NOT** initialize with README, .gitignore, or license
4. Click "Create repository"

### Step 1.3: Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/n8n-render-deployment.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username!

## Part 1.5: Neon Database Setup (5 minutes) 🆕

### Step 1.5.1: Create Neon Account
1. Go to [Neon Console](https://console.neon.tech)
2. Sign up (free account)
3. Verify your email if prompted

### Step 1.5.2: Create Database Project
1. Click **"Create a project"**
2. Name it: `n8n-db` (or any name you prefer)
3. Select a region (choose one close to your Render region for better performance)
4. Click **"Create project"**

### Step 1.5.3: Get Connection Details
After creating the project, Neon will show you connection details:

1. Click **"Connect"** button in your project dashboard
2. Select **"Connection string"** tab
3. Copy or note down these values:
   - **Host** (e.g., `ep-xxxxx.ap-southeast-1.aws.neon.tech`)
   - **Database** (usually `neondb`)
   - **User** (usually `neondb_owner`)
   - **Password** (click "Show" to reveal) ⚠️ **SAVE THIS PASSWORD!**

**Example connection string:**
```
postgresql://neondb_owner:yourpassword@ep-xxxxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

You'll use these values in Render later!

## Part 2: Render Account Setup (2 minutes)

### Step 2.1: Create Render Account
1. Go to [render.com](https://render.com)
2. Click "Get Started" or "Sign Up"
3. Sign up with GitHub (recommended for easy repo connection)

### Step 2.2: Verify Email
- Check your email and click the verification link

## Part 3: Deploy n8n (10-15 minutes)

### Step 3.1: Create Blueprint
1. In Render Dashboard, click the big **"+ New"** button
2. Select **"Blueprint"** from the dropdown
3. You'll see: "Connect a repository from GitHub"
4. Click **"Connect GitHub"** (if not already connected)
5. Select your `n8n-render-deployment` repository

### Step 3.2: Configure Blueprint
Render will auto-detect your `render.yaml` file and show:
- Service name: `n8n-automation`
- Environment: Docker
- Plan: Free

**IMPORTANT**: Before clicking "Apply", we need to add secrets!

### Step 3.3: Add Required Environment Variables
Scroll down to "Environment Variables" section and add these:

#### Authentication Variables:
1. **N8N_BASIC_AUTH_USER**
   - Click "Add Environment Variable"
   - Key: `N8N_BASIC_AUTH_USER`
   - Value: Choose a username (e.g., `admin`)
   - ✅ Check "Secret" checkbox (optional but recommended)

2. **N8N_BASIC_AUTH_PASSWORD**
   - Click "Add Environment Variable" again
   - Key: `N8N_BASIC_AUTH_PASSWORD`
   - Value: Create a STRONG password (mix of letters, numbers, symbols)
   - ✅ Check "Secret" checkbox
   - **⚠️ SAVE THIS PASSWORD SOMEWHERE SAFE!**

#### Neon Database Variables:
3. **DB_POSTGRESDB_HOST**
   - Key: `DB_POSTGRESDB_HOST`
   - Value: Your Neon host (from Part 1.5, e.g., `ep-xxxxx.ap-southeast-1.aws.neon.tech`)

4. **DB_POSTGRESDB_DATABASE**
   - Key: `DB_POSTGRESDB_DATABASE`
   - Value: Your Neon database name (usually `neondb`)

5. **DB_POSTGRESDB_USER**
   - Key: `DB_POSTGRESDB_USER`
   - Value: Your Neon username (usually `neondb_owner`)

6. **DB_POSTGRESDB_PASSWORD**
   - Key: `DB_POSTGRESDB_PASSWORD`
   - Value: Your Neon password (from Part 1.5)
   - ✅ Check "Secret" checkbox
   - **⚠️ This is VERY important!**

#### Optional (Recommended):
7. **N8N_ENCRYPTION_KEY**
   - Key: `N8N_ENCRYPTION_KEY`
   - Value: Generate a random 32-character string
   - You can use: `openssl rand -hex 16` (or online generator)
   - ✅ Check "Secret" checkbox

**Note**: Variables marked with `sync: false` in `render.yaml` must be set manually in Render Dashboard. See `env.example` for a complete list!

### Step 3.4: Deploy!
1. Click the blue **"Apply"** button at the bottom
2. Wait for deployment (5-10 minutes)
3. You'll see a live log of the build process

## Part 4: Post-Deployment (5 minutes)

### Step 4.1: Find Your URL
Once deployment is complete, you'll see:
- Status: ✅ Live
- Your URL: `https://n8n-automation.onrender.com`

Click on the URL or copy it!

### Step 4.2: Configure Service URLs
After deployment, add these variables in Render Dashboard → Your Service → Environment:

1. **N8N_HOST**
   - Key: `N8N_HOST`
   - Value: Your Render service hostname (e.g., `n8n-xxxxx.onrender.com`)
   - ⚠️ No `https://` prefix, just the hostname!

2. **WEBHOOK_URL**
   - Key: `WEBHOOK_URL`
   - Value: `https://your-service-name.onrender.com/` (with trailing slash!)
   - ⚠️ Replace with YOUR actual Render URL

After adding these, Render will automatically restart your service (or you can manually restart).

### Step 4.3: Access n8n
1. Open your URL in a browser
2. You'll see a login page
3. Enter your `N8N_BASIC_AUTH_USER` and `N8N_BASIC_AUTH_PASSWORD`
4. Click "Log In"

🎉 **Congratulations!** You should now see the n8n interface!

**Verify Database Connection:**
- If login works, n8n has successfully connected to your Neon database
- n8n automatically creates all required tables on first startup
- Check your Neon dashboard → Query Editor to see the tables if you're curious!

## Part 5: First Workflow (Optional - 5 minutes)

Let's test it works:

1. Click **"+ New Workflow"** in n8n
2. Click on the empty canvas
3. Search for "Manual Trigger"
4. Drag it onto the canvas
5. Click **"+ Add another node"**
6. Search for "Code"
7. Drag "Code" node after Manual Trigger
8. Connect them (drag from output to input)
9. Click "Execute Workflow" button (top right)
10. Click "Execute Node" on the Code node
11. Add some test code in the Code node:
```javascript
return { message: "Hello from n8n!" };
```
12. Click "Execute Node" again
13. You should see the output!

## Troubleshooting Common Issues

### Issue: "This page isn't working"
- **Cause**: Service is still starting up
- **Fix**: Wait 2-3 more minutes, then refresh

### Issue: Can't log in
- **Cause**: Wrong credentials
- **Fix**: Check your environment variables in Render Dashboard → Your Service → Environment

### Issue: "Webhook not working"
- **Cause**: WEBHOOK_URL or N8N_HOST not set correctly
- **Fix**: In Render Dashboard → Your Service → Environment, add:
  ```
  N8N_HOST=your-service-name.onrender.com
  WEBHOOK_URL=https://your-service-name.onrender.com/
  ```
  (Use YOUR actual service URL! No https:// prefix for N8N_HOST)

### Issue: "Database connection failed"
- **Cause**: Neon credentials incorrect or SSL issue
- **Fix**: 
  1. Double-check all Neon variables in Render:
     - `DB_POSTGRESDB_HOST`
     - `DB_POSTGRESDB_DATABASE`
     - `DB_POSTGRESDB_USER`
     - `DB_POSTGRESDB_PASSWORD`
     - `DB_POSTGRESDB_SSLMODE=require` (must be set!)
  2. Verify credentials in Neon dashboard
  3. Check Render logs for specific error messages

### Issue: Service goes to sleep
- **Cause**: Free tier limitation (15 minutes inactivity)
- **Fix**: Normal for free tier. Service wakes up on first request (may take 30 seconds)

## Next Steps

1. ✨ Create your first automation workflow
2. 📚 Explore n8n workflow templates: https://n8n.io/workflows/
3. 🔒 Review security best practices: https://docs.n8n.io/security/
4. 💾 Export workflows regularly as backup
5. 🗄️ Your Neon database is already set up and working!
6. 📖 Check `env.example` for all available environment variables

## Need Help?

- [n8n Documentation](https://docs.n8n.io)
- [Render Documentation](https://render.com/docs)
- [n8n Community](https://community.n8n.io)

Happy Automating! 🚀

