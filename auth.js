import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
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
                phone: user?.phone,
                bio: user?.bio,
                socialMedia: user?.socialMedia,
                role: user?.role?.toLowerCase() || 'student' // Handle case and default
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
    
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: { params: { prompt: "consent", access_type: "offline", response_type: "code" } },
    }),
    
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  
  // Add callbacks to preserve user data in session
  callbacks: {
    async signIn({ user, account, profile }) {
      // Allow all sign-ins (credentials, google, github)
      if (account.provider === "google" || account.provider === "github") {
        // Social login users are automatically verified
        return true;
      }
      return true; // Allow credentials login
    },
    
    async jwt({ token, user, account, profile }) {
      // Handle JWT errors gracefully
      try {
        // Only set user data on first login (when user object exists)
        if (user) {
          token.id = user.id;
          token.firstName = user.firstName;
          token.lastName = user.lastName;
          token.role = user.role || 'student'; // Default role for social users
          token.profilePicture = user.profilePicture || user.image;
          token.phone = user.phone;
          token.bio = user.bio;
          token.socialMedia = user.socialMedia;
        }
        
        // Only set provider info on first login (when account object exists)
        if (account) {
          token.provider = account.provider;
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
          session.user.firstName = token?.firstName;
          session.user.lastName = token?.lastName;
          session.user.name = (token?.firstName || token?.lastName ) ? `${token?.firstName} ${token?.lastName}` : session.user.name;
          session.user.role = token?.role;
          session.user.profilePicture = token?.profilePicture;
          session.user.phone = token?.phone;
          session.user.bio = token?.bio;
          session.user.socialMedia = token?.socialMedia;
          session.user.provider = token?.provider;
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

