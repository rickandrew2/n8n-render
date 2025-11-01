# Self-Hosting n8n on Render

This repository contains the configuration files to deploy n8n (a powerful workflow automation tool) on Render's platform.

## 📋 Prerequisites

- A [Render account](https://render.com) (free tier available)
- A GitHub account to connect your repository
- Basic knowledge of environment variables

## 🚀 Quick Start

### Step 1: Prepare Your Repository

1. Push this code to a GitHub repository
2. Fork or clone this repository to your GitHub account

### Step 2: Deploy on Render

#### Option A: Using render.yaml (Recommended)

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** and select **"Blueprint"**
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` file
5. Review and deploy

#### Option B: Manual Deployment

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** and select **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `n8n-automation` (or your preferred name)
   - **Environment**: Docker
   - **Dockerfile Path**: `./Dockerfile`
   - **Plan**: Free
   - **Health Check Path**: `/`

### Step 3: Set Environment Variables

In your Render service settings, go to **Environment** and add variables. See `.env.example` for a complete list.

#### Required Variables:

**Authentication:**
```
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=your_username
N8N_BASIC_AUTH_PASSWORD=your_secure_password
```

**Neon Database:**
```
DB_TYPE=postgresdb
DB_POSTGRESDB_HOST=your-neon-host
DB_POSTGRESDB_DATABASE=neondb
DB_POSTGRESDB_USER=neondb_owner
DB_POSTGRESDB_PASSWORD=your-neon-password
DB_POSTGRESDB_SSLMODE=require
```

**Service URLs** (set after deployment):
```
N8N_HOST=your-service-name.onrender.com
WEBHOOK_URL=https://your-service-name.onrender.com/
```

#### Recommended Variables:

```
N8N_ENCRYPTION_KEY=your_32_character_encryption_key  # Generate with: openssl rand -hex 16
```

**Important**: 
- Mark ALL passwords and keys as "Secret" in Render (they'll be hidden)
- Copy values from `.env.example` and customize them
- `WEBHOOK_URL` and `N8N_HOST` should match your actual Render service URL

### Step 4: Wait for Deployment

- First deployment typically takes 5-10 minutes
- Render will build the Docker image and start n8n
- You'll receive a URL like: `https://n8n-automation.onrender.com`

### Step 5: Access n8n

1. Visit your Render service URL
2. Log in with your `N8N_BASIC_AUTH_USER` and `N8N_BASIC_AUTH_PASSWORD`
3. Start creating workflows!

## 🔧 Configuration Details

### What's in this setup?

- **Dockerfile**: Uses the official n8n Docker image
- **render.yaml**: Blueprint for automated deployment
- **README.md**: This file!

### Database (Required - Neon PostgreSQL)

This setup uses **Neon** (free PostgreSQL cloud service) instead of Render's database.

#### Step 1: Create Neon Database
1. Go to [Neon Console](https://console.neon.tech) and sign up
2. Create a new project (name it `n8n-db` or similar)
3. Note your connection details:
   - Host (e.g., `ep-xxxxx.ap-southeast-1.aws.neon.tech`)
   - Database name (usually `neondb`)
   - Username (usually `neondb_owner`)
   - Password (copy from Neon dashboard)

#### Step 2: Add Database Variables in Render
In Render Dashboard → Your Service → Environment, add:

```
DB_TYPE=postgresdb
DB_POSTGRESDB_HOST=your-neon-host-here
DB_POSTGRESDB_PORT=5432
DB_POSTGRESDB_DATABASE=neondb
DB_POSTGRESDB_USER=neondb_owner
DB_POSTGRESDB_PASSWORD=your-neon-password
DB_POSTGRESDB_SSLMODE=require
```

⚠️ **Important**: Mark `DB_POSTGRESDB_PASSWORD` as a **Secret** in Render!

#### Step 3: Verify Connection
After deployment, n8n will automatically create required tables in your Neon database.

### Free Tier Limitations

- **Sleep**: Free services sleep after 15 minutes of inactivity (wakes up on next request)
- **Compute**: May be slower than paid tiers
- **Database**: Free tier includes 1GB PostgreSQL database

## 📝 Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `N8N_BASIC_AUTH_ACTIVE` | Enable authentication | Yes |
| `N8N_BASIC_AUTH_USER` | Username for login | Yes |
| `N8N_BASIC_AUTH_PASSWORD` | Password for login | Yes |
| `N8N_HOST` | Host to bind to | Yes |
| `N8N_PORT` | Port to use | Yes |
| `N8N_PROTOCOL` | Protocol (http/https) | Yes |
| `N8N_ENCRYPTION_KEY` | For encrypting credentials | Recommended |
| `WEBHOOK_URL` | Your service URL | Auto-set |

## 🔐 Security Notes

1. **Always** set `N8N_BASIC_AUTH_ACTIVE=true` for public deployments
2. Use a **strong password** for `N8N_BASIC_AUTH_PASSWORD`
3. Consider adding `N8N_ENCRYPTION_KEY` for additional security
4. Review n8n's [security documentation](https://docs.n8n.io/security/) regularly

## 🐛 Troubleshooting

### Service won't start
- Check Render logs: Go to your service → Logs tab
- Verify all required environment variables are set
- Ensure Dockerfile is in the correct location

### Can't access webhook URLs
- Verify `WEBHOOK_URL` is set correctly to your Render URL
- Check that `N8N_PROTOCOL=https` (Render uses HTTPS)

### Authentication issues
- Make sure both `N8N_BASIC_AUTH_USER` and `N8N_BASIC_AUTH_PASSWORD` are set
- Check they're not empty or contain only spaces

## 📚 Additional Resources

- [n8n Documentation](https://docs.n8n.io)
- [Render Documentation](https://render.com/docs)
- [n8n Workflow Library](https://n8n.io/workflows/)

## 💡 Tips

1. **Keep it updated**: Regularly pull the latest n8n Docker image
2. **Backup workflows**: Export your workflows regularly
3. **Use database**: For production, enable PostgreSQL for persistence
4. **Monitor usage**: Check Render metrics to stay within free tier limits

## 🤝 Contributing

Feel free to submit issues or pull requests to improve this deployment setup!

## 📄 License

This configuration is provided as-is for educational purposes.

---

**Happy Automating!** 🎉

