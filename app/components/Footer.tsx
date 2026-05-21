'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Sparkles, Heart } from "lucide-react";
import Link from "next/link";

// Create an animated version of Next.js Link
const MotionLink = motion.create(Link);

export default function BubblyPawskyFooter() {
  const [hoveredIcon, setHoveredIcon] = useState<number | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socialLinks = [
    { name: "Twitter", img: "/img/twitter-icon.png", toy: "🐾", href: "https://twitter.com" },
    { name: "Instagram", img: "/img/instagram-icon.png", toy: "🧶", href: "https://instagram.com" },
    { name: "Discord", img: "/img/discord-icon.png", toy: "🦴", href: "https://discord.com" },
    { name: "Facebook", img: "/img/facebook-icon.png", toy: "🐟", href: "https://facebook.com" },
  ];

  const exploreLinks = [
    { name: "Adopt", href: "/#all-pets-section" },
    { name: "Our Story", href: "/#our-story-section" },
    { name: "Care Hub", href: "/#pet-care-tips" },
    { name: "Pet Quizes", href: "/#pet-quizes" },
    { name: "Sticker Maker", href: "/#pet-sticker-maker" },
  ];

  // Handles the smooth slide-up animation and purges the URL hash after 500ms
  const handleScrollAndClearHash = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("/#")) {
      const targetId = href.replace("/#", "");
      const element = document.getElementById(targetId);

      if (element) {
        e.preventDefault();
        
        element.scrollIntoView({ behavior: "smooth" });

        setTimeout(() => {
          window.history.replaceState(
            null, 
            document.title, 
            window.location.pathname + window.location.search
          );
        }, 500);
      }
    }
  };

  const titleLetters = "Pawsky".split("");
  const titleAccentLetters = "Wawsky".split("");

  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Fixed formatting: Attached "as const" properly inside the statement assignment
  const letterVariants = {
    initial: { y: 0 },
    animate: {
      y: [0, -6, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  } as const;

  return (
    <footer className="relative w-full bg-[#5A4E4E] text-[#FFF0F0] pb-8 pt-12 select-none mt-20 overflow-visible font-rounded">
      
      {/* 🧼 THE WAVE RIDGE */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] h-[70px] -translate-y-[68px] pointer-events-none">
        <svg 
          className="relative block w-full h-full" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <path 
            d="M0,64 C150,140 300,10 450,70 C600,130 750,20 900,80 C1050,140 1150,50 1200,64 L1200,120 L0,120 Z" 
            fill="#5A4E4E" 
          />
        </svg>
      </div>

      {/* ☁️ Soft Decorative Accents */}
      <motion.div 
        animate={{ y: [0, -6, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-12 left-[12%] w-8 h-8 rounded-full bg-[#FFF0F0]/10 blur-[1px] hidden sm:block"
      />
      <motion.div 
        animate={{ y: [0, -10, 0], scale: [1, 0.95, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -top-16 right-[15%] w-12 h-12 rounded-full bg-[#FFF0F0]/5 blur-[2px] hidden sm:block"
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* MAIN BODY LAYOUT */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 pb-10 border-b border-[#FFF0F0]/15">
          
          {/* Brand Info & Animated Bouncy Title */}
          <div className="flex flex-col items-start gap-2.5 max-w-sm">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0F0]/10 border border-[#FFF0F0]/10 text-[10px] font-bold tracking-wider text-[#FFF0F0]">
              <Sparkles className="w-3 h-3 text-[#FFF0F0]" /> Cozy & Rounded
            </div>
            
            <motion.h3 
              className="text-3xl font-black tracking-tight text-white flex flex-wrap cursor-default select-none"
              variants={containerVariants}
              initial="initial"
              animate="animate"
            >
              <span className="flex mr-2">
                {titleLetters.map((letter, index) => (
                  <motion.span key={index} variants={letterVariants} className="inline-block">
                    {letter
                  }</motion.span>
                ))}
              </span>
              <span className="flex text-[#e1ebe2]">
                {titleAccentLetters.map((letter, index) => (
                  <motion.span key={index} variants={letterVariants} className="inline-block">
                    {letter}
                  </motion.span>
                ))}
              </span>
            </motion.h3>

            <p className="text-xs font-medium leading-relaxed text-[#FFF0F0]/80">
              A playful little pocket of the internet built for happy paws and cozy afternoons. Soft layers, smooth edges, and no sharp corners allowed!
            </p>
          </div>

          {/* Navigation Capsules */}
          <div className="flex flex-col gap-3 justify-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FFF0F0]/50">Explore Sanctuary</span>
            <div className="flex flex-wrap gap-2 max-w-xs">
              {exploreLinks.map((link) => (
                <MotionLink
                  key={link.name} 
                  href={link.href} 
                  onClick={(e) => handleScrollAndClearHash(e, link.href)}
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="text-xs font-bold text-[#5A4E4E] bg-[#FFF0F0] hover:bg-[#FFF0F0]/90 px-3 py-1.5 rounded-full shadow-sm transition-colors cursor-pointer inline-block decoration-transparent text-center"
                >
                  {link.name}
                </MotionLink>
              ))}
            </div>
          </div>

          {/* Social Row */}
          <div className="flex flex-col items-start md:items-end justify-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FFF0F0]/50 md:text-right w-full">Say Hello</span>
            <div className="flex flex-row items-center gap-3.5">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setHoveredIcon(index)}
                  onMouseLeave={() => setHoveredIcon(null)}
                  whileHover={{ 
                    scale: 1.15,
                    borderRadius: "40% 60% 60% 40% / 40% 40% 60% 60%"
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 18 }}
                  className="w-14 h-14 rounded-full bg-white flex items-center justify-center relative shadow-md border border-white/10 overflow-visible cursor-pointer"
                  title={social.name}
                >
                  <img 
                    src={social.img} 
                    alt={social.name} 
                    className="w-7 h-7 object-contain group-hover:scale-105 transition-transform" 
                    draggable={false}
                  />

                  <AnimatePresence>
                    {hoveredIcon === index && (
                      <motion.span
                        initial={{ opacity: 0, y: 5, scale: 0.3 }}
                        animate={{ opacity: 1, y: -38, scale: 1.3, rotate: [0, -10, 10, 0] }}
                        exit={{ opacity: 0, y: -45, scale: 0.5 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="absolute text-xl pointer-events-none filter drop-shadow-sm z-20"
                      >
                        {social.toy}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.a>
              ))}
            </div>
          </div>

        </div>

        {/* BOTTOM UTILITY ROW */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[10px] font-bold text-[#FFF0F0]/70 flex items-center flex-wrap justify-center gap-1 text-center sm:text-left">
            <span>© {new Date().getFullYear()} Pawsky Wawsky.</span>
            <span className="flex items-center gap-0.5">Bubbly, soft, and crafted with <Heart className="w-2.5 h-2.5 fill-[#e1ebe2] text-[#e1ebe2]" /> in Rajshahi.</span>
          </div>

          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="group flex items-center gap-1.5 px-4 py-2 bg-[#FFF0F0] hover:bg-[#FFF0F0]/90 text-[#5A4E4E] font-black text-[10px] uppercase rounded-full shadow-sm"
          >
            <span>Back to Nest</span>
            <ArrowUp className="w-3 h-3 stroke-[3] group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>
        </div>

      </div>
    </footer>
  );
}