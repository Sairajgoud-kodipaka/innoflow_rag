'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/lib/api/auth';
import { toast } from '@/components/ui/use-toast';

export default function GitHubCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        toast({
          title: 'Error',
          description: 'GitHub login failed',
          variant: 'destructive',
        });
        router.push('/login');
        return;
      }

      if (!code) {
        toast({
          title: 'Error',
          description: 'No authorization code received',
          variant: 'destructive',
        });
        router.push('/login');
        return;
      }

      try {
        await authService.githubLogin(code);
        toast({
          title: 'Success',
          description: 'Successfully logged in with GitHub',
        });
        router.push('/dashboard');
      } catch (error) {
        console.error('GitHub callback error:', error);
        toast({
          title: 'Error',
          description: 'Failed to complete GitHub login',
          variant: 'destructive',
        });
        router.push('/login');
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Completing GitHub Login</h1>
        <p className="mt-2 text-gray-600">Please wait while we complete your login...</p>
      </div>
    </div>
  );
} 