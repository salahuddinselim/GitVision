"use client";
import { motion } from "framer-motion";
import CodeBlock from "@/components/CodeBlock";

export default function LoadingPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-57px)] bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md mx-auto px-6"
      >
        <div className="w-16 h-16 rounded-full border-4 border-primary/30 border-t-primary mx-auto mb-6 animate-spin" />
        <h2 className="text-xl font-bold text-gray-200 mb-2">Loading GitVision</h2>
        <p className="text-gray-500 text-sm">Initializing the playground engine...</p>
      </motion.div>
    </div>
  );
}