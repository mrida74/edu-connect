# 🔐 NextAuth.js v5 Complete Authentication Setup Guide

## 📊 **Current Setup Analysis & Grade: B+ (85/100)**

### ✅ **What's Working Well:**
- ✅ NextAuth v5 setup with JWT strategy
- ✅ MongoDB adapter configuration
- ✅ Proper password hashing with bcrypt
- ✅ Custom user model with Mongoose
- ✅ Session callbacks for custom user data
- ✅ Environment variables setup
- ✅ Error handling in authentication flow
- ✅ Server actions for login functionality

### ⚠️ **Areas for Improvement:**
- 🔸 Missing database connection in user queries
- 🔸 No password validation rules
- 🔸 No email verification
- 🔸 No password reset functionality
- 🔸 Missing rate limiting
- 🔸 No logout API route
- 🔸 Basic error messages (could be more user-friendly)
- 🔸 No session security headers

---

## 🛠️ **Complete Step-by-Step Setup Process**

### **Step 1: Install Required Packages**

```bash
# Core authentication packages
npm install next-auth@beta
npm install @auth/mongodb-adapter
npm install mongodb
npm install bcryptjs

# UI and form handling
npm install @hookform/resolvers
npm install react-hook-form
npm install zod

# Database
npm install mongoose
```

**What this does:** Installs NextAuth v5 beta, MongoDB adapter, password hashing library, and form validation tools.

---

### **Step 2: Environment Configuration**

Create `.env.local` file:

```bash
# Database Configuration
MONGODB_CONNECTION_STRING=mongodb://localhost:27017/your-database-name
ENVIRONMENT=your-database-name

# Authentication Secret (Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
AUTH_SECRET=your-generated-secret-here

# NextAuth URL (Required for production)
NEXTAUTH_URL=http://localhost:3000
```

**What this does:** Sets up environment variables for database connection and authentication security.

---

### **Step 3: MongoDB Client Setup**

Create `db/mongoClientPromise.js`:

```javascript
import { MongoClient } from "mongodb";

if (!process.env.MONGODB_CONNECTION_STRING) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_CONNECTION_STRING"');
}

const uri = process.env.MONGODB_CONNECTION_STRING;
const options = {};

let client;
let mongoClientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  mongoClientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  mongoClientPromise = client.connect();
}

export default mongoClientPromise;
```

**What this does:** Creates a MongoDB client connection that NextAuth can use for session storage and user management.

---

### **Step 4: User Model Definition**

Create `models/user-model.js`:

```javascript
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  firstName: { required: true, type: String },
  lastName: { required: true, type: String },
  email: { required: true, type: String, unique: true },
  password: { required: true, type: String },
  phone: { required: false, type: String },
  role: { required: true, type: String, default: "user" },
  bio: { required: false, type: String },
  socialMedia: { required: false, type: Object },
  profilePicture: { required: false, type: String },
  emailVerified: { required: false, type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export { User };
```

**What this does:** Defines the database schema for users with all necessary fields for authentication and profile management.

---

### **Step 5: Database Service Setup**

Create `services/mongo.js`:

```javascript
import mongoose from "mongoose";

export async function dbConnect() {
  try {
    if (mongoose.connections[0].readyState) {
      return mongoose.connections[0];
    }
    const conn = await mongoose.connect(String(process.env.MONGODB_CONNECTION_STRING));
    return conn;
  } catch (err) {
    console.error("Database connection error:", err);
    throw err;
  }
}
```

**What this does:** Provides a reusable database connection function using Mongoose.

---

### **Step 6: User Query Functions**

Create `db/queries/user.js`:

```javascript
import { User } from "@/models/user-model";
import { dbConnect } from "@/services/mongo";

const getUserByEmail = async (email) => {
  try {
    await dbConnect();
    const user = await User.findOne({ email }).lean();
    return user;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw error;
  }
};

const createUser = async (userData) => {
  try {
    await dbConnect();
    const user = await User.create(userData);
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export { getUserByEmail, createUser };
```

**What this does:** Provides database operations for user management with proper error handling.

---

### **Step 7: NextAuth Configuration**

Create `auth.js`:

```javascript
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import mongoClientPromise from "@/db/mongoClientPromise";
import { getUserByEmail } from "./db/queries/user";
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
  
  session: { strategy: 'jwt' },
  
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }
        
        try {
          const user = await getUserByEmail(credentials.email);
          
          if (!user) {
            throw new Error("User not found");
          }
          
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          
          if (!isPasswordValid) {
            throw new Error("Invalid password");
          }
          
          return {
            id: user._id.toString(),
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            profilePicture: user.profilePicture,
          };
        } catch (error) {
          throw error;
        }
      }
    }),
  ],
  
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
        session.user.name = `${token.firstName} ${token.lastName}`;
        session.user.role = token.role;
        session.user.profilePicture = token.profilePicture;
      }
      return session;
    },
  },
  
  pages: {
    signIn: '/login',
  },
  
  secret: process.env.AUTH_SECRET,
});
```

**What this does:** Configures NextAuth with credentials provider, JWT sessions, and custom callbacks to preserve user data.

---

### **Step 8: API Route Setup**

Create `app/api/auth/[...nextauth]/route.js`:

```javascript
import { handlers } from "@/auth";

export const { GET, POST } = handlers;
```

**What this does:** Creates API routes for NextAuth authentication endpoints.

---

### **Step 9: Server Actions**

Create `app/actions/auth.js`:

```javascript
"use server";

import { signIn, signOut } from "@/auth";
import { redirect } from "next/navigation";

export async function loginAction(formData) {
  try {
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
    
    if (result?.error) {
      return { error: result.error };
    }
    
    redirect("/dashboard");
  } catch (error) {
    return { error: error.message };
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}
```

**What this does:** Provides server-side functions for login and logout operations.

---

### **Step 10: Client Components**

Create login form component:

```javascript
"use client";
import { useState } from "react";
import { loginAction } from "@/app/actions/auth";

export function LoginForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  async function handleSubmit(formData) {
    setLoading(true);
    setError("");
    
    const result = await loginAction(formData);
    
    if (result?.error) {
      setError(result.error);
    }
    
    setLoading(false);
  }
  
  return (
    <form action={handleSubmit}>
      {error && <p className="text-red-500">{error}</p>}
      
      <input 
        name="email" 
        type="email" 
        placeholder="Email" 
        required 
      />
      
      <input 
        name="password" 
        type="password" 
        placeholder="Password" 
        required 
      />
      
      <button 
        type="submit" 
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
```

**What this does:** Creates a client-side login form with error handling and loading states.

---

### **Step 11: Session Provider Setup**

Create `app/providers.jsx`:

```javascript
"use client";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
```

Update `app/layout.js`:

```javascript
import { Providers } from "./providers";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

**What this does:** Wraps the app with SessionProvider to enable useSession hook throughout the application.

---

### **Step 12: Using Auth in Components**

```javascript
// Server Component
import { auth } from "@/auth";

export default async function ProfilePage() {
  const session = await auth();
  
  if (!session) {
    redirect("/login");
  }
  
  return <div>Welcome {session.user.name}</div>;
}

// Client Component
"use client";
import { useSession, signOut } from "next-auth/react";

export function UserMenu() {
  const { data: session, status } = useSession();
  
  if (status === "loading") return <div>Loading...</div>;
  
  if (!session) return <a href="/login">Login</a>;
  
  return (
    <div>
      <span>Hello {session.user.name}</span>
      <button onClick={() => signOut()}>Logout</button>
    </div>
  );
}
```

**What this does:** Shows how to use authentication in both server and client components.

---

## 🚀 **Suggested Improvements for A+ Grade:**

### **1. Security Enhancements (Priority: High)**
```javascript
// Add password validation
const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters")
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain uppercase, lowercase, and number");

// Add rate limiting
import { Ratelimit } from "@upstash/ratelimit";
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 m"),
});
```

### **2. User Experience Improvements (Priority: Medium)**
```javascript
// Add email verification
// Add password reset functionality
// Add remember me option
// Add social login providers (Google, GitHub)
```

### **3. Error Handling Enhancement (Priority: Medium)**
```javascript
// Custom error types
class AuthError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}
```

### **4. Monitoring & Analytics (Priority: Low)**
```javascript
// Add login attempt tracking
// Add session analytics
// Add security event logging
```

---

## 📝 **Quick Setup Checklist**

- [ ] Install required packages
- [ ] Set up environment variables
- [ ] Create MongoDB client promise
- [ ] Define user model
- [ ] Set up database connection service
- [ ] Create user query functions
- [ ] Configure NextAuth
- [ ] Create API routes
- [ ] Set up server actions
- [ ] Create login components
- [ ] Add session provider
- [ ] Test authentication flow

---

## 🔧 **Common Issues & Solutions**

### **Issue: Session not persisting**
**Solution:** Ensure SessionProvider is wrapping your app and AUTH_SECRET is set.

### **Issue: Database connection errors**
**Solution:** Check MongoDB connection string and ensure database is running.

### **Issue: Password comparison fails**
**Solution:** Verify bcrypt.compare parameter order: `bcrypt.compare(plaintext, hash)`.

### **Issue: JWT token errors**
**Solution:** Ensure AUTH_SECRET is consistent and not changing between restarts.

---

## 📚 **Additional Resources**

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [MongoDB Atlas Setup](https://www.mongodb.com/cloud/atlas)
- [bcrypt Documentation](https://github.com/kelektiv/node.bcrypt.js)
- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)

---

**Current Grade: B+ (85/100)**
**Potential Grade with Improvements: A+ (95/100)**

This setup provides a solid foundation for authentication that can be easily replicated across different projects with minimal modifications.