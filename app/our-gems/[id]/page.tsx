'use client';

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter, useSearchParams } from "next/navigation"; 
import { useAuth } from "../../context/AuthContext"; 
import toast from "react-hot-toast"; 
import api from '@/lib/axios';

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
  status?: "available" | "pending" | "adopted"; // Added status alignment
}

const cozyToastStyle = {
  style: {
    background: '#FFFDF9',
    color: '#4E5C56',
    border: '1px solid #EAD7C3',
    borderRadius: '1rem',
    fontSize: '14px',
    fontWeight: '600',
    fontFamily: 'inherit',
    boxShadow: '0 10px 25px -5px rgba(78, 92, 86, 0.08)',
  },
};

function PetDetailsContent() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const searchParams = useSearchParams(); 
  
  const { user, loading: authLoading } = useAuth();
  
  const [pet, setPet] = useState<IPet | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  
  const [pickupDate, setPickupDate] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const isOwner = pet && user ? pet.ownerEmail === user.email : false;
  const isAlreadyAdopted = pet?.status === "adopted";
  const derivedUserName = user?.name || (user as any)?.displayName || (user as any)?.username || user?.email?.split('@')[0] || "Cozy Adopter";

  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${baseUrl}/api/pets/${id}`);
        const json = await res.json();
        
        if (json.success) {
          setPet(json.data);
        } else {
          toast.error("Could not find this pet's profile 🐾", cozyToastStyle);
        }
      } catch (error) {
        console.error("Error reading pet entity record:", error);
        toast.error("Network hiccup! Failed to load pet details.", cozyToastStyle);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPetDetails();
  }, [id]);

  // ✅ FRONTEND GUARD: Prevents automated modal popup if owner OR if already adopted
  useEffect(() => {
    if (isOwner || isAlreadyAdopted) {
      setShowModal(false);
      return;
    }

    if (!loading && !authLoading && user && searchParams?.get("adopt") === "true") {
      setShowModal(true);
    }
  }, [loading, authLoading, user, searchParams, isOwner, isAlreadyAdopted]);

  const handleAdoptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isOwner || isAlreadyAdopted || !user) return;

    const applicationPayload = {
      petId: pet?._id,
      petName: pet?.name,
      petOwnerEmail: pet?.ownerEmail,
      userName: derivedUserName,
      userEmail: user?.email,
      pickupDate,
      message: message || "I would love to give this gem a cozy home!", 
      status: "pending" 
    };

    await toast.promise(
      api.post("/api/adoptions", applicationPayload) 
      .then((res) => {
        if (!res.data.success) throw new Error(res.data.message || "Failed");
        
        setShowModal(false);
        router.push("/dashboard");
        return res.data;
      }),
      {
        loading: 'Sending application over to the sanctuary... 🕊️',
        success: `Application submitted! ✨`,
        error: (err: any) => {
          const backendMessage = err.response?.data?.message || err.response?.data?.error;
          return backendMessage || 'Pipeline block: Could not submit application. 🐾';
        },
      },
      cozyToastStyle
    );
  };

  // ✅ FRONTEND GUARD: Explicit block validation inside manual click
  const handleAdoptButtonAction = () => {
    if (isOwner) {
      toast.error("You cannot apply to adopt your own sanctuary listing! 🔒", cozyToastStyle);
      return;
    }

    if (isAlreadyAdopted) {
      toast.error("This asset has found a family! Application channel is closed. 🏡", cozyToastStyle);
      return;
    }

    if (!user) {
      toast("Please sign in to start your adoption journey! 👉👈", {
        icon: "🔒",
        ...cozyToastStyle
      });
      router.push("/login");
    } else {
      setShowModal(true);
    }
  };

  if (loading || authLoading) {
    return <LoadingStateSkeleton />;
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-[#FDF6EC] flex flex-col items-center justify-center p-6 text-center relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#EAD7C3_1px,transparent_1px),linear-gradient(to_bottom,#EAD7C3_1px,transparent_1px)] bg-[size:24px_24px] opacity-20 pointer-events-none" />
        <div className="relative z-10 max-w-md bg-white p-8 rounded-[2rem] border border-[#EAD7C3]/50 shadow-xl">
          <h2 className="text-2xl md:text-3xl font-black text-[#6D7C75]">Gem Not Found 🔍</h2>
          <p className="text-[#8E9B94] mt-2 italic text-sm">This pet profile might have found a family or been unlisted.</p>
          <button 
            onClick={() => router.push(`/#pet-${id}`)} 
            className="mt-6 w-full py-3 bg-[#6D7C75] text-white rounded-xl font-bold hover:bg-[#E29393] transition-all duration-300"
          >
            Back to Sanctuary
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#FDF6EC] text-[#5C6B64] py-12 md:py-20 px-4 sm:px-6 md:px-8 overflow-x-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#EAD7C3_1px,transparent_1px),linear-gradient(to_bottom,#EAD7C3_1px,transparent_1px)] bg-[size:24px_24px] opacity-[0.22] pointer-events-none z-0" />

      <div className="max-w-6xl mx-auto relative z-10">
        <button 
          onClick={() => router.replace(`/#pet-${pet._id}`)} 
          className="mb-6 md:mb-10 flex items-center gap-2 text-xs md:text-sm font-black uppercase tracking-wider text-[#6D7C75] hover:text-[#E29393] transition-colors pt-16 md:pt-24"
        >
          ← Back to All Precious Gems
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-1 lg:col-span-5 relative px-2 md:px-0"
          >
            <div className="absolute -inset-2 md:-inset-4 bg-[#F0A8A8]/30 rounded-[2rem] md:rounded-[2.5rem] rotate-1 md:rotate-2" />
            <div className="relative overflow-hidden rounded-[1.8rem] md:rounded-[2rem] border-[4px] md:border-[6px] border-white shadow-2xl bg-white aspect-[4/5] sm:aspect-video lg:aspect-auto">
              <Image 
                src={pet.image} 
                alt={pet.name} 
                width={600} 
                height={700} 
                className={`w-full h-full lg:h-[560px] object-cover ${isAlreadyAdopted ? "grayscale contrast-[0.85]" : ""}`}
                priority
              />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="col-span-1 lg:col-span-7 bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-8 md:p-12 shadow-[0_15px_40px_-15px_rgba(78,92,86,0.06)] border border-[#EAD7C3]/30 flex flex-col justify-between min-h-fit lg:min-h-[560px]"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-[10px] md:text-xs uppercase font-black px-2.5 py-1 bg-[#FCFAF5] text-[#C9A68D] border border-[#E7C78A]/40 rounded-md tracking-wider">
                  {pet.species} • {pet.breed}
                </span>
                <span className="text-[10px] md:text-xs font-black uppercase tracking-wider px-2.5 py-1 bg-[#FDF1F1] text-[#E29393] border border-[#F0A8A8]/40 rounded-md">
                  🛡️ {pet.vaccinationStatus}
                </span>
                {isAlreadyAdopted && (
                  <span className="text-[10px] md:text-xs font-black uppercase tracking-wider px-2.5 py-1 bg-[#F1F3F1] text-[#556B58] border border-[#D5DDD7] rounded-md">
                    🏡 Found a Family
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#4E5C56] tracking-tight mb-3 flex flex-wrap items-baseline gap-2">
                {pet.name}
                <span className="text-base md:text-lg font-normal italic text-[#8E9B94]">({pet.age})</span>
              </h1>

              <p className="text-lg md:text-xl font-black text-[#C9A68D]">
                Adoption Fee: {pet.adoptionFee === 0 ? "Free Adoption Asset! 🎁" : `$${pet.adoptionFee}`}
              </p>

              <hr className="border-dashed border-[#EAD7C3]/50 my-5 md:my-6" />

              <div className="space-y-6">
                <div>
                  <h3 className="font-black text-[#4E5C56] mb-2 text-xs md:text-sm uppercase tracking-wider">Personality & Backstory</h3>
                  <p className="text-[#73827A] leading-relaxed text-sm md:text-base font-medium">{pet.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 bg-[#FCFAF5] p-5 md:p-6 rounded-2xl border border-[#EAD7C3]/30 shadow-inner">
                  <div className="space-y-2.5 text-xs md:text-sm">
                    <p className="flex items-center gap-2"><span className="font-black text-[#4E5C56] w-20 shrink-0">Gender:</span> <span className="text-[#73827A] font-medium">{pet.gender}</span></p>
                    <p className="flex items-center gap-2"><span className="font-black text-[#4E5C56] w-20 shrink-0">Location:</span> <span className="text-[#73827A] font-medium truncate">{pet.location}</span></p>
                  </div>
                  <div className="space-y-2.5 text-xs md:text-sm">
                    <p className="flex items-center gap-2"><span className="font-black text-[#4E5C56] w-24 shrink-0">Health Status:</span> <span className="text-[#73827A] font-medium">{pet.healthStatus}</span></p>
                    <p className="flex items-center gap-2 overflow-hidden"><span className="font-black text-[#4E5C56] w-24 shrink-0">Listed By:</span> <span className="text-[#73827A] font-medium truncate" title={pet.ownerEmail}>{pet.ownerEmail}</span></p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 md:mt-10">
              {isOwner ? (
                <div className="p-4 bg-[#FDF1F1] border border-[#F0A8A8]/30 rounded-xl text-center text-xs md:text-sm text-[#E29393] font-bold">
                  🔒 You own this sanctuary listing. Manage adoption requests for this pet inside your account dashboard.
                </div>
              ) : isAlreadyAdopted ? (
                <div className="p-4 bg-[#FCFAF5] border border-[#EADFC9] rounded-xl text-center text-xs md:text-sm text-[#8A7979] font-black uppercase tracking-wider">
                  🏡 This precious gem has been adopted into a beautiful forever home!
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleAdoptButtonAction}
                  className="w-full py-3.5 md:py-4 bg-[#6D7C75] text-white font-black text-sm uppercase tracking-widest rounded-xl shadow-md hover:bg-[#E29393] transition-all duration-300"
                >
                  Adopt Now 💌
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showModal && !isOwner && !isAlreadyAdopted && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-[#4E5C56]/40 backdrop-blur-sm"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="bg-white rounded-[1.8rem] md:rounded-[2rem] w-full max-w-lg p-6 sm:p-8 md:p-10 shadow-2xl relative z-10 border-2 border-[#EAD7C3]/50 my-auto"
            >
              <h2 className="text-xl md:text-2xl font-black text-[#4E5C56] tracking-tight mb-1">
                Adoption Application 📝
              </h2>
              <p className="text-xs text-[#8E9B94] mb-5 italic">Please confirm your pickup window and matching details before applying.</p>

              <form onSubmit={handleAdoptionSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-[#6D7C75] mb-1 tracking-wider">Pet Profile Target</label>
                  <input type="text" value={pet.name || ""} readOnly className="w-full p-3 bg-[#FCFAF5] border border-[#EAD7C3]/30 rounded-lg text-xs md:text-sm text-slate-400 font-bold focus:outline-none cursor-not-allowed" />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-[#6D7C75] mb-1 tracking-wider">Applicant Name</label>
                  <input type="text" value={derivedUserName} readOnly className="w-full p-3 bg-[#FCFAF5] border border-[#EAD7C3]/30 rounded-lg text-xs md:text-sm text-slate-400 font-bold focus:outline-none cursor-not-allowed" />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-[#6D7C75] mb-1 tracking-wider">Applicant Email</label>
                  <input type="text" value={user?.email || ""} readOnly className="w-full p-3 bg-[#FCFAF5] border border-[#EAD7C3]/30 rounded-lg text-xs md:text-sm text-slate-400 font-bold focus:outline-none truncate cursor-not-allowed" />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-[#4E5C56] mb-1 tracking-wider">Proposed Pickup Date 🗓️</label>
                  <input 
                    type="date" 
                    required 
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full p-3 border border-[#EAD7C3]/60 rounded-lg text-xs md:text-sm text-[#5C6B64] font-medium bg-white focus:outline-none focus:border-[#F0A8A8] transition-colors" 
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-[#4E5C56] mb-1 tracking-wider">Warm Greeting Message 💬</label>
                  <textarea 
                    rows={3}
                    placeholder="Tell the shelter manager a bit about your cozy home setup..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-3 border border-[#EAD7C3]/60 rounded-lg text-xs md:text-sm text-[#5C6B64] font-medium bg-white focus:outline-none focus:border-[#F0A8A8] transition-colors resize-none placeholder:text-slate-300"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 bg-slate-100 text-slate-500 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-[#6D7C75] text-white rounded-xl font-black text-xs uppercase tracking-wider hover:bg-[#E29393] transition-colors shadow-sm"
                  >
                    Submit File 🕊️
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

function LoadingStateSkeleton() {
  return (
    <div className="min-h-screen bg-[#FDF6EC] flex items-center justify-center relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#EAD7C3_1px,transparent_1px),linear-gradient(to_bottom,#EAD7C3_1px,transparent_1px)] bg-[size:24px_24px] opacity-20 pointer-events-none" />
      <div className="w-12 h-12 border-4 border-[#F0A8A8] border-t-transparent rounded-full animate-spin relative z-10" />
    </div>
  );
}

export default function PetDetailsPage() {
  return (
    <Suspense fallback={<LoadingStateSkeleton />}>
      <PetDetailsContent />
    </Suspense>
  );
}