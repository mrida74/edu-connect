import { NextResponse } from 'next/server'

export function middleware(request) {
  // Define protected routes
  const protectedRoutes = ['/account']
  const { pathname } = request.nextUrl
  
  // Check if current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // Get session token from cookies (NextAuth v5 compatible)
  const sessionToken = request.cookies.get('authjs.session-token') ||
                      request.cookies.get('__Secure-authjs.session-token') ||
                      request.cookies.get('next-auth.session-token') ||
                      request.cookies.get('__Secure-next-auth.session-token')
  
  const isAuthenticated = !!sessionToken
  
  // If accessing protected route without authentication, redirect to login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // If authenticated and accessing login page, redirect to courses
  if (isAuthenticated && pathname === '/login') {
    return NextResponse.redirect(new URL('/courses', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}