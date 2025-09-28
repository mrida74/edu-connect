# 🔐 Authentication Setup Guide

## NextAuth.js Configuration with Google & GitHub

### **📋 Overview**
EduConnect uses NextAuth.js v5 for authentication with support for:
- 🔑 **Local Login** (Email/Password)
- 🌐 **Google OAuth**
- 🐙 **GitHub OAuth**
- 📱 **JWT Sessions**
- 🗄️ **MongoDB Integration**

---

## **1. Environment Variables Setup**

### **Required Variables in `.env.local`:**

```env
# NextAuth.js Configuration
AUTH_SECRET=a1b2c3d4e5f6789012345678901234567890abcdef123456789012345678901234
AUTH_TRUST_HOST=true
NEXTAUTH_URL=http://localhost:3000

# MongoDB Configuration
MONGODB_CONNECTION_STRING=mongodb://localhost:27017/edu-connect

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-google-client-secret

# GitHub OAuth
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret
```

---

## **2. Google OAuth Setup**

### **Step 1: Google Cloud Console**
1. Go to: https://console.cloud.google.com/
2. Create new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**

### **Step 2: Configure OAuth Client**
```
Application Type: Web Application
Name: EduConnect
Authorized JavaScript Origins: http://localhost:3000
Authorized Redirect URIs: http://localhost:3000/api/auth/callback/google
```

### **Step 3: Copy Credentials**
- Copy **Client ID** → `GOOGLE_CLIENT_ID`
- Copy **Client Secret** → `GOOGLE_CLIENT_SECRET`

---

## **3. GitHub OAuth Setup**

### **Step 1: GitHub Settings**
1. Go to: https://github.com/settings/developers
2. Click **New OAuth App**

### **Step 2: Configure Application**
```
Application Name: EduConnect
Homepage URL: http://localhost:3000
Authorization Callback URL: http://localhost:3000/api/auth/callback/github
```

### **Step 3: Copy Credentials**
- Copy **Client ID** → `GITHUB_ID`
- Copy **Client Secret** → `GITHUB_SECRET`

---

## **4. NextAuth Configuration**

### **File: `auth.js`**
```javascript
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import { MongoClient } from "mongodb"

const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING)

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(client),
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          // Connect to database
          const { User } = await import("@/models/user-model")
          const bcrypt = await import("bcryptjs")
          
          // Find user by email
          const user = await User.findOne({ email: credentials.email })
          
          if (!user) {
            throw new Error("No user found with this email")
          }
          
          // Verify password
          const isPasswordValid = await bcrypt.compare(
            credentials.password, 
            user.password
          )
          
          if (!isPasswordValid) {
            throw new Error("Invalid password")
          }
          
          // Return user object (without password)
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.firstName + " " + user.lastName,
            role: user.role
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id
      return session
    }
  },
  pages: {
    signIn: '/login',
    signUp: '/register',
  }
})
```

---

## **4. Credentials Login Setup**

### **Step 1: Install bcryptjs for Password Hashing**
```bash
npm install bcryptjs
npm install @types/bcryptjs # if using TypeScript
```

### **Step 2: Update User Model (if not already done)**
```javascript
// models/user-model.js
import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: function() {
      // Password required only for credentials provider
      return !this.provider || this.provider === 'credentials'
    },
  },
  role: {
    type: String,
    enum: ['student', 'instructor'],
    default: 'student',
  },
  provider: {
    type: String,
    enum: ['credentials', 'google', 'github'],
    default: 'credentials',
  },
  // ... other fields
}, {
  timestamps: true,
})

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next()
  
  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

export const User = mongoose.models.User || mongoose.model("User", userSchema)
```

### **Step 3: Create Registration API Route**
```javascript
// app/api/register/route.js
import { NextResponse } from "next/server"
import { User } from "@/models/user-model"
import dbConnect from "@/services/mongo"

export async function POST(request) {
  try {
    const { firstName, lastName, email, password, role } = await request.json()
    
    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }
    
    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }
    
    await dbConnect()
    
    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 409 }
      )
    }
    
    // Create new user
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password, // Will be hashed by pre-save middleware
      role: role || 'student',
      provider: 'credentials'
    })
    
    // Return success (without password)
    return NextResponse.json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role
      }
    }, { status: 201 })
    
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
```

### **Step 4: Create Login Form Component**
```jsx
// app/login/_components/credentials-form.jsx
'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function CredentialsForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
      } else {
        router.push('/') // Redirect to home or dashboard
        router.refresh()
      }
    } catch (error) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          disabled={loading}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          disabled={loading}
          required
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button 
        type="submit" 
        className="w-full" 
        disabled={loading}
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  )
}
```

### **Step 5: Create Registration Form Component**
```jsx
// app/register/_components/credentials-form.jsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function RegisterForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          role: formData.role
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      // Registration successful, redirect to login
      router.push('/login?message=Registration successful! Please login.')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First name"
            disabled={loading}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last name"
            disabled={loading}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          disabled={loading}
          required
        />
      </div>

      <div>
        <Label htmlFor="role">Role</Label>
        <Select 
          value={formData.role} 
          onValueChange={(value) => setFormData(prev => ({...prev, role: value}))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="instructor">Instructor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter password (min 6 characters)"
          disabled={loading}
          required
        />
      </div>

      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
          disabled={loading}
          required
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button 
        type="submit" 
        className="w-full" 
        disabled={loading}
      >
        {loading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  )
}
```

---

## **5. Usage in Components**

### **Complete Login Page:**
```jsx
// app/login/page.jsx
import { CredentialsForm } from './_components/credentials-form'
import { SocialLogin } from './_components/social-login'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Sign in to EduConnect</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link href="/register" className="text-blue-600 hover:text-blue-500">
              create a new account
            </Link>
          </p>
        </div>

        {/* Social Login Options */}
        <SocialLogin />
        
        <div className="relative">
          <Separator />
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with email</span>
          </div>
        </div>

        {/* Credentials Login Form */}
        <CredentialsForm />
      </div>
    </div>
  )
}
```

### **Social Login Component:**
```jsx
// app/login/_components/social-login.jsx
'use client'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export function SocialLogin() {
  return (
    <div className="space-y-3">
      <Button
        variant="outline"
        className="w-full"
        onClick={() => signIn('google', { callbackUrl: '/' })}
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </Button>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => signIn('github', { callbackUrl: '/' })}
      >
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        Continue with GitHub
      </Button>
    </div>
  )
}
```

### **Auth Status Component:**
```jsx
'use client'
import { signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function AuthButton() {
  const { data: session, status } = useSession()

  if (status === "loading") return <p>Loading...</p>

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src={session.user.image} />
          <AvatarFallback>
            {session.user.name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{session.user.name}</p>
          <p className="text-sm text-gray-500">{session.user.email}</p>
        </div>
        <Button variant="outline" onClick={() => signOut()}>
          Sign Out
        </Button>
      </div>
    )
  }

  return (
    <div className="space-x-2">
      <Button asChild variant="outline">
        <Link href="/login">Sign In</Link>
      </Button>
      <Button asChild>
        <Link href="/register">Sign Up</Link>
      </Button>
    </div>
  )
}
```

### **Protected Route:**
```jsx
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function ProtectedPage() {
  const session = await auth()
  
  if (!session) {
    redirect('/login')
  }

  return (
    <div>
      <h1>Protected Content</h1>
      <p>Hello, {session.user.name}!</p>
    </div>
  )
}
```

---

## **6. Database Schema**

### **MongoDB Collections Created:**
```javascript
// users collection
{
  _id: ObjectId,
  name: String,
  email: String,
  image: String,
  emailVerified: Date,
  // Social login fields
  provider: String, // 'google', 'github', 'credentials'
  providerAccountId: String,
}

// accounts collection (for OAuth)
{
  _id: ObjectId,
  userId: ObjectId,
  type: String,
  provider: String,
  providerAccountId: String,
  // OAuth tokens...
}

// sessions collection
{
  _id: ObjectId,
  sessionToken: String,
  userId: ObjectId,
  expires: Date,
}
```

---

## **6. Testing Authentication**

### **Test Steps:**

#### **1. Credentials Login Testing:**
```bash
# Start development server
npm run dev
```

1. **Registration Test:**
   - Visit: http://localhost:3000/register
   - Fill registration form with valid data
   - Submit and verify redirect to login page
   - Check MongoDB for new user record

2. **Login Test:**
   - Visit: http://localhost:3000/login
   - Enter registered email and password
   - Verify successful login and redirect
   - Check session in browser dev tools

3. **Password Security Test:**
   - Check MongoDB: Password should be hashed (not plain text)
   - Try login with wrong password: Should fail
   - Try login with correct password: Should succeed

#### **2. Social Login Testing:**
1. **Google OAuth:** Click "Continue with Google"
2. **GitHub OAuth:** Click "Continue with GitHub"
3. **Database Verification:** Check user records in MongoDB

#### **3. Session Testing:**
```javascript
// Test session in browser console
console.log(await fetch('/api/auth/session').then(r => r.json()))
```

### **Common Issues & Solutions:**

**Issue:** OAuth redirect URI mismatch
**Solution:** Ensure callback URLs match exactly in provider settings

**Issue:** MongoDB connection error
**Solution:** Check MONGODB_CONNECTION_STRING format

**Issue:** Session not persisting
**Solution:** Verify AUTH_SECRET is set and sufficiently long

---

## **8. Production Deployment**

### **Environment Variables for Production:**
```env
AUTH_SECRET=generate-new-secure-secret-for-production
NEXTAUTH_URL=https://yourdomain.com
MONGODB_CONNECTION_STRING=mongodb+srv://username:password@cluster.mongodb.net/educonnect
```

### **OAuth Redirect URLs for Production:**
- **Google:** `https://yourdomain.com/api/auth/callback/google`
- **GitHub:** `https://yourdomain.com/api/auth/callback/github`

---

## **✅ Authentication Setup Complete!**

Your authentication system now supports:
- ✅ **Credentials Login** (Email/Password with bcrypt hashing)
- ✅ **User Registration** with validation and role selection
- ✅ **Google OAuth** login
- ✅ **GitHub OAuth** login
- ✅ **JWT Sessions** for all providers
- ✅ **MongoDB User Storage** with proper schema
- ✅ **Protected Routes** and session management

### **Security Features:**
- 🔒 Password hashing with bcryptjs (salt rounds: 12)
- 🛡️ Email validation and duplicate prevention
- 🔐 Secure session management with JWT
- 🚫 Input validation and error handling
- 🔄 Automatic password hashing on user save

**Next Step:** [Setup Stripe Payment System](./STRIPE_GUIDE.md)