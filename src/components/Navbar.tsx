'use client';

import React from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

// Main Navbar Component
export default function FuturisticNavbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Services', href: '#services' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'About', href: '#about' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/80 backdrop-blur-xl border-white/10 shadow-lg shadow-black/50' 
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <a href="/" className="group flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 blur-xl rounded-full group-hover:bg-white/30 transition-all" />
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-white to-white/80 shadow-lg">
                <div className="h-4 w-4 rounded-full bg-black" />
              </div>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Agency</span>
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
                const element = document.querySelector(link.href);
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {link.label}
            </Button>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Button variant="ghost" className="text-white/80 hover:bg-transparent hover:text-white cursor-pointer">
            Sign In
          </Button>
          <Button className="bg-white text-black hover:bg-gray-100 shadow-lg shadow-white/10 group relative overflow-hidden cursor-pointer">
            <span className="relative z-10 flex items-center gap-2">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </span>
            <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden border-white/30 bg-white/5 backdrop-blur-xl text-white hover:bg-white/10 hover:border-white/40 cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          
          <SheetContent 
            side="left"
            className="bg-black/95 backdrop-blur-xl border-white/10"
          >
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-5 right-5 rounded-full p-2 text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="flex flex-col h-full pt-16 pb-6">
              {/* Mobile Logo */}
              <div className="px-6 mb-8">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="absolute inset-0 bg-white/20 blur-xl rounded-full" />
                    <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-white to-white/80">
                      <div className="h-3 w-3 rounded-full bg-black" />
                    </div>
                  </div>
                  <span className="text-lg font-bold text-white">Agency</span>
                </div>
              </div>

              {/* Mobile Navigation Links */}
              <div className="flex-1 px-6 space-y-1">
                {navLinks.map((link) => (
                  <Button
                    key={link.label}
                    variant="ghost"
                    className="w-full justify-start text-white/80 hover:text-white cursor-pointer"
                    onClick={() => {
                      const element = document.querySelector(link.href);
                      element?.scrollIntoView({ behavior: 'smooth' });
                      setMobileMenuOpen(false);
                    }}
                  >
                    {link.label}
                  </Button>
                ))}
              </div>

              {/* Mobile CTA */}
              <div className="px-6 pt-6 space-y-3 border-t border-white/10">
                <Button 
                  variant="outline" 
                  className="w-full border-white/30 bg-white/5 backdrop-blur-xl text-white hover:bg-white/10 hover:border-white/40 cursor-pointer"
                >
                  Sign In
                </Button>
                <Button className="w-full bg-white text-black hover:bg-gray-100 shadow-lg shadow-white/10 group relative overflow-hidden cursor-pointer">
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </span>
                  <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}