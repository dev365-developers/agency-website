"use client";
import BillingSection from "@/components/dashboard/BillingSection";
import OverviewSection from "@/components/dashboard/OverviewSection";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import WebsitesSection from "@/components/dashboard/WebsiteSection";
import { Button } from "@/components/ui/button";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu } from "lucide-react";
import RequestsSection from "@/components/dashboard/RequestsSection";

export default function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState('overview');

  // Initialize sidebar state based on screen size
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection key="overview" />;
      case 'websites':
        return <WebsitesSection key="websites" />;
      case 'billing':
        return <BillingSection key="billing" />;
      case 'requests':
        return <RequestsSection key="requests" />;
      default:
        return <OverviewSection key="overview" />;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Sidebar */}
      <Sidebar 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Content */}
      <motion.main
        animate={{ 
          marginLeft: sidebarCollapsed ? (typeof window !== 'undefined' && window.innerWidth < 1024 ? 64 : 80) : 256 
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Top Bar */}
        <Topbar 
          sidebarCollapsed={sidebarCollapsed} 
          setSidebarCollapsed={setSidebarCollapsed}
        />

        {/* Page Content */}
        <div >
          <div >
            <AnimatePresence mode="wait">
              {renderSection()}
            </AnimatePresence>
          </div>
        </div>
      </motion.main>
    </div>
  );
}