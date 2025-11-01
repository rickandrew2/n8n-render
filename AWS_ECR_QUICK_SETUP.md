# Quick AWS Setup - Using ECR (Faster Alternative)

If GitHub connection is taking too long, we can deploy from ECR instead!

## Steps:

### 1. Create ECR Repository
1. Go to AWS Console → Search "ECR" → Elastic Container Registry
2. Click "Repositories" → "Create repository"
3. **Repository name**: `n8n`
4. **Visibility**: Private
5. **Tag immutability**: Disable (optional)
6. **Scan on push**: Disable (optional, saves time)
7. Click "Create repository"

### 2. Get ECR Login Command
1. Click on your repository (`n8n`)
2. Click "View push commands" button
3. Copy the commands shown (you'll need them)

### 3. Build and Push Docker Image (Local Machine)
You'll need Docker Desktop running on your Windows machine.

**Option A: If you have AWS CLI installed:**
```powershell
# 1. Get ECR login token
aws ecr get-login-password --region ap-southeast-2 | docker login --username AWS --password-stdin 897545368156.dkr.ecr.ap-southeast-2.amazonaws.com

# 2. Build Docker image
docker build -t n8n .

# 3. Tag image
docker tag n8n:latest 897545368156.dkr.ecr.ap-southeast-2.amazonaws.com/n8n:latest

# 4. Push to ECR
docker push 897545368156.dkr.ecr.ap-southeast-2.amazonaws.com/n8n:latest
```

**Option B: Use ECR's provided commands:**
1. Go to ECR repository → "View push commands"
2. Run commands in PowerShell (they'll show you exact commands)

### 4. Deploy from ECR in App Runner
1. Go back to App Runner → "Create service"
2. Choose **"Container registry"** (not Source code)
3. **Container image URI**: 
   - Click "Browse" and select your `n8n` repository
   - Or paste: `897545368156.dkr.ecr.ap-southeast-2.amazonaws.com/n8n:latest`
4. **Tag**: `latest`
5. Continue with service configuration...

---

**This is faster because:**
- No GitHub connection needed
- Direct Docker image push
- Works immediately

**Note:** Your account ID: `897545368156` and region: `ap-southeast-2` (Sydney)


