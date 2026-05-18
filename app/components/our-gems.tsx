'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Sparkles, MapPin, ArrowRight } from "lucide-react";

interface IPet {
  _id: string;
  name: string;
  species: string;
  breed: string;
  age: string;
  gender: "Male" | "Female" | "Unknown";
  image: string;
  location: string;
  adoptionFee: number;
  description: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.99 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  },
  hover: {
    y: -10,
    scale: 1.015,
    boxShadow: "0 40px 80px -25px rgba(90, 70, 70, 0.18)",
    borderColor: "rgba(226, 147, 147, 0.6)",
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
  }
};

const imageBgVariants = (isEven: boolean) => ({
  initial: { rotate: isEven ? 3 : -3, scale: 1 },
  hover: { 
    rotate: isEven ? -2 : 2, 
    scale: 1.03,
    backgroundColor: "#DF9A9A",
    transition: { duration: 0.4, ease: "easeInOut" }
  }
});

export default function OurGems() {
  const [pets, setPets] = useState<IPet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const isUserLoggedIn = false; 

useEffect(() => {
  const fetchGems = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/pets", {
        cache: "no-store"
      });
      const json = await response.json();
      if (json.success) {
        setPets(json.data);
      }
    } catch (error) {
      console.error("Error connecting to separate backend:", error);
    } finally {
      // 🌟 FIX: Change 'loading(false)' to 'setLoading(false)'
      setLoading(false);
    }
  };
  fetchGems();
}, []);

  const handleAdoptClick = (e: React.MouseEvent, petId: string) => {
    e.stopPropagation(); 
    if (!isUserLoggedIn) {
      router.push("/login");
    } else {
      router.push(`/our-gems/${petId}?adopt=true`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="flex flex-col items-center gap-5">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 border-[3px] border-[#3C3232]/10 rounded-full" />
            <div className="absolute inset-0 border-[3px] border-[#E29393] border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-[#5A4E4E] text-xs font-black tracking-widest uppercase animate-pulse">
            polishing our precious gems... ✨
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen text-[#5A4E4E] py-24 px-6 overflow-hidden bg-[#FFFFF7]">
      
      {/* 🌸 Ambient Backdrop Soft Lighting—Pushed completely to back using negative z-index */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-24 right-16 text-5xl opacity-20 rotate-12 animate-bounce duration-[7s]">💎</div>
        <div className="absolute bottom-44 left-16 text-4xl opacity-20 -rotate-12 animate-pulse">🌸</div>
        <div className="absolute top-1/4 left-1/4 w-[550px] h-[550px] bg-[#FADCD5]/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[650px] h-[650px] bg-[#F3E1C6]/30 rounded-full blur-[140px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-28 relative z-10"
      >
        <span className="text-[10px] uppercase tracking-widest font-black text-[#E29393] bg-[#FCFAF7] px-4 py-1.5 rounded-full border border-[#EADFC9] shadow-sm">
          Adoption Sanctuary
        </span>
        <h1 className="text-4xl md:text-6xl font-black text-[#3C3232] mt-4 tracking-tight drop-shadow-sm">
          Our Precious Gems <span className="text-[#E29393]">💎</span>
        </h1>
        <p className="text-[#6E5D5D] mt-3 text-lg italic font-medium max-w-xl mx-auto">
          Meet the beautiful souls that turn our small sanctuary into a cozy home.
        </p>
        <div className="h-[3px] w-16 bg-gradient-to-r from-[#E29393] to-[#DFB48F] mx-auto mt-5 rounded-full" />
      </motion.div>

      <div className="flex flex-col gap-24 max-w-5xl mx-auto relative z-10 px-2">
        {pets.length === 0 ? (
          <div className="text-center py-20 bg-[#FCFAF7]/60 backdrop-blur-sm border-2 border-dashed border-[#D2BCA4] rounded-[2.5rem]">
            <p className="text-sm font-black uppercase tracking-wider text-[#8A7979] italic">The nursery is quiet right now. Check back soon! 🐾</p>
          </div>
        ) : (
          pets.map((pet, i) => {
            const isEven = i % 2 === 0;
            return (
              <motion.section
                key={pet._id}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true, margin: "-80px" }}
                onClick={() => router.push(`/our-gems/${pet._id}`)}
                className={`bg-[#FCFAF7]/90 backdrop-blur-md p-6 md:p-10 flex flex-col ${
                  isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                } items-center gap-10 border-2 border-[#D2BCA4] relative overflow-hidden cursor-pointer group transition-all duration-300 rounded-[2.75rem_1.25rem_2.75rem_1.25rem]`}
              >
                {/* Folk-art aesthetic subtle corner accent overlays */}
                <div className="absolute top-0 right-0 w-8 h-8 opacity-40 border-t-2 border-r-2 border-[#D2BCA4] rounded-tr-md pointer-events-none group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 w-8 h-8 opacity-40 border-b-2 border-l-2 border-[#D2BCA4] rounded-bl-md pointer-events-none group-hover:opacity-100 transition-opacity" />

                {/* Subtle interior card warm overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#FFFDFB]/0 via-[#FFFDFB]/0 to-[#FFF0F0]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* 📸 Image Frame Setup */}
                <div className="w-full lg:w-[42%] relative flex-shrink-0">
                  <motion.div 
                    variants={imageBgVariants(isEven)}
                    initial="initial"
                    className="absolute -inset-2.5 bg-[#E2A6A6] rounded-[2rem_1rem_2rem_1rem] z-0 shadow-inner" 
                  />
                  
                  <div className="relative overflow-hidden rounded-[1.75rem_0.75rem_1.75rem_0.75rem] shadow-md border-[3px] border-[#FCFAF7] z-10">
                    <Image
                      src={pet.image}
                      alt={pet.name}
                      width={500}
                      height={400}
                      className="w-full h-[340px] object-cover transition-transform duration-700 ease-out group-hover:scale-102"
                      priority={i === 0}
                    />
                  </div>

                  {/* Absolute Floating Decorative Charm */}
                  <motion.div 
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
                    className="absolute -bottom-4 -right-4 bg-[#FCFAF7] w-14 h-14 rounded-2xl shadow-md flex items-center justify-center text-xl z-20 border-2 border-[#D2BCA4]"
                  >
                    🌸
                  </motion.div>
                </div>

                {/* 📝 Card Details Panel */}
                <div className="w-full lg:w-[58%] flex flex-col justify-between self-stretch py-1 z-10">
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5 mb-4">
                      <h2 className="text-3xl font-black text-[#3C3232] tracking-tight transition-colors duration-300 group-hover:text-[#E29393]">
                        {pet.name}
                      </h2>
                      <span className="text-[10px] font-black tracking-wide px-3 py-1 bg-[#FFF0F0] text-[#E29393] rounded-full border border-[#FCD4D4]">
                        {pet.age} Old
                      </span>
                      <span className="text-[9px] uppercase font-black px-2.5 py-1 bg-[#FAF5E7] border border-[#DFB48F]/40 text-[#A08068] rounded-md tracking-widest">
                        {pet.species}
                      </span>
                    </div>
                    
                    <p className="text-[#6E5D5D] leading-relaxed text-sm line-clamp-3 mb-6 font-medium italic">
                      "{pet.description}"
                    </p>

                    {/* Styled Pill Badge Clusters */}
                    <div className="flex flex-wrap gap-2 border-t border-b border-dashed border-[#D2BCA4] py-4 mb-6">
                      <span className="text-[11px] font-bold px-3 py-1.5 bg-white/50 border border-[#EADFC9] rounded-xl text-[#5A4E4E] shadow-sm">
                        🎀 <span className="text-[#8A7979] font-medium ml-1">Breed:</span> {pet.breed}
                      </span>
                      <span className="text-[11px] font-bold px-3 py-1.5 bg-white/50 border border-[#EADFC9] rounded-xl text-[#5A4E4E] shadow-sm">
                        ✨ <span className="text-[#8A7979] font-medium ml-1">Gender:</span> {pet.gender}
                      </span>
                      <span className="text-[11px] font-bold px-3 py-1.5 bg-white/50 border border-[#EADFC9] rounded-xl text-[#5A4E4E] shadow-sm flex items-center gap-1">
                        <MapPin size={12} className="text-[#E29393]" /> {pet.location}
                      </span>
                    </div>
                  </div>

                  {/* Clean Dynamic Action Bar */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-3 mt-auto">
                    <div>
                      <p className="text-[9px] uppercase tracking-widest font-black text-[#A89898]">Adoption Contribution</p>
                      <p className="text-xl font-black text-[#E29393] tracking-tight">
                        {pet.adoptionFee === 0 ? "Gifted Adoption! 🎁" : `$${pet.adoptionFee}`}
                      </p>
                    </div>

                    <div className="flex items-center gap-5 w-full sm:w-auto justify-between sm:justify-end">
                      <span className="text-[#6E5D5D] font-black text-xs tracking-wider uppercase transition-colors duration-300 flex items-center gap-1.5 group-hover:text-[#E29393]">
                        Read Bio
                        <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
                      </span>

                      <motion.button
                        whileHover={{ scale: 1.03, backgroundColor: "#3F5947" }}
                        whileTap={{ scale: 0.97 }}
                        onClick={(e) => handleAdoptClick(e, pet._id)}
                        className="px-6 py-3 bg-[#4E6E58] text-[#FCFAF7] rounded-xl font-black shadow-[0_4px_15px_rgba(78,110,88,0.2)] transition-all duration-300 text-[10px] tracking-widest uppercase flex items-center gap-1"
                      >
                        Adopt Now <Sparkles size={11} />
                      </motion.button>
                    </div>
                  </div>

                </div>
              </motion.section>
            );
          })
        )}
      </div>

      <footer className="mt-36 text-center text-[#8A7979]/70">
        <p className="text-xs italic font-semibold tracking-widest uppercase">Every gem deserves a crown. Every pet deserves a home. ✨</p>
      </footer>
    </main>
  );
}