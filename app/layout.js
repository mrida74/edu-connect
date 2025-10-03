import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { dbConnect } from "@/services/mongo";
import { SessionProvider } from "next-auth/react";
import { PasswordSetupChecker } from "@/components/password-setup-checker";


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
        <SessionProvider 
          refetchInterval={5 * 60}         // Check every 5 minutes (balanced)
          refetchOnWindowFocus={true}      // Check when user comes back
          refetchWhenOffline={false}       // Don't check when offline
        >
          <PasswordSetupChecker />
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