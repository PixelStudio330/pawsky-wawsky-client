'use client';

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";

interface IChronicleChapter {
  id: number;
  chapterNumber: string;
  title: string;
  image: string; 
  quote?: string;
  description: string;
  decorEmote: string;
}

const chronicleData: IChronicleChapter[] = [
  {
    id: 1,
    chapterNumber: "Genesis",
    title: "A Single Cry for Help",
    image: "/img/chapter-one.jpg", 
    decorEmote: "📦",
    description: "It began on a frozen evening with a sound so faint it was nearly lost to the wind—a lone, helpless shivering kitten tucked inside a water-logged alleyway. No resources, no backing; just a promise that this tiny life wouldn't fade unnoticed in the dark."
  },
  {
    id: 2,
    chapterNumber: "Gathering",
    title: "More Hands, More Hearts",
    image: "/img/chapter-two.jpg", 
    decorEmote: "🤝",
    description: "Kindness is a quiet echo that grows louder when shared. One small rescue spark caught the attention of neighborhood dreamers, student builders, and gentle souls. Suddenly, two hands turned into ten, then into dozens—each offering warmth, medical support, and sleepless shifts."
  },
  {
    id: 3,
    chapterNumber: "Metamorphosis",
    title: "From Cardboard Box to Haven",
    image: "/img/chapter-three.jpg", 
    decorEmote: "🏡",
    description: "What began as a makeshift cardboard sanctuary on a small porch slowly blossomed into a living, breathing ecosystem of care. Today, that humble beginning has transformed into a fully nourished, active shelter protecting and restoring hundreds of helpless strays at a time."
  },
  {
    id: 4,
    chapterNumber: "The Covenant",
    title: "The Truest Meaning of Belonging",
    image: "/img/chapter-four.jpg", 
    decorEmote: "✨",
    quote: "We didn't save them. We simply gave them a home they deserved and belonged to.",
    description: "The sanctuary is not a destination of pity—it is a launchpad of dignity. Every patched-up wound, every restored purr, and every bright-eyed wagging tail is a reminder that these precious gems were never broken; they were just waiting to be found."
  }
];

export default function SuccessStories() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // --- Interactive Aura Logic ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  const auraX = useTransform(springX, (val) => `${val * 0.05}px`);
  const auraY = useTransform(springY, (val) => `${val * 0.05}px`);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - left - width / 2);
    mouseY.set(e.clientY - top - height / 2);
  };

  // --- Scroll Path Logic ---
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });
  const pathLength = useTransform(scrollYProgress, [0, 0.98], [0, 1]);

  return (
    <section 
      ref={containerRef} 
      onMouseMove={handleMouseMove}
      className="relative min-h-screen py-20 sm:py-32 px-4 sm:px-6 bg-[#FFFFF7] overflow-hidden text-[#5A4E4E] select-none"
    >
      {/* 🏁 Checkered Texture Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#EADFC9_1px,transparent_1px),linear-gradient(to_bottom,#EADFC9_1px,transparent_1px)] bg-[size:24px_24px] opacity-[0.24] pointer-events-none z-0" />

      {/* 💫 Dreamy Aura Ambient Suns & Mouse Follower */}
      <motion.div style={{ x: auraX, y: auraY }} className="absolute inset-0 pointer-events-none z-0">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.8, 0.6] }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
          className="absolute top-20 left-[5%] w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-[#FADCD5] rounded-full blur-[80px] sm:blur-[100px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.7, 0.5] }}
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut", delay: 1 }}
          className="absolute top-[40%] right-[5%] w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] bg-[#F7EAC9] rounded-full blur-[90px] sm:blur-[110px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ repeat: Infinity, duration: 14, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-20 left-[10%] w-[250px] sm:w-[350px] h-[250px] sm:h-[350px] bg-[#E2ECE9] rounded-full blur-[70px] sm:blur-[90px]"
        />
      </motion.div>

      {/* Header */}
      <div className="text-center mb-24 sm:mb-32 relative z-10">
        <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-black text-[#E29393] bg-white px-5 py-2 rounded-full border-2 border-[#EADFC9] shadow-sm mb-4">
          📖 Our Living History
        </span>
        <h2 className="text-3xl sm:text-5xl font-black text-[#3C3232] tracking-tight">
          The Chronicles of Our Sanctuary
        </h2>
        <p className="text-[#6E5D5D] mt-3 text-xs sm:text-base italic font-bold max-w-xl mx-auto px-4">
          How a tiny spark of empathy rewrote the destiny of hundreds of precious souls.
        </p>
        <div className="h-[4px] w-16 bg-gradient-to-r from-[#E29393] to-[#E7C78A] mx-auto mt-5 rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto relative px-2 sm:px-4">
        
        {/* 🛠️ Responsive Central/Left-Sided SVG Connecting Engine */}
        <div className="absolute left-6 sm:left-8 lg:left-1/2 transform -translate-x-1/2 top-4 bottom-4 w-4 z-0">
          <svg className="w-full h-full" viewBox="0 0 16 1000" preserveAspectRatio="none">
            <line 
              x1="8" y1="0" x2="8" y2="1000" 
              stroke="#EADFC9" strokeWidth="2.5" 
              strokeDasharray="6 10" strokeLinecap="round"
              opacity="0.8"
            />
            <motion.line 
              x1="8" y1="0" x2="8" y2="1000" 
              stroke="#E29393" strokeWidth="3.5" 
              strokeDasharray="6 10" strokeLinecap="round"
              style={{ pathLength }}
            />
          </svg>
        </div>

        {/* Narrative Chapters Loop */}
        <div className="space-y-24 sm:space-y-36 relative z-10">
          {chronicleData.map((chapter, idx) => {
            const isEven = idx % 2 === 0;

            return (
              <div 
                key={chapter.id} 
                className={`flex flex-col lg:flex-row items-start lg:items-center gap-6 sm:gap-12 lg:gap-24 pl-12 sm:pl-16 lg:pl-0 ${
                  isEven ? "" : "lg:flex-row-reverse"
                }`}
              >
                {/* Image Book Frame Container */}
                <motion.div 
                  initial={{ opacity: 0, x: isEven ? -30 : 30, scale: 0.96 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  className="w-full lg:w-[46%] relative group max-w-sm sm:max-w-md lg:max-w-none"
                >
                  <div className="absolute -inset-2.5 sm:-inset-3.5 bg-[#EADFC9]/40 rounded-[2rem] sm:rounded-[2.8rem] rotate-2 group-hover:rotate-1 transition-transform duration-500 shadow-inner pointer-events-none" />
                  <div className="absolute -inset-1 bg-[#E7C78A]/15 rounded-[1.8rem] sm:rounded-[2.4rem] -rotate-1 pointer-events-none" />
                  
                  <div className="relative overflow-hidden aspect-[4/3] rounded-[1.6rem] sm:rounded-[2.2rem] border-[4px] sm:border-[6px] border-white shadow-lg bg-white">
                    <Image 
                      src={chapter.image} 
                      alt={chapter.title} 
                      width={600} 
                      height={450}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-104"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#3C3232]/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </div>

                  {/* Corner Badge - Shifted slightly for responsive balance */}
                  <div className="absolute -bottom-3 -right-1 sm:-bottom-4 sm:-right-2 bg-white w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl shadow-md border-2 border-[#EADFC9] flex items-center justify-center text-base sm:text-xl select-none group-hover:scale-110 transition-transform duration-300">
                    {chapter.decorEmote}
                  </div>
                </motion.div>

                {/* 📌 Responsive Connecting Micro-Node Intersections */}
                <div className="absolute left-6 sm:left-8 lg:left-1/2 transform -translate-x-1/2 flex w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-white border-4 border-[#EADFC9] items-center justify-center z-20 shadow-sm pointer-events-none top-4 lg:top-auto">
                  <motion.div 
                    style={{ scale: scrollYProgress }}
                    className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-[#E29393]" 
                  />
                </div>

                {/* Typography Story Columns */}
                <motion.div 
                  initial={{ opacity: 0, x: isEven ? 30 : -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ type: "spring", stiffness: 90, damping: 18 }}
                  className="w-full lg:w-[46%] space-y-3 sm:space-y-4 text-left"
                >
                  <div>
                    <span className="text-[9px] sm:text-[10px] text-[#E29393] uppercase font-black tracking-widest bg-white border border-[#FCD4D4] px-2.5 py-1 rounded-md shadow-sm">
                      {chapter.chapterNumber}
                    </span>
                    <h3 className="text-xl sm:text-3xl font-black text-[#3C3232] tracking-tight mt-2.5">
                      {chapter.title}
                    </h3>
                  </div>

                  {chapter.quote && (
                    <div className="relative bg-white/90 border-l-4 border-[#E29393] p-3 sm:p-4 rounded-r-2xl italic font-black text-[#4E6E58] text-xs sm:text-base shadow-sm text-left my-2 leading-relaxed">
                      "{chapter.quote}"
                    </div>
                  )}

                  <p className="text-[11px] sm:text-sm text-[#6E5D5D] leading-relaxed font-bold tracking-wide italic">
                    {chapter.description}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Decorative End Marker */}
      <div className="max-w-xs mx-auto h-[2px] bg-dashed bg-[linear-gradient(to_right,#D2BCA4_4px,transparent_4px)] bg-[size:10px_2px] mt-24 sm:mt-36 opacity-30" />
    </section>
  );
}