'use client';

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext"; 
import { Sparkles, MapPin, ArrowRight, Search, Sun, CheckCircle, Clock } from "lucide-react";

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
  status?: "available" | "pending" | "adopted";
}

const bubbleCardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 180, damping: 20 } 
  },
  hover: {
    y: -14,
    scale: 1.025,
    boxShadow: "0 35px 60px -20px rgba(110, 80, 80, 0.16)",
    borderColor: "#E29393",
    transition: { type: "spring", stiffness: 260, damping: 14 }
  }
};

const bubbleImageVariants = (isEven: boolean) => ({
  initial: { rotate: isEven ? 3 : -3, scale: 1 },
  hover: { 
    rotate: isEven ? -3 : 3, 
    scale: 1.05,
    backgroundColor: "#DF9A9A",
    transition: { type: "spring", stiffness: 300, damping: 12 }
  }
});

const charmVariants = {
  animate: {
    y: [0, -8, 0],
    rotate: [0, 8, -8, 0],
    transition: {
      repeat: Infinity,
      duration: 3.5,
      ease: "easeInOut"
    }
  },
  hover: {
    scale: 1.2,
    rotate: 45,
    transition: { type: "spring", stiffness: 400, damping: 10 }
  }
};

export default function OurGems() {
  const [pets, setPets] = useState<IPet[]>([]);
  const [filteredPets, setFilteredPets] = useState<IPet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>(" ");
  const [selectedSpecies, setSelectedSpecies] = useState<string>("All");
  
  const mainRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user } = useAuth();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  const auraTranslateX = useTransform(springX, (val) => `${val * 0.04}px`);
  const auraTranslateY = useTransform(springY, (val) => `${val * 0.04}px`);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!mainRef.current) return;
    const { left, top, width, height } = mainRef.current.getBoundingClientRect();
    const x = e.clientX - left - width / 2;
    const y = e.clientY - top - height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const fetchGems = async () => {
  try {
    // This will use your Vercel env variable in production, and fallback to localhost for development
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    
    const response = await fetch(`${API_URL}/api/pets`, {
      cache: "no-store"
    });
    const json = await response.json();
    if (json.success) {
      setPets(json.data);
      setFilteredPets(json.data); 
    }
  } catch (error) {
    console.error("Error connecting to separate backend:", error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (!loading && typeof window !== "undefined" && window.location.hash) {
      const hashId = window.location.hash.substring(1); 
      const targetElement = document.getElementById(hashId);
      
      if (targetElement) {
        setTimeout(() => {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }

      const vanishTimer = setTimeout(() => {
        window.history.replaceState(
          null, 
          document.title, 
          window.location.pathname + window.location.search
        );
      }, 500);

      return () => clearTimeout(vanishTimer);
    }
  }, [loading]);

  useEffect(() => {
    const results = pets.filter((pet) => {
      const matchesSearch = 
        pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pet.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pet.species.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesSpecies = 
        selectedSpecies === "All" || 
        pet.species.toLowerCase() === selectedSpecies.toLowerCase();

      return matchesSearch && matchesSpecies;
    });
    
    setFilteredPets(results);
  }, [searchQuery, selectedSpecies, pets]);

  const handleAdoptClick = (e: React.MouseEvent, pet: IPet) => {
    e.stopPropagation(); 
    if (pet.status === "adopted") return;

    if (!user) {
      router.push("/login");
    } else {
      router.push(`/our-gems/${pet._id}?adopt=true`);
    }
  };

  const uniqueSpecies = ["All", ...Array.from(new Set(pets.map(p => p.species)))];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative bg-[#FFFFF7]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#EADFC9_1px,transparent_1px),linear-gradient(to_bottom,#EADFC9_1px,transparent_1px)] bg-[size:24px_24px] opacity-25 pointer-events-none" />
        <div className="flex flex-col items-center gap-5 relative z-10">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-[4px] border-[#3C3232]/5 rounded-full" />
            <div className="absolute inset-0 border-[4px] border-[#E29393] border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-[#5A4E4E] text-xs font-black tracking-widest uppercase animate-pulse">
            polishing our precious gems... 🫧
          </p>
        </div>
      </div>
    );
  }

  return (
    <main 
      ref={mainRef}
      id="all-pets-section"
      onMouseMove={handleMouseMove}
      className="relative min-h-screen text-[#5A4E4E] py-24 px-4 sm:px-6 overflow-x-hidden bg-[#FFFFF7] scroll-mt-32"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#EADFC9_1px,transparent_1px),linear-gradient(to_bottom,#EADFC9_1px,transparent_1px)] bg-[size:24px_24px] opacity-[0.24] pointer-events-none z-0" />

      {/* Dreamy Aura Ambient Suns */}
      <motion.div 
        style={{ x: auraTranslateX, y: auraTranslateY }} 
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      >
        <motion.div 
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
          className="absolute top-40 left-[5%] w-[380px] h-[380px] bg-[#FADCD5] rounded-full blur-[110px] opacity-75"
        />
        <motion.div 
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-24 right-[8%] w-[420px] h-[420px] bg-[#F7EAC9] rounded-full blur-[120px] opacity-80"
        />
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ repeat: Infinity, duration: 14, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/2 left-1/3 w-[350px] h-[350px] bg-[#E2ECE9] rounded-full blur-[100px] opacity-65"
        />
      </motion.div>

      {/* Header Elements */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="text-center mb-16 relative z-10"
      >
        <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-black text-[#E29393] bg-white px-5 py-2 rounded-full border-2 border-[#EADFC9] shadow-sm mb-1 cursor-default">
          <span>Adoption Sanctuary</span> 
          <Sun size={11} className="text-[#E7C78A] animate-spin" style={{ animationDuration: '8s' }} />
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#3C3232] mt-5 tracking-tight drop-shadow-sm leading-tight">
          Our Precious Gems <span className="inline-block animate-bounce duration-[3s] text-[#E29393]">💎</span>
        </h1>
        <div className="h-[4px] w-20 bg-gradient-to-r from-[#E29393] via-[#E7C78A] to-[#DFB48F] mx-auto mt-6 rounded-full shadow-sm" />
      </motion.div>

      {/* Search Controls */}
      <div className="max-w-xl mx-auto mb-20 relative z-10 px-2">
        <div className="relative group bg-white border-3 border-[#D2BCA4] rounded-2xl p-1.5 flex items-center shadow-md transition-all duration-300 focus-within:border-[#E29393] focus-within:shadow-xl">
          <div className="pl-4 text-[#A89898] group-focus-within:text-[#E29393] transition-colors">
            <Search size={18} strokeWidth={2.5} />
          </div>
          <input 
            type="text" 
            placeholder="Search gems by name, breed, or species..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-0 outline-none px-3 py-2.5 text-sm font-bold text-[#3C3232] placeholder-[#C4B4B4]"
          />
        </div>

        {pets.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            {uniqueSpecies.map((species) => (
              <button
                key={species}
                onClick={() => setSelectedSpecies(species)}
                className={`text-[10px] uppercase font-black tracking-widest px-4 py-2 rounded-xl transition-all duration-300 border-2 ${
                  (selectedSpecies === species)
                    ? "bg-[#E29393] border-[#E29393] text-white shadow-sm"
                    : "bg-white border-[#EADFC9] text-[#8A7979] hover:border-[#DFB48F]"
                }`}
              >
                {species}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Gems Cards Grid */}
      <div className="flex flex-col gap-20 md:gap-28 max-w-5xl mx-auto relative z-10">
        {filteredPets.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 px-4 bg-white/80 backdrop-blur-sm border-4 border-dashed border-[#D2BCA4] rounded-[2.5rem] shadow-sm max-w-2xl mx-auto w-full"
          >
            <p className="text-3xl mb-4">🐾</p>
            <p className="text-sm font-black uppercase tracking-widest text-[#8A7979] italic">
              {pets.length === 0 
                ? "The nursery is quiet right now. Check back soon!" 
                : "No precious gems match your search context."}
            </p>
          </motion.div>
        ) : (
          filteredPets.map((pet, i) => {
            const isEven = i % 2 === 0;
            const currentStatus = pet.status || "available";

            return (
              <motion.section
                key={pet._id}
                id={`pet-${pet._id}`}
                variants={bubbleCardVariants}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true, margin: "-60px" }}
                onClick={() => router.push(`/our-gems/${pet._id}`)}
                className={`bg-white/95 backdrop-blur-md p-5 sm:p-7 md:p-10 flex flex-col items-center gap-8 lg:gap-12 border-3 border-[#D2BCA4] relative overflow-hidden cursor-pointer group rounded-[2.5rem_1.25rem_2.5rem_1.25rem] sm:rounded-[3.5rem_1.5rem_3.5rem_1.5rem] ${
                  isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } ${currentStatus === "adopted" ? "opacity-80 border-[#EADFC9]" : ""}`}
              >
                <div className="absolute top-0 right-0 w-10 h-10 opacity-30 border-t-3 border-r-3 border-[#D2BCA4] rounded-tr-md pointer-events-none group-hover:opacity-100 group-hover:scale-105 transition-all" />
                <div className="absolute bottom-0 left-0 w-10 h-10 opacity-30 border-b-3 border-l-3 border-[#D2BCA4] rounded-bl-md pointer-events-none group-hover:opacity-100 group-hover:scale-105 transition-all" />

                <div className="w-full lg:w-[44%] relative flex-shrink-0">
                  <motion.div 
                    variants={bubbleImageVariants(isEven)}
                    initial="initial"
                    className={`absolute -inset-2 md:-inset-3 rounded-[2rem_1rem_2rem_1rem] sm:rounded-[2.5rem_1.25rem_2.5rem_1.25rem] z-0 shadow-inner ${
                      currentStatus === "adopted" ? "bg-[#A8A59E]" : "bg-[#E2A6A6]"
                    }`} 
                  />
                  
                  <div className="relative overflow-hidden rounded-[1.8rem_0.8rem_1.8rem_0.8rem] sm:rounded-[2.2rem_1.1rem_2.2rem_1.1rem] shadow-md border-[4px] border-white z-10 aspect-[4/3] sm:aspect-video lg:aspect-auto">
                    <Image
                      src={pet.image}
                      alt={pet.name}
                      width={500}
                      height={400}
                      className={`w-full h-full lg:h-[350px] object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
                        currentStatus === "adopted" ? "grayscale contrast-[0.85]" : ""
                      }`}
                      priority={i === 0}
                    />
                  </div>

                  <motion.div 
                    variants={charmVariants}
                    animate="animate"
                    whileHover="hover"
                    className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 bg-white w-12 h-12 sm:w-14 sm:h-14 rounded-2xl shadow-md flex items-center justify-center text-lg sm:text-xl z-20 border-2 border-[#D2BCA4] select-none"
                  >
                    {currentStatus === "adopted" ? "🏡" : currentStatus === "pending" ? "⏳" : "🌸"}
                  </motion.div>
                </div>

                <div className="w-full lg:w-[56%] flex flex-col justify-between self-stretch py-1 z-10">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <h2 className="text-3xl sm:text-4xl font-black text-[#3C3232] tracking-tight transition-colors duration-300 group-hover:text-[#E29393]">
                        {pet.name}
                      </h2>
                      
                      {currentStatus === "adopted" ? (
                        <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 bg-[#F1F3F1] text-[#556B58] rounded-full border border-[#D5DDD7] flex items-center gap-1">
                          <CheckCircle size={10} /> Adopted!!
                        </span>
                      ) : currentStatus === "pending" ? (
                        <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 bg-[#FFF9EB] text-[#C99A2E] rounded-full border border-[#FBEAC4] flex items-center gap-1">
                          <Clock size={10} className="animate-pulse" /> Pending
                        </span>
                      ) : (
                        <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 bg-[#F2FAF6] text-[#4E8C6A] rounded-full border border-[#D4EFE0]">
                          Available
                        </span>
                      )}

                      <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 bg-[#FFF0F0] text-[#E29393] rounded-full border border-[#FCD4D4]">
                        {pet.age} Old
                      </span>
                    </div>
                    
                    <p className="text-[#6E5D5D] leading-relaxed text-sm line-clamp-3 mb-5 font-bold italic">
                      "{pet.description}"
                    </p>

                    <div className="flex flex-wrap gap-2 border-t-2 border-b-2 border-dashed border-[#D2BCA4]/60 py-4 mb-6">
                      <span className="text-[11px] font-black px-3 py-1.5 bg-[#FCFAF7]/60 border border-[#EADFC9] rounded-xl text-[#5A4E4E] shadow-sm">
                        🎀 <span className="text-[#8A7979] font-medium ml-0.5">Breed:</span> {pet.breed}
                      </span>
                      <span className="text-[11px] font-black px-3 py-1.5 bg-[#FCFAF7]/60 border border-[#EADFC9] rounded-xl text-[#5A4E4E] shadow-sm">
                        ✨ <span className="text-[#8A7979] font-medium ml-0.5">Gender:</span> {pet.gender}
                      </span>
                      <span className="text-[11px] font-black px-3 py-1.5 bg-[#FCFAF7]/60 border border-[#EADFC9] rounded-xl text-[#5A4E4E] shadow-sm flex items-center gap-1">
                        <MapPin size={12} className="text-[#E29393]" /> {pet.location}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2 mt-auto">
                    <div>
                      <p className="text-[9px] uppercase tracking-widest font-black text-[#A89898]">Adoption Contribution</p>
                      <p className="text-xl font-black text-[#E29393] tracking-tight">
                        {pet.adoptionFee === 0 ? "Gifted Adoption! 🎁" : `$${pet.adoptionFee}`}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6 justify-between sm:justify-end">
                      <span className="text-[#6E5D5D] font-black text-xs tracking-wider uppercase transition-colors duration-300 flex items-center gap-1.5 group-hover:text-[#E29393]">
                        View Details
                        <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                      </span>

                      <motion.button
                        whileHover={currentStatus === "adopted" ? {} : { scale: 1.05, backgroundColor: currentStatus === "pending" ? "#D9A066" : "#3F5947" }}
                        whileTap={currentStatus === "adopted" ? {} : { scale: 0.95 }}
                        disabled={currentStatus === "adopted"}
                        onClick={(e) => handleAdoptClick(e, pet)}
                        className={`px-5 py-3 rounded-xl font-black transition-all duration-300 text-[10px] tracking-widest uppercase flex items-center gap-1.5 ${
                          currentStatus === "adopted" 
                            ? "bg-[#D2CFC9] text-[#7A7771] cursor-not-allowed shadow-none"
                            : currentStatus === "pending"
                            ? "bg-[#EAA15F] text-white shadow-[0_6px_20px_rgba(234,161,95,0.2)]"
                            : "bg-[#4E6E58] text-white shadow-[0_6px_20px_rgba(78,110,88,0.2)]"
                        }`}
                      >
                        {currentStatus === "adopted" ? (
                          <>Found a Home! 🎉</>
                        ) : currentStatus === "pending" ? (
                          <>In Review ⏳</>
                        ) : (
                          <>Adopt Now <Sparkles size={11} className="animate-pulse" /></>
                        )}
                      </motion.button>
                    </div>
                  </div>

                </div>
              </motion.section>
            );
          })
        )}
      </div>
      <div className="w-full max-w-xs mx-auto border-t-2 border-dashed border-[#D2BCA4] mt-28 opacity-100" />
    </main>
  );
}