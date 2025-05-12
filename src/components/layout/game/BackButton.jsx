import { FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";

export default function BackButton({ onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="relative bg-white/10 dark:bg-black/20 p-4 rounded-xl backdrop-blur-sm border border-purple-500/30 shadow-lg"
      initial={{ opacity: 0.7 }}
      whileHover={{
        opacity: 1,
        scale: 1.05,
        backgroundColor: "rgba(124, 58, 237, 0.3)",
        boxShadow: "0 0 12px rgba(167, 139, 250, 0.5)",
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <FaArrowLeft className="text-purple-300 dark:text-purple-200 text-2xl" />
      {/* Glowing border effect */}
      <div className="absolute inset-0 rounded-xl p-[2px] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl opacity-10 blur-md"></div>
      </div>
    </motion.button>
  );
}
