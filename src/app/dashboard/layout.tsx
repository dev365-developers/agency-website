"use client";
import { ReactNode, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Only redirect after Clerk has finished loading
    if (isLoaded && !isSignedIn) {
      router.push("/");
    }
  }, [isLoaded, isSignedIn, router]);

  // Show loading spinner while checking authentication
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center space-y-4"
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full animate-pulse" />
            <Loader2 className="h-12 w-12 text-white animate-spin relative" />
          </div>
          <p className="text-white/60 text-sm">Loading...</p>
        </motion.div>
      </div>
    );
  }

  // Show loading while redirecting unauthenticated users
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center space-y-4"
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full animate-pulse" />
            <Loader2 className="h-12 w-12 text-white animate-spin relative" />
          </div>
          <p className="text-white/60 text-sm">Redirecting...</p>
        </motion.div>
      </div>
    );
  }

  // User is authenticated, render the dashboard
  return (
    <div className="min-h-screen bg-black">
      {children}
    </div>
  );
}