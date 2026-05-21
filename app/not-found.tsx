'use client';

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#FFFDF6] text-[#3C3232] overflow-hidden px-6">

      {/* Floating grid aura */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#EADFC9_1px,transparent_1px),linear-gradient(to_bottom,#EADFC9_1px,transparent_1px)] bg-[size:26px_26px] opacity-30" />

      {/* Soft glowing blobs */}
      <div className="absolute w-[400px] h-[400px] bg-[#E29393]/20 blur-3xl rounded-full top-10 left-10 animate-pulse" />
      <div className="absolute w-[350px] h-[350px] bg-[#4E6E58]/20 blur-3xl rounded-full bottom-10 right-10 animate-pulse" />

      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        className="relative z-10 text-center max-w-lg w-full bg-white/70 backdrop-blur-xl border-2 border-[#EADFC9] rounded-[3rem] p-10 shadow-2xl"
      >

        {/* Icon */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-6xl mb-4"
        >
          🧭
        </motion.div>

        {/* Title */}
        <h1 className="text-6xl font-black tracking-tight text-[#3C3232]">
          404
        </h1>

        <p className="text-xs uppercase tracking-[0.3em] font-black text-[#E29393] mt-2">
          LOST IN THE SANCTUARY
        </p>

        {/* Divider line */}
        <div className="w-20 h-[2px] bg-[#EADFC9] mx-auto my-6" />

        {/* Message */}
        <p className="text-sm font-semibold text-[#6D7C75] leading-relaxed italic">
          "The page you’re chasing has slipped through the gates of Pawsky Wawsky…
          probably chasing butterflies or refusing responsibility 🐾"
        </p>

        {/* Button */}
        <Link href="/">
          <motion.div
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            className="mt-8 inline-flex items-center gap-2 px-7 py-3 rounded-2xl bg-[#4E6E58] text-white font-black text-sm tracking-wide shadow-lg hover:bg-[#3F5947] transition-all"
          >
            🏡 Back to Sanctuary
          </motion.div>
        </Link>

        {/* tiny footer vibe */}
        <p className="text-[10px] text-[#A89898] mt-6 uppercase tracking-widest">
          Pawsky Wawsky • Lost Page Recovery Unit
        </p>
      </motion.div>
    </div>
  );
}