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
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  
  jwt: {
    maxAge: 7 * 24 * 60 * 60, // 7 days
    encryption: false, // Disable encryption for development
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
                name: `${user?.firstName} ${user?.lastName}`, // Add full name
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
    async jwt({ token, user, trigger }) {
      // Handle JWT errors gracefully
      try {
        if (user) {
          token.id = user.id;
          token.firstName = user.firstName;
          token.lastName = user.lastName;
          token.role = user.role;
          token.profilePicture = user.profilePicture;
        }
        return token;
      } catch (error) {
        console.error("JWT callback error:", error);
        return token;
      }
    },
    
    async session({ session, token }) {
      try {
        if (token) {
          session.user.id = token.id;
          session.user.firstName = token.firstName;
          session.user.lastName = token.lastName;
          session.user.name = `${token.firstName} ${token.lastName}`;
          session.user.role = token.role;
          session.user.profilePicture = token.profilePicture;
        }
        return session;
      } catch (error) {
        console.error("Session callback error:", error);
        return session;
      }
    },
  },
  
  // Pages configuration
  pages: {
    signIn: '/login',
    error: '/auth/error', // Error code passed in query string as ?error=
  },
  
  secret: process.env.AUTH_SECRET,
});

