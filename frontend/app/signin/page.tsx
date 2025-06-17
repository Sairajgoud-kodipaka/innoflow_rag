import { NextAuthSigninForm } from "@/components/auth/nextauth-signin-form"
import Link from "next/link"
import Image from "next/image"

export default function SigninPage() {
  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-12">
        <div className="grid w-full max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="rounded-lg border border-white/10 bg-black/50 p-8 backdrop-blur-sm">
            <div className="mb-6 flex items-center gap-2">
              <Link href="/" className="flex items-center gap-1">
                <Image
                  src="/images/logo.jpg"
                  alt="Innoflow Logo"
                  width={50}
                  height={50}
                  className="text-primary"
                />
                <span className="text-2xl font-bold text-white">Innoflow</span>
              </Link>
            </div>
            <h1 className="mb-6 text-3xl font-bold text-white">Sign In</h1>
            <NextAuthSigninForm />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="mb-8 text-3xl font-bold text-white">Welcome Back to InnoFlow</h2>
            <div className="space-y-6">
              <div className="rounded-lg border border-white/10 bg-black/30 p-6 backdrop-blur-sm hover:border-primary/20 transition-colors">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/10 text-white">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-white">Continue Building Amazing AI Applications</h3>
                </div>
                <p className="text-white/70">Pick up where you left off and continue creating powerful AI workflows with our intuitive drag-and-drop interface.</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/30 p-6 backdrop-blur-sm hover:border-primary/20 transition-colors">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/10 text-white">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 21V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M8 7H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M8 11H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M8 15H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-white">Access Your Saved Projects</h3>
                </div>
                <p className="text-white/70">All your workflows, templates, and AI models are safely stored and ready to use. Continue your innovation journey seamlessly.</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/30 p-6 backdrop-blur-sm hover:border-primary/20 transition-colors">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/10 text-white">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-white">Join the Community</h3>
                </div>
                <p className="text-white/70">Connect with other AI developers, share your creations, and get inspired by the community's innovative solutions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 