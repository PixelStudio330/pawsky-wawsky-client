'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";

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

export default function PetDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  
  // States for API simulation and UI tracking
  const [pet, setPet] = useState<IPet | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  
  // Adoption Form fields
  const [pickupDate, setPickupDate] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  // Simulated Mock Auth State (Replace with your actual context layer later)
  const user = {
    name: "Mst. Gulnahar",
    email: "developer@pixelstudio.dev",
    isLoggedIn: true
  };

  // Check rule: Pet owners are NOT allowed to submit adoption requests for their own pets
  const isOwner = pet?.ownerEmail === user.email;

  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        // Fetching the singular specific pet via our upcoming parameter API route
        const res = await fetch(`http://localhost:5000/api/pets/${id}`);
        const json = await res.json();
        if (json.success) {
          setPet(json.data);
        }
      } catch (error) {
        console.error("Failed to read pet entity:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPetDetails();
  }, [id]);

  const handleAdoptionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Safety block guard check
    if (isOwner) {
      alert("🚫 Assignment Rule: You cannot adopt a pet you already befriended!");
      return;
    }

    const applicationPayload = {
      petId: pet?._id,
      petName: pet?.name,
      userName: user.name,
      userEmail: user.email,
      pickupDate,
      message,
      status: "pending"
    };

    console.log("Submitting Application Payload to Backend:", applicationPayload);
    
    // UI Success Toast Mock triggers here
    setShowModal(false);
    router.push("/my-requests"); 
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF6EC] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#E7C78A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-[#FDF6EC] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-3xl font-bold text-[#6D7C75]">Gem Not Found 🔍</h2>
        <p className="text-[#8E9B94] mt-2 italic">This soul may have already found their happy forever home.</p>
        <button onClick={() => router.push("/our-gems")} className="mt-6 px-6 py-2 bg-[#6D7C75] text-white rounded-full font-bold">Back to Sanctuary</button>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#FDF6EC] text-[#5C6B64] py-16 px-4 md:px-8 overflow-hidden">
      
      {/* 🌸 Ambient Flow Art Background */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
        <div className="absolute top-10 left-10 text-7xl rotate-45">✨</div>
        <div className="absolute bottom-20 right-10 text-6xl -rotate-12">🍃</div>
        <div className="absolute top-1/3 right-[-100px] w-[500px] h-[500px] bg-[#E7C78A]/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Navigation Breadcrumb shortcut */}
        <button 
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 text-sm font-bold text-[#6D7C75] hover:text-[#E7C78A] transition-colors pt-20"
        >
          ← Back to All Precious Gems
        </button>

        {/* 🏛️ Dual Panel Architecture Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* 📸 LEFT SIDE: Image Gallery Frame Section (5 Columns) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative"
          >
            <div className="absolute -inset-4 bg-[#C9A68D] rounded-[2.5rem] rotate-2" />
            <div className="relative overflow-hidden rounded-[2rem] border-[6px] border-white shadow-2xl bg-white">
              <Image 
                src={pet.image} 
                alt={pet.name} 
                width={600} 
                height={700} 
                className="w-full h-[450px] lg:h-[550px] object-cover"
                priority
              />
            </div>
          </motion.div>

          {/* 📝 RIGHT SIDE: Complete Informative Showcase Profile (7 Columns) */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border-4 border-white/40 flex flex-col justify-between min-h-[550px]"
          >
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="text-xs uppercase font-black px-3 py-1 bg-[#FAF5E7] text-[#C9A68D] border border-[#E7C78A]/40 rounded">
                  {pet.species} • {pet.breed}
                </span>
                <span className="text-xs font-bold px-3 py-1 bg-[#EDFDF3] text-green-800 rounded">
                  🛡️ {pet.vaccinationStatus}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold text-[#6D7C75] mb-4 flex items-baseline gap-4">
                {pet.name}
                <span className="text-lg font-medium text-[#8E9B94] italic">({pet.age})</span>
              </h1>

              <p className="text-xl font-bold text-[#C9A68D] mb-6">
                Adoption Fee: {pet.adoptionFee === 0 ? "Free Adoption Asset! 🎁" : `$${pet.adoptionFee}`}
              </p>

              <hr className="border-gray-100 my-6" />

              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-[#6D7C75] mb-2 text-md">Personality & Backstory</h3>
                  <p className="text-[#8E9B94] leading-relaxed text-base">{pet.description}</p>
                </div>

                {/* Technical Metric Info Blocks Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FAF5E7]/60 p-6 rounded-2xl border border-[#E7C78A]/20">
                  <div className="space-y-2 text-sm">
                    <p><span className="font-bold text-[#6D7C75]">Gender:</span> {pet.gender}</p>
                    <p><span className="font-bold text-[#6D7C75]">Current Sanctuary:</span> {pet.location}</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-bold text-[#6D7C75]">Health Status:</span> {pet.healthStatus}</p>
                    <p className="truncate"><span className="font-bold text-[#6D7C75]">Listed By:</span> {pet.ownerEmail}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Interactive Adoption Action Call */}
            <div className="mt-10">
              {isOwner ? (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-center text-sm text-amber-800 font-medium">
                  🔒 You are the primary owner of this listing layout. You can track adoption inquiries inside your private Dashboard panel!
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowModal(true)}
                  className="w-full py-4 bg-[#6D7C75] text-white font-bold rounded-xl text-md shadow-lg hover:bg-[#E7C78A] hover:text-[#6D7C75] transition-all duration-300"
                >
                  Request Adoption Handshake 💌
                </motion.button>
              )}
            </div>

          </motion.div>
        </div>
      </div>

      {/* 📌 MODAL OVERLAY LAYOUT: Secure Requirement Adoption Form */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Dark background blur mesh */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* Form Sheet Canvas block */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-[2rem] w-full max-w-lg p-8 md:p-10 shadow-2xl relative z-10 border-4 border-[#E7C78A]/20"
            >
              <h2 className="text-2xl font-black text-[#6D7C75] mb-2 flex items-center gap-2">
                Adoption Application 📝
              </h2>
              <p className="text-xs text-[#8E9B94] mb-6 italic">Review your details carefully before routing to shelter verification.</p>

              <form onSubmit={handleAdoptionSubmit} className="space-y-5">
                
                {/* Pet Name Field (Read Only) */}
                <div>
                  <label className="block text-xs font-bold uppercase text-[#6D7C75] mb-1">Pet Profile Target</label>
                  <input type="text" value={pet.name} readOnly className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 font-semibold focus:outline-none" />
                </div>

                {/* User Name Field (Read Only) */}
                <div>
                  <label className="block text-xs font-bold uppercase text-[#6D7C75] mb-1">Applicant Name</label>
                  <input type="text" value={user.name} readOnly className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 font-semibold focus:outline-none" />
                </div>

                {/* User Email Field (Read Only) */}
                <div>
                  <label className="block text-xs font-bold uppercase text-[#6D7C75] mb-1">Applicant Routing Email</label>
                  <input type="text" value={user.email} readOnly className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 font-semibold focus:outline-none" />
                </div>

                {/* Pickup Date Selection Input */}
                <div>
                  <label className="block text-xs font-bold uppercase text-[#6D7C75] mb-1">Proposed Pickup Date 🗓️</label>
                  <input 
                    type="date" 
                    required 
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg text-sm text-[#5C6B64] focus:outline-none focus:border-[#E7C78A]" 
                  />
                </div>

                {/* Custom Narrative Message Input */}
                <div>
                  <label className="block text-xs font-bold uppercase text-[#6D7C75] mb-1">Why do you want to adopt? 💭</label>
                  <textarea 
                    rows={3}
                    required
                    placeholder="Tell the shelter about your home environment, past experience with pets..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg text-sm text-[#5C6B64] focus:outline-none focus:border-[#E7C78A] placeholder:text-gray-300"
                  />
                </div>

                {/* Interactive Action Command Controls */}
                <div className="flex gap-4 mt-8">
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)}
                    className="w-1/3 py-3 border-2 border-gray-100 text-gray-400 font-bold rounded-xl text-sm hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="w-2/3 py-3 bg-[#6D7C75] text-white font-bold rounded-xl text-sm hover:bg-[#E7C78A] hover:text-[#6D7C75] shadow-md transition-all"
                  >
                    Submit Application ✨
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