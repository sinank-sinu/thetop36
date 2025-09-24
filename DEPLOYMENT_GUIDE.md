# 🚀 TheTop36 Deployment Guide

## 🔧 **ENVIRONMENT VARIABLE UPDATED**

**Changed**: `VERCEL_CRON_SECRET` → `CRON_JOB_SECRET`
**Reason**: Better compatibility with different hosting platforms

---

## 📋 **REQUIRED ENVIRONMENT VARIABLES**

```bash
# ===========================================
# STRIPE CONFIGURATION
# ===========================================
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
NEXT_PUBLIC_STRIPE_MODE=test
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
STRIPE_PRICE_ID=price_your_price_id_here
STRIPE_MODE=test

# ===========================================
# DATABASE CONFIGURATION
# ===========================================
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/thetop36

# ===========================================
# AUTHENTICATION
# ===========================================
JWT_SECRET=your-super-secret-jwt-key-here

# ===========================================
# CRON JOB SECURITY (UPDATED)
# ===========================================
CRON_JOB_SECRET=EFD37wvuMA5CIo0W8Dh3Vz4INUymZDO5N5fyK3jyv8g=

# ===========================================
# SITE CONFIGURATION
# ===========================================
SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

---

## 🌐 **HOSTING PLATFORM OPTIONS**

### **1. Vercel (Recommended for Next.js)**

#### **Setup:**
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

#### **Environment Variables in Vercel:**
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-jwt-secret
CRON_JOB_SECRET=EFD37wvuMA5CIo0W8Dh3Vz4INUymZDO5N5fyK3jyv8g=
SITE_URL=https://your-app.vercel.app
```

#### **Cron Job Setup:**
- Vercel automatically handles cron jobs via `vercel.json`
- No additional setup needed

---

### **2. Netlify**

#### **Setup:**
1. Connect GitHub repository
2. Set environment variables in Netlify dashboard
3. Configure build settings

#### **Build Settings:**
```bash
Build command: npm run build
Publish directory: .next
```

#### **Environment Variables:**
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-jwt-secret
CRON_JOB_SECRET=EFD37wvuMA5CIo0W8Dh3Vz4INUymZDO5N5fyK3jyv8g=
SITE_URL=https://your-app.netlify.app
```

#### **Cron Job Setup:**
- Use external cron service (cron-job.org, EasyCron)
- Set URL: `https://your-app.netlify.app/api/draw/run`
- Headers: `x-cron-secret: EFD37wvuMA5CIo0W8Dh3Vz4INUymZDO5N5fyK3jyv8g=`

---

### **3. Railway**

#### **Setup:**
1. Connect GitHub repository
2. Set environment variables in Railway dashboard
3. Deploy automatically

#### **Environment Variables:**
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-jwt-secret
CRON_JOB_SECRET=EFD37wvuMA5CIo0W8Dh3Vz4INUymZDO5N5fyK3jyv8g=
SITE_URL=https://your-app.railway.app
```

#### **Cron Job Setup:**
- Use external cron service
- Set URL: `https://your-app.railway.app/api/draw/run`

---

### **4. DigitalOcean App Platform**

#### **Setup:**
1. Connect GitHub repository
2. Set environment variables in DigitalOcean dashboard
3. Configure app spec

#### **App Spec:**
```yaml
name: thetop36
services:
- name: web
  source_dir: /
  github:
    repo: your-username/thetop36
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: STRIPE_SECRET_KEY
    value: sk_test_...
  - key: MONGODB_URI
    value: mongodb+srv://...
  - key: CRON_JOB_SECRET
    value: EFD37wvuMA5CIo0W8Dh3Vz4INUymZDO5N5fyK3jyv8g=
```

---

### **5. AWS Amplify**

#### **Setup:**
1. Connect GitHub repository
2. Set environment variables in Amplify console
3. Configure build settings

#### **Build Settings:**
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install
    build:
      commands:
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

---

## ⏰ **CRON JOB SETUP FOR NON-VERCEL HOSTING**

### **External Cron Services:**

#### **1. cron-job.org**
- URL: `https://yourdomain.com/api/draw/run`
- Method: POST
- Headers: `x-cron-secret: EFD37wvuMA5CIo0W8Dh3Vz4INUymZDO5N5fyK3jyv8g=`
- Schedule: `0 12 * * *` (Daily at 12:00 PM UTC)

#### **2. EasyCron**
- URL: `https://yourdomain.com/api/draw/run`
- Method: POST
- Headers: `x-cron-secret: EFD37wvuMA5CIo0W8Dh3Vz4INUymZDO5N5fyK3jyv8g=`
- Schedule: Daily at 12:00 PM UTC

#### **3. SetCronJob**
- URL: `https://yourdomain.com/api/draw/run`
- Method: POST
- Headers: `x-cron-secret: EFD37wvuMA5CIo0W8Dh3Vz4INUymZDO5N5fyK3jyv8g=`
- Schedule: Daily at 12:00 PM UTC

---

## 🔧 **MANUAL CRON JOB TESTING**

### **Test Cron Job:**
```bash
curl -X POST "https://yourdomain.com/api/draw/run" \
  -H "x-cron-secret: EFD37wvuMA5CIo0W8Dh3Vz4INUymZDO5N5fyK3jyv8g="
```

### **Expected Response:**
```json
{
  "ok": true,
  "winner": {
    "email": "user@example.com",
    "prize": "Daily Micro Prize",
    "drawDate": "2025-01-24T12:00:00.000Z",
    "tickets": 1
  },
  "stats": {
    "totalTickets": 5,
    "totalUsers": 3
  }
}
```

---

## 🎯 **DEPLOYMENT CHECKLIST**

### **Pre-Deployment:**
- [ ] Update environment variables
- [ ] Test locally with production settings
- [ ] Verify Stripe webhook configuration
- [ ] Test cron job endpoint
- [ ] Check database connection

### **Post-Deployment:**
- [ ] Verify site loads correctly
- [ ] Test payment flow
- [ ] Check real-time updates
- [ ] Verify cron job execution
- [ ] Test referral system
- [ ] Check winner selection

### **Production Setup:**
- [ ] Set up Stripe webhook endpoint
- [ ] Configure cron job service
- [ ] Set up monitoring
- [ ] Configure domain and SSL
- [ ] Set up backup strategy

---

## 🚀 **QUICK DEPLOYMENT COMMANDS**

### **Vercel:**
```bash
npm install -g vercel
vercel login
vercel --prod
```

### **Netlify:**
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

### **Railway:**
```bash
npm install -g @railway/cli
railway login
railway deploy
```

---

## ✅ **FINAL NOTES**

1. **Environment Variable**: Changed from `VERCEL_CRON_SECRET` to `CRON_JOB_SECRET`
2. **Cron Job**: Works with any hosting platform using external cron services
3. **Security**: Keep your `CRON_JOB_SECRET` secure and don't commit it to Git
4. **Testing**: Always test the cron job endpoint after deployment
5. **Monitoring**: Set up monitoring for cron job execution

**Your TheTop36 app is now ready for deployment on any hosting platform! 🎉**
