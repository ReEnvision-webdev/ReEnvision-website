'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';

/**
 * Hook to automatically log out banned users
 */
export function useBannedUserLogout() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const checkBannedStatus = async () => {
        try {
          // Check if the user is banned by fetching their info from the API
          const response = await fetch(`/api/users/${session.user.id}`);

          if (response.ok) {
            const userData = await response.json();

            // If user is banned, log them out
            if (userData.isBanned) {
              // Sign out the user
              await signOut({ redirect: false });

              // Redirect to home page or banned page
              window.location.href = '/';
            }
          } else if (response.status === 404) {
            // If user doesn't exist, log them out
            await signOut({ redirect: false });
            window.location.href = '/';
          }
        } catch (error) {
          console.error('Error checking user banned status:', error);
        }
      };

      // Check immediately when component mounts
      checkBannedStatus();
    }
  }, [status, session?.user?.id]);
}