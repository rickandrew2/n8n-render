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

### Step 3.3: Add Required Secrets
Scroll down to "Environment Variables" section and add these:

1. **N8N_BASIC_AUTH_USER**
   - Click "Add Environment Variable"
   - Key: `N8N_BASIC_AUTH_USER`
   - Value: Choose a username (e.g., `admin`)
   - ✅ Check "Secret" checkbox

2. **N8N_BASIC_AUTH_PASSWORD**
   - Click "Add Environment Variable" again
   - Key: `N8N_BASIC_AUTH_PASSWORD`
   - Value: Create a STRONG password (mix of letters, numbers, symbols)
   - ✅ Check "Secret" checkbox
   - **⚠️ SAVE THIS PASSWORD SOMEWHERE SAFE!**

3. **N8N_ENCRYPTION_KEY** (Recommended)
   - Click "Add Environment Variable"
   - Key: `N8N_ENCRYPTION_KEY`
   - Value: Generate a random 32-character string
   - You can use: `openssl rand -hex 16` or any online generator
   - ✅ Check "Secret" checkbox

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

### Step 4.2: Access n8n
1. Open your URL in a browser
2. You'll see a login page
3. Enter your `N8N_BASIC_AUTH_USER` and `N8N_BASIC_AUTH_PASSWORD`
4. Click "Log In"

🎉 **Congratulations!** You should now see the n8n interface!

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
- **Cause**: WEBHOOK_URL not set correctly
- **Fix**: In Render Dashboard → Your Service → Environment, add:
  ```
  WEBHOOK_URL=https://n8n-automation.onrender.com/
  ```
  (Use YOUR actual service URL!)

### Issue: Service goes to sleep
- **Cause**: Free tier limitation (15 minutes inactivity)
- **Fix**: Normal for free tier. Service wakes up on first request (may take 30 seconds)

## Next Steps

1. ✨ Create your first automation workflow
2. 📚 Explore n8n workflow templates: https://n8n.io/workflows/
3. 🔒 Review security best practices: https://docs.n8n.io/security/
4. 💾 Export workflows regularly as backup
5. 🗄️ Consider enabling PostgreSQL for production (see README.md)

## Need Help?

- [n8n Documentation](https://docs.n8n.io)
- [Render Documentation](https://render.com/docs)
- [n8n Community](https://community.n8n.io)

Happy Automating! 🚀

