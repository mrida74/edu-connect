"use client";

import { usePasswordSetupRedirect } from "@/hooks/use-password-setup-redirect";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function PasswordSetupChecker() {
  const { needsPasswordSetup, isLoading, isRedirecting } = usePasswordSetupRedirect();
  const pathname = usePathname();
  const [showLoading, setShowLoading] = useState(false);

  // Control loading display with timeout
  useEffect(() => {
    if (isRedirecting && !pathname.startsWith('/auth/')) {
      setShowLoading(true);
      
      // Auto-hide loading after 3 seconds to prevent infinite loading
      const timeout = setTimeout(() => {
        console.log('⏰ Loading timeout - hiding loading overlay');
        setShowLoading(false);
      }, 3000);
      
      return () => clearTimeout(timeout);
    } else {
      setShowLoading(false);
    }
  }, [isRedirecting, pathname]);

  // Show loading overlay during redirect (with timeout protection)
  if (showLoading) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Setting up your account...</p>
        </div>
      </div>
    );
  }

  return null; // This component doesn't render anything normally
}