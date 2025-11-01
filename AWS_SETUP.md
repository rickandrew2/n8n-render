# AWS n8n Deployment Guide

This guide will help you deploy n8n on AWS with its own PostgreSQL database.

## Prerequisites
- AWS Account with free credits
- AWS CLI installed (optional, but helpful)
- Docker image built and pushed to ECR (or use AWS App Runner)

## Option 1: AWS App Runner (Easiest - Similar to Render)

### Step 1: Set Up RDS PostgreSQL Database

1. Go to AWS Console → **RDS** → **Create Database**
2. Choose **PostgreSQL**
3. Select **Free tier** (if available) or **Dev/Test**
4. Settings:
   - **DB instance identifier**: `n8n-db` (or your choice)
   - **Master username**: `n8nuser` (or your choice)
   - **Master password**: Create a strong password (save it!)
   - **DB instance class**: `db.t3.micro` (free tier) or `db.t3.small`
   - **Storage**: 20 GB (free tier) or more
   - **Public access**: **Yes** (for App Runner to connect)
   - **VPC security group**: Create new or use existing
   - **Initial database name**: `n8n`

5. **Important Security Settings**:
   - Go to **VPC Security Groups** → Select your RDS security group
   - **Inbound Rules** → **Edit** → Add rule:
     - Type: PostgreSQL
     - Port: 5432
     - Source: Your App Runner security group or `0.0.0.0/0` (temporary, restrict later)

### Step 2: Deploy n8n with App Runner

1. Go to AWS Console → **App Runner** → **Create service**
2. Choose **Source code repository** or **Container image**
3. If using source code:
   - Connect to your GitHub repo
   - Build: Use `apprunner.yaml`
   - Deploy: Auto deploy on push

4. If using container image:
   - Push your Docker image to **ECR** (Elastic Container Registry)
   - Select the image from ECR

5. **Configure Environment Variables** in App Runner:
   ```
   # Authentication (set your own)
   N8N_BASIC_AUTH_USER=your_username
   N8N_BASIC_AUTH_PASSWORD=your_strong_password
   
   # Database Connection (from RDS)
   DB_POSTGRESDB_HOST=your-rds-endpoint.region.rds.amazonaws.com
   DB_POSTGRESDB_DATABASE=n8n
   DB_POSTGRESDB_USER=n8nuser
   DB_POSTGRESDB_PASSWORD=your_rds_password
   
   # Service URLs (set after deployment)
   N8N_HOST=https://your-app-runner-url.awsapprunner.com
   WEBHOOK_URL=https://your-app-runner-url.awsapprunner.com/
   ```

6. **Port Configuration**: Set to `5678`

7. Click **Create & Deploy**

### Step 3: Get Your RDS Endpoint

1. Go to RDS → **Databases** → Select your database
2. Copy the **Endpoint** (looks like: `n8n-db.xxxxx.region.rds.amazonaws.com`)
3. Update the `DB_POSTGRESDB_HOST` in App Runner environment variables

---

## Option 2: AWS ECS (More Control, More Complex)

### Step 1: Set Up RDS (Same as above)

### Step 2: Push Docker Image to ECR

```bash
# Create ECR repository
aws ecr create-repository --repository-name n8n --region your-region

# Get login token
aws ecr get-login-password --region your-region | docker login --username AWS --password-stdin your-account-id.dkr.ecr.your-region.amazonaws.com

# Tag and push
docker tag n8n:latest your-account-id.dkr.ecr.your-region.amazonaws.com/n8n:latest
docker push your-account-id.dkr.ecr.your-region.amazonaws.com/n8n:latest
```

### Step 3: Create ECS Task Definition

Create a task definition with:
- Container image: Your ECR image
- Port mappings: 5678 → 5678
- Environment variables: Same as App Runner above
- Task role: Allows ECS to connect to RDS

### Step 4: Create ECS Service

- Use Application Load Balancer (ALB)
- Target group: Port 5678
- Security groups: Allow 443/80 from internet, 5432 to RDS

---

## Option 3: EC2 (Full Control)

1. Launch EC2 instance (Ubuntu)
2. Install Docker
3. Run n8n container
4. Set up Application Load Balancer
5. Connect to RDS database

---

## Cost Comparison

### Render Free Tier:
- Service sleeps after inactivity
- Limited resources

### AWS Free Tier:
- **RDS**: 750 hours/month for 12 months (t2.micro)
- **App Runner**: Pay per use (very cheap)
- **EC2**: 750 hours/month for 12 months (t2.micro)
- After free tier: ~$15-30/month for small setup

---

## Quick Start: AWS App Runner (Recommended)

1. **Create RDS PostgreSQL** (15 minutes)
2. **Push code to GitHub** (already done)
3. **Create App Runner service** (10 minutes)
4. **Set environment variables** (5 minutes)
5. **Done!** (30 minutes total)

---

## Troubleshooting

### Can't connect to database?
- Check RDS security group allows App Runner IP
- Verify database endpoint and credentials
- Check VPC configuration

### App Runner deployment fails?
- Check Dockerfile is correct
- Verify build commands
- Check CloudWatch logs

### Database SSL errors?
- Set `DB_POSTGRESDB_SSLMODE=require`
- Set `DB_POSTGRESDB_SSL=true`

---

## Next Steps After Deployment

1. Set up **Route 53** for custom domain (optional)
2. Configure **CloudWatch** for monitoring
3. Set up **backup** for RDS database
4. Configure **auto-scaling** if needed

---

## Resources

- [AWS App Runner Docs](https://docs.aws.amazon.com/apprunner/)
- [RDS PostgreSQL Setup](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_GettingStarted.CreatingConnecting.PostgreSQL.html)
- [n8n Docker Documentation](https://docs.n8n.io/hosting/installation/docker/)

