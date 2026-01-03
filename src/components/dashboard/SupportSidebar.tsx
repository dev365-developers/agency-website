import React from 'react';
import { 
  HelpCircle, 
  Mail, 
  MessageCircle, 
  Bug, 
  Headphones,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SupportSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openRequestsCount: number;
}

const SupportSidebar = ({ 
  collapsed, 
  setCollapsed, 
  activeTab, 
  setActiveTab,
  openRequestsCount,
  showMobile,
  setShowMobile
}:any) => {
 const menuItems = [
    { icon: HelpCircle, label: 'FAQ', id: 'faq' },
    { icon: Mail, label: 'Email Support', id: 'email' },
    { icon: MessageCircle, label: 'WhatsApp', id: 'whatsapp' },
    { icon: Bug, label: 'My Issues', id: 'my-issues', badge: openRequestsCount },
  ];

  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {showMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMobile(false)}
            className="lg:hidden fixed inset-0 bg-black/80 z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isMobile ? 256 : (collapsed ? 64 : 256),
          x: isMobile ? (showMobile ? 0 : -256) : 0
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-black border-r border-white/10 flex flex-col flex-shrink-0 fixed h-full z-50 lg:z-20 lg:left-auto lg:top-auto left-0 top-0"
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10 flex-shrink-0">
          <AnimatePresence mode="wait">
            {(!collapsed || isMobile) ? (
              <motion.div
                key="expanded-header"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3"
              >
                <div className="p-2 bg-white/10 rounded-lg">
                  <Headphones className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Support Hub</h2>
                  <p className="text-[10px] text-white/60">How can we help?</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="collapsed-header"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="relative mx-auto"
              >
                <Headphones className="h-5 w-5 text-white" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Close button for mobile */}
          {isMobile && (
            <button
              onClick={() => setShowMobile(false)}
              className="p-2 text-white hover:bg-white/10 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setActiveTab(item.id);
                  if (isMobile) setShowMobile(false);
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
                  {(!collapsed || isMobile) && (
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
                {item.badge !== undefined && item.badge > 0 && (
                  <AnimatePresence>
                    {(!collapsed || isMobile) && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className={`ml-auto h-5 w-5 text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0 relative z-10 ${
                          isActive ? 'bg-black text-white' : 'bg-white text-black'
                        }`}
                      >
                        {item.badge}
                      </motion.span>
                    )}
                  </AnimatePresence>
                )}
              </motion.button>
            );
          })}
        </nav>
      </motion.aside>
    </>
  );
};



export default SupportSidebar;