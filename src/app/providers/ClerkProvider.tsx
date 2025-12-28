// app/providers/ClerkProvider.tsx
'use client';

import { ClerkProvider as ClerkProviderBase } from '@clerk/nextjs';
import { useEffect, useRef } from 'react';
import { useAuth } from '@clerk/nextjs';

function SyncUser() {
  const { userId, isLoaded, getToken } = useAuth();
  const syncedRef = useRef(false);

  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded || !userId || syncedRef.current) return;

      // Check localStorage for recent sync (within last 24 hours)
      const lastSyncKey = `clerk_last_sync_${userId}`;
      const lastSyncTime = localStorage.getItem(lastSyncKey);
      
      if (lastSyncTime) {
        const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
        if (parseInt(lastSyncTime) > twentyFourHoursAgo) {
          // User was synced recently, skip
          syncedRef.current = true;
          return;
        }
      }

      // Mark as syncing to prevent duplicate requests
      syncedRef.current = true;

      try {
        const token = await getToken();
        if (!token) {
          syncedRef.current = false;
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/sync`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        });

        if (response.ok) {
          // Store successful sync timestamp
          localStorage.setItem(lastSyncKey, Date.now().toString());
          console.log('User synced successfully');
        } else {
          // Allow retry on failure
          syncedRef.current = false;
          console.error('Sync failed:', await response.text());
        }
      } catch (error) {
        // Allow retry on error
        syncedRef.current = false;
        console.error('Sync error:', error);
      }
    };

    syncUser();
  }, [userId, isLoaded, getToken]);

  return null;
}

export function ClerkProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProviderBase
      appearance={{
        elements: {
          rootBox: 'hidden',
        },
      }}
    >
      <SyncUser />
      {children}
    </ClerkProviderBase>
  );
}