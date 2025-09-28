# 🎓 EduConnect - Online Learning PlatformThis is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).



A comprehensive online learning platform built with **Next.js 13+**, **NextAuth.js**, **Stripe**, and **MongoDB**.## Getting Started



## ✨ FeaturesFirst, run the development server:



- 🔐 **Multi-provider Authentication** (Google, GitHub, Email/Password)```bash

- 💳 **Stripe Payment Integration** for course purchasesnpm run dev

- 📚 **Course Management System** with lessons and modules# or

- 🎯 **Role-based Access** (Students, Instructors)yarn dev

- 📱 **Responsive Design** with Tailwind CSS# or

- 🎨 **Modern UI Components** with shadcn/uipnpm dev

# or

## 🚀 Quick Startbun dev

```

### Prerequisites

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

- Node.js 18+ and npm

- MongoDB databaseYou can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

- Stripe account (for payments)

- Google/GitHub OAuth apps (optional)This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.



### Installation## 🔐 Authentication



```bashThis project uses **NextAuth.js v5** with MongoDB for authentication. The authentication system includes:

# Clone the repository

git clone https://github.com/mrida74/edu-connect.git### Features

cd edu-connect- ✅ **Credentials-based login** with email and password

- ✅ **JWT session management** for stateless authentication

# Install dependencies- ✅ **MongoDB integration** for user data storage

npm install- ✅ **Password hashing** with bcrypt

- ✅ **Custom user model** with role-based access

# Setup environment variables- ✅ **Session callbacks** for custom user data

cp .env.example .env.local- ✅ **Server actions** for form handling

# Edit .env.local with your configuration- ✅ **Protected routes** with middleware

- ✅ **Callback URL support** for smart redirects

# Run development server

npm run dev### 📚 Documentation

```- **[Complete Authentication Guide](./COMPLETE_AUTHENTICATION_GUIDE.md)** - Detailed step-by-step instructions

- **[Quick Setup (5 minutes)](./QUICK_AUTH_SETUP.md)** - Fast track implementation

Open [http://localhost:3000](http://localhost:3000) to view the application.- **[NextAuth Setup Guide](./NEXTAUTH_COMPLETE_SETUP_GUIDE.md)** - Original setup documentation



## 📚 Complete Documentation### Quick Setup



For detailed setup instructions, configuration guides, and development workflows, visit our comprehensive documentation:1. **Environment Variables** - Create `.env.local`:

```bash

### **[📖 View Complete Documentation →](./docs/README.md)**AUTH_SECRET=your-generated-secret-here

AUTH_TRUST_HOST=true

The documentation includes:NEXTAUTH_URL=http://localhost:3000

MONGODB_CONNECTION_STRING=mongodb://localhost:27017/your-db

- **[🔐 Authentication Setup](./docs/AUTH_GUIDE.md)** - NextAuth.js with Google, GitHub, and credentialsENVIRONMENT=your-db-name

- **[💳 Stripe Integration](./docs/STRIPE_GUIDE.md)** - Payment processing and webhooks```

- **[⚙️ Environment Setup](./docs/ENV_SETUP.md)** - Environment variables configuration

- **[🗄️ Database Setup](./docs/DATABASE_GUIDE.md)** - MongoDB schemas and connection2. **Generate AUTH_SECRET**:

- **[🔧 Development Workflow](./docs/DEV_WORKFLOW.md)** - Development process and testing```bash

node -e "console.log('AUTH_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"

## 🛠️ Tech Stack```



- **Framework:** Next.js 13+ (App Router)3. **Test Authentication**:

- **Authentication:** NextAuth.js v5```bash

- **Database:** MongoDB with Mongoosenpm run dev

- **Payments:** Stripe# Navigate to /account → Should redirect to login

- **Styling:** Tailwind CSS# Login → Should redirect back to /account

- **UI Components:** shadcn/ui```

- **Language:** JavaScript

3. **Install Dependencies**:

## 🏗️ Project Structure```bash

npm install next-auth@beta @auth/mongodb-adapter mongodb bcryptjs mongoose

``````

edu-connect/

├── app/                    # Next.js app directory### Features Overview

│   ├── (main)/            # Main application routes

│   ├── api/               # API routes✅ **Secure Authentication**

│   ├── login/             # Authentication pages- Email/password login with bcrypt hashing

│   └── register/          # Registration pages- JWT-based session management

├── components/            # Reusable UI components- Role-based access control

├── docs/                  # Complete documentation

├── models/               # Database models✅ **Database Integration**

├── services/             # External service integrations- MongoDB with Mongoose ODM

└── lib/                  # Utility functions- Custom user model with profile data

```- Optimized connection handling



## 🤝 Contributing✅ **Modern Implementation**

- NextAuth.js v5 with App Router

1. Fork the repository- Server Actions for form handling

2. Create your feature branch (`git checkout -b feature/amazing-feature`)- Client/Server component support

3. Commit your changes (`git commit -m 'Add some amazing feature'`)

4. Push to the branch (`git push origin feature/amazing-feature`)✅ **User Experience**

5. Open a Pull Request- Responsive login/logout flow

- Error handling and validation

## 📄 License- Session persistence



This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.✅ **Developer Friendly**

- TypeScript ready

## 🆘 Support- Environment variable configuration

- Comprehensive documentation

If you encounter any issues or have questions:

### Quick Usage

1. Check the [📖 Documentation](./docs/README.md)

2. Search existing [GitHub Issues](https://github.com/mrida74/edu-connect/issues)**Protect Server Components:**

3. Create a new issue with detailed information```javascript

import { auth } from "@/auth";

---

export default async function ProtectedPage() {

**Happy Learning! 🎓✨**  const session = await auth();
  if (!session) redirect("/login");
  return <div>Welcome {session.user.name}</div>;
}
```

**Protect Client Components:**
```javascript
"use client";
import { useSession } from "next-auth/react";

export function UserProfile() {
  const { data: session } = useSession();
  if (!session) return <div>Please login</div>;
  return <div>Hello {session.user.name}</div>;
}
```

### Key Files Structure
```
├── auth.js                              # NextAuth configuration
├── app/api/auth/[...nextauth]/route.js  # API routes
├── db/mongoClientPromise.js             # MongoDB client
├── models/user-model.js                 # User schema
├── db/queries/user.js                   # Database operations
└── app/actions/index.js                 # Server actions
```

### Complete Setup Guide
📚 For detailed implementation, login/logout process, and step-by-step setup instructions, see:
**[NEXTAUTH_COMPLETE_SETUP_GUIDE.md](./NEXTAUTH_COMPLETE_SETUP_GUIDE.md)**

### Key Files
- `auth.js` - NextAuth configuration
- `app/api/auth/[...nextauth]/route.js` - API routes
- `db/mongoClientPromise.js` - MongoDB client
- `models/user-model.js` - User schema
- `db/queries/user.js` - Database operations
- `app/actions/index.js` - Server actions

### Complete Setup Guide
📚 For detailed implementation, login/logout process, and step-by-step setup instructions, see:
**[NEXTAUTH_COMPLETE_SETUP_GUIDE.md](./NEXTAUTH_COMPLETE_SETUP_GUIDE.md)**

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
