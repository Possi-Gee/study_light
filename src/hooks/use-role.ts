
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './use-auth';
import { getUserById, UserProfile } from '@/services/user-service';

export function useRole() {
  const { user, loading: authLoading } = useAuth();
  const [role, setRole] = useState<UserProfile['role'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If auth is still loading, the role is also loading.
    if (authLoading) {
      setIsLoading(true);
      return;
    }

    // If there is no user, we are done loading and there is no role.
    if (!user) {
      setRole(null);
      setIsLoading(false);
      return;
    }

    // If there is a user, fetch their role.
    let isMounted = true;
    async function fetchRole() {
      try {
        const userProfile = await getUserById(user.uid);
        if (isMounted) {
            if (userProfile) {
              setRole(userProfile.role);
            } else {
              setRole(null);
            }
        }
      } catch (error) {
        console.error("Failed to fetch user role:", error);
        if (isMounted) {
            setRole(null);
        }
      } finally {
        if (isMounted) {
            setIsLoading(false);
        }
      }
    }

    fetchRole();
    
    return () => {
        isMounted = false;
    }
  }, [user, authLoading]);

  return { role, isLoading };
}
