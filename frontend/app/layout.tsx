import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { NextAuthProvider } from "@/components/providers/session-provider"
import GlobalClientProviders from "@/components/global-client-providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Innoflow - Where Ideas Stream and Innovation Flows",
  description: "Build AI-powered agents and workflows with a visual interface",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/logo.jpg" type="image/jpeg" />
      </head>
      <body className={inter.className}>
        <NextAuthProvider>
          <GlobalClientProviders>
            {children}
          </GlobalClientProviders>
        </NextAuthProvider>
      </body>
    </html>
  )
}

import './globals.css'