This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## 🔐 Authentication

This project uses **NextAuth.js v5** with MongoDB for authentication. The authentication system includes:

### Features
- ✅ **Credentials-based login** with email and password
- ✅ **JWT session management** for stateless authentication
- ✅ **MongoDB integration** for user data storage
- ✅ **Password hashing** with bcrypt
- ✅ **Custom user model** with role-based access
- ✅ **Session callbacks** for custom user data
- ✅ **Server actions** for form handling

### Quick Setup

1. **Environment Variables** - Create `.env.local`:
```bash
MONGODB_CONNECTION_STRING=mongodb://localhost:27017/edu-connect
ENVIRONMENT=edu-connect
AUTH_SECRET=your-generated-secret-here
NEXTAUTH_URL=http://localhost:3000
```

2. **Generate AUTH_SECRET**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

3. **Install Dependencies**:
```bash
npm install next-auth@beta @auth/mongodb-adapter mongodb bcryptjs mongoose
```

### Authentication Flow

1. **Login**: Users authenticate with email/password through `/login`
2. **Session**: JWT tokens store user data (id, name, email, role)
3. **Protection**: Pages can be protected using `auth()` server-side or `useSession()` client-side
4. **Logout**: Users can sign out through the logout functionality

### Usage Examples

**Server Component:**
```javascript
import { auth } from "@/auth";

export default async function ProtectedPage() {
  const session = await auth();
  if (!session) redirect("/login");
  
  return <div>Welcome {session.user.name}</div>;
}
```

**Client Component:**
```javascript
"use client";
import { useSession } from "next-auth/react";

export function UserProfile() {
  const { data: session, status } = useSession();
  
  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div>Please login</div>;
  
  return <div>Hello {session.user.name}</div>;
}
```

### Key Files
- `auth.js` - NextAuth configuration
- `app/api/auth/[...nextauth]/route.js` - API routes
- `db/mongoClientPromise.js` - MongoDB client
- `models/user-model.js` - User schema
- `db/queries/user.js` - Database operations
- `app/actions/index.js` - Server actions

### MongoDB Client Setup

Create `db/mongoClientPromise.js` file with this exact code:

```javascript
import { MongoClient } from "mongodb";

if (!process.env.MONGODB_CONNECTION_STRING) {
  throw new Error(
    'Invalid/Missing environment variable: "MONGODB_CONNECTION_STRING"'
  );
}

const uri = process.env.MONGODB_CONNECTION_STRING;
const options = {};

let client;
let mongoClientPromise;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  mongoClientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  mongoClientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default mongoClientPromise;
```

**What this does:**
- ✅ Creates a MongoDB client connection for NextAuth
- ✅ Handles development vs production environments differently
- ✅ Prevents connection pooling issues during development
- ✅ Validates environment variables
- ✅ Exports a reusable client promise

For detailed setup guide, see `NEXTAUTH_COMPLETE_SETUP_GUIDE.md`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
