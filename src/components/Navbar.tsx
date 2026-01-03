'use client';

import React from 'react';
import { Menu, X, ArrowRight, LayoutDashboard, LogOut, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import AuthModal from '@/components/auth/AuthModal';

export default function FuturisticNavbarWithAuth() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [authModalOpen, setAuthModalOpen] = React.useState(false);
  const [authMode, setAuthMode] = React.useState<'login' | 'signup'>('login');
  const [mounted, setMounted] = React.useState(false);
  
  const { isSignedIn, user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const handleDashboardClick = () => {
    router.push('/dashboard');
    setMobileMenuOpen(false);
  };

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openAuthModal = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { label: 'Services', href: '#services' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'About', href: '#about' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-black/80 backdrop-blur-xl border-white/10 shadow-lg shadow-black/50"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <a href="/" className="group flex items-center gap-2">
              <img
                src="/agency_logo.png"
                alt="dev365"
                className="h-8 sm:h-10 w-auto"
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              <Button
                key={link.label}
                variant="ghost"
                className="text-white/80 hover:bg-transparent hover:text-white cursor-pointer"
                onClick={() => {
                  if (link.href.startsWith("#")) {
                    const element = document.querySelector(link.href);
                    element?.scrollIntoView({ behavior: "smooth" });
                  } else {
                    router.push(link.href);
                  }
                }}
              >
                {link.label}
              </Button>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            {!mounted || !isLoaded ? (
              <div className="flex items-center gap-3">
                <div className="h-10 w-24 bg-white/10 rounded-md animate-pulse" />
                <div className="h-10 w-10 bg-white/10 rounded-full animate-pulse" />
              </div>
            ) : isSignedIn ? (
              <>
                <Button
                  className="bg-white text-black hover:bg-gray-100 shadow-lg shadow-white/10 group relative overflow-hidden cursor-pointer"
                  onClick={handleDashboardClick}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </span>
                  <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                </Button>

                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full border-white/30 bg-white/5 backdrop-blur-xl hover:bg-white/10 hover:border-white/40 cursor-pointer overflow-hidden"
                    >
                      {user?.imageUrl ? (
                        <img
                          src={user.imageUrl}
                          alt={user.firstName || "User"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5 text-white" />
                      )}
                    </Button>
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
              <>
                <Button
                  variant="ghost"
                  className="text-white/80 hover:bg-transparent hover:text-white cursor-pointer"
                  onClick={() => openAuthModal("login")}
                >
                  Sign In
                </Button>
                <Button
                  className="bg-white text-black hover:bg-gray-100 shadow-lg shadow-white/10 group relative overflow-hidden cursor-pointer"
                  onClick={() => openAuthModal("signup")}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </span>
                  <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          {mounted && (
            <div className="flex lg:hidden items-center gap-2 flex-shrink-0">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-white/30 bg-white/5 backdrop-blur-xl text-white hover:bg-white/10 hover:border-white/40 cursor-pointer h-9 w-9 sm:h-10 sm:w-10"
                  >
                    <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </SheetTrigger>

                <SheetContent
                  side="left"
                  className="bg-black/95 backdrop-blur-xl border-r border-white/10 w-[280px] sm:w-[320px]"
                >
                  <div className="flex flex-col h-full pt-12 sm:pt-16 pb-6">
                    {/* Mobile Logo */}
                    <div className="px-6 mb-6 sm:mb-8">
                      <div className="flex items-center gap-2">
                        <img
                          src="/agency_logo.png"
                          alt="dev365"
                          className="h-8 sm:h-10 w-auto"
                        />
                      </div>
                    </div>

                    {/* Mobile Navigation Links */}
                    <div className="flex-1 px-4 sm:px-6 space-y-1 overflow-y-auto">
                      {navLinks.map((link) => (
                        <Button
                          key={link.label}
                          variant="ghost"
                          className="w-full justify-start text-white/80 hover:text-white hover:bg-white/5 cursor-pointer h-11"
                          onClick={() => {
                            if (link.href.startsWith("#")) {
                              const element = document.querySelector(link.href);
                              element?.scrollIntoView({ behavior: "smooth" });
                            } else {
                              router.push(link.href);
                            }
                            setMobileMenuOpen(false);
                          }}
                        >
                          {link.label}
                        </Button>
                      ))}
                    </div>

                    {/* Mobile CTA */}
                    <div className="px-4 sm:px-6 pt-6 space-y-3 border-t border-white/10">
                      {isLoaded && isSignedIn ? (
                        <>
                          <div className="px-3 py-2 mb-2">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full overflow-hidden bg-white/10 flex items-center justify-center flex-shrink-0">
                                {user?.imageUrl ? (
                                  <img
                                    src={user.imageUrl}
                                    alt={user.firstName || "User"}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <User className="h-5 w-5 text-white" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                  {user?.firstName} {user?.lastName}
                                </p>
                                <p className="text-xs text-white/60 truncate">
                                  {user?.primaryEmailAddress?.emailAddress}
                                </p>
                              </div>
                            </div>
                          </div>

                          <Button
                            className="w-full bg-white text-black hover:bg-gray-100 shadow-lg shadow-white/10 group relative overflow-hidden cursor-pointer h-11"
                            onClick={handleDashboardClick}
                          >
                            <span className="relative z-10 flex items-center gap-2 text-sm">
                              <LayoutDashboard className="h-4 w-4" />
                              Dashboard
                            </span>
                            <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                          </Button>

                          <Button
                            variant="outline"
                            className="w-full border-white/30 bg-white/5 backdrop-blur-xl text-red-400 hover:bg-red-500/10 hover:border-red-500/40 cursor-pointer h-11"
                            onClick={handleSignOut}
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            <span className="text-sm">Sign Out</span>
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            className="w-full border-white/30 bg-white/5 backdrop-blur-xl text-white hover:bg-white/10 hover:border-white/40 cursor-pointer h-11"
                            onClick={() => openAuthModal("login")}
                          >
                            <span className="text-sm">Sign In</span>
                          </Button>
                          <Button
                            className="w-full bg-white text-black hover:bg-gray-100 shadow-lg shadow-white/10 group relative overflow-hidden cursor-pointer h-11"
                            onClick={() => openAuthModal("signup")}
                          >
                            <span className="relative z-10 flex items-center justify-center gap-2 text-sm">
                              Get Started
                              <ArrowRight className="h-4 w-4" />
                            </span>
                            <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          )}
        </nav>
      </header>

      {/* Auth Modal */}
      {mounted && (
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialMode={authMode}
        />
      )}
    </>
  );
}