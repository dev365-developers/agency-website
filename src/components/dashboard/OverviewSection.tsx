import { LayoutDashboard } from "lucide-react";
import DashboardHeader from "./DashboardHeader";
import { motion } from "framer-motion";

const OverviewSection = () => {
  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <DashboardHeader 
        title="Overview" 
        description="Welcome back! Here's what's happening with your projects."
      />
      
      <motion.div 
        className="flex items-center justify-center h-96"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="text-center space-y-4">
          <motion.div 
            className="relative inline-block"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4, type: "spring", stiffness: 200 }}
          >
            <div className="absolute inset-0 bg-white/10 blur-2xl rounded-full" />
            <LayoutDashboard className="h-16 w-16 text-white/40 relative" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h3 className="text-xl font-semibold text-white mb-2">Under Development</h3>
            <p className="text-white/60 text-sm">This section is coming soon</p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};
export default OverviewSection;