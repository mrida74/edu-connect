# 🚀 Development Workflow Guide

## Day-to-Day Development Process for EduConnect

### **📋 Overview**
This guide covers the complete development workflow from setup to testing.

---

## **1. Daily Startup Process**

### **Quick Start Checklist:**
```bash
# 1. Navigate to project
cd /c/Users/User/OneDrive/Desktop/HTML/reactive-accelerator/edu-connect

# 2. Check environment file exists
ls .env.local

# 3. Start development server
npm run dev

# 4. In separate terminal: Start Stripe webhook listener (if testing payments)
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### **Verify Everything is Running:**
- ✅ Development server: http://localhost:3000
- ✅ Database connection working
- ✅ Authentication functional
- ✅ Stripe webhooks (if needed)

---

## **2. Development Server Commands**

### **Start Development:**
```bash
# Start Next.js development server
npm run dev

# Alternative if npm has issues in PowerShell
node ./node_modules/.bin/next dev
```

### **Build & Production:**
```bash
# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check
```

### **Package Management:**
```bash
# Install new package
npm install package-name

# Install dev dependency
npm install -D package-name

# Update packages
npm update

# Check for vulnerabilities
npm audit
```

---

## **3. Testing Workflow**

### **Authentication Testing:**
1. **Visit:** http://localhost:3000/login
2. **Test Google OAuth:** Click "Sign in with Google"
3. **Test GitHub OAuth:** Click "Sign in with GitHub"
4. **Verify Session:** Check if user is logged in
5. **Test Logout:** Ensure logout works properly

### **Payment System Testing:**
1. **Start Webhook Listener:**
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

2. **Visit Purchase Page:**
   ```
   http://localhost:3000/courses/test-course/purchase
   ```

3. **Test Payment Flow:**
   ```
   Name: Test User
   Email: test@example.com
   Card: 4242 4242 4242 4242
   Expiry: 12/28
   CVC: 123
   ```

4. **Verify Webhook Events:**
   Check terminal for webhook confirmations

---

## **4. Code Structure & Organization**

### **Project Structure:**
```
edu-connect/
├── app/                          # Next.js App Router
│   ├── (main)/                   # Main layout group
│   │   ├── courses/              # Course pages
│   │   │   └── [id]/
│   │   │       └── purchase/     # Purchase flow
│   │   └── page.js               # Homepage
│   ├── api/                      # API routes
│   │   ├── auth/                 # NextAuth.js
│   │   ├── create-payment-intent/ # Stripe payment
│   │   └── webhooks/stripe/      # Stripe webhooks
│   ├── login/                    # Login page
│   └── globals.css               # Global styles
├── components/                   # Reusable components
│   ├── ui/                       # UI components
│   └── Enrollment.jsx            # Course enrollment
├── docs/                         # Documentation
├── lib/                          # Utilities
│   ├── stripe.js                 # Stripe configuration
│   ├── mongodb.js                # Database connection
│   └── utils.js                  # Utility functions
├── models/                       # Database models
└── .env.local                    # Environment variables
```

### **Naming Conventions:**
- **Components:** PascalCase (`CourseCard.jsx`)
- **Pages:** lowercase (`page.jsx`)
- **API routes:** lowercase (`route.js`)
- **Utilities:** camelCase (`formatPrice.js`)

---

## **5. Git Workflow**

### **Daily Git Commands:**
```bash
# Check status
git status

# Add changes
git add .

# Commit changes
git commit -m "Add payment system components"

# Push to repository
git push origin main

# Pull latest changes
git pull origin main
```

### **Feature Development:**
```bash
# Create feature branch
git checkout -b feature/user-dashboard

# Work on feature...
git add .
git commit -m "Add user dashboard"

# Push feature branch
git push origin feature/user-dashboard

# Merge to main (or create PR)
git checkout main
git merge feature/user-dashboard
```

### **Important: Never Commit Secrets**
```bash
# Check .gitignore includes:
.env.local
.env*.local
node_modules/
.next/
```

---

## **6. Debugging Common Issues**

### **Development Server Won't Start:**
```bash
# Check if port is in use
netstat -ano | findstr :3000

# Kill process using port
taskkill /PID <process_id> /F

# Clear Next.js cache
rm -rf .next
npm run dev
```

### **Environment Variables Not Loading:**
```bash
# Restart development server after .env.local changes
# Check variable names (NEXT_PUBLIC_ prefix for client-side)
# Verify no extra spaces or quotes
```

### **Database Connection Issues:**
```bash
# Check MongoDB is running (local)
services.msc → MongoDB Server

# Test connection string format
# Check network connectivity (Atlas)
```

### **Authentication Not Working:**
```bash
# Verify OAuth redirect URIs match exactly
# Check AUTH_SECRET is set and long enough
# Clear browser cookies/localStorage
```

### **Stripe Issues:**
```bash
# Restart webhook listener
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Check API keys are correct format
# Verify NEXT_PUBLIC_ prefix for publishable key
```

---

## **7. Code Quality & Best Practices**

### **Component Structure:**
```jsx
'use client'; // Only if needed

import { useState } from 'react';
import { ComponentName } from './component-name';

export function MyComponent({ prop1, prop2 }) {
  const [state, setState] = useState(initialValue);

  const handleEvent = () => {
    // Handle logic
  };

  return (
    <div className="container">
      {/* Component JSX */}
    </div>
  );
}
```

### **API Route Structure:**
```javascript
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validation
    if (!data.required) {
      return NextResponse.json(
        { error: 'Missing required field' }, 
        { status: 400 }
      );
    }

    // Business logic
    const result = await processData(data);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
```

### **Error Handling:**
```javascript
// Client-side error handling
const [error, setError] = useState(null);
const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
  setError(null);
  setLoading(true);
  
  try {
    const response = await fetch('/api/endpoint');
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }
    
    // Success handling
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

---

## **8. Performance Optimization**

### **Image Optimization:**
```jsx
import Image from 'next/image';

<Image
  src="/course-thumbnail.jpg"
  alt="Course thumbnail"
  width={400}
  height={250}
  className="rounded-lg"
  priority={false} // true for above-the-fold images
/>
```

### **Loading States:**
```jsx
{loading && (
  <div className="flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
)}
```

### **Code Splitting:**
```jsx
import dynamic from 'next/dynamic';

const PaymentForm = dynamic(() => import('./PaymentForm'), {
  loading: () => <p>Loading payment form...</p>,
  ssr: false // Disable server-side rendering if needed
});
```

---

## **9. Deployment Preparation**

### **Pre-deployment Checklist:**
- [ ] All environment variables set for production
- [ ] Database connection string updated
- [ ] OAuth redirect URIs updated for production domain
- [ ] Stripe keys switched to live mode
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Images optimized
- [ ] Performance tested

### **Build Test:**
```bash
# Test production build locally
npm run build
npm start

# Check for build errors
# Test all functionality
# Verify environment variables load correctly
```

---

## **10. Troubleshooting Checklist**

### **When Something Breaks:**

1. **Check Browser Console**
   - Look for JavaScript errors
   - Check network requests
   - Verify API responses

2. **Check Terminal Output**
   - Development server errors
   - Build warnings
   - Database connection messages

3. **Verify Environment Variables**
   - All required variables set
   - Correct format and values
   - No extra spaces or characters

4. **Test Authentication**
   - Can users sign in/out?
   - OAuth providers working?
   - Sessions persisting?

5. **Test Database**
   - Connection established?
   - Queries working?
   - Data being saved?

6. **Test Payments**
   - Stripe keys correct?
   - Webhook listener running?
   - Test cards working?

---

## **✅ Development Workflow Complete!**

You now have:
- ✅ Daily startup process
- ✅ Testing procedures
- ✅ Debugging strategies
- ✅ Code quality guidelines
- ✅ Performance optimization tips
- ✅ Deployment preparation

**Happy coding! 🎉**

### **Quick Commands Reference:**
```bash
# Start development
npm run dev

# Start webhooks
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Test payment
# Visit: http://localhost:3000/courses/test/purchase
```