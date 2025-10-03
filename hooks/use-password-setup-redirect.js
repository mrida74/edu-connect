"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function usePasswordSetupRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Skip if still loading
    if (status === 'loading') return;
    
    // Skip if not authenticated
    if (!session?.user) return;
    
    // Skip if already on setup page or auth pages
    if (pathname.startsWith('/auth/') || pathname === '/login' || pathname === '/register') return;
    
    // Skip if on courses page and just redirected (prevent infinite loop)
    if (pathname === '/courses' && isRedirecting) {
      console.log('🛑 Skipping redirect check - just redirected to courses');
      return;
    }
    
    // Debug logging
    console.log('🔍 Password Setup Check:', {
      provider: session.user?.provider,
      hasPassword: session.user?.hasPassword,
      pathname: pathname,
      isRedirecting: isRedirecting
    });
    
    // Only redirect if Google user AND no password AND not already redirecting
    if (
      session.user.provider === 'google' && 
      session.user.hasPassword === false &&
      !isRedirecting // Prevent multiple redirects
    ) {
      console.log('🔄 Redirecting Google user to mandatory password setup...');
      setIsRedirecting(true);
      
      // Add delay for smoother transition
      setTimeout(() => {
        router.push(`/auth/complete-setup?email=${encodeURIComponent(session.user.email)}`);
      }, 800); // 800ms delay for smooth UX
    }
  }, [session, status, router, pathname, isRedirecting]);

  return {
    needsPasswordSetup: session?.user?.provider === 'google' && session?.user?.hasPassword === false,
    isLoading: status === 'loading',
    isRedirecting
  };
}