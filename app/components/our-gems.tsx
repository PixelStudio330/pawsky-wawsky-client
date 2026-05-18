'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

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

// Framer Motion Animation Configurations
const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  },
  hover: {
    y: -12,
    scale: 1.015,
    boxShadow: "0 30px 60px -15px rgba(220, 164, 164, 0.25)",
    borderColor: "rgba(243, 198, 198, 0.7)",
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

const imageBgVariants = (isEven: boolean) => ({
  initial: { rotate: isEven ? 3 : -3, scale: 1 },
  hover: { 
    rotate: isEven ? -1 : 1, 
    scale: 1.03,
    backgroundColor: "#E2B4B4", // Shifts to a deeper warm rose tone on hover
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
      <div className="min-h-screen bg-[#FFFDFB] flex items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-[#F3C6C6] rounded-full opacity-30" />
            <div className="absolute inset-0 border-4 border-[#F0A8A8] border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-[#8A6E6E] font-bold italic tracking-wide animate-pulse">
            polishing our precious gems... ✨
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#FFFDFB] text-[#5A4E4E] py-24 px-6 overflow-hidden">
      
      {/* 🌸 Ambient Backdrop Art Layer */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-20 right-12 text-6xl opacity-15 rotate-12 animate-bounce duration-[6s]">💎</div>
        <div className="absolute bottom-40 left-12 text-5xl opacity-15 -rotate-12 animate-pulse">🌸</div>
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#FADCD5]/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-[#E7C78A]/10 rounded-full blur-[140px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-24 relative z-10"
      >
        <span className="text-xs uppercase tracking-widest font-black text-[#F0A8A8] bg-[#FFF0F0] px-4 py-1.5 rounded-full shadow-sm">
          Adoption Sanctuary
        </span>
        <h1 className="text-5xl md:text-7xl font-black text-[#524444] mt-4 tracking-tight drop-shadow-sm">
          Our Precious Gems <span className="text-[#F0A8A8]">💎</span>
        </h1>
        <p className="text-[#8A7979] mt-4 text-xl italic font-medium max-w-xl mx-auto">
          Meet the beautiful souls that turn our small sanctuary into a cozy home.
        </p>
        <div className="h-1.5 w-24 bg-gradient-to-r from-[#F0A8A8] to-[#E7C78A] mx-auto mt-6 rounded-full" />
      </motion.div>

      <div className="flex flex-col gap-28 max-w-6xl mx-auto relative z-10 px-4">
        {pets.length === 0 ? (
          <div className="text-center py-24 bg-white/60 border-4 border-dashed border-[#F3C6C6] rounded-[3rem] shadow-inner">
            <p className="text-xl font-bold text-[#A69292] italic">The nursery is quiet right now. Check back soon! 🐾</p>
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
                viewport={{ once: true, margin: "-100px" }}
                onClick={() => router.push(`/our-gems/${pet._id}`)}
                className={`bg-white rounded-[3.5rem] p-8 md:p-12 shadow-[0_15px_40px_rgba(90,78,78,0.06)] flex flex-col ${
                  isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                } items-center gap-12 border-4 border-white relative overflow-hidden cursor-pointer group transition-colors duration-500`}
              >
                {/* 🎨 Subtle interior card glow overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#FFF5F5]/0 via-[#FFF5F5]/0 to-[#FFF5F5] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* 📸 Image Frame Setup */}
                <div className="w-full lg:w-[45%] relative">
                  <motion.div 
                    variants={imageBgVariants(isEven)}
                    initial="initial"
                    className="absolute -inset-4 bg-[#F3C6C6] rounded-[3rem] shadow-sm z-0" 
                  />
                  
                  <div className="relative overflow-hidden rounded-[2.2rem] shadow-xl border-4 border-white z-10">
                    <Image
                      src={pet.image}
                      alt={pet.name}
                      width={550}
                      height={450}
                      className="w-full h-[390px] object-cover transition-transform duration-700 group-hover:scale-105"
                      priority={i === 0}
                    />
                  </div>

                  {/* Little absolute float icon charm */}
                  <motion.div 
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                    className="absolute -bottom-6 -right-6 bg-white w-20 h-20 rounded-full shadow-lg flex items-center justify-center text-3xl z-20 border border-[#FFF0F0]"
                  >
                    🌸
                  </motion.div>
                </div>

                {/* 📝 Card Typography & Metadata Side */}
                <div className="w-full lg:w-[55%] flex flex-col justify-between h-full py-2 z-10">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-5">
                      <h2 className="text-4xl md:text-5xl font-black text-[#524444] tracking-tight transition-colors duration-300 group-hover:text-[#F0A8A8]">
                        {pet.name}
                      </h2>
                      <span className="text-xs font-bold px-4 py-1.5 bg-[#FFF0F0] text-[#F0A8A8] rounded-full border border-[#FFE0E0]">
                        {pet.age} old
                      </span>
                      <span className="text-[10px] uppercase font-black px-3 py-1 bg-[#FAF5E7] border border-[#E7C78A]/30 text-[#C9A68D] rounded-md tracking-wider">
                        {pet.species}
                      </span>
                    </div>
                    
                    <p className="text-[#8A7979] leading-relaxed text-base line-clamp-3 mb-6 font-medium">
                      {pet.description}
                    </p>

                    {/* Styled Pill Badge Clusters */}
                    <div className="flex flex-wrap gap-2.5 mb-8">
                      <span className="text-xs font-semibold px-3.5 py-2 bg-[#FFF8F6] border border-[#FDF0EC] rounded-2xl text-[#8A6E6E] shadow-sm">
                        🎀 <span className="text-[#5A4E4E] font-bold ml-1">Breed:</span> {pet.breed}
                      </span>
                      <span className="text-xs font-semibold px-3.5 py-2 bg-[#FFF8F6] border border-[#FDF0EC] rounded-2xl text-[#8A6E6E] shadow-sm">
                        ✨ <span className="text-[#5A4E4E] font-bold ml-1">Gender:</span> {pet.gender}
                      </span>
                      <span className="text-xs font-semibold px-3.5 py-2 bg-[#FAF9F6] border border-[#F5F4EE] rounded-2xl text-[#8A7979] shadow-sm">
                        📍 {pet.location}
                      </span>
                    </div>
                  </div>

                  {/* Clean Dynamic Footer Row Action Dock */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 pt-5 border-t border-[#FFF2F2] mt-auto">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-black text-[#C6B6B6]">Adoption Fee</p>
                      <p className="text-2xl font-black text-[#F0A8A8] mt-0.5 tracking-tight">
                        {pet.adoptionFee === 0 ? "Free Adoption! 🎁" : `$${pet.adoptionFee}`}
                      </p>
                    </div>

                    <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                      {/* Animated text link block with sliding dynamic arrow variants */}
                      <span className="text-[#8A7979] font-black text-sm tracking-wide transition-colors duration-300 flex items-center gap-2 pl-2 group-hover:text-[#F0A8A8]">
                        Read Full Bio
                        <motion.span 
                          animate={{ x: [0, 5, 0] }} 
                          transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                          className="inline-block"
                        >
                          👉
                        </motion.span>
                      </span>

                      <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: "#E2B4B4" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => handleAdoptClick(e, pet._id)}
                        className="px-7 py-3.5 bg-[#F0A8A8] text-white rounded-full font-black shadow-[0_10px_25px_rgba(240,168,168,0.4)] transition-all duration-300 text-xs tracking-wider uppercase"
                      >
                        Adopt Now! ✨
                      </motion.button>
                    </div>
                  </div>

                </div>
              </motion.section>
            );
          })
        )}
      </div>

      <footer className="mt-36 text-center text-[#BAAFAF]">
        <p className="text-sm italic font-medium tracking-wide">Every gem deserves a crown. Every pet deserves a home. ✨</p>
      </footer>
    </main>
  );
}