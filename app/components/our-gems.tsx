'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface IPet {
  _id: string;
  name: string;
  species: string;
  breed: string;
  age: string;
  gender: "Male" | "Female" | "Unknown";
  image: string;
  healthStatus: string;
  vaccinationStatus: string;
  location: string;
  adoptionFee: number;
  description: string;
  ownerEmail: string;
}

export default function OurGems() {
  const [pets, setPets] = useState<IPet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const isUserLoggedIn = false; 

  // Fetch from our separate server engine running on port 5000
  useEffect(() => {
    const fetchGems = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/pets");
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

  // Secure navigation rule: If they click "Adopt Now" without being logged in, send them straight to login
  const handleAdoptClick = (e: React.MouseEvent, petId: string) => {
    if (!isUserLoggedIn) {
      e.preventDefault();
      router.push("/login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF6EC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#E7C78A] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#6D7C75] font-bold italic">polishing our precious gems... ✨</p>
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#FDF6EC] text-[#5C6B64] py-20 px-6 overflow-hidden">
      
      {/* 🌸 Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-20 right-10 text-6xl opacity-10 rotate-12">💎</div>
        <div className="absolute bottom-40 left-10 text-6xl opacity-10 -rotate-12">🐾</div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#E7C78A]/5 rounded-full blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-20 relative z-10"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-[#6D7C75] drop-shadow-sm">
          Our Precious Gems 💎
        </h1>
        <p className="text-[#8E9B94] mt-4 text-xl italic font-medium">
          Meet the souls that make our sanctuary a home.
        </p>
        <div className="h-1.5 w-32 bg-[#E7C78A] mx-auto mt-6 rounded-full" />
      </motion.div>

      <div className="flex flex-col gap-28 max-w-7xl mx-auto relative z-10 px-4">
        {pets.length === 0 ? (
          <div className="text-center py-20 bg-white/40 border-4 border-dashed border-[#E7C78A]/40 rounded-[3rem]">
            <p className="text-xl font-bold text-[#8E9B94] italic">The nursery is empty right now. Check back soon! 🐾</p>
          </div>
        ) : (
          pets.map((pet, i) => (
            <motion.section
              key={pet._id}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-150px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className={`bg-white rounded-[3rem] p-10 md:p-14 shadow-2xl flex flex-col ${
                i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } items-center gap-14 border-4 border-white/50 relative overflow-hidden`}
            >
              {/* 📸 Image Side */}
              <div className="w-full lg:w-1/2 relative group">
                <div className={`absolute -inset-5 bg-[#C9A68D] rounded-[3.5rem] ${
                  i % 2 === 0 ? "rotate-3" : "-rotate-3"
                } group-hover:rotate-0 transition-transform duration-500`} />
                <div className="relative overflow-hidden rounded-[2.5rem] shadow-xl border-8 border-white">
                  <Image
                    src={pet.image}
                    alt={pet.name}
                    width={650}
                    height={550}
                    className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                    priority={i === 0}
                  />
                </div>
                <div className="absolute -bottom-8 -right-8 bg-white w-24 h-24 rounded-full shadow-2xl flex items-center justify-center text-4xl animate-pulse">
                  ✨
                </div>
              </div>

              {/* 📝 Content Side */}
              <div className="w-full lg:w-1/2 flex flex-col">
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <h2 className="text-5xl font-extrabold text-[#6D7C75] tracking-tight">
                    {pet.name}
                  </h2>
                  <span className="text-sm font-semibold px-5 py-2 bg-[#E7C78A]/30 text-[#6D7C75] rounded-full">
                    {pet.age} old
                  </span>
                  <span className="text-xs uppercase font-black px-4 py-1.5 bg-[#EDFDF3] border border-[#C5ECD9] text-green-800 rounded-md tracking-wider">
                    {pet.species}
                  </span>
                </div>
                
                <div className="space-y-6 text-lg">
                  <p className="text-[#8E9B94] leading-relaxed">
                    <span className="font-bold text-[#6D7C75]">Personality & Story:</span> {pet.description}
                  </p>

                  <div className="flex flex-wrap gap-4 mt-2">
                    <div className="bg-[#FAF5E7] p-4 rounded-2xl border-l-4 border-[#E7C78A] shadow-inner inline-block">
                      <p className="text-sm text-[#6D7C75]">
                        <span className="font-bold">Breed:</span> {pet.breed} • <span className="font-bold">Gender:</span> {pet.gender}
                      </p>
                    </div>
                    <div className="bg-[#FAF5E7] p-4 rounded-2xl border-l-4 border-[#E7C78A] shadow-inner inline-block">
                      <p className="text-sm text-[#6D7C75]">
                        <span className="font-bold">Adoption Fee:</span> {pet.adoptionFee === 0 ? "Free Adoption! 🎁" : `$${pet.adoptionFee}`}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                    <div className="bg-[#EDFDF3] p-6 rounded-3xl shadow-sm border border-[#C5ECD9]">
                      <h4 className="font-bold text-green-800 mb-2 text-md underline decoration-green-200 underline-offset-4">Health & Status 🌿</h4>
                      <p className="text-xs text-[#465A51] font-semibold mb-1">🏥 {pet.healthStatus}</p>
                      <p className="text-xs text-[#465A51] font-semibold">💉 {pet.vaccinationStatus}</p>
                    </div>
                    <div className="bg-[#FFF6F6] p-6 rounded-3xl shadow-sm border border-[#FFD9D9]">
                      <h4 className="font-bold text-red-800 mb-2 text-md underline decoration-red-200 underline-offset-4">Sanctuary Details 📍</h4>
                      <p className="text-xs text-[#664F4F] font-semibold mb-1">🏡 Location: {pet.location}</p>
                      <p className="text-xs text-[#664F4F] font-semibold truncate">✉️ Contact: {pet.ownerEmail}</p>
                    </div>
                  </div>
                </div>

                {/* 🌟 Action Buttons Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
                  {/* View Full Details Layout Link */}
                  <Link href={`/our-gems/${pet._id}`}>
                    <motion.button
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 bg-[#FAF5E7] text-[#6D7C75] border-2 border-[#E7C78A]/50 rounded-full font-bold shadow-md hover:bg-[#E7C78A]/20 transition-all duration-300 text-center text-sm"
                    >
                      View Full Details 📂
                    </motion.button>
                  </Link>

                  {/* Adopt Now Rule Action Button */}
                  <Link 
                    href={`/our-gems/${pet._id}?adopt=true`} 
                    onClick={(e) => handleAdoptClick(e, pet._id!)}
                  >
                    <motion.button
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 bg-[#6D7C75] text-white rounded-full font-bold shadow-xl hover:bg-[#586660] transition-all duration-300 text-center text-sm"
                    >
                      Adopt Now! ✨
                    </motion.button>
                  </Link>
                </div>

              </div>
            </motion.section>
          ))
        )}
      </div>

      <footer className="mt-32 text-center text-[#8E9B94]">
        <p className="text-sm italic font-medium">Every gem deserves a crown. Every pet deserves a home. ✨</p>
      </footer>
    </main>
  );
}