import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    accessToken?: string
    jwtAccessToken?: string
    jwtRefreshToken?: string
    backendUser?: any
    user: {
      id: string
      email: string
      name: string
      image?: string
      username?: string
      company?: string
      bio?: string
    }
  }

  interface User {
    id: string
    email: string
    name: string
    image?: string
    username?: string
    company?: string
    bio?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    jwtAccessToken?: string
    jwtRefreshToken?: string
    backendUser?: any
    user?: {
      id: string
      email: string
      name: string
      image?: string
      username?: string
      company?: string
      bio?: string
    }
  }
} 