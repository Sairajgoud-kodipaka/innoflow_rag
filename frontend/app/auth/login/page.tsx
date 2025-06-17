'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthLoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the main login page
    router.replace('/login');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p>Redirecting to login...</p>
      </div>
    </div>
  );
} 