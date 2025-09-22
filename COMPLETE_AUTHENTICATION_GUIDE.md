# 🔐 Complete Authentication Setup Guide

## Overview
This guide provides step-by-step instructions to implement complete authentication system using NextAuth.js v5, MongoDB, and protected routes.

---

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Schema](#database-schema)
4. [Authentication Configuration](#authentication-configuration)
5. [Database Queries](#database-queries)
6. [Server Actions](#server-actions)
7. [Login Form Component](#login-form-component)
8. [Protected Routes (Middleware)](#protected-routes-middleware)
9. [Account Page](#account-page)
10. [Session Provider](#session-provider)
11. [Navigation with Authentication](#navigation-with-authentication)
12. [Testing & Verification](#testing--verification)

---

## 🎯 Prerequisites

### Required Packages
```bash
npm install next-auth@beta @auth/mongodb-adapter bcryptjs mongoose
```

### Required Files Structure
```
project/
├── auth.js                          # NextAuth configuration
├── middleware.js                    # Route protection
├── app/
│   ├── layout.js                   # Session provider
│   ├── login/
│   │   ├── page.jsx               # Login page
│   │   └── _components/
│   │       └── login-form.jsx     # Login form
│   ├── (main)/
│   │   └── account/
│   │       └── page.jsx           # Protected account page
│   └── actions/
│       └── index.js               # Server actions
├── db/
│   ├── mongoClientPromise.js      # MongoDB connection
│   └── quaries/
│       └── user.js                # User database queries
└── models/
    └── user-model.js              # User schema
```

---

## ⚙️ Environment Setup

### Step 1: Create `.env.local`
```bash
# Authentication Configuration
AUTH_SECRET=your-generated-secret-here
AUTH_TRUST_HOST=true
NEXTAUTH_URL=http://localhost:3000

# MongoDB Configuration
MONGODB_CONNECTION_STRING=mongodb://localhost:27017/your-db-name
ENVIRONMENT=your-db-name
```

### Step 2: Generate AUTH_SECRET
```bash
node -e "console.log('AUTH_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🗄️ Database Schema

### User Model (`models/user-model.js`)
```javascript
import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
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
    required: true,
  },
  role: {
    type: String,
    enum: ["student", "instructor", "admin"],
    default: "student",
  },
  profilePicture: {
    type: String,
    default: "/default-avatar.png",
  },
}, {
  timestamps: true,
});

export const User = models.User || model("User", userSchema);
```

---

## 🔧 Authentication Configuration

### Step 1: MongoDB Connection (`db/mongoClientPromise.js`)
```javascript
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_CONNECTION_STRING;
const options = {};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
```

### Step 2: User Queries (`db/quaries/user.js`)
```javascript
import { User } from "@/models/user-model";

export async function getUserByEmail(email) {
  try {
    const user = await User.findOne({ email }).lean();
    return user;
  } catch (error) {
    throw new Error(`Failed to get user: ${error.message}`);
  }
}

export async function createUser(userData) {
  try {
    const user = await User.create(userData);
    return user;
  } catch (error) {
    throw new Error(`Failed to create user: ${error.message}`);
  }
}
```

### Step 3: NextAuth Configuration (`auth.js`)
```javascript
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import mongoClientPromise from "@/db/mongoClientPromise";
import { getUserByEmail } from "./db/quaries/user";
import bcrypt from "bcryptjs";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: MongoDBAdapter(mongoClientPromise, {
    databaseName: process.env.ENVIRONMENT,
  }),
  session: {
    strategy: 'jwt'
  },
  
  // Trust host for production
  trustHost: true,
  
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if(credentials === null) return null;
        try {
          const user = await getUserByEmail(credentials?.email);
          if (user) {
            const isMatch = await bcrypt.compare(credentials?.password, user?.password)
            if (isMatch) {
              return {
                id: user._id.toString(),
                firstName: user?.firstName,
                lastName: user?.lastName,
                name: \`\${user?.firstName} \${user?.lastName}\`,
                email: user?.email,
                profilePicture: user?.profilePicture,
                role: user?.role
              }
            } else {
              throw new Error("Invalid password");
            }
          } else {
            throw new Error("User not found")
          }
        } catch (error) {
            throw error;
        }
      }
    }),
  ],
  
  // Add callbacks to preserve user data in session
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.role = user.role;
        token.profilePicture = user.profilePicture;
      }
      return token;
    },
    
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.name = \`\${token.firstName} \${token.lastName}\`;
        session.user.role = token.role;
        session.user.profilePicture = token.profilePicture;
      }
      return session;
    },
  },
  
  secret: process.env.AUTH_SECRET,
});
```

---

## 🔄 Server Actions

### Login Action (`app/actions/index.js`)
```javascript
"use server";

import { signIn } from "@/auth";

export async function logIn(formData) {
  try {
    const response = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
    
    // Check if login was successful
    if (response?.error) {
      return { error: response.error };
    }
    
    return { success: true };
  } catch (error) {
    return { error: { message: error.message } };
  }
}
```

---

## 📝 Login Form Component

### Login Page (`app/login/page.jsx`)
```jsx
import { Suspense } from "react";
import { LoginForm } from "./_components/login-form";

const LoginPage = () => {
  return (
    <div className="w-full flex-col h-screen flex items-center justify-center">
      <div className="container">
        <Suspense fallback={<div>Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
};
export default LoginPage;
```

### Login Form (`app/login/_components/login-form.jsx`)
```jsx
'use client';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import { logIn } from "@/app/actions";
import { useState } from "react";

export function LoginForm() {
  const [error, setError] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get callbackUrl from URL parameters for redirect after login
  const callbackUrl = searchParams.get('callbackUrl') || '/courses';
  
  const handleSubmit = async (event)=> {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget)
      const response = await logIn(formData);
      
      if (response?.error) {
        setError(response.error.message || 'Login failed');
      } else if (response?.success) {
        // Redirect to callbackUrl or default to courses
        router.push(callbackUrl);
      } else {
        setError('Unexpected login response');
      }
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      {error && <p className="text-red-500 px-6">{error}</p>}
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input 
              id="password" 
              type="password" 
              name="password"
              required 
            />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## 🛡️ Protected Routes (Middleware)

### Middleware (`middleware.js`)
```javascript
import { NextResponse } from 'next/server'

export function middleware(request) {
  // Define protected routes
  const protectedRoutes = ['/account', '/dashboard', '/admin']
  const { pathname } = request.nextUrl
  
  // Check if current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // Get session token from cookies (NextAuth v5 compatible)
  const sessionToken = request.cookies.get('authjs.session-token') ||
                      request.cookies.get('__Secure-authjs.session-token') ||
                      request.cookies.get('next-auth.session-token') ||
                      request.cookies.get('__Secure-next-auth.session-token')
  
  const isAuthenticated = !!sessionToken
  
  // If accessing protected route without authentication, redirect to login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // If authenticated and accessing login page, redirect to courses
  if (isAuthenticated && pathname === '/login') {
    return NextResponse.redirect(new URL('/courses', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

---

## 👤 Account Page (Protected)

### Account Page (`app/(main)/account/page.jsx`)
```jsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AccountPage() {
  const session = await auth();
  
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Account</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Profile Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Name</label>
                <p className="text-lg">{session.user?.firstName} {session.user?.lastName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-lg">{session.user?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Role</label>
                <p className="text-lg capitalize">{session.user?.role}</p>
              </div>
            </div>
          </div>

          {/* Account Statistics */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Account Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Account Status</span>
                <span className="text-green-600 font-medium">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Member Since</span>
                <span className="font-medium">
                  {new Date(session.user?.createdAt || Date.now()).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 🧭 Session Provider Setup

### Root Layout (`app/layout.js`)
```jsx
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { dbConnect } from "@/services/mongo";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });
const poppins = Inter({ subsets: ["latin"], variable: "--font-poppins" });

export const metadata = {
  title: "EduConnect - World's Best Learning Platform",
  description: "Explore || Learn || Build || Share",
};

export default function RootLayout({ children }) {
  dbConnect();
  
  return (
    <html lang="en">
      <body className={cn(inter.className, poppins.className)}>
        <SessionProvider>
          {children}
          <Toaster
            richColors
            position="top-center"
            closeButton
          />
        </SessionProvider>
      </body>
    </html>
  );
}
```

---

## 📱 Navigation with Authentication

### Navigation Component Example
```jsx
'use client';
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function MainNav() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;

  return (
    <nav className="flex items-center space-x-4">
      <Link href="/" className="text-blue-600 hover:text-blue-800">
        Home
      </Link>
      
      {session ? (
        <>
          <Link href="/courses" className="text-blue-600 hover:text-blue-800">
            Courses
          </Link>
          <Link href="/account" className="text-blue-600 hover:text-blue-800">
            Account
          </Link>
          <span className="text-gray-600">
            Welcome, {session.user?.firstName}!
          </span>
          <button 
            onClick={() => signOut()} 
            className="text-red-600 hover:text-red-800"
          >
            Logout
          </button>
        </>
      ) : (
        <Link href="/login" className="text-blue-600 hover:text-blue-800">
          Login
        </Link>
      )}
    </nav>
  );
}
```

---

## 🧪 Testing & Verification

### Development Testing Steps:

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Test Authentication Flow**
   - Navigate to `/account` (should redirect to login)
   - Login with valid credentials
   - Should redirect back to `/account`
   - Verify session data displays correctly

3. **Test Protected Routes**
   - Access protected pages without login
   - Verify middleware redirects work
   - Test callback URL functionality

4. **Test Session Management**
   - Refresh page on protected route
   - Should remain authenticated
   - Test logout functionality

### Production Testing:
1. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

2. **Verify Environment Variables**
   - Ensure all required env vars are set
   - Test with production database

---

## 🔍 Troubleshooting

### Common Issues:

1. **JWT Session Errors**
   - Ensure `AUTH_SECRET` is properly set
   - Clear browser cookies and try again

2. **Middleware Redirect Loops**
   - Check cookie names in middleware
   - Verify session strategy matches

3. **Database Connection Issues**
   - Verify MongoDB connection string
   - Check database permissions

4. **Build Errors**
   - Ensure Suspense boundary around components using useSearchParams
   - Verify all imports are correct

---

## ✅ Quick Checklist

- [ ] Environment variables configured
- [ ] Database schema created
- [ ] NextAuth configuration complete
- [ ] Login form implemented
- [ ] Middleware protecting routes
- [ ] Account page created
- [ ] Session provider added
- [ ] Navigation updated
- [ ] Testing completed

---

**🎉 Congratulations! Your authentication system is now complete and production-ready!**