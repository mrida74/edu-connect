# 🚀 Production Deployment Checklist

## 📋 Pre-Deployment Steps

### 1. Environment Variables
- [ ] Set `NEXTAUTH_URL` to your production domain
- [ ] Generate new `AUTH_SECRET` (64 characters)
- [ ] Configure MongoDB Atlas connection string
- [ ] Set `ENVIRONMENT=production`
- [ ] Set `NODE_ENV=production`

### 2. Database Setup
- [ ] Create MongoDB Atlas cluster
- [ ] Import data from local database
- [ ] Test database connection
- [ ] Configure database user permissions

### 3. Authentication Configuration
- [ ] Update trusted domains in auth config
- [ ] Test login/logout functionality
- [ ] Verify protected routes
- [ ] Test callback URLs with production domain

### 4. Build & Deploy
```bash
# Build for production
npm run build

# Test production build locally
npm start

# Deploy to hosting platform (Vercel/Netlify/etc)
```

## 🔧 Common Production Issues & Solutions

### JWT Session Errors
- **Problem**: `no matching decryption secret`
- **Solution**: Ensure `AUTH_SECRET` is exactly the same as used during token creation

### Database Connection Timeouts
- **Problem**: `Operation buffering timed out`
- **Solution**: Use MongoDB Atlas with proper connection string and IP whitelist

### Authentication Failures
- **Problem**: Login not working
- **Solution**: Update `NEXTAUTH_URL` to production domain

### Middleware Issues
- **Problem**: Protected routes not working
- **Solution**: Ensure Edge Runtime compatibility and proper cookie detection

## 📱 Testing Production Build

1. Clear all browser cookies
2. Test authentication flow:
   - Login with valid credentials
   - Access protected routes
   - Test logout functionality
   - Verify callback URLs

## 🌟 Deployment Platforms

### Vercel (Recommended)
```bash
npm i -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# Upload .next folder to Netlify
```

### AWS/Digital Ocean
```bash
# Docker deployment
docker build -t edu-connect .
docker run -p 3000:3000 edu-connect
```

## 🛡️ Security Checklist

- [ ] Use HTTPS in production
- [ ] Set secure AUTH_SECRET (64+ characters)
- [ ] Enable MongoDB Atlas IP restrictions
- [ ] Configure CORS properly
- [ ] Use environment-specific secrets