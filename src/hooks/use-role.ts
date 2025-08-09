
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './use-auth';
import { getUserById, UserProfile } from '@/services/user-service';

export function useRole() {
  const { user, loading: authLoading } = useAuth();
  const [role, setRole] = useState<UserProfile['role'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRole() {
      if (authLoading) {
        return; // Wait for auth to finish loading
      }
      if (!user) {
        setRole(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const userProfile = await getUserById(user.uid);
        if (userProfile) {
          setRole(userProfile.role);
        } else {
          setRole(null);
        }
      } catch (error) {
        console.error("Failed to fetch user role:", error);
        setRole(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRole();
  }, [user, authLoading]);

  return { role, isLoading };
}
