'use client';

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFFFF7] text-[#5A4E4E] p-6 relative overflow-hidden">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#EADFC9_1px,transparent_1px),linear-gradient(to_bottom,#EADFC9_1px,transparent_1px)] bg-[size:24px_24px] opacity-25 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
        className="text-center z-10 max-w-md bg-white/80 backdrop-blur-sm p-10 border-3 border-[#D2BCA4] rounded-[2.5rem] shadow-md"
      >
        <span className="text-6xl inline-block animate-bounce mb-4">🧭</span>
        <h1 className="text-5xl font-black text-[#3C3232] tracking-tight mb-2">404</h1>
        <p className="text-xs uppercase font-black tracking-widest text-[#E29393] mb-6">Lost in the Sanctuary</p>
        
        <p className="text-sm font-bold italic text-[#8A7979] leading-relaxed mb-8">
          "This path leads to an empty meadow. The gems you are looking for might have wandered elsewhere!"
        </p>

        <Link href="/">
          <motion.span
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-6 py-3 bg-[#4E6E58] text-white text-[10px] uppercase font-black tracking-widest rounded-xl shadow-md cursor-pointer transition-colors hover:bg-[#3F5947]"
          >
            Back to Our Sanctuary ✨
          </motion.span>
        </Link>
      </motion.div>
    </div>
  );
}