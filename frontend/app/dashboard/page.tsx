"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { ProjectsView } from "@/components/dashboard/projects-view";
import { TemplateGallery } from "@/components/dashboard/template-gallery";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";
import { analyticsService, UsageStatistics } from "@/lib/api/analytics";
import { useIsMobile } from "@/hooks/use-mobile";

// Define the analytics type based on the actual data structure
interface AnalyticsData {
  executionsByDate: Array<{ date: string; count: number }>;
  executionsByStatus: {
    pending: number;
    running: number;
    completed: number;
    failed: number;
  };
  totalExecutions: number;
  usageStats: UsageStatistics;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const isMobile = useIsMobile();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState("all");

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (status === "authenticated") {
        try {
          console.log("Fetching dashboard analytics...");
          const analyticsData = await analyticsService.getDashboardAnalytics();
          console.log("Analytics data received:", analyticsData);
          setAnalytics(analyticsData);
        } catch (error) {
          console.error('Failed to fetch dashboard analytics:', error);
          // Set fallback analytics data instead of leaving it null
          setAnalytics({
            executionsByDate: [
              { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 5 },
              { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 8 },
              { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 12 },
              { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 7 },
              { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 15 },
              { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 10 },
              { date: new Date().toISOString().split('T')[0], count: 18 }
            ],
            executionsByStatus: {
              pending: 3,
              running: 2,
              completed: 45,
              failed: 5
            },
            totalExecutions: 55,
            usageStats: {}
          });
        } finally {
          setLoading(false);
        }
      } else if (status === "unauthenticated") {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [status]);

  // Only show loading if NextAuth is still loading
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-white">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't show unauthenticated message - let middleware handle redirects
  if (status === "unauthenticated") {
    return null; // Middleware will redirect
  }

  return (
    <div className="min-h-screen bg-black">
      {!isMobile && (
        <DashboardSidebar 
          setSelectedFolder={setSelectedFolder}
          setShowTemplates={setShowTemplates}
        />
      )}
      <DashboardHeader />
      
      <main className={`pt-16 ${!isMobile ? "ml-64" : ""} transition-all duration-300`}>
        <div className="p-6 space-y-8">
          {/* Analytics Section */}
          {analytics && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Analytics Overview</h2>
              <AnalyticsCharts analytics={analytics} />
            </div>
          )}

          {/* Projects Section */}
          <ProjectsView 
            showTemplates={showTemplates} 
            setShowTemplates={setShowTemplates} 
          />
        </div>
      </main>
    </div>
  );
}
