'use client';

import { usePathname } from 'next/navigation';
import FuturisticNavbar from '@/components/Navbar';
import FooterDemo from '@/components/Footer';

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Hide navbar and footer on dashboard routes
  const isDashboard = pathname?.startsWith('/dashboard');

  return (
    <>
      {!isDashboard && <FuturisticNavbar />}
      {children}
      {!isDashboard && <FooterDemo />}
    </>
  );
}