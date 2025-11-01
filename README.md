# n8n on Render

Deploy n8n workflow automation on Render using Docker.

## Quick Setup

1. **Deploy on Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will auto-detect `render.yaml`

2. **Set Environment Variables in Render Dashboard**
   
   **Required:**
   - `N8N_BASIC_AUTH_USER` - Your username
   - `N8N_BASIC_AUTH_PASSWORD` - Your password (mark as Secret)
   - `N8N_HOST` - Your service URL (e.g., `n8n-xxxxx.onrender.com`)
   - `WEBHOOK_URL` - Full URL (e.g., `https://n8n-xxxxx.onrender.com/`)
   - `DB_POSTGRESDB_HOST` - Your Neon database host
   - `DB_POSTGRESDB_DATABASE` - Your database name
   - `DB_POSTGRESDB_USER` - Your database user
   - `DB_POSTGRESDB_PASSWORD` - Your database password (mark as Secret)

3. **Access n8n**
   - Visit your Render service URL
   - Log in with your credentials

## Database

This setup uses Neon PostgreSQL. Create a database at [Neon Console](https://console.neon.tech) and use those connection details in Render.

