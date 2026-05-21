'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Plus, Trash2, ListChecks, Heart, 
  PawPrint, DollarSign, Image as ImageIcon, Tag, X,
  Edit2, Eye, Check, Calendar, Mail, User, Loader2
} from 'lucide-react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { useAuth } from "@/context/AuthContext";

export default function UnifiedDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  
  // Dashboard Data State
  const [pets, setPets] = useState<any[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<any[]>([]);
  const [sentRequests, setSentRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<any>(null);
  
  // Form Modal State (Handles BOTH Add and Edit)
  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
  const initialFormState = {
    name: "", species: "", breed: "", age: "", gender: "Male",
    image: "", healthStatus: "", vaccinationStatus: "",
    location: "", adoptionFee: 0, description: "", status: "Available"
  };
  const [formData, setFormData] = useState<any>(initialFormState);

  // --- DATA FETCHING ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const [p, r, a] = await Promise.all([
        api.get('/api/pets/my-pets'),
        api.get('/api/adoptions/my-received-requests'),
        api.get('/api/adoptions/my-applications')
      ]);
      setPets(p.data.data || []);
      setReceivedRequests(r.data.data || []);
      setSentRequests(a.data.data || []);
    } catch { 
      toast.error("Failed to fetch dashboard data"); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // --- STATS CALCULATION ---
  const totalListings = pets.length;
  const adoptedListings = pets.filter(p => p.status?.toLowerCase() === 'adopted').length;
  const availableListings = totalListings - adoptedListings;

  // --- PET CRUD ACTIONS ---
  const handleFormChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        await toast.promise(
          api.post("/api/pets", { ...formData, ownerEmail: user?.email }),
          { 
            loading: "Listing gem... 🐾", 
            success: "Listed successfully! ✨", 
            error: "Failed to list. 🥺" 
          }
        );
      } else {
        await toast.promise(
          api.put(`/api/pets/${formData._id}`, formData),
          { 
            loading: "Updating gem... 🐾", 
            success: "Updated successfully! ✨", 
            error: "Failed to update. 🥺" 
          }
        );
      }
      setModalMode(null);
      fetchData();
    } catch (err) { console.error(err); }
  };

  const handleDeletePet = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this listing? 🥺")) return;
    try {
      await api.delete(`/api/pets/${id}`);
      setPets(pets.filter(p => p._id !== id));
      toast.success("Pet listing removed! 👋");
    } catch {
      toast.error("Failed to delete listing.");
    }
  };

  // --- ADOPTION CONTROL CHALLENGE HANDLER ---
  const handleUpdateAppStatus = async (reqId: string, petId: string, newStatus: string) => {
    const petRecord = pets.find(p => p._id === petId);
    
    // Normalize string casing checks to safe-guard matching rules
    if (newStatus.toLowerCase() === 'approved' && petRecord?.status?.toLowerCase() === 'adopted') {
      toast.error("This pet listing has already been adopted! Only one request can be accepted. 🔒");
      return;
    }

    try {
      await api.patch(`/api/adoptions/${reqId}`, { status: newStatus.toLowerCase() });
      toast.success(`Application status marked as ${newStatus}! 🎉`);
      
      // 1. Await full data synchronization from backend database
      const [p, r] = await Promise.all([
        api.get('/api/pets/my-pets'),
        api.get('/api/adoptions/my-received-requests')
      ]);
      
      const updatedPets = p.data.data || [];
      const updatedRequests = r.data.data || [];
      
      setPets(updatedPets);
      setReceivedRequests(updatedRequests);

      // 2. Safely sync current open modal view parameters
      if (selectedPet && selectedPet._id === petId) {
        const freshlySyncedPet = updatedPets.find((petItem: any) => petItem._id === petId);
        if (freshlySyncedPet) {
          setSelectedPet(freshlySyncedPet);
        } else {
          setSelectedPet((prev: any) => ({
            ...prev,
            status: newStatus.toLowerCase() === 'approved' ? 'Adopted' : prev.status
          }));
        }
      }
    } catch {
      toast.error("Failed to update layout status parameters.");
    }
  };

  const handleCancelRequest = async (reqId: string) => {
    if (!window.confirm("Cancel your adoption application?")) return;
    try {
      await api.delete(`/api/adoptions/${reqId}`);
      toast.success("Application cancelled.");
      fetchData();
    } catch {
      toast.error("Failed to cancel application.");
    }
  };

  const inputClass = "w-full pl-11 pr-4 py-3.5 bg-[#FBF8F3] border-2 border-[#EADFC9] rounded-2xl focus:border-[#4E6E58] outline-none text-sm font-semibold text-[#3C3232] transition-colors";

  return (
    <div className="min-h-screen bg-[#FFFDF9] p-6 md:p-12 pt-28 font-sans text-[#4A4440]">
      
      <style dangerouslySetInnerHTML={{__html: `
        .cozy-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #EADFC9 transparent;
          overflow-y: auto;
          overscroll-behavior: contain;
          -webkit-overflow-scrolling: touch;
        }
        .cozy-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .cozy-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .cozy-scrollbar::-webkit-scrollbar-thumb {
          background-color: #EADFC9;
          border-radius: 20px;
        }
        .cozy-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #C1D6C7;
        }
      `}} />

      {/* HEADER SECTION */}
      <header className="max-w-7xl mx-auto mb-10 border-b-2 border-[#EADFC9]/40 pb-6">
        <h1 className="text-5xl pt-28 font-black text-[#3C3232]">
          Hello, {user?.name || user?.displayName || user?.username || user?.email?.split('@')[0] || "Cozy Human"}! 👋
        </h1>
        <p className="text-[#A89898] mt-2 font-medium">Dashboard Layout View &bull; Unified Control Center</p>
      </header>
      
      {/* DASHBOARD GRID */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: LISTINGS */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* STATS ROW */}
          <div className="grid grid-cols-3 gap-4 md:gap-6">
            <div className="bg-white p-6 rounded-[2rem] border-2 border-[#EADFC9] shadow-sm flex flex-col justify-center items-center text-center hover:-translate-y-1 transition-transform">
              <p className="text-[#A89898] text-[10px] font-black uppercase tracking-widest mb-1">Total Listings</p>
              <p className="text-4xl font-black text-[#3C3232]">{totalListings}</p>
            </div>
            <div className="bg-[#4E6E58] p-6 rounded-[2rem] shadow-sm flex flex-col justify-center items-center text-center hover:-translate-y-1 transition-transform">
              <p className="text-[#C1D6C7] text-[10px] font-black uppercase tracking-widest mb-1">Available</p>
              <p className="text-4xl font-black text-white">{availableListings}</p>
            </div>
            <div className="bg-[#E29393] p-6 rounded-[2rem] shadow-sm flex flex-col justify-center items-center text-center hover:-translate-y-1 transition-transform">
              <p className="text-[#FFF0F0] text-[10px] font-black uppercase tracking-widest mb-1">Adopted</p>
              <p className="text-4xl font-black text-white">{adoptedListings}</p>
            </div>
          </div>

          {/* SECTION HEADER */}
          <div id="my-listings-view" className="flex justify-between items-center bg-white p-6 rounded-[2rem] border-2 border-[#EADFC9] shadow-sm">
            <div>
              <span className="text-[10px] font-black tracking-widest text-[#4E6E58] bg-[#C1D6C7]/30 px-3 py-1 rounded-md uppercase block w-max mb-1">Dashboard Component</span>
              <h2 className="text-2xl font-black text-[#3C3232]">My Listings 💎</h2>
            </div>
            <button 
              onClick={() => { setFormData(initialFormState); setModalMode('add'); }}
              className="flex items-center gap-2 bg-[#4E6E58] text-white px-6 py-3 rounded-[1.5rem] font-black text-xs uppercase hover:scale-105 transition-transform shadow-lg shadow-[#4E6E58]/20"
            >
              <Plus size={16} /> Add Pet
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12 text-[#A89898] font-bold animate-pulse">Loading your gems...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pets.map((pet) => {
                const associatedRequests = receivedRequests.filter(r => r.petId === pet._id);
                const hasPendingRequests = associatedRequests.some(r => r.status?.toLowerCase() === 'pending');
                
                let lifecycleStatus = 'Available';
                if (pet.status?.toLowerCase() === 'adopted') {
                  lifecycleStatus = 'Adopted';
                } else if (hasPendingRequests) {
                  lifecycleStatus = 'Pending';
                }

                return (
                  <motion.div key={pet._id} whileHover={{ y: -8 }} className="bg-white p-6 rounded-[2rem] border-2 border-[#EADFC9] shadow-sm flex flex-col relative overflow-hidden group">
                    
                    <div className={`absolute top-8 right-8 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider text-white select-none shadow-sm ${
                      lifecycleStatus === 'Adopted' ? 'bg-[#E29393]' : 
                      lifecycleStatus === 'Pending' ? 'bg-amber-500' : 'bg-[#4E6E58]'
                    }`}>
                      {lifecycleStatus}
                    </div>

                    <img src={pet.image} className="h-48 w-full object-cover rounded-[1.5rem] mb-4" alt={pet.name} />
                    
                    <div className="flex-1">
                      <h3 className="font-black text-2xl text-[#3C3232]">{pet.name}</h3>
                      <p className="text-[#E29393] font-bold text-lg mb-6">Adoption Fee: {pet.adoptionFee === 0 ? "Free" : `$${pet.adoptionFee}`}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-auto">
                      <button onClick={() => { setSelectedPet(pet); setIsRequestModalOpen(true); }} className="col-span-2 flex items-center justify-center gap-2 p-3 bg-[#4E6E58] rounded-[1rem] text-xs font-black text-white hover:bg-[#3B5443] transition-colors">
                        <ListChecks size={16} /> Incoming Requests ({associatedRequests.length})
                      </button>
                      
                      <button onClick={() => router.push(`/our-gems/${pet._id}`)} className="flex items-center justify-center gap-2 p-3 bg-[#FBF8F3] rounded-[1rem] text-xs font-black text-[#8A7979] hover:bg-[#EADFC9] transition-colors">
                        <Eye size={16} /> View
                      </button>
                      
                      <button onClick={() => { setFormData(pet); setModalMode('edit'); }} className="flex items-center justify-center gap-2 p-3 bg-[#FBF8F3] rounded-[1rem] text-xs font-black text-[#8A7979] hover:bg-[#EADFC9] transition-colors">
                        <Edit2 size={16} /> Edit
                      </button>

                      <button onClick={() => handleDeletePet(pet._id)} className="col-span-2 flex items-center justify-center gap-2 p-3 bg-[#FFF0F0] rounded-[1rem] text-xs font-black text-[#E29393] hover:bg-[#E29393] hover:text-white transition-colors">
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: MY SENT APPLICATIONS */}
        <aside id="my-requests-view" className="lg:col-span-4 h-full">
          <div className="bg-[#EADFC9] p-8 rounded-[2.5rem] text-[#3C3232] shadow-xl relative flex flex-col h-[750px]">
            <div className="mb-6 flex-shrink-0">
              <span className="text-[10px] font-black tracking-widest text-[#3C3232]/60 bg-white/40 px-3 py-1 rounded-md uppercase inline-block mb-1">Dashboard Component</span>
              <div className="flex items-center gap-3">
                <Heart size={28} className="text-[#E29393] fill-[#E29393]" />
                <h3 className="font-black text-2xl leading-tight">My Requests 💌</h3>
              </div>
            </div>
            
            <div className="flex-1 cozy-scrollbar pr-1 space-y-4">
              {sentRequests.length === 0 ? (
                <div className="text-center py-10 opacity-60">
                  <p className="font-bold">No applications yet.</p>
                  <p className="text-xs mt-1">Go find a fuzzy friend! 🐾</p>
                </div>
              ) : (
                sentRequests.map(req => (
                  <div key={req._id} className="bg-white p-5 rounded-[1.5rem] shadow-sm relative">
                    <h4 className="font-black text-lg mb-1">{req.petName}</h4>
                    
                    <div className="text-xs text-[#8A7979] space-y-1 mb-4">
                      <p className="flex items-center gap-2">
                        <Calendar size={12}/> Request Date: {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
                      </p>
                      <p className="flex items-center gap-2">
                        <Check size={12}/> Pickup Date: {req.pickupDate || 'TBD'}
                      </p>
                      <p className="text-[11px] italic text-[#A89898] truncate max-w-full block mt-1">
                        "{req.message || 'No warm greeting attached.'}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <span className={`text-[10px] px-3 py-1.5 rounded-xl uppercase font-black
                        ${req.status?.toLowerCase() === 'approved' ? 'bg-[#C1D6C7] text-[#4E6E58]' : 
                          req.status?.toLowerCase() === 'rejected' ? 'bg-[#FFF0F0] text-[#E29393]' : 
                          'bg-[#FBF8F3] text-[#8A7979]'}`}>
                        {req.status}
                      </span>
                      
                      <div className="flex gap-2">
                        <button onClick={() => router.push(`/our-gems/${req.petId}`)} className="p-2 bg-[#FBF8F3] text-[#8A7979] rounded-lg hover:bg-[#EADFC9]" title="View Profile">
                          <Eye size={14}/>
                        </button>
                        <button onClick={() => handleCancelRequest(req._id)} className="p-2 bg-[#FFF0F0] text-[#E29393] rounded-lg hover:bg-[#E29393] hover:text-white" title="Cancel Request">
                          <Trash2 size={14}/>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>
      </main>

      {/* --- MODALS --- */}
      <AnimatePresence>
        
        {/* VIEW RECEIVED REQUESTS MODAL */}
        {isRequestModalOpen && selectedPet && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto pt-24 pb-12">
            <motion.div 
              initial={{ scale: 0.93, opacity: 0, y: 15 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.93, opacity: 0, y: 15 }} 
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white p-8 rounded-[2.5rem] max-w-md w-full border-4 border-[#EADFC9] shadow-2xl relative flex flex-col my-auto"
            >
              <h3 className="font-black text-2xl mb-2 text-[#3C3232]">Adopters for {selectedPet.name}</h3>
              <p className="text-sm text-[#A89898] mb-1">Review your pending incoming applications.</p>
              
              {selectedPet.status?.toLowerCase() === 'adopted' && (
                <div className="mb-4 text-xs font-bold text-[#E29393] bg-[#FFF0F0] p-3 rounded-xl border border-[#F0A8A8]/40 shadow-sm">
                  🔒 Adoption Completed: Only one choice can be accepted. Action options on remaining requests are closed.
                </div>
              )}
              
              <div className="max-h-[40vh] cozy-scrollbar pr-1 space-y-4 mt-2">
                {receivedRequests.filter(r => r.petId === selectedPet._id).length === 0 ? (
                  <p className="text-[#A89898] text-sm text-center py-8 font-bold bg-[#FBF8F3] rounded-2xl">No requests yet. 🐾</p>
                ) : (
                  receivedRequests.filter(r => r.petId === selectedPet._id).map(r => (
                    <div key={r._id} className="p-5 bg-[#FBF8F3] rounded-2xl border-2 border-[#EADFC9]">
                      <div className="flex items-center gap-2 mb-1">
                        <User size={14} className="text-[#8A7979]"/>
                        <span className="text-base font-black text-[#3C3232]">{r.userName}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <Mail size={14} className="text-[#8A7979]"/>
                        <span className="text-xs font-bold text-[#8A7979]">{r.userEmail}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar size={14} className="text-[#8A7979]"/>
                        <span className="text-xs font-bold text-[#8A7979]">Pickup Window: {r.pickupDate || 'Not set'}</span>
                      </div>
                      <p className="text-xs font-medium text-[#6D7C75] bg-white p-2.5 rounded-xl border border-[#EADFC9]/50 italic mb-4">
                        "{r.message}"
                      </p>

                      {r.status?.toLowerCase() === 'pending' && selectedPet.status?.toLowerCase() !== 'adopted' ? (
                        <div className="grid grid-cols-2 gap-2 mt-4">
                          <button onClick={() => handleUpdateAppStatus(r._id, selectedPet._id, 'approved')} className="flex items-center justify-center gap-1 py-2.5 bg-[#4E6E58] text-white rounded-xl text-xs font-black shadow-md hover:bg-[#3B5443] transition-colors">
                            <Check size={14}/> Approve
                          </button>
                          <button onClick={() => handleUpdateAppStatus(r._id, selectedPet._id, 'rejected')} className="flex items-center justify-center gap-1 py-2.5 bg-[#E29393] text-white rounded-xl text-xs font-black shadow-md hover:bg-[#C97B7B] transition-colors">
                            <X size={14}/> Reject
                          </button>
                        </div>
                      ) : (
                        <div className={`mt-4 text-center py-2 rounded-xl text-xs font-black uppercase 
                          ${r.status?.toLowerCase() === 'approved' ? 'bg-[#C1D6C7] text-[#4E6E58]' : 
                            r.status?.toLowerCase() === 'rejected' ? 'bg-[#FFF0F0] text-[#E29393]' : 
                            'bg-slate-200 text-slate-500 italic'}`}>
                          {r.status?.toLowerCase() === 'pending' && selectedPet.status?.toLowerCase() === 'adopted' ? 'Unavailable (Closed)' : r.status}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
              <button onClick={() => setIsRequestModalOpen(false)} className="mt-6 flex-shrink-0 w-full p-4 bg-[#3C3232] text-white rounded-2xl font-black text-sm hover:bg-[#1A1616] transition-colors">Close Viewer</button>
            </motion.div>
          </div>
        )}

        {/* ADD / EDIT PET MODAL */}
        {modalMode && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto pt-24 pb-12">
            <motion.div 
              initial={{ scale: 0.93, opacity: 0, y: 15 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.93, opacity: 0, y: 15 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white w-full max-w-2xl rounded-[2.75rem] p-8 md:p-10 border-[3px] border-[#EADFC9] shadow-2xl relative my-auto"
            >
              <button 
                onClick={() => setModalMode(null)} 
                className="absolute top-8 right-8 w-10 h-10 bg-[#FBF8F3] text-[#A89898] hover:text-[#3C3232] rounded-full flex items-center justify-center transition-colors z-10"
              >
                <X size={20} strokeWidth={3} />
              </button>

              <span className="text-[10px] font-black tracking-widest text-[#4E6E58] bg-[#C1D6C7]/30 px-3 py-1 rounded-md uppercase inline-block mb-1">
                Dashboard View &bull; Add Pet Form Guideline
              </span>
              <h2 className="text-3xl font-black text-[#3C3232] mb-1">
                {modalMode === 'add' ? 'List a New Gem 💎' : 'Update Your Gem ✨'}
              </h2>
              <p className="text-[#A89898] font-medium mb-6 text-sm">
                Fill out the fields below. The listing will be anchored under your verified account.
              </p>

              <form onSubmit={handleAddOrUpdateSubmit} className="space-y-5 max-h-[55vh] cozy-scrollbar pr-1">
                <div className="bg-[#FBF8F3] p-4 rounded-2xl border-2 border-[#EADFC9]/60">
                  <label className="block text-[10px] font-black uppercase text-[#4E6E58] mb-1.5 tracking-wider">
                    Owner Email Field Requirement (Auto-Filled / Read-Only)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
                    <input 
                      type="email" 
                      readOnly 
                      name="ownerEmail"
                      value={user?.email || ""} 
                      className="w-full pl-11 pr-4 py-3 bg-slate-100 border-2 border-slate-200 text-slate-500 font-bold text-sm rounded-xl cursor-not-allowed outline-none select-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="relative">
                    <PawPrint className="absolute left-4 top-4 text-[#A89898]" size={18} />
                    <input name="name" className={inputClass} placeholder="Pet Name" value={formData.name} onChange={handleFormChange} required />
                  </div>
                  <div className="relative">
                    <Tag className="absolute left-4 top-4 text-[#A89898]" size={18} />
                    <input name="species" className={inputClass} placeholder="Species (e.g. Dog)" value={formData.species} onChange={handleFormChange} required />
                  </div>

                  <input name="breed" className={inputClass.replace('pl-11', 'px-4')} placeholder="Breed" value={formData.breed} onChange={handleFormChange} required />
                  <input name="age" className={inputClass.replace('pl-11', 'px-4')} placeholder="Age (e.g. 2 years)" value={formData.age} onChange={handleFormChange} required />

                  <select name="gender" className={inputClass.replace('pl-11', 'px-4')} value={formData.gender} onChange={handleFormChange}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                  
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-4 text-[#A89898]" size={18} />
                    <input type="number" name="adoptionFee" className={inputClass} placeholder="Adoption Fee ($)" value={formData.adoptionFee} onChange={handleFormChange} required />
                  </div>
                </div>

                <div className="relative">
                  <ImageIcon className="absolute left-4 top-4 text-[#A89898]" size={18} />
                  <input name="image" className={inputClass} placeholder="Image URL (e.g. https://...)" value={formData.image} onChange={handleFormChange} required />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <input name="healthStatus" className={inputClass.replace('pl-11', 'px-4')} placeholder="Health Status" value={formData.healthStatus} onChange={handleFormChange} required />
                  <input name="vaccinationStatus" className={inputClass.replace('pl-11', 'px-4')} placeholder="Vaccination Status" value={formData.vaccinationStatus} onChange={handleFormChange} required />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <input name="location" className={inputClass.replace('pl-11', 'px-4')} placeholder="Location/City" value={formData.location} onChange={handleFormChange} required />
                  {modalMode === 'edit' && (
                    <select name="status" className={inputClass.replace('pl-11', 'px-4')} value={formData.status} onChange={handleFormChange}>
                      <option value="Available">Available</option>
                      <option value="Adopted">Adopted</option>
                    </select>
                  )}
                </div>
                
                <textarea 
                  name="description" 
                  className="w-full p-4 bg-[#FBF8F3] border-2 border-[#EADFC9] rounded-2xl focus:border-[#4E6E58] outline-none text-sm font-semibold text-[#3C3232] transition-colors resize-none" 
                  placeholder="Tell us a bit about their personality..." rows={4} value={formData.description} onChange={handleFormChange} required 
                />

                <button type="submit" className="w-full py-4 mt-2 bg-[#4E6E58] text-white text-lg font-black rounded-2xl hover:bg-[#3B5443] transition-colors shadow-lg shadow-[#4E6E58]/20">
                  {modalMode === 'add' ? 'Submit Listing 🐾' : 'Save Changes ✨'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}