"use client";

import { useSession } from "next-auth/react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { ProjectsView } from "@/components/dashboard/projects-view"
import { TemplateGallery } from "@/components/dashboard/template-gallery"
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts"
import { useIsMobile } from "@/hooks/use-mobile"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const isMobile = useIsMobile()

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="mb-4">You need to sign in to access the dashboard.</p>
          <a href="/login" className="text-blue-500 hover:underline">
            Sign In
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {!isMobile && <DashboardSidebar />}
        <DashboardHeader />
      
      <main className={`pt-16 ${!isMobile ? "ml-64" : ""} transition-all duration-300`}>
        <div className="p-6 space-y-8">
          {/* Welcome Section */}
          <div className="text-white">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {session?.user?.name || session?.user?.email}!
            </h1>
            <p className="text-white/70">
              Continue building amazing AI workflows and automations.
            </p>
          </div>
          
          {/* Analytics */}
          <AnalyticsCharts />

          {/* Projects */}
          <ProjectsView />

          {/* Templates */}
          <TemplateGallery />
          </div>
        </main>
    </div>
  )
}
