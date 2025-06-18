import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import type { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Call your backend API for authentication
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          if (response.ok) {
            const user = await response.json()
            return {
              id: user.id,
              email: user.email,
              name: user.name || user.first_name + ' ' + user.last_name,
              image: user.profile_picture,
            }
          }
          return null
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Persist the OAuth access_token and user info to the token right after signin
      if (account && user) {
        token.accessToken = account.access_token
        token.user = user
        
        // For Google OAuth, create/update user in backend and get JWT tokens
        if (account.provider === 'google') {
          try {
            console.log('🔄 Syncing Google user with backend...', {
              email: user.email,
              name: user.name,
              apiUrl: process.env.NEXT_PUBLIC_API_URL
            });
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/google/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: user.email,
                name: user.name,
                image: user.image,
                google_id: account.providerAccountId,
              }),
            })
            
            console.log('📡 Backend sync response:', {
              status: response.status,
              statusText: response.statusText,
              ok: response.ok
            });
            
            if (response.ok) {
              const backendUser = await response.json()
              console.log('✅ Backend user sync successful with JWT tokens:', {
                hasAccessToken: !!backendUser.access_token,
                hasRefreshToken: !!backendUser.refresh_token,
                userId: backendUser.id,
                username: backendUser.username
              })
              
              // Store the JWT tokens for API calls
              token.jwtAccessToken = backendUser.access_token
              token.jwtRefreshToken = backendUser.refresh_token
              
              token.user = {
                ...user,
                id: backendUser.id,
                username: backendUser.username,
                company: backendUser.company,
                bio: backendUser.bio,
              }
              token.backendUser = backendUser
            } else {
              const errorText = await response.text()
              console.error('❌ Backend user sync failed:', {
                status: response.status,
                statusText: response.statusText,
                error: errorText
              })
            }
          } catch (error: any) {
            console.error('❌ Backend user sync error:', {
              message: error?.message || 'Unknown error',
              name: error?.name || 'Unknown',
              apiUrl: process.env.NEXT_PUBLIC_API_URL
            })
          }
        }
      }
      return token
    },
    async session({ session, token }) {
      // Send properties to the client
      session.accessToken = token.accessToken as string
      session.jwtAccessToken = token.jwtAccessToken as string
      session.jwtRefreshToken = token.jwtRefreshToken as string
      session.user = token.user as any
      session.backendUser = token.backendUser as any
      return session
    },
    async redirect({ url, baseUrl }) {
      // Handle redirects after authentication
      console.log('NextAuth redirect:', { url, baseUrl })
      
      // If redirecting to sign-in pages, go to dashboard instead
      if (url.includes('/signin') || url.includes('/login') || url.includes('/signup')) {
        return `${baseUrl}/dashboard`
      }
      
      // If it's a relative URL, prepend baseUrl
      if (url.startsWith("/")) return `${baseUrl}${url}`
      
      // If it's the same origin, allow it
      if (new URL(url).origin === baseUrl) return url
      
      // Default to dashboard for successful authentication
      return `${baseUrl}/dashboard`
    }
  },
  pages: {
    signIn: '/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}

export default NextAuth(authOptions) 