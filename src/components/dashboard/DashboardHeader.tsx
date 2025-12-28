import { motion, AnimatePresence } from 'framer-motion';
const DashboardHeader = ({ title, description }: any) => (
  <motion.div 
    className="mb-6"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
    <p className="text-white/60 text-sm">{description}</p>
  </motion.div>
);

export default DashboardHeader;