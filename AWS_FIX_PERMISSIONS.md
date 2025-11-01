# Fix AWS Permissions for App Runner Setup

You're using IAM user `rick-cli-user` which needs additional permissions.

## Option 1: Add Required Permissions (Recommended)

### Step 1: Go to IAM Console
1. In AWS Console, search for **"IAM"**
2. Click on **"IAM"** service
3. Click **"Users"** in left sidebar
4. Click on **"rick-cli-user"**

### Step 2: Attach Policies
1. Click **"Add permissions"** button
2. Choose **"Attach policies directly"**
3. Search and attach these policies:
   - ✅ **PowerUserAccess** (gives most permissions except billing/account management)
   - ✅ **AmazonRDSFullAccess** (for RDS database)
   - ✅ **AmazonEC2ContainerRegistryFullAccess** (for ECR)
   - ✅ **AWSAppRunnerServicePolicy** (if available)
   - ✅ **AWSAppRunnerFullAccess** (for App Runner)

### Step 3: Create Custom Policy (If Needed)
If the above doesn't work, create a custom policy:

1. In IAM → **"Policies"** → **"Create policy"**
2. Choose **"JSON"** tab
3. Paste this policy:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "apprunner:*",
                "rds:*",
                "ecr:*",
                "ec2:Describe*",
                "ec2:CreateSecurityGroup",
                "ec2:AuthorizeSecurityGroupIngress",
                "ec2:RevokeSecurityGroupIngress",
                "iam:GetUser",
                "iam:GetAccountSummary",
                "billing:GetBillingData",
                "account:GetAccountInformation",
                "account:GetContactInformation"
            ],
            "Resource": "*"
        }
    ]
}
```
4. Name it: `n8n-deployment-policy`
5. Attach it to `rick-cli-user`

---

## Option 2: Use Root/Admin Account (Fastest)

If you have access to the root account:
1. Sign out of `rick-cli-user`
2. Sign in with root/admin account
3. This will have all permissions by default

---

## Option 3: Use AWS Organizations/Admin Account

If this is an organization account:
1. Contact your AWS administrator
2. Ask them to grant:
   - Full App Runner access
   - Full RDS access
   - Full ECR access
   - Basic billing read access

---

## Quick Check: What Permissions You Have Now

After adding permissions:
1. Sign out and sign back in
2. Try accessing App Runner again
3. Check if GitHub connection works

---

## Notes

The billing permission errors you saw are mostly informational and won't prevent you from:
- ✅ Creating RDS databases
- ✅ Creating App Runner services
- ✅ Pushing to ECR

But for full functionality, adding the permissions above is recommended.


