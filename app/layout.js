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