import { withAuth } from "next-auth/middleware"

export default withAuth(
  // This function is only called if the `authorized` callback returns `true`
  function middleware(req) {
    console.log("🔒 Middleware executing for:", req.nextUrl.pathname)
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Always allow access to these paths
        const publicPaths = [
          "/",
          "/signin", 
          "/signup",
          "/login",
          "/api/auth"
        ]
        
        // Check if current path is public
        const isPublicPath = publicPaths.some(path => 
          pathname === path || pathname.startsWith(path + "/")
        )
        
        if (isPublicPath) {
          console.log("🔒 Public path allowed:", pathname)
          return true
        }

        // For protected paths, check if user is authenticated
        const isAuthenticated = !!token
        console.log("🔒 Protected path:", pathname, "- Authenticated:", isAuthenticated)
        
        if (!isAuthenticated) {
          console.log("🔒 Not authenticated, will redirect to signin")
        }
        
        return isAuthenticated
      },
    },
    pages: {
      signIn: "/signin",
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|images|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
} 