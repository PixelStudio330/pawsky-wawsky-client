'use client';

import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

export default function Hero() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12, 
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 25, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 120,
        damping: 14
      },
    },
  };

  return (
    <section className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-[#EAD7C3] pt-40 pb-32 md:pt-48 md:pb-44 lg:pb-52 flex items-center overflow-hidden min-h-[580px] md:h-screen max-h-[850px] z-10 m-0 p-0">
      
      {/* BACKGROUND LAYER 1 */}
      <div className="absolute inset-0 w-full h-full select-none pointer-events-none">
        <Image
          src="/img/hero-animals.png" 
          alt="Full screen cozy pets banner background"
          fill
          priority
          quality={95}
          sizes="100vw"
          className="object-cover w-full h-full object-center"
        />
      </div>

      {/* BACKGROUND LAYER 2 */}
      <motion.div 
        animate={{ 
          y: [0, -14, 8, -6, 0],
          x: [0, 6, -5, 4, 0],
          rotate: [0, 1.5, -1.2, 0.8, 0]
        }}
        transition={{ 
          duration: 9, 
          repeat: Infinity, 
          ease: [0.445, 0.05, 0.55, 0.95]
        }}
        className="absolute inset-0 w-full h-full select-none pointer-events-none z-10"
      >
        <Image
          src="/img/hero-leaves.png" 
          alt="Cozy leaves floating overlay banner background"
          fill
          priority
          quality={95}
          sizes="100vw"
          className="object-cover w-full h-full object-center mix-blend-multiply opacity-95 scale-[1.04]"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-r from-[#EAD7C3]/20 via-[#EAD7C3]/10 to-[#EAD7C3]/85 pointer-events-none z-15" />

      {/* HERO CONTENT AREA */}
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 z-20 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
          
          {/*left side */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col items-start text-left max-w-md md:max-w-lg lg:col-span-7 lg:-ml-12 xl:-ml-20"
          >
            {/* rating note */}
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-2 mb-6 text-xs font-black tracking-wider text-[#A67C52] uppercase bg-[#FFF0ED]/90 backdrop-blur-sm px-4 py-1.5 rounded-full border-2 border-[#EAD7C3] shadow-sm select-none"
            >
              <span className="text-[#E7C78A] animate-pulse">★★★★★</span>
              <span>5.0 Top Rated Adoption Hub</span>
            </motion.div>

            {/* header */}
            <motion.h1 
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-black text-[#3E4D44] tracking-tight mb-8 leading-[1.25] select-none"
            >
              Welcome to <br />
              <span className="relative inline-block bg-[#FFF0ED] text-[#3E4D44] px-5 sm:px-6 py-2 rounded-[2rem] border-4 border-[#EAD7C3] shadow-[0_8px_24px_rgba(234,215,195,0.5)] cursor-default group hover:scale-105 active:scale-98 transition-transform duration-300 whitespace-nowrap mt-2">
                <span className="bg-gradient-to-r from-[#3E4D44] via-[#617A6B] to-[#3E4D44] bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradient-x_8s_ease_infinite]">
                  Pawsky Wawsky
                </span>
                <motion.span 
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                  className="absolute -top-5 -right-3 text-xl md:text-2xl"
                >
                  🐾
                </motion.span>
              </span>
            </motion.h1>
            
            {/* CTA */}
            <motion.div variants={itemVariants} className="flex items-center gap-4">
              <Link
                href="/our-gems"
                className="group/btn relative inline-flex items-center justify-center px-8 py-4 bg-[#3E4D44] text-white text-base font-black rounded-2xl shadow-[0_10px_28px_-5px_rgba(62,77,68,0.45),0_4px_0px_#2B3630] overflow-hidden transition-all duration-300 hover:shadow-[0_18px_35px_-5px_rgba(62,77,68,0.5),0_4px_0px_#2B3630] hover:scale-[1.03] active:translate-y-[3px] active:shadow-[0_2px_0px_#2B3630]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Meet Our Babies! 
                  <motion.span 
                    animate={{ rotate: [0, -15, 15, -15, 0] }}
                    transition={{ repeat: Infinity, duration: 2, repeatDelay: 1.5 }}
                    className="inline-block origin-bottom text-xl"
                  >
                    🐱
                  </motion.span>
                </span>
                <div className="absolute inset-0 bg-[#C8A27B] opacity-0 group-hover/btn:opacity-100 translate-y-full group-hover/btn:translate-y-0 transition-all duration-500 ease-out" />
              </Link>
            </motion.div>
          </motion.div>

          {/* right side */}
          <div className="hidden lg:flex lg:col-span-5 justify-center items-center relative z-20 pl-8">
            <div 
              className="w-100 h-100 xl:w-100 xl:h-100 rounded-full border-4 border-[#FFF0ED]/80 bg-[#FFF0ED]/40 backdrop-blur-md shadow-[0_15px_35px_rgba(166,124,82,0.15)] flex items-center justify-center p-8 origin-top animate-[paw-swing_3s_ease-in-out_infinite] select-none pointer-events-auto"
            >
              <div className="relative w-full h-full rounded-full overflow-hidden">
                <Image
                  src="/img/paw.png"
                  alt="Playful signature pet paw indicator"
                  fill
                  className="object-cover w-full h-full drop-shadow-[0_4px_10px_rgba(62,77,68,0.15)]"
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* SVG Curve */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform translate-y-[1px] z-30">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="relative block w-full h-[45px] md:h-[80px] lg:h-[110px]"
        >
          <path 
            d="M0,0 C150,90 350,120 600,120 C850,120 1050,90 1200,0 L1200,120 L0,120 Z" 
            fill="#FDF6EC" 
          />
        </svg>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes paw-swing {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(14deg); }
          50% { transform: rotate(-10deg); }
          75% { transform: rotate(6deg); }
        }
      `}} />
    </section>
  );
}