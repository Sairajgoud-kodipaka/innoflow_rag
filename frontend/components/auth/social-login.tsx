'use client';

declare const google: any;

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/api/auth';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { toast } from '@/components/ui/use-toast';

interface SocialLoginProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function SocialLogin({ onSuccess, onError }: SocialLoginProps) {
  const [isLoading, setIsLoading] = useState<{
    google: boolean;
    github: boolean;
  }>({
    google: false,
    github: false,
  });
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setIsLoading((prev) => ({ ...prev, google: true }));
    try {
      // Initialize Google OAuth client
      const client = google.accounts.oauth2.initTokenClient({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        scope: 'email profile',
        callback: async (response: any) => {
          if (response.error) {
            throw new Error(response.error);
          }
          const result = await authService.googleLogin(response.access_token);
          toast({
            title: 'Success',
            description: 'Successfully logged in with Google',
          });
          onSuccess?.();
          router.push('/dashboard');
        },
      });
      client.requestAccessToken();
    } catch (error) {
      console.error('Google login error:', error);
      toast({
        title: 'Error',
        description: 'Failed to login with Google',
        variant: 'destructive',
      });
      onError?.(error as Error);
    } finally {
      setIsLoading((prev) => ({ ...prev, google: false }));
    }
  };

  const handleGithubLogin = async () => {
    setIsLoading((prev) => ({ ...prev, github: true }));
    try {
      // Redirect to GitHub OAuth
      const githubClientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
      const redirectUri = `${window.location.origin}/auth/github/callback`;
      const scope = 'user:email';
      const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${redirectUri}&scope=${scope}`;
      window.location.href = githubAuthUrl;
    } catch (error) {
      console.error('GitHub login error:', error);
      toast({
        title: 'Error',
        description: 'Failed to login with GitHub',
        variant: 'destructive',
      });
      onError?.(error as Error);
    } finally {
      setIsLoading((prev) => ({ ...prev, github: false }));
    }
  };

  return (
    <div className="grid gap-4">
      <Button
        variant="outline"
        type="button"
        disabled={isLoading.google}
        onClick={handleGoogleLogin}
      >
        {isLoading.google ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}
        Continue with Google
      </Button>
      <Button
        variant="outline"
        type="button"
        disabled={isLoading.github}
        onClick={handleGithubLogin}
      >
        {isLoading.github ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 h-4 w-4" />
        )}
        Continue with GitHub
      </Button>
    </div>
  );
} 