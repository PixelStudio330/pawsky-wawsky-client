'use client';

import { motion } from "framer-motion";

export default function Header() {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center mb-16 relative z-10"
    >
      <h1 className="text-6xl font-extrabold text-[#6D7C75] drop-shadow-sm tracking-tight pt-18">
        Pawsky Wasky <span className="inline-block animate-bounce">🐾</span>
      </h1>
      <div className="h-1 w-24 bg-[#E7C78A] mx-auto mt-4 rounded-full" />
      <p className="text-xl text-[#8E9B94] mt-4 font-medium italic">
        Whiskers, Wings & Warm Hearts
      </p>
    </motion.header>
  );
}