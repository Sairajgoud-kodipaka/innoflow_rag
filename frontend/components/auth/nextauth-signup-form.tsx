"use client"

import React, { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Loader2, Mail, Lock, Eye, EyeOff, User, ArrowRight, Sparkles, Shield, Zap, Users } from "lucide-react"
import { toast } from "sonner"

export function NextAuthSignupForm() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const router = useRouter()

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!firstName || !lastName || !email || !password) {
      toast.error("Please fill in all fields")
      return
    }

    if (!agreeToTerms) {
      toast.error("Please agree to the terms and conditions")
      return
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    setIsLoading(true)

    try {
      // First create the user account via your backend API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          password,
        }),
      })

      if (response.ok) {
        // After successful registration, sign them in
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        })

        if (result?.error) {
          toast.error("Account created but sign in failed. Please try signing in manually.")
        } else if (result?.ok) {
          toast.success("Account created successfully! Welcome to Innoflow!")
          router.push("/dashboard")
        }
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || "Failed to create account")
      }
    } catch (error) {
      console.error("Sign up error:", error)
      toast.error("An error occurred during sign up")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true)
    
    try {
      const result = await signIn("google", {
        redirect: false,
        callbackUrl: "/dashboard"
      })

      if (result?.error) {
        toast.error("Google sign up failed")
      } else if (result?.url) {
        toast.success("Signing up with Google...")
        window.location.href = result.url
      }
    } catch (error) {
      console.error("Google sign up error:", error)
      toast.error("An error occurred during Google sign up")
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-violet-600/8 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-50" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      <div className="relative z-10 flex min-h-screen">
        {/* Left side - Auth Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Logo and Header */}
            <div className="text-center mb-10">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                <img src="/images/logo.jpg" alt="logo" className="w-10 h-10" />

                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-2xl blur opacity-30 animate-pulse"></div>
                </div>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-3">
                Create Account
              </h1>
              <p className="text-slate-400 text-lg">Join Innoflow and start building</p>
            </div>

            {/* Auth Form */}
            <div className="relative">
              {/* Premium Glass Card */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl blur-sm"></div>
              <div className="relative bg-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl shadow-black/50">
                
                {/* Social Login */}
                <Button
                  onClick={handleGoogleSignUp}
                  disabled={isGoogleLoading || isLoading}
                  className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-4 rounded-2xl mb-8 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGoogleLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin mr-3" />
                  ) : (
                    <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  )}
                  Continue with Google
                </Button>

                <div className="relative mb-8">
                  <Separator className="bg-slate-700" />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900/50 px-4 text-slate-400 font-medium">
                    OR
                  </span>
                </div>

                {/* Email/Password Form */}
                <form onSubmit={handleEmailSignUp} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-white font-medium text-sm">
                        First Name
                      </Label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                        <Input
                          id="firstName"
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="John"
                          className="pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-white placeholder:text-slate-400 transition-all duration-200"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-white font-medium text-sm">
                        Last Name
                      </Label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                        <Input
                          id="lastName"
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Doe"
                          className="pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-white placeholder:text-slate-400 transition-all duration-200"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white font-medium text-sm">
                      Email
                    </Label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@example.com"
                        className="pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-white placeholder:text-slate-400 transition-all duration-200"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white font-medium text-sm">
                      Password
                    </Label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="pl-12 pr-12 py-4 bg-slate-800/50 border border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-white placeholder:text-slate-400 transition-all duration-200"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="text-xs text-slate-400">
                      Must be at least 6 characters
                    </p>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms"
                      checked={agreeToTerms}
                      onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                      className="border-slate-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 mt-1"
                    />
                    <Label htmlFor="terms" className="text-sm text-slate-300 leading-relaxed">
                      I agree to the{" "}
                      <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                        Privacy Policy
                      </a>
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || isGoogleLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-600/25 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin mr-2" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-slate-400">
                    Already have an account?{" "}
                    <a href="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                      Sign in here
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Feature Highlights */}
        <div className="hidden lg:flex flex-1 items-center justify-center p-12">
          <div className="max-w-lg text-center">
            <div className="mb-12">
              <div className="relative inline-block mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-600/20 via-indigo-600/20 to-violet-600/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/10 shadow-2xl">
                  <svg className="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="absolute -inset-2 bg-gradient-to-br from-blue-600/20 via-indigo-600/20 to-violet-600/20 rounded-3xl blur-xl opacity-50 animate-pulse"></div>
              </div>
              
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent mb-6">
                Start Building Today
              </h2>
              
              <p className="text-slate-300 text-lg leading-relaxed">
                Join thousands of developers and teams who are already building 
                amazing AI-powered applications with Innoflow.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4 text-left group">
                <div className="relative">
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-blue-400 rounded-full blur-sm opacity-60"></div>
                </div>
                <Sparkles className="w-5 h-5 text-blue-400 transition-transform group-hover:scale-110" />
                <span className="text-slate-300 text-lg font-medium group-hover:text-white transition-colors">
                  Free to get started
                </span>
              </div>
              
              <div className="flex items-center space-x-4 text-left group">
                <div className="relative">
                  <div className="w-3 h-3 bg-indigo-400 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-indigo-400 rounded-full blur-sm opacity-60"></div>
                </div>
                <Shield className="w-5 h-5 text-indigo-400 transition-transform group-hover:scale-110" />
                <span className="text-slate-300 text-lg font-medium group-hover:text-white transition-colors">
                  No credit card required
                </span>
              </div>
              
              <div className="flex items-center space-x-4 text-left group">
                <div className="relative">
                  <div className="w-3 h-3 bg-violet-400 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-violet-400 rounded-full blur-sm opacity-60"></div>
                </div>
                <Zap className="w-5 h-5 text-violet-400 transition-transform group-hover:scale-110" />
                <span className="text-slate-300 text-lg font-medium group-hover:text-white transition-colors">
                  Deploy in minutes
                </span>
              </div>
              
              <div className="flex items-center space-x-4 text-left group">
                <div className="relative">
                  <div className="w-3 h-3 bg-slate-400 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-slate-400 rounded-full blur-sm opacity-60"></div>
                </div>
                <Users className="w-5 h-5 text-slate-400 transition-transform group-hover:scale-110" />
                <span className="text-slate-300 text-lg font-medium group-hover:text-white transition-colors">
                  24/7 support
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}