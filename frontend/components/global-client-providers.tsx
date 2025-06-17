'use client';

import { useSession } from "next-auth/react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Navigation } from "@/components/Navigation";
import { NotificationContainer } from "@/components/NotificationContainer";
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GlobalClientProviders({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const loading = status === "loading";
  const user = session?.user;

  // Redirect to login if not authenticated and not on auth pages or root page
  useEffect(() => {
    if (!loading && !user && pathname !== '/login' && pathname !== '/signup' && pathname !== '/signin' && pathname !== '/') {
      router.push('/login');
    }
  }, [user, loading, pathname, router]);

  const showNavigation = user && !loading && pathname !== '/' && pathname !== '/login' && pathname !== '/signup' && pathname !== '/signin';

  if (loading) {
    // Show a loading spinner while auth is loading
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Loading application...</p>
        </div>
      </div>
    );
  }

  // If not authenticated and on a protected route, show nothing while redirecting
  if (!user && pathname !== '/login' && pathname !== '/signup' && pathname !== '/signin' && pathname !== '/') {
    return null;
  }

  return (
    <ErrorBoundary>
      {showNavigation && <Navigation />}
      <NotificationContainer />
      {children}
    </ErrorBoundary>
  );
} 