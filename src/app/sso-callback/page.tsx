'use client';

import { AuthenticateWithRedirectCallback } from '@clerk/nextjs';
import { useEffect } from 'react';

export default function SSOCallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <AuthenticateWithRedirectCallback />
    </div>
  );
}