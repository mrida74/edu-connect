import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import mongoClientPromise from "@/db/mongoClientPromise";
import { getUserByEmail } from "./db/quaries/user";
import { User } from "./models/user-model";  // User model import
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
                role: user?.role?.toLowerCase() || 'student', // Handle case and default
                hasPassword: user?.hasPassword || false // Include password status
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
      allowDangerousEmailAccountLinking: true,
    }),
    
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  
  // Add callbacks to preserve user data in session
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle Google/GitHub social login
      if (account.provider === "google" || account.provider === "github") {
        // Split name into firstName and lastName for Google users
        if (account.provider === "google") {
          const fullName = profile.name || user.name || "";
          const nameParts = fullName.trim().split(" ");
          const firstName = nameParts[0] || "";
          const lastName = nameParts.slice(1).join(" ") || "";
          
          // Check if user exists in database
          const existingUser = await getUserByEmail(user.email);
          
          if (!existingUser) {
            // Create new Google user with consistent structure
            const newUser = await User.create({
              firstName: firstName,
              lastName: lastName,
              email: user.email,
              profilePicture: user.image,  // Google profile image
              role: "student",
              provider: "google",
              emailVerified: new Date(),
              hasPassword: false // New Google users don't have password yet
            });
            
            // Don't redirect here - let client-side handle it
          } else {
            // Existing user - update if needed
            if (!existingUser.firstName) {
              await User.updateOne(
                { email: user.email },
                {
                  firstName: firstName,
                  lastName: lastName,
                  role: existingUser.role || "student",
                  profilePicture: user.image
                }
              );
            }
          }
        }
        return true;
      }
      return true; // Allow credentials login
    },
    
    async jwt({ token, user, account, profile, trigger }) {
      try {
        // Only set user data on first login (when user object exists)
        if (user) {
          if (account?.provider === "google") {
            // For Google users, split name and set data
            const fullName = profile?.name || user.name || "";
            const nameParts = fullName.trim().split(" ");
            
            token.firstName = nameParts[0] || "";
            token.lastName = nameParts.slice(1).join(" ") || "";
            token.role = user.role || 'student';
            token.profilePicture = user.image;  // Google image
          } else {
            // For credentials users, use database data
            token.firstName = user.firstName;
            token.lastName = user.lastName;
            token.role = user.role || 'student';
            token.profilePicture = user.profilePicture || "/assets/images/profile.jpg";
          }
          
          // Common fields for all users
          token.id = user.id;
          token.phone = user.phone;
          token.bio = user.bio;
          token.socialMedia = user.socialMedia;
          token.hasPassword = user.hasPassword || false; // Track password status
        }
        
        // Always check database for password status
        // This ensures fresh data on session updates
        try {
          const currentUser = await getUserByEmail(token.email);
          if (currentUser) {
            token.hasPassword = currentUser.hasPassword || false;
          }
        } catch (error) {
          console.error("Error checking user status:", error);
          // Fallback to existing token values
          token.hasPassword = token.hasPassword || false;
        }
        
        // Set provider info on first login
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
          session.user.name = (token?.firstName || token?.lastName ) ? `${token?.firstName} ${token?.lastName}`.trim() : session.user.name;
          session.user.role = token?.role;
          session.user.profilePicture = token?.profilePicture;
          session.user.image = token?.profilePicture;  // NextAuth compatibility এর জন্য
          session.user.phone = token?.phone;
          session.user.bio = token?.bio;
          session.user.socialMedia = token?.socialMedia;
          session.user.provider = token?.provider;
          session.user.hasPassword = token?.hasPassword || false; // Password status
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

