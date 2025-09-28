# ⚙️ Environment Configuration Guide

## Complete .env.local Setup for EduConnect

### **📋 Overview**
This guide covers all environment variables needed for EduConnect to run properly.

---

## **1. Complete .env.local File**

### **Create `.env.local` in project root:**

```env
# NextAuth.js Configuration
AUTH_SECRET=a1b2c3d4e5f6789012345678901234567890abcdef123456789012345678901234
AUTH_TRUST_HOST=true
NEXTAUTH_URL=http://localhost:3000

# MongoDB Configuration
MONGODB_CONNECTION_STRING=mongodb://localhost:27017/edu-connect
ENVIRONMENT=edu-connect

# Social Login Providers
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-google-client-secret

GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51SBKcWCW106sG8un...
STRIPE_SECRET_KEY=sk_test_51SBKcWCW106sG8un...
STRIPE_WEBHOOK_SECRET=whsec_webhook_secret_from_cli
```

---

## **2. Variable Explanations**

### **Authentication Variables:**

| Variable | Purpose | Required | Example |
|----------|---------|----------|---------|
| `AUTH_SECRET` | JWT signing secret | ✅ Yes | Random 64-char string |
| `AUTH_TRUST_HOST` | Trust host header | ✅ Yes | `true` |
| `NEXTAUTH_URL` | Base URL for auth | ✅ Yes | `http://localhost:3000` |

### **Database Variables:**

| Variable | Purpose | Required | Example |
|----------|---------|----------|---------|
| `MONGODB_CONNECTION_STRING` | MongoDB connection | ✅ Yes | `mongodb://localhost:27017/edu-connect` |
| `ENVIRONMENT` | Environment name | ❌ No | `edu-connect` |

### **OAuth Variables:**

| Variable | Purpose | Required | Where to Get |
|----------|---------|----------|--------------|
| `GOOGLE_CLIENT_ID` | Google OAuth ID | ✅ Yes | Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | ✅ Yes | Google Cloud Console |
| `GITHUB_ID` | GitHub OAuth ID | ✅ Yes | GitHub Developer Settings |
| `GITHUB_SECRET` | GitHub OAuth secret | ✅ Yes | GitHub Developer Settings |

### **Stripe Variables:**

| Variable | Purpose | Required | Where to Get |
|----------|---------|----------|--------------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Client-side Stripe key | ✅ Yes | Stripe Dashboard |
| `STRIPE_SECRET_KEY` | Server-side Stripe key | ✅ Yes | Stripe Dashboard |
| `STRIPE_WEBHOOK_SECRET` | Webhook signature secret | ✅ Yes | Stripe CLI |

---

## **3. How to Generate Values**

### **AUTH_SECRET Generation:**
```bash
# Option 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 2: Using OpenSSL
openssl rand -hex 32

# Option 3: Online generator
# Visit: https://generate-secret.vercel.app/32
```

### **MongoDB Connection String:**

**Local MongoDB:**
```env
MONGODB_CONNECTION_STRING=mongodb://localhost:27017/edu-connect
```

**MongoDB Atlas (Cloud):**
```env
MONGODB_CONNECTION_STRING=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/edu-connect?retryWrites=true&w=majority
```

---

## **4. Getting OAuth Credentials**

### **Google OAuth Setup:**
1. Go to: https://console.cloud.google.com/
2. Create project → Enable Google+ API
3. Credentials → Create OAuth 2.0 Client ID
4. Set redirect URI: `http://localhost:3000/api/auth/callback/google`

### **GitHub OAuth Setup:**
1. Go to: https://github.com/settings/developers
2. New OAuth App
3. Set callback URL: `http://localhost:3000/api/auth/callback/github`

### **Stripe API Keys:**
1. Go to: https://dashboard.stripe.com/test/apikeys
2. Copy Publishable key (pk_test_...)
3. Copy Secret key (sk_test_...)

---

## **5. Environment Files Structure**

```
edu-connect/
├── .env.local          # Main environment file (not committed)
├── .env.example        # Template file (committed)
├── .gitignore          # Must include .env.local
└── ...
```

### **.env.example (Template):**
```env
# Copy this file to .env.local and fill in your actual values

# NextAuth.js Configuration
AUTH_SECRET=generate-random-secret-here
AUTH_TRUST_HOST=true
NEXTAUTH_URL=http://localhost:3000

# MongoDB Configuration
MONGODB_CONNECTION_STRING=mongodb://localhost:27017/edu-connect

# Social Login Providers
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-google-client-secret
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

---

## **6. Security Best Practices**

### **✅ Do:**
- Generate strong, unique `AUTH_SECRET`
- Use test keys for development
- Keep .env.local in .gitignore
- Use different secrets for production
- Regularly rotate secrets

### **❌ Don't:**
- Commit .env.local to git
- Share secrets in chat/email
- Use production keys in development
- Hardcode secrets in source code
- Use weak or predictable secrets

---

## **7. Environment Validation**

### **Check Required Variables:**
```javascript
// Add to your app to validate env vars
const requiredEnvVars = [
  'AUTH_SECRET',
  'MONGODB_CONNECTION_STRING',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'STRIPE_SECRET_KEY'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}
```

### **Development vs Production:**

**Development (.env.local):**
```env
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

**Production (.env.production):**
```env
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

---

## **8. Troubleshooting**

### **Common Issues:**

**Issue:** NextAuth.js session not working
**Solution:** Check `AUTH_SECRET` is set and `NEXTAUTH_URL` matches your domain

**Issue:** MongoDB connection failed
**Solution:** Verify `MONGODB_CONNECTION_STRING` format and MongoDB is running

**Issue:** OAuth providers not working
**Solution:** Check OAuth client IDs and redirect URIs match exactly

**Issue:** Stripe not loading
**Solution:** Ensure `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` has correct prefix

**Issue:** Webhooks not working
**Solution:** Check `STRIPE_WEBHOOK_SECRET` matches CLI output

---

## **9. Environment File Template**

### **Quick Setup Copy-Paste:**
Create `.env.local` and fill in your values:

```env
# NextAuth.js Configuration
AUTH_SECRET=
AUTH_TRUST_HOST=true
NEXTAUTH_URL=http://localhost:3000

# MongoDB Configuration
MONGODB_CONNECTION_STRING=mongodb://localhost:27017/edu-connect
ENVIRONMENT=edu-connect

# Social Login Providers
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_ID=
GITHUB_SECRET=

# Stripe Configuration  
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

---

## **✅ Environment Setup Complete!**

Once all variables are set:
1. ✅ Authentication will work
2. ✅ Database connections established
3. ✅ OAuth providers functional
4. ✅ Stripe payments ready
5. ✅ Development server starts successfully

**Next Step:** Test your setup by running `npm run dev`