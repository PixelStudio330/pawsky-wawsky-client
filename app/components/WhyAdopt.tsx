'use client';

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Heart, Sparkles, ShieldAlert, Sun } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

// Pure Framer Motion physics for initial layout enter
const cardVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 30 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 16 } 
  }
};

export default function WhyAdopt() {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Interactive cursor aura tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  const auraTranslateX = useTransform(springX, (val) => `${val * 0.05}px`);
  const auraTranslateY = useTransform(springY, (val) => `${val * 0.05}px`);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sectionRef.current) return;
    const { left, top, width, height } = sectionRef.current.getBoundingClientRect();
    const x = e.clientX - left - width / 2;
    const y = e.clientY - top - height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const coreReasons = [
    {
      icon: <Heart className="text-[#E29393]" size={24} strokeWidth={2.5} />,
      title: "Save a Precious Life",
      desc: "Every year, countless sweet souls wait in shelters for a warm lap. When you adopt, you aren't just buying a pet—you are actively rewriting a beautiful story from heartbreak to pure comfort.",
      bgColor: "bg-[#FFF0F0]/80",
      accentBorder: "group-hover:border-[#E29393]",
      // Unique timing offsets using smooth float ranges
      yValues: [0, -14, 0],
      duration: 5
    },
    {
      icon: <Sparkles className="text-[#E7C78A]" size={24} strokeWidth={2.5} />,
      title: "Unconditional Gratitude",
      desc: "Rescue gems know they've been given a second chance. The depth of devotion, soft purrs, and excited tail wags you receive will make your cozy corner feel infinitely warmer every single day.",
      bgColor: "bg-[#FCFAF2]/80",
      accentBorder: "group-hover:border-[#E7C78A]",
      yValues: [-7, 7, -7], // Counter-balance floating rhythm
      duration: 5.5
    },
    {
      icon: <ShieldAlert className="text-[#4E6E58]" size={24} strokeWidth={2.5} />,
      title: "Fight Cruel Breeding",
      desc: "Choosing sanctuary adoption directly starves commercial mills and irresponsible backyard setups. It asserts a world where pets are viewed as family constants, not profit margins.",
      bgColor: "bg-[#F3F7F4]/80",
      accentBorder: "group-hover:border-[#4E6E58]",
      yValues: [0, -12, 0],
      duration: 6
    }
  ];

  return (
    <section 
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative w-full py-32 px-4 sm:px-6 overflow-hidden bg-[#FFFFF7] text-[#5A4E4E] select-none"
    >
      {/* 🏁 Clean Uniform Checkered Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#EADFC9_1px,transparent_1px),linear-gradient(to_bottom,#EADFC9_1px,transparent_1px)] bg-[size:24px_24px] opacity-[0.24] pointer-events-none z-0" />

      {/* 💫 Dreamy Aura Ambient Suns */}
      <motion.div 
        style={{ x: auraTranslateX, y: auraTranslateY }} 
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      >
        <motion.div 
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
          className="absolute top-20 left-[10%] w-[260px] h-[260px] bg-[#FADCD5] rounded-full blur-[90px] opacity-75"
        />
        <motion.div 
          animate={{ scale: [1, 1.10, 1] }}
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-16 right-[15%] w-[320px] h-[320px] bg-[#F7EAC9] rounded-full blur-[100px] opacity-80"
        />
        <div className="absolute top-1/3 right-1/4 w-[260px] h-[260px] bg-[#E2ECE9] rounded-full blur-[80px] opacity-60" />
      </motion.div>

      {/* --- Header Elements --- */}
      <div className="max-w-5xl mx-auto text-center mb-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-black text-[#E29393] bg-white px-5 py-2 rounded-full border-2 border-[#EADFC9] shadow-sm mb-5 cursor-default"
        >
          <span>The Heart of Pawsky Wawsky</span> 
          <Sun size={11} className="text-[#E7C78A] animate-spin" style={{ animationDuration: '8s' }} />
        </motion.div>
        
        <h2 className="text-4xl sm:text-5xl font-black text-[#3C3232] tracking-tight leading-tight max-w-2xl mx-auto">
          Why Adopting is the Purest Form of Love ✨
        </h2>
        <p className="text-sm sm:text-base text-[#6E5D5D] font-bold italic mt-4 max-w-lg mx-auto">
          Before stepping into a retail pet store, consider the magic of opening your heart to a sanctuary rescue.
        </p>
        <div className="h-[4px] w-16 bg-gradient-to-r from-[#E29393] via-[#E7C78A] to-[#4E6E58] mx-auto mt-6 rounded-full" />
      </div>

      {/* --- Safe Fluid Bubble Grid Layout --- */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10"
      >
        {coreReasons.map((reason, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            animate={{ y: reason.yValues }}
            transition={{
              y: {
                duration: reason.duration,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            whileHover={{
              scale: 1.04,
              boxShadow: "0 25px 50px -20px rgba(90, 78, 78, 0.12)",
              transition: { type: "spring", stiffness: 400, damping: 22 }
            }}
            className={`group p-6 sm:p-8 ${reason.bgColor} backdrop-blur-md border-3 border-[#D2BCA4] ${reason.accentBorder} flex flex-col items-start rounded-[2.5rem_1rem_2.5rem_1rem] shadow-sm transition-colors duration-300 relative overflow-hidden cursor-pointer`}
          >
            {/* Corner highlights with absolute isolation */}
            <div className="absolute top-0 left-0 w-2 h-12 bg-gradient-to-b from-[#D2BCA4]/20 to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 w-12 h-2 bg-gradient-to-r from-[#D2BCA4]/20 to-transparent pointer-events-none" />
            
            {/* Floating Internal Icons */}
            <motion.div 
              animate={{ y: [0, -5, 0] }}
              transition={{ 
                repeat: Infinity, 
                duration: 3, 
                ease: "easeInOut",
                delay: index * 0.25
              }}
              className="p-3.5 bg-white border-2 border-[#EADFC9] rounded-2xl shadow-sm mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 pointer-events-none"
            >
              {reason.icon}
            </motion.div>

            <h3 className="text-xl font-black text-[#3C3232] tracking-tight mb-3">
              {reason.title}
            </h3>
            
            <p className="text-xs sm:text-sm text-[#6E5D5D] font-bold leading-relaxed flex-grow">
              {reason.desc}
            </p>
            
            <span className="absolute bottom-4 right-5 opacity-10 group-hover:opacity-25 transition-opacity duration-300 text-xl select-none pointer-events-none">
              🐾
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* --- Bottom Cozy Divider Line --- */}
      <div className="max-w-md mx-auto h-[2px] bg-dashed bg-[linear-gradient(to_right,#D2BCA4_4px,transparent_4px)] bg-[size:10px_2px] mt-28 opacity-60" />
    </section>
  );
}