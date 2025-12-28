import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, User, Settings, LogOut } from "lucide-react";
import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Topbar = ({ sidebarCollapsed, setSidebarCollapsed }: any) => {
  const { isSignedIn, user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-16 border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-20"
    >
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="lg:hidden text-white/80 hover:text-white hover:bg-white/5 cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </motion.div>
          <h2 className="text-lg font-semibold text-white">Dashboard</h2>
        </div>
        
        <div className="flex items-center gap-3">
          {!isLoaded ? (
            // Loading skeleton
            <div className="flex items-center gap-3">
              <div className="h-4 w-24 bg-white/10 rounded animate-pulse hidden sm:block" />
              <div className="h-9 w-9 bg-white/10 rounded-full animate-pulse" />
            </div>
          ) : isSignedIn ? (
            <>
              {/* Greeting Text - Hidden on mobile */}
              <span className="text-white/80 text-sm font-medium hidden sm:block">
                Hi, {user?.firstName || 'User'}
              </span>

              {/* User Avatar Dropdown */}
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full border-white/30 bg-white/5 backdrop-blur-xl hover:bg-white/10 hover:border-white/40 cursor-pointer overflow-hidden h-9 w-9"
                    >
                      {user?.imageUrl ? (
                        <img 
                          src={user.imageUrl} 
                          alt={user.firstName || 'User'} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5 text-white" />
                      )}
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end"
                  sideOffset={8}
                  className="w-56 bg-black/95 backdrop-blur-xl border-white/20 text-white"
                >
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs leading-none text-white/60">
                        {user?.primaryEmailAddress?.emailAddress}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem className="cursor-pointer hover:bg-white/10 focus:bg-white/10">
                    <Settings className="mr-2 h-4 w-4" />
                    <span className="text-white">Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem 
                    className="cursor-pointer hover:bg-white/10 focus:bg-white/10 text-red-400 focus:text-red-400"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            // Fallback if not signed in
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-white/30 bg-white/5 backdrop-blur-xl hover:bg-white/10 hover:border-white/40 cursor-pointer h-9 w-9"
              >
                <User className="h-5 w-5 text-white" />
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Topbar;