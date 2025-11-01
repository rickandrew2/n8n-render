# AWS n8n Setup - Step by Step Guide

Follow these steps in order to deploy n8n on AWS with its own database.

---

## Step 1: Create RDS PostgreSQL Database ⏱️ (~15 minutes)

### 1.1 Go to AWS RDS Console
1. Log in to AWS Console: https://console.aws.amazon.com
2. Search for **"RDS"** in the top search bar
3. Click on **"RDS"** service

### 1.2 Create Database
1. Click **"Create database"** button (orange button on the right)
2. Choose configuration method: **"Standard create"**

### 1.3 Database Configuration
**Engine options:**
- Select **PostgreSQL**
- Engine version: Choose latest (e.g., PostgreSQL 16.x or 15.x)

**Templates:**
- For free tier: Select **"Free tier"** (if available)
- Otherwise: Select **"Dev/Test"**

**Settings:**
- **DB instance identifier**: `n8n-db` (you can change this)
- **Master username**: `n8nuser` (save this!)
- **Master password**: 
  - Click "Auto generate a password" OR
  - Create your own strong password (save it!)
  - 📝 **SAVE THE PASSWORD - You'll need it later!**

**Instance configuration:**
- **DB instance class**: 
  - Free tier: `db.t3.micro` (or `db.t2.micro` if available)
  - With credits: `db.t3.small` (faster)

**Storage:**
- Storage type: `General Purpose SSD (gp3)`
- Allocated storage: `20 GB` (free tier) or more
- ✅ **Disable** "Enable storage autoscaling" (to save money)

**Connectivity:**
- **Virtual Private Cloud (VPC)**: Default VPC (or create new)
- **Subnet group**: default (auto-created)
- **Public access**: **Yes** (required for App Runner to connect)
- **VPC security group**: 
  - Choose **"Create new"**
  - Security group name: `n8n-rds-sg` (or your choice)

**Database authentication:**
- Choose **"Password authentication"** (default)

**Additional configuration (optional):**
- **Initial database name**: `n8n` (important!)
- ✅ **Disable** "Enable automated backups" (to save money initially)
  - ⚠️ **Note**: You can enable this later for production

### 1.4 Create Database
1. Click **"Create database"** button at bottom
2. Wait ~5-10 minutes for database to be created
3. ⏳ **While waiting**, proceed to Step 2

### 1.5 Save Database Endpoint
Once database status shows **"Available"**:
1. Click on your database (`n8n-db`)
2. Copy the **Endpoint** (looks like: `n8n-db.xxxxx.us-east-1.rds.amazonaws.com`)
3. 📝 **Save this** - you'll need it for App Runner!

---

## Step 2: Configure RDS Security Group ⏱️ (~5 minutes)

### 2.1 Find Your Security Group
1. In RDS console, click on your database
2. Scroll down to **"Connectivity & security"** tab
3. Find **"VPC security groups"** section
4. Click on the security group link (e.g., `sg-xxxxx`)

### 2.2 Add Inbound Rule
1. Click **"Edit inbound rules"** button
2. Click **"Add rule"**
3. Configure:
   - **Type**: PostgreSQL
   - **Protocol**: TCP
   - **Port**: 5432
   - **Source**: 
     - Option 1: `0.0.0.0/0` (allows from anywhere - less secure but works)
     - Option 2: Your App Runner VPC (more secure - we'll do this after creating App Runner)
4. **Description**: "Allow App Runner to connect"
5. Click **"Save rules"**

---

## Step 3: Choose Deployment Method

You have 2 options:

### Option A: Deploy from GitHub (Easiest) ✅ Recommended
- App Runner connects to your GitHub repo
- Auto-deploys when you push code
- Uses your existing Dockerfile

### Option B: Deploy from ECR Container Registry
- Push Docker image to ECR first
- More steps but more control

**We'll use Option A** (GitHub) since it's easier!

---

## Step 4: Connect GitHub to AWS (First Time Only) ⏱️ (~5 minutes)

### 4.1 If You Haven't Connected GitHub Yet:
1. Go to **AWS App Runner** console
2. When creating service, it will ask to connect GitHub
3. Click **"Connect to GitHub"**
4. Authorize AWS App Runner to access your repositories
5. Select the repository: `rickandrew2/n8n-render`

---

## Step 5: Create App Runner Service ⏱️ (~15 minutes)

### 5.1 Go to App Runner Console
1. Search for **"App Runner"** in AWS Console
2. Click on **"App Runner"** service
3. Click **"Create service"** button

### 5.2 Configure Source
**Source:**
- Select **"Source code repository"**
- **Connect to GitHub** (or select existing connection)
- **Repository**: Select `rickandrew2/n8n-render`
- **Branch**: `main`
- **Deployment trigger**: **"Automatic"** (deploys on push)

**Build settings:**
- **Configuration file**: **"Use a configuration file"**
- **Configuration file location**: `apprunner.yaml` (we created this)
- OR choose **"Auto"** and App Runner will detect Dockerfile

### 5.3 Configure Service
**Service name**: `n8n-aws` (or your choice)

**Virtual CPU & Memory:**
- **CPU**: 0.25 vCPU (free tier / cheapest)
- **Memory**: 0.5 GB (minimum)
- Or upgrade: 1 vCPU / 2 GB (if you have credits)

**Port**: `5678` (n8n's default port)

**Encryption**: Leave default

### 5.4 Configure Environment Variables
Click **"Configure environment variables"** or expand the section.

**Add these variables one by one:**

```
# Server Configuration
N8N_PORT = 5678
N8N_PROTOCOL = https
N8N_LISTEN_ADDRESS = 0.0.0.0

# n8n Settings
N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS = true
N8N_RUNNERS_ENABLED = true
GENERIC_TIMEZONE = Asia/Manila
TZ = Asia/Manila

# Authentication (set your own values)
N8N_BASIC_AUTH_ACTIVE = true
N8N_BASIC_AUTH_USER = your_username
N8N_BASIC_AUTH_PASSWORD = your_strong_password

# Database Configuration (from RDS - Step 1)
DB_TYPE = postgresdb
DB_POSTGRESDB_HOST = [PASTE YOUR RDS ENDPOINT HERE]
DB_POSTGRESDB_PORT = 5432
DB_POSTGRESDB_DATABASE = n8n
DB_POSTGRESDB_USER = n8nuser
DB_POSTGRESDB_PASSWORD = [YOUR RDS PASSWORD FROM STEP 1]
DB_POSTGRESDB_SSLMODE = require
DB_POSTGRESDB_SSL = true
DB_POSTGRESDB_SSL_REJECT_UNAUTHORIZED = false
```

**Important:**
- Replace `[PASTE YOUR RDS ENDPOINT HERE]` with your actual RDS endpoint
- Replace `[YOUR RDS PASSWORD FROM STEP 1]` with your RDS password
- Replace `your_username` and `your_strong_password` with your own values

### 5.5 Health Check (Optional)
- **Health check path**: Leave empty (or use `/rest/healthz` if needed)
- **Health check interval**: 10 seconds
- **Timeout**: 5 seconds
- **Healthy threshold**: 1
- **Unhealthy threshold**: 5

### 5.6 Create Service
1. Review your configuration
2. Click **"Create & deploy"**
3. ⏳ Wait ~10-15 minutes for first deployment

---

## Step 6: Get App Runner URL and Update Service URLs ⏱️ (~5 minutes)

### 6.1 Get App Runner URL
Once deployment completes:
1. In App Runner console, click on your service
2. Find **"Default domain"** (looks like: `xxxxx.us-east-1.awsapprunner.com`)
3. 📝 Copy this URL

### 6.2 Update Environment Variables
1. Click **"Configuration"** tab
2. Click **"Edit"** next to environment variables
3. Add/Update these:
   ```
   N8N_HOST = https://xxxxx.us-east-1.awsapprunner.com
   WEBHOOK_URL = https://xxxxx.us-east-1.awsapprunner.com/
   ```
4. Replace `xxxxx.us-east-1.awsapprunner.com` with your actual App Runner URL
5. Save and redeploy (auto-deploys)

---

## Step 7: Update Security Group (Secure It) ⏱️ (~5 minutes)

Now that App Runner is running, we should restrict RDS access:

### 7.1 Get App Runner VPC
1. In App Runner console → Your service → **"Networking"** tab
2. Note the VPC information

### 7.2 Update RDS Security Group (Optional but Recommended)
1. Go back to RDS Security Group
2. Edit inbound rules
3. Change source from `0.0.0.0/0` to App Runner's VPC or security group
4. Save rules

---

## Step 8: Test Your Deployment ⏱️ (~2 minutes)

1. Wait for App Runner deployment to complete (check status)
2. Visit your App Runner URL: `https://xxxxx.us-east-1.awsapprunner.com`
3. You should see n8n login page
4. Login with your `N8N_BASIC_AUTH_USER` and `N8N_BASIC_AUTH_PASSWORD`
5. Create a test workflow to verify database is working

---

## Troubleshooting

### Can't connect to database?
- ✅ Check RDS security group allows port 5432
- ✅ Verify database endpoint is correct (no `:5432` at the end)
- ✅ Check password is correct
- ✅ Verify database status is "Available"

### App Runner deployment fails?
- ✅ Check CloudWatch logs (App Runner → Logs)
- ✅ Verify Dockerfile is correct
- ✅ Check environment variables are set correctly

### Database SSL errors?
- ✅ Set `DB_POSTGRESDB_SSLMODE=require`
- ✅ Set `DB_POSTGRESDB_SSL=true`
- ✅ Set `DB_POSTGRESDB_SSL_REJECT_UNAUTHORIZED=false`

---

## Cost Estimate (Using Free Tier)

**First 12 Months (Free Tier):**
- RDS: **FREE** (750 hours/month of db.t3.micro)
- App Runner: **~$0.50-2/month** (very cheap for small usage)
- **Total: ~$1-3/month** with credits

**After Free Tier:**
- RDS db.t3.micro: ~$15/month
- App Runner: ~$10-20/month (depending on usage)
- **Total: ~$25-35/month**

---

## Success! 🎉

Once everything is working:
- ✅ n8n running on AWS App Runner
- ✅ Database on AWS RDS
- ✅ Workflows persist in database
- ✅ Compare with Render deployment

---

## Next Steps

1. Test creating workflows
2. Monitor in CloudWatch
3. Set up auto-scaling if needed
4. Configure custom domain (optional)
5. Set up RDS backups for production

---

## Need Help?

If you get stuck at any step, let me know which step and I'll help troubleshoot!

