'use client';

import { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Sparkles, Sun, Moon, Wind, Heart } from "lucide-react";

interface ICareRitual {
  id: string;
  tabLabel: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  bgAccent: string; // Tailored cozy pastels
  borderAccent: string;
  bulletColor: string;
  intro: string;
  guidelines: string[];
  closingQuote: string;
}

const careRitualsData: ICareRitual[] = [
  {
    id: "food",
    tabLabel: "🍲 Daily Food",
    title: "Mindful Nourishment",
    subtitle: "Fueling small bodies with love",
    icon: <Sun className="w-5 h-5 text-[#E7C78A]" />,
    bgAccent: "bg-[#FDF9F0]",
    borderAccent: "border-[#EADFC9]",
    bulletColor: "bg-[#E7C78A]",
    intro: "Feeding isn't just a routine—it’s the foundational sunrise ritual of survival. Providing natural, rich, and well-proportioned meals keeps their coats shining and spirits high.",
    guidelines: [
      "Serve high-protein, easily digestible meals at consistent times daily to regulate digestion.",
      "Incorporate moisture-rich wet toppers alongside dry kibble to protect kidney function.",
      "Always provide clean, fresh water filtered in safe ceramic or clay bowls."
    ],
    closingQuote: "A full bowl is a quiet promise of constant security."
  },
  {
    id: "shower",
    tabLabel: "🧼 Warm Shower",
    title: "The Cleaning Sanctuary",
    subtitle: "Gentle coat & skin care",
    icon: <Wind className="w-5 h-5 text-[#E29393]" />,
    bgAccent: "bg-[#FFF5F5]",
    borderAccent: "border-[#FCD4D4]",
    bulletColor: "bg-[#E29393]",
    intro: "Showers should never be an ordeal of fear. By keeping the water lukewarm and using calm, steady movements, bathing becomes a healing ritual that washes away grime and stress.",
    guidelines: [
      "Use only organic, fragrance-free pet shampoos to shield sensitive skin from rashes.",
      "Place a soft towel at the base of the tub so their tiny paws can grip and feel safe.",
      "Dry them thoroughly with warm fleece towels, paying extra attention to small ears."
    ],
    closingQuote: "Every gentle splash washes away the dirt of yesterday's hardships."
  },
  {
    id: "sleep",
    tabLabel: "🌙 Deep Sleep",
    title: "Cradle of Rest",
    subtitle: "Safe harbors for deep dreaming",
    icon: <Moon className="w-5 h-5 text-[#9AAEC4]" />,
    bgAccent: "bg-[#F4F7F9]",
    borderAccent: "border-[#D6E2EC]",
    bulletColor: "bg-[#9AAEC4]",
    intro: "As darkness falls, our little gems require a quiet, insulated sanctuary where their fragile nervous systems can fully switch off and recover.",
    guidelines: [
      "Position bedding far away from drafty doorways, damp spots, or loud appliances.",
      "Incorporate soft, worn blankets that hold your familiar, comforting scent.",
      "Keep evening environments dimly lit to establish a natural, calm sleep rhythm."
    ],
    closingQuote: "In their quiet slumber, they dream of the hands that protect them."
  },
  {
    id: "play",
    tabLabel: "🧸 Active Play",
    title: "Soulful Enrichment",
    subtitle: "Chasing light leaks & chasing shadows",
    icon: <Sparkles className="w-5 h-5 text-[#8AB69B]" />,
    bgAccent: "bg-[#F4F9F6]",
    borderAccent: "border-[#D2E6DA]",
    bulletColor: "bg-[#8AB69B]",
    intro: "A bored mind leads to a heavy heart. True care means expanding their small worlds through active play, sensory tracking, and joyful curiosity.",
    guidelines: [
      "Hide treats inside cardboard forage setups to stimulate natural tracking instincts.",
      "Introduce textured crinkle toys, safe feather wands, or climbing perches near windows.",
      "Rotate their toy box weekly so older objects feel completely fresh and exciting again."
    ],
    closingQuote: "Play is the bridge that links their wild heritage to our cozy spaces."
  },
  {
    id: "avoid",
    tabLabel: "⚠️ Things to Avoid",
    title: "Hazards & Harm",
    subtitle: "Shielding them from hidden dangers",
    icon: <Heart className="w-5 h-5 text-[#C96A6A]" />,
    bgAccent: "bg-[#FFF0F0]",
    borderAccent: "border-[#FCD4D4]",
    bulletColor: "bg-[#C96A6A]",
    intro: "Love is also about knowing what to keep away. Many common household items contain invisible toxins or stressors that can instantly compromise a stray's fragile recovery process.",
    guidelines: [
      "Strictly avoid feeding chocolate, onions, garlic, caffeine, or bones that can splinter.",
      "Keep chemical floor cleaners, toxic indoor plants (like lilies), and medicines locked away.",
      "Never use harsh physical discipline or loud shouting—it shatters their fragile trust instantly."
    ],
    closingQuote: "Protection is the highest form of love we can offer them."
  }
];


export default function PetCare() {
  const [activeTab, setActiveTab] = useState<string>("nourish");
  const sectionRef = useRef<HTMLDivElement>(null);

  // --- Ambient Aura Mouse Interaction ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 22 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 22 });
  const auraX = useTransform(springX, (val) => `${val * 0.04}px`);
  const auraY = useTransform(springY, (val) => `${val * 0.04}px`);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sectionRef.current) return;
    const { left, top, width, height } = sectionRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - left - width / 2);
    mouseY.set(e.clientY - top - height / 2);
  };

  const currentRitual = careRitualsData.find((r) => r.id === activeTab) || careRitualsData[0];

  return (
    <section 
      ref={sectionRef}
      id="pet-care-tips"
      onMouseMove={handleMouseMove}
      className="relative min-h-screen py-10 px-4 sm:px-6 bg-[#FFFFF7] overflow-hidden text-[#5A4E4E] select-none"
    >
      {/* 🏁 Checkered Texture Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#EADFC9_1px,transparent_1px),linear-gradient(to_bottom,#EADFC9_1px,transparent_1px)] bg-[size:24px_24px] opacity-[0.22] pointer-events-none z-0" />

      {/* 💫 Ambient Glow Suns */}
      <motion.div style={{ x: auraX, y: auraY }} className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-[#F7EAC9] rounded-full blur-[110px] opacity-60" />
        <div className="absolute bottom-[15%] left-[5%] w-[450px] h-[450px] bg-[#FFF0F0] rounded-full blur-[120px] opacity-70" />
      </motion.div>

      {/* Header */}
      <div className="text-center mb-20 relative z-10">
        <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-black text-[#E29393] bg-white px-5 py-2 rounded-full border-2 border-[#EADFC9] shadow-sm mb-4">
          🌸 Cozy Rituals Guide
        </span>
        <h2 className="text-3xl sm:text-5xl font-black text-[#3C3232] tracking-tight">
          The Daily Handbook of Gentle Care
        </h2>
        <p className="text-[#6E5D5D] mt-3 text-xs sm:text-base italic font-bold max-w-lg mx-auto px-2">
          Caring for a rescued gem isn't about rigid rules—it's a choreography of slow, beautiful habits that whisper safety.
        </p>
        <div className="h-[4px] w-12 bg-gradient-to-r from-[#E7C78A] to-[#E29393] mx-auto mt-4 rounded-full" />
      </div>

      {/* Main Studio Frame Layout */}
      <div className="max-w-5xl mx-auto relative z-10 flex flex-col lg:flex-row items-stretch gap-10 sm:gap-14">
        
        {/* Left Side: Recipe Box Index Selector */}
        <div className="w-full lg:w-[32%] flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 scrollbar-none snap-x justify-start">
          {careRitualsData.map((ritual) => {
            const isSelected = activeTab === ritual.id;
            return (
              <button
                key={ritual.id}
                onClick={() => setActiveTab(ritual.id)}
                className={`relative group flex-shrink-0 snap-center lg:w-full text-left px-5 py-4 rounded-2xl border-2 transition-all duration-300 outline-none flex items-center gap-4 ${
                  isSelected 
                    ? "bg-white border-[#3C3232] text-[#3C3232] shadow-[4px_4px_0px_#3C3232]" 
                    : "bg-white/60 backdrop-blur-sm border-[#EADFC9] text-[#6E5D5D] hover:bg-white hover:border-[#3C3232]/40"
                }`}
              >
                {/* Visual Icon Accent Ring */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border-2 transition-transform duration-500 group-hover:rotate-12 ${
                  isSelected ? "bg-[#FFFFF7] border-[#3C3232]" : "bg-white border-[#EADFC9]"
                }`}>
                  {ritual.icon}
                </div>

                <div className="pr-2">
                  <p className="text-xs font-black tracking-tight leading-tight">
                    {ritual.tabLabel}
                  </p>
                  <p className="text-[10px] opacity-60 font-bold italic mt-0.5 hidden sm:block">
                    {ritual.subtitle}
                  </p>
                </div>

                {/* Subtle side pointer dot for active item on desktop */}
                {isSelected && (
                  <motion.div 
                    layoutId="activePointerDot"
                    className="absolute right-4 w-1.5 h-1.5 rounded-full bg-[#E29393] hidden lg:block"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Side: Animated Living Journal Pages */}
        <div className="w-full lg:w-[68%] relative min-h-[460px] sm:min-h-[420px]">
          {/* Whimsical Background Offset Shadows for Card Stability */}
          <div className="absolute -inset-2 bg-[#EADFC9]/30 rounded-[2.5rem] rotate-1 shadow-inner pointer-events-none" />
          <div className="absolute -inset-0.5 bg-[#E7C78A]/10 rounded-[2.2rem] -rotate-1 pointer-events-none" />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentRitual.id}
              initial={{ opacity: 0, y: 15, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.99 }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              className={`w-full h-full relative rounded-[2rem] border-4 border-[#3C3232] p-6 sm:p-10 shadow-xl bg-white flex flex-col justify-between overflow-hidden`}
            >
              {/* Cozy Corner Watermark Pattern inside Card */}
              <div className="absolute top-0 right-0 p-8 opacity-[0.04] pointer-events-none select-none text-8xl font-black">
                {currentRitual.decorEmote || "🐾"}
              </div>

              {/* Card Meta Content */}
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-dashed border-[#EADFC9] pb-5">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-[#3C3232] tracking-tight">
                      {currentRitual.title}
                    </h3>
                    <p className="text-xs text-[#E29393] uppercase font-black tracking-widest mt-1">
                      {currentRitual.subtitle}
                    </p>
                  </div>
                  <div className="bg-[#FFFFF7] border-2 border-[#EADFC9] rounded-2xl px-3 py-2 flex items-center justify-center shadow-inner">
                    {currentRitual.icon}
                  </div>
                </div>

                {/* Narrative Intro Description */}
                <p className="text-xs sm:text-sm text-[#5A4E4E] leading-relaxed font-semibold italic bg-[#FFFFF7]/90 border border-[#EADFC9]/50 p-4 rounded-xl">
                  {currentRitual.intro}
                </p>

                {/* Handcrafted Guide Lines */}
                <div className="space-y-3">
                  {currentRitual.guidelines.map((line, lIdx) => (
                    <div key={lIdx} className="flex items-start gap-3 text-xs sm:text-sm text-[#6E5D5D] font-medium leading-relaxed">
                      <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${currentRitual.bulletColor} border border-[#3C3232]/10`} />
                      <p>{line}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Quote Accent Badge */}
              <div className="mt-8 pt-4 border-t-2 border-dashed border-[#EADFC9]/60 flex items-center gap-3 text-[#4E6E58] font-bold italic text-xs sm:text-sm">
                <Heart className="w-4 h-4 text-[#E29393] fill-[#E29393] flex-shrink-0 animate-pulse" />
                <span>"{currentRitual.closingQuote}"</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* Footer Dotted Break */}
    <div className="w-full max-w-xs mx-auto border-t-2 border-dashed border-[#D2BCA4] mt-28 opacity-100" />
    </section>
  );
}