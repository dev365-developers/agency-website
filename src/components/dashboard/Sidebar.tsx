import React from 'react';
import { LayoutDashboard, Globe, CreditCard, ChevronLeft, Users, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

const Sidebar = ({ collapsed, setCollapsed, activeSection, setActiveSection }: any) => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', id: 'overview' },
    { icon: Globe, label: 'My Websites', id: 'websites' },
    { icon: FileText, label: 'My Requests', id: 'requests' },
    { icon: CreditCard, label: 'Billing', id: 'billing' },
    { icon: Users, label: 'Support', id: 'support' },
  ];

  const router = useRouter();

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setCollapsed(true)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{
          width: collapsed
            ? typeof window !== "undefined" && window.innerWidth < 1024
              ? 64
              : 80
            : 256,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 top-0 h-screen bg-black border-r border-white/10 z-30"
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
          <AnimatePresence mode="wait">
            {!collapsed ? (
              <motion.div
                key="expanded-logo"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => router.push("/")}
              >
                <img
                  src="/agency_logo.png"
                  alt="dev365"
                  className="h-8 sm:h-10 w-auto"
                />
              </motion.div>
            ) : (
              <motion.div
                key="collapsed-logo"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="relative mx-auto"
              >
                <img src="/agency_logo.png" alt="dev365" className="h-6 w-10" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Toggle Button - Hidden on mobile when collapsed */}
        <motion.div
          className={`absolute top-1/2 -right-3 z-30 ${
            collapsed ? "hidden lg:block" : "hidden lg:block"
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-6 w-6 rounded-full border-white/30 bg-black hover:bg-white/10 hover:border-white/40 cursor-pointer shadow-lg"
          >
            <motion.div
              animate={{ rotate: collapsed ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronLeft className="h-3 w-3 text-white" />
            </motion.div>
          </Button>
        </motion.div>

        {/* Navigation */}
        <nav className="p-2 space-y-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setActiveSection(item.id);
                  // Auto-collapse on mobile after selection
                  if (
                    typeof window !== "undefined" &&
                    window.innerWidth < 1024
                  ) {
                    setCollapsed(true);
                  }
                }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all cursor-pointer group relative overflow-hidden ${
                  isActive
                    ? "bg-white text-black"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeBackground"
                    className="absolute inset-0 bg-white rounded-lg"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <motion.div
                  animate={{
                    rotate: isActive ? [0, -10, 10, -10, 0] : 0,
                  }}
                  transition={{ duration: 0.5 }}
                  className="relative z-10"
                >
                  <Icon
                    className={`h-5 w-5 flex-shrink-0 ${
                      isActive ? "text-black" : ""
                    }`}
                  />
                </motion.div>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="font-medium text-sm truncate relative z-10"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {!collapsed && isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                      className="ml-auto h-2 w-2 rounded-full bg-black flex-shrink-0 relative z-10"
                    />
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </nav>

        {/* Footer */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10"
            >
              <div className="text-xs text-white/40 text-center">
                © 2026 dev365. All rights reserved.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>
    </>
  );
};

export default Sidebar;