
'use client';

import { useEffect, ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from './use-auth-store';

const unprotectedRoutes = ['/login', '/register', '/forgot-password'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, loading, setUser } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, [setUser]);

  useEffect(() => {
    if (!loading && !user && !unprotectedRoutes.includes(pathname)) {
      router.push('/login');
    }
  }, [loading, user, router, pathname]);

  if (loading || (!user && !unprotectedRoutes.includes(pathname))) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  return <>{children}</>;
}

export const useAuth = () => {
    return useAuthStore();
}
