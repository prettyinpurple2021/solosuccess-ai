# 🚀 AWS Amplify Deployment Guide for SoloSuccess AI

This guide will help you deploy your SoloSuccess AI Platform to AWS Amplify with S3 file storage.

## 📋 Prerequisites

Before deploying, ensure you have:

1. **AWS Account**: Sign up at [aws.amazon.com](https://aws.amazon.com)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **Domain Name**: (Optional) For custom domain setup

## 🏗️ AWS Infrastructure Setup

### Step 1: Create S3 Bucket for File Storage

1. **Go to S3 Console:**
   - Navigate to [AWS S3 Console](https://console.aws.amazon.com/s3/)
   - Click "Create bucket"

2. **Configure Bucket:**
   ```
   Bucket name: solosuccess-ai-files-[random-suffix]
   Region: us-east-1 (or your preferred region)
   ```

3. **Set Public Access:**
   - Uncheck "Block all public access"
   - Check "I acknowledge that the current settings might result in this bucket and the objects within it becoming public"

4. **Configure CORS Policy:**
   - Go to Permissions tab
   - Add CORS configuration:
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
       "AllowedOrigins": ["*"],
       "ExposeHeaders": []
     }
   ]
   ```

### Step 2: Create IAM User for S3 Access

1. **Go to IAM Console:**
   - Navigate to [AWS IAM Console](https://console.aws.amazon.com/iam/)
   - Click "Users" > "Create user"

2. **Configure User:**
   ```
   User name: solosuccess-ai-s3-user
   Access type: Programmatic access
   ```

3. **Attach Policy:**
   - Create custom policy with this JSON:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "s3:GetObject",
           "s3:PutObject",
           "s3:DeleteObject",
           "s3:PutObjectAcl"
         ],
         "Resource": "arn:aws:s3:::your-bucket-name/*"
       },
       {
         "Effect": "Allow",
         "Action": [
           "s3:ListBucket"
         ],
         "Resource": "arn:aws:s3:::your-bucket-name"
       }
     ]
   }
   ```

4. **Save Credentials:**
   - Download or copy the Access Key ID and Secret Access Key
   - You'll need these for environment variables

## 🚀 AWS Amplify Deployment

### Step 1: Connect Repository

1. **Go to Amplify Console:**
   - Navigate to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
   - Click "New app" > "Host web app"

2. **Connect GitHub:**
   - Select "GitHub" as source
   - Authorize AWS Amplify to access your GitHub
   - Select your repository
   - Choose the main branch

3. **Build Settings:**
   - Amplify will auto-detect Next.js from `amplify.yml`
   - Review and confirm the build settings

### Step 2: Configure Environment Variables

1. **Go to App Settings:**
   - Click on your app
   - Go to "App settings" > "Environment variables"

2. **Add Required Variables:**
   ```bash
   # Database Configuration
   DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
   JWT_SECRET=your_secure_jwt_secret_key_at_least_32_characters_long
   
   # App Configuration
   NEXT_PUBLIC_APP_URL=https://your-app.amplifyapp.com
   NODE_ENV=production
   
   # AWS Configuration
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your_aws_access_key_id
   AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
   AWS_S3_BUCKET_NAME=your-s3-bucket-name
   
   # AI Services
   OPENAI_API_KEY=sk-your_openai_api_key_here
   
   # Optional Services
   RESEND_API_KEY=your_resend_api_key
   FROM_EMAIL=noreply@yourdomain.com
   ```

### Step 3: Deploy

1. **Start Deployment:**
   - Click "Save and deploy"
   - Amplify will build and deploy your app

2. **Monitor Build:**
   - Watch the build logs for any errors
   - Build typically takes 5-10 minutes

3. **Access Your App:**
   - Once deployed, you'll get a URL like: `https://main.d1234567890.amplifyapp.com`

## 🌐 Custom Domain Setup (Optional)

### Step 1: Add Domain in Amplify

1. **Go to Domain Management:**
   - In your Amplify app, go to "Domain management"
   - Click "Add domain"

2. **Configure Domain:**
   - Enter your domain name
   - Choose subdomain (www or root)
   - Amplify will provide DNS records

### Step 2: Update DNS Records

1. **Go to Your DNS Provider:**
   - Add the CNAME record provided by Amplify
   - Wait for DNS propagation (up to 48 hours)

2. **SSL Certificate:**
   - Amplify automatically provisions SSL certificates
   - HTTPS will be enabled once DNS propagates

## 🔧 Configuration Files

Your app now includes these AWS Amplify configuration files:

### `amplify.yml`
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - echo "Installing dependencies..."
        - npm install --legacy-peer-deps
    build:
      commands:
        - echo "Building the app..."
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

### `.amplifyrc`
```json
{
  "version": 1,
  "frontend": {
    "framework": "nextjs",
    "config": {
      "SourceDir": ".",
      "DistributionDir": ".next",
      "BuildCommand": "npm run build",
      "StartCommand": "npm start"
    }
  }
}
```

## 📊 Monitoring and Analytics

### Built-in Amplify Features

1. **Access Logs:**
   - View real-time access logs in Amplify Console
   - Monitor performance and errors

2. **Build History:**
   - Track all deployments and builds
   - View build logs for debugging

3. **Performance Monitoring:**
   - Core Web Vitals tracking
   - Performance insights

### Optional Integrations

1. **AWS CloudWatch:**
   - Detailed application metrics
   - Custom dashboards

2. **Sentry:**
   - Error tracking and monitoring
   - Already configured in your app

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures:**
   ```bash
   # Check build logs in Amplify Console
   # Common fixes:
   - Verify all environment variables are set
   - Check Node.js version compatibility
   - Ensure all dependencies are in package.json
   ```

2. **S3 Access Issues:**
   ```bash
   # Verify IAM permissions
   # Check bucket name and region
   # Ensure CORS policy is configured
   ```

3. **Database Connection Issues:**
   ```bash
   # Verify DATABASE_URL format
   # Check Neon database is accessible
   # Ensure SSL mode is enabled
   ```

### Getting Help

- **AWS Amplify Documentation**: [docs.amplify.aws](https://docs.amplify.aws/)
- **AWS Support**: Available with paid support plans
- **Community Forums**: [AWS Amplify GitHub](https://github.com/aws-amplify/amplify-js)

## 💰 Cost Considerations

### AWS Amplify Pricing

- **Free Tier**: 1,000 build minutes/month, 5GB storage
- **Pay-as-you-go**: $0.01 per build minute, $0.15/GB storage
- **Custom Domain**: $0.50/month per domain

### S3 Pricing

- **Storage**: $0.023/GB/month (first 50TB)
- **Requests**: $0.0004 per 1,000 PUT requests
- **Data Transfer**: Free for first 1GB/month

## 🎉 Post-Deployment Checklist

### ✅ Verify Deployment

- [ ] App loads correctly at Amplify URL
- [ ] User registration and login work
- [ ] File upload/download functionality works
- [ ] AI features are operational
- [ ] Database connections are stable
- [ ] SSL certificate is active (if using custom domain)

### ✅ Performance Optimization

- [ ] Enable CloudFront CDN (automatic with Amplify)
- [ ] Configure caching headers
- [ ] Monitor Core Web Vitals
- [ ] Set up error monitoring

### ✅ Security

- [ ] Environment variables are secure
- [ ] S3 bucket permissions are properly configured
- [ ] HTTPS is enforced
- [ ] CORS policy is restrictive enough

---

## 🆘 Need Help?

If you encounter any issues during deployment:

1. **Check the build logs** in AWS Amplify Console
2. **Verify environment variables** are set correctly
3. **Test locally** with production settings first
4. **Review this guide** for common solutions

**Your SoloSuccess AI platform is now ready for production on AWS Amplify! 🚀**
