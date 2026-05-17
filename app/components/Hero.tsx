'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  // Staggered orchestration for smooth text entry without structural shifts
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, 
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.21, 0.45, 0.32, 0.9] },
    },
  };

  return (
    <div className="relative w-full flex justify-center px-4 py-12 group/hero overflow-visible">
      
      {/* Deep-Shadowed Hero Container Card - Restored original p-8 md:p-10 and gap-10 md:gap-12 */}
      <motion.section 
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        whileHover={{ 
          y: -6,
          shadow: "0_30px_70px_rgba(90,105,97,0.4)"
        }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ 
          type: "spring",
          stiffness: 140,
          damping: 20
        }}
        className="relative max-w-5xl w-full bg-[#EAD7C3] rounded-[2.5rem] p-8 md:p-10 flex flex-col md:flex-row items-center gap-10 md:gap-12 z-10 border-4 border-white shadow-[0_25px_60px_-15px_rgba(90,105,97,0.35),0_15px_30px_-10px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(255,255,255,0.6)] transition-shadow duration-500 ease-out"
      >
        {/* Subtle Textured Background Layer */}
        <div className="absolute inset-0 bg-[radial-gradient(#5A6961_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none rounded-[2.5rem]" />

        {/* Left Side */}
        <div className="relative shrink-0 w-full md:w-[460px] lg:w-[500px] group/img">
          
          <div className="relative w-full rounded-2xl overflow-hidden shadow-[0_15px_35px_-5px_rgba(50,60,55,0.3),inset_0_4px_8px_rgba(0,0,0,0.2)] border-2 border-white/60 transition-all duration-500 group-hover/hero:scale-[1.02] group-hover/hero:-rotate-1 bg-[#F4EDE4] flex items-center">
            
            {/* Animals Illustration */}
            <Image
              src="/img/hero-animals.png" 
              alt="Adorable pets banner illustration"
              width={500}
              height={280}
              sizes="(max-w-768px) 100vw, 500px"
              priority
              className="w-full h-auto object-contain block p-1 transition-transform duration-1000 ease-out group-hover/img:scale-103"
            />

            {/* 🍃 Animated Overlay Layer: Rustling Leaves in the Breeze */}
            <motion.div 
              animate={{ 
                x: [0, 4, -2, 3, 0],
                y: [0, -5, 2, -3, 0],
                rotate: [0, 2, -1, 1, 0]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute inset-0 pointer-events-none flex items-center"
            >
              <Image
                src="/img/hero-leaves.png" 
                alt="Rustling cozy leaves overlay"
                width={500}
                height={280}
                sizes="(max-w-768px) 100vw, 500px"
                priority
                className="w-full h-auto object-contain block p-1 mix-blend-multiply opacity-95 transition-transform duration-1000 ease-out group-hover/img:scale-105"
              />
            </motion.div>

            {/* Ambient Lighting Overlay on Image */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-transparent to-white/10 pointer-events-none z-10" />
          </div>
          
          {/* Floating Sticker Badge with Shadow Depth */}
          <motion.div 
            animate={{ 
              y: [0, -8, 0],
              rotate: [0, 6, -6, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            whileHover={{ scale: 1.2, rotate: 15 }}
            className="absolute -bottom-4 -right-3 bg-white w-12 h-12 rounded-full shadow-[0_10px_25px_rgba(0,0,0,0.2),0_4px_10px_rgba(90,105,97,0.15)] flex items-center justify-center text-xl select-none border-2 border-[#EAD7C3] z-25 cursor-pointer transition-transform"
          >
            ✨
          </motion.div>
        </div>

        {/* Right Side (Animated Text) */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col items-start text-left flex-1 min-w-[280px] relative z-10"
        >
          
          {/* Subtle Accent Title Tag - Restored original text-xs, mb-4, px-3, py-1 spacing */}
          <motion.div 
            variants={itemVariants}
            className="mb-4 text-xs font-black tracking-widest text-[#445249]/80 uppercase bg-white/40 px-3 py-1 rounded-full border border-white/30 backdrop-blur-sm shadow-sm"
          >
            🐾 The Cozy Corner
          </motion.div>

          {/* Title - Restored exact original text-3xl md:text-4xl sizes, with enhanced drop-shadow and weight */}
          <motion.h2 
            variants={itemVariants}
            className="text-3xl md:text-4xl font-black text-[#445249] tracking-tight mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.06)] leading-tight"
          >
            Welcome to the <br />
            <span className="text-[#5A6961] bg-gradient-to-r from-[#5A6961] via-[#71857A] to-[#5A6961] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-x">
              Cozy Corner
            </span>
          </motion.h2>
          
          {/* Paragraph - Restored exact original text-sm md:text-base sizing, mb-8, with a clean bold layout weight */}
          <motion.p 
            variants={itemVariants}
            className="text-[#5A6961] text-sm md:text-base font-extrabold leading-relaxed mb-8 drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]"
          >
            Step into a world where every wag, chirp, and purr tells a story. From fuzzy rabbits to loyal hounds, we find forever homes for the soul{' '}
            <motion.span
              animate={{ y: [0, -4, 0] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="inline-block origin-center text-[#5A6961]"
            >
              ︵‿︵‿୨♡୧‿︵‿︵
            </motion.span>
          </motion.p>
          
          {/* Premium 3D Interaction Button Layer - Restored original inline padding px-8 py-4 metrics */}
          <motion.div variants={itemVariants}>
            <Link
              href="/our-gems"
              className="group/btn relative inline-flex items-center justify-center px-8 py-4 bg-[#5A6961] text-white text-base font-black rounded-2xl shadow-[0_8px_25px_-5px_rgba(90,105,97,0.5),0_4px_0px_#3D4942] overflow-hidden transition-all duration-300 hover:shadow-[0_15px_30px_-5px_rgba(90,105,97,0.6)] hover:scale-[1.02] active:translate-y-[3px] active:scale-[1] active:shadow-[0_2px_0px_#3D4942]"
            >
              <span className="relative z-10 flex items-center gap-2 transition-transform duration-300 group-hover/btn:-translate-y-[1px]">
                Meet Our Babies! 
                <span className="inline-block transition-transform duration-500 group-hover/btn:rotate-[15deg] group-hover/btn:scale-110">🐕</span>
              </span>
              
              {/* Smooth Fill Backsplash Reveal */}
              <div className="absolute inset-0 bg-[#C8A27B] opacity-0 group-hover/btn:opacity-100 translate-y-full group-hover/btn:translate-y-0 transition-all duration-500 ease-out" />
            </Link>
          </motion.div>
        </motion.div>

      </motion.section>

      {/* Embedded shimmer style definition */}
      <style jsx global>{`
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          animation: gradient-x 8s ease infinite;
          background-size: 200% 200%;
        }
      `}</style>
    </div>
  );
}