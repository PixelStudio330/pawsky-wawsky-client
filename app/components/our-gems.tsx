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
    <main className="relative min-h-screen text-[#5A4E4E] py-24 px-4 sm:px-6 overflow-x-hidden bg-[#FFFFF7]">
      
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#EADFC9_1px,transparent_1px),linear-gradient(to_bottom,#EADFC9_1px,transparent_1px)] bg-[size:24px_24px] opacity-[0.24] pointer-events-none z-0" />

      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[350px] sm:w-[550px] h-[350px] sm:h-[550px] bg-[#FADCD5]/50 rounded-full blur-[100px] sm:blur-[130px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] sm:w-[650px] h-[400px] sm:h-[650px] bg-[#F3E1C6]/40 rounded-full blur-[110px] sm:blur-[150px]" />
        
        <motion.div animate={{ y: [0, -12, 0], rotate: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }} className="absolute top-28 right-12 text-5xl opacity-30 select-none">💎</motion.div>
        <motion.div animate={{ y: [0, 10, 0], rotate: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }} className="absolute bottom-40 left-10 text-4xl opacity-30 select-none">🌸</motion.div>
        <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="absolute top-1/2 left-8 text-3xl select-none">🫧</motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="text-center mb-24 md:mb-32 relative z-10"
      >
        <span className="inline-block text-[10px] uppercase tracking-widest font-black text-[#E29393] bg-white px-5 py-2 rounded-full border-2 border-[#EADFC9] shadow-sm">
          Adoption Sanctuary ✨
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#3C3232] mt-5 tracking-tight drop-shadow-sm leading-tight">
          Our Precious Gems <span className="inline-block animate-bounce duration-[3s] text-[#E29393]">💎</span>
        </h1>
        <p className="text-[#6E5D5D] mt-3 text-base sm:text-lg italic font-bold max-w-xl mx-auto px-4">
          Meet the beautiful souls that turn our small sanctuary into a cozy home.
        </p>
        <div className="h-[4px] w-20 bg-gradient-to-r from-[#E29393] via-[#E7C78A] to-[#DFB48F] mx-auto mt-6 rounded-full shadow-sm" />
      </motion.div>

      <div className="flex flex-col gap-20 md:gap-28 max-w-5xl mx-auto relative z-10">
        {pets.length === 0 ? (
          <div className="text-center py-20 px-4 bg-white/80 backdrop-blur-sm border-4 border-dashed border-[#D2BCA4] rounded-[2.5rem] shadow-sm">
            <p className="text-xs md:text-sm font-black uppercase tracking-widest text-[#8A7979] italic">The nursery is quiet right now. Check back soon! 🐾</p>
          </div>
        ) : (
          pets.map((pet, i) => {
            const isEven = i % 2 === 0;
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
                className={`scroll-mt-32 bg-white/95 backdrop-blur-md p-5 sm:p-7 md:p-10 flex flex-col ${
                  isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                } items-center gap-8 lg:gap-12 border-3 border-[#D2BCA4] relative overflow-hidden cursor-pointer group rounded-[2.5rem_1.25rem_2.5rem_1.25rem] sm:rounded-[3.5rem_1.5rem_3.5rem_1.5rem]`}
              >
                <div className="absolute top-0 right-0 w-10 h-10 opacity-30 border-t-3 border-r-3 border-[#D2BCA4] rounded-tr-md pointer-events-none group-hover:opacity-100 group-hover:scale-105 transition-all" />
                <div className="absolute bottom-0 left-0 w-10 h-10 opacity-30 border-b-3 border-l-3 border-[#D2BCA4] rounded-bl-md pointer-events-none group-hover:opacity-100 group-hover:scale-105 transition-all" />

                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-[#FFF0F0]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="w-full lg:w-[44%] relative flex-shrink-0">
                  <motion.div 
                    variants={bubbleImageVariants(isEven)}
                    initial="initial"
                    className="absolute -inset-2 md:-inset-3 bg-[#E2A6A6] rounded-[2rem_1rem_2rem_1rem] sm:rounded-[2.5rem_1.25rem_2.5rem_1.25rem] z-0 shadow-inner" 
                  />
                  
                  <div className="relative overflow-hidden rounded-[1.8rem_0.8rem_1.8rem_0.8rem] sm:rounded-[2.2rem_1.1rem_2.2rem_1.1rem] shadow-md border-[4px] border-white z-10 aspect-[4/3] sm:aspect-video lg:aspect-auto">
                    <Image
                      src={pet.image}
                      alt={pet.name}
                      width={500}
                      height={400}
                      className="w-full h-full lg:h-[350px] object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      priority={i === 0}
                    />
                  </div>

                  <motion.div 
                    variants={charmVariants}
                    animate="animate"
                    whileHover="hover"
                    className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 bg-white w-12 h-12 sm:w-14 sm:h-14 rounded-2xl shadow-md flex items-center justify-center text-lg sm:text-xl z-20 border-2 border-[#D2BCA4] select-none"
                  >
                    🌸
                  </motion.div>
                </div>

                <div className="w-full lg:w-[56%] flex flex-col justify-between self-stretch py-1 z-10">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <h2 className="text-3xl sm:text-4xl font-black text-[#3C3232] tracking-tight transition-colors duration-300 group-hover:text-[#E29393]">
                        {pet.name}
                      </h2>
                      <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 bg-[#FFF0F0] text-[#E29393] rounded-full border border-[#FCD4D4]">
                        {pet.age} Old
                      </span>
                      <span className="text-[9px] uppercase font-black px-2.5 py-1 bg-[#FCFAF2] border border-[#DFB48F]/50 text-[#A08068] rounded-md tracking-widest">
                        {pet.species}
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
                        Read Bio
                        <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                      </span>

                      <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: "#3F5947" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => handleAdoptClick(e, pet._id)}
                        className="px-5 py-3 bg-[#4E6E58] text-white rounded-xl font-black shadow-[0_6px_20px_rgba(78,110,88,0.2)] transition-all duration-300 text-[10px] tracking-widest uppercase flex items-center gap-1.5"
                      >
                        Adopt Now <Sparkles size={11} className="animate-pulse" />
                      </motion.button>
                    </div>
                  </div>

                </div>
              </motion.section>
            );
          })
        )}
      </div>

      <footer className="mt-36 text-center text-[#8A7979]/60 px-4 relative z-10">
        <p className="text-[10px] sm:text-xs italic font-black tracking-widest uppercase">Every gem deserves a crown. Every pet deserves a home. 🫧</p>
      </footer>
    </main>
  );
}