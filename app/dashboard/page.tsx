'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Trash2,
  ListChecks,
  Heart,
  PawPrint,
  DollarSign,
  Image as ImageIcon,
  Tag,
  X,
  Edit2,
  Eye,
  Check,
  Calendar,
  Mail,
  User,
  Loader2,
  MapPin,
  ShieldCheck,
} from 'lucide-react';

import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

interface Pet {
  _id?: string;
  name: string;
  species: string;
  breed: string;
  age: string;
  gender: string;
  image: string;
  healthStatus: string;
  vaccinationStatus: string;
  location: string;
  adoptionFee: number;
  description: string;
  status: string;
}

interface AdoptionRequest {
  _id: string;
  petId: string;
  petName: string;
  userName: string;
  userEmail: string;
  pickupDate?: string;
  message?: string;
  status: string;
  createdAt?: string;
}

export default function UnifiedDashboard() {
  const { user } = useAuth();
  const router = useRouter();

  const [pets, setPets] = useState<Pet[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<
    AdoptionRequest[]
  >([]);
  const [sentRequests, setSentRequests] = useState<AdoptionRequest[]>([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);

  const initialFormState: Pet = {
    name: '',
    species: '',
    breed: '',
    age: '',
    gender: 'Male',
    image: '',
    healthStatus: '',
    vaccinationStatus: '',
    location: '',
    adoptionFee: 0,
    description: '',
    status: 'Available',
  };

  const [formData, setFormData] = useState<Pet>(initialFormState);

  // =========================
  // FETCH DATA
  // =========================
  const fetchData = async () => {
    try {
      setLoading(true);

      const [petsRes, receivedRes, sentRes] = await Promise.all([
        api.get('/api/pets/my-pets'),
        api.get('/api/adoptions/my-received-requests'),
        api.get('/api/adoptions/my-applications'),
      ]);

      setPets(petsRes.data?.data || []);
      setReceivedRequests(receivedRes.data?.data || []);
      setSentRequests(sentRes.data?.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch dashboard data 💀');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =========================
  // STATS
  // =========================
  const totalListings = pets.length;

  const adoptedListings = pets.filter(
    (pet) => pet.status?.toLowerCase() === 'adopted'
  ).length;

  const availableListings = totalListings - adoptedListings;

  // =========================
  // INPUT HANDLER
  // =========================
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'adoptionFee'
          ? Number(value)
          : value,
    }));
  };

  // =========================
  // ADD / UPDATE PET
  // =========================
  const handleAddOrUpdateSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setActionLoading(true);

      if (modalMode === 'add') {
        await toast.promise(
          api.post('/api/pets', {
            ...formData,
            ownerEmail: user?.email,
          }),
          {
            loading: 'Listing your fluffy CEO... 🐾',
            success: 'Pet listed successfully ✨',
            error: 'Failed to list pet 😭',
          }
        );
      }

      if (modalMode === 'edit') {
        await toast.promise(
          api.put(`/api/pets/${formData._id}`, formData),
          {
            loading: 'Updating the tiny beast... 🛠️',
            success: 'Pet updated successfully ✨',
            error: 'Update failed 💀',
          }
        );
      }

      setModalMode(null);
      setFormData(initialFormState);

      await fetchData();
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  };

  // =========================
  // DELETE PET
  // =========================
  const handleDeletePet = async (id?: string) => {
    if (!id) return;

    const confirmDelete = window.confirm(
      'Delete this listing forever? Tiny dramatic violin starts playing. 🎻'
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/api/pets/${id}`);

      setPets((prev) => prev.filter((pet) => pet._id !== id));

      toast.success('Listing deleted 👋');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete listing 😭');
    }
  };

  // =========================
  // UPDATE REQUEST STATUS
  // =========================
  const handleUpdateAppStatus = async (
    reqId: string,
    petId: string,
    newStatus: 'approved' | 'rejected'
  ) => {
    try {
      const pet = pets.find((p) => p._id === petId);

      if (
        newStatus === 'approved' &&
        pet?.status?.toLowerCase() === 'adopted'
      ) {
        toast.error(
          'This pet is already adopted. The adoption arena has CLOSED 🔒'
        );
        return;
      }

      setActionLoading(true);

      await api.patch(`/api/adoptions/${reqId}`, {
        status: newStatus,
      });

      toast.success(
        `Application ${newStatus === 'approved' ? 'approved' : 'rejected'} 🎉`
      );

      await fetchData();

      if (selectedPet?._id === petId) {
        const updatedPet = pets.find((p) => p._id === petId);

        if (updatedPet) {
          setSelectedPet(updatedPet);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update request 😭');
    } finally {
      setActionLoading(false);
    }
  };

  // =========================
  // CANCEL REQUEST
  // =========================
  const handleCancelRequest = async (reqId: string) => {
    const confirmCancel = window.confirm(
      'Cancel your request? The pet might side-eye you forever 🐈'
    );

    if (!confirmCancel) return;

    try {
      await api.delete(`/api/adoptions/${reqId}`);

      toast.success('Request cancelled.');

      await fetchData();
    } catch (error) {
      console.error(error);
      toast.error('Failed to cancel request 💀');
    }
  };

  // =========================
  // STYLES
  // =========================
  const inputClass =
    'w-full bg-[#FBF8F3] border-2 border-[#EADFC9] rounded-2xl px-4 py-3.5 outline-none focus:border-[#4E6E58] transition-all text-sm font-semibold text-[#3C3232]';

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#3C3232] p-6 md:p-10 pt-28">

      <style
        dangerouslySetInnerHTML={{
          __html: `
          .cozy-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #EADFC9 transparent;
          }

          .cozy-scrollbar::-webkit-scrollbar {
            width: 6px;
          }

          .cozy-scrollbar::-webkit-scrollbar-thumb {
            background: #EADFC9;
            border-radius: 20px;
          }
        `,
        }}
      />

      {/* HEADER */}
      <header className="max-w-7xl mx-auto mb-10 border-b border-[#EADFC9] pb-6">
        <h1 className="text-4xl pt-28 md:text-5xl font-black">
          Hello,{' '}
          {user?.name ||
            user?.displayName ||
            user?.username ||
            user?.email?.split('@')[0] ||
            'Human'}{' '}
          👋
        </h1>

        <p className="mt-2 text-[#8A7979] font-medium">
          Your pet empire control center. Tiny paws. Massive chaos.
        </p>
      </header>

      {/* MAIN GRID */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LEFT */}
        <section className="lg:col-span-8 space-y-8">

          {/* STATS */}
          <div className="grid grid-cols-3 gap-4">

            <div className="bg-white rounded-[2rem] border-2 border-[#EADFC9] p-6 text-center shadow-sm">
              <p className="text-[10px] uppercase tracking-widest font-black text-[#A89898]">
                Total Listings
              </p>

              <h2 className="text-4xl font-black mt-2">
                {totalListings}
              </h2>
            </div>

            <div className="bg-[#4E6E58] rounded-[2rem] p-6 text-center shadow-sm">
              <p className="text-[10px] uppercase tracking-widest font-black text-[#C1D6C7]">
                Available
              </p>

              <h2 className="text-4xl font-black mt-2 text-white">
                {availableListings}
              </h2>
            </div>

            <div className="bg-[#E29393] rounded-[2rem] p-6 text-center shadow-sm">
              <p className="text-[10px] uppercase tracking-widest font-black text-[#FFF0F0]">
                Adopted
              </p>

              <h2 className="text-4xl font-black mt-2 text-white">
                {adoptedListings}
              </h2>
            </div>
          </div>

          {/* HEADER */}
          <div className="bg-white border-2 border-[#EADFC9] rounded-[2rem] p-6 flex items-center justify-between">

            <div>
              <p className="text-[10px] uppercase tracking-widest font-black text-[#4E6E58]">
                Dashboard Component
              </p>

              <h2 className="text-2xl font-black mt-1">
                My Listings 💎
              </h2>
            </div>

            <button
              onClick={() => {
                setFormData(initialFormState);
                setModalMode('add');
              }}
              className="bg-[#4E6E58] text-white px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <Plus size={18} />
              Add Pet
            </button>
          </div>

          {/* PET GRID */}
          {loading ? (
            <div className="py-24 flex items-center justify-center">
              <Loader2 className="animate-spin text-[#4E6E58]" size={40} />
            </div>
          ) : pets.length === 0 ? (
            <div className="bg-white rounded-[2rem] border-2 border-dashed border-[#EADFC9] p-16 text-center">
              <p className="text-2xl font-black">
                No listings yet 🐾
              </p>

              <p className="text-[#8A7979] mt-2">
                Your dashboard is emptier than my sleep schedule.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {pets.map((pet) => {
                const associatedRequests = receivedRequests.filter(
                  (r) => r.petId === pet._id
                );

                const hasPending = associatedRequests.some(
                  (r) => r.status?.toLowerCase() === 'pending'
                );

                let lifecycleStatus = 'Available';

                if (pet.status?.toLowerCase() === 'adopted') {
                  lifecycleStatus = 'Adopted';
                } else if (hasPending) {
                  lifecycleStatus = 'Pending';
                }

                return (
                  <motion.div
                    key={pet._id}
                    whileHover={{ y: -6 }}
                    className="bg-white rounded-[2rem] border-2 border-[#EADFC9] overflow-hidden shadow-sm"
                  >

                    <div className="relative">

                      <img
                        src={pet.image}
                        alt={pet.name}
                        className="w-full h-56 object-cover"
                      />

                      <div
                        className={`absolute top-4 right-4 px-4 py-1 rounded-xl text-xs uppercase font-black text-white ${
                          lifecycleStatus === 'Adopted'
                            ? 'bg-[#E29393]'
                            : lifecycleStatus === 'Pending'
                            ? 'bg-amber-500'
                            : 'bg-[#4E6E58]'
                        }`}
                      >
                        {lifecycleStatus}
                      </div>
                    </div>

                    <div className="p-6">

                      <div className="mb-5">
                        <h3 className="text-2xl font-black">
                          {pet.name}
                        </h3>

                        <p className="text-[#E29393] font-bold mt-1">
                          {pet.adoptionFee === 0
                            ? 'Free Adoption'
                            : `$${pet.adoptionFee}`}
                        </p>
                      </div>

                      <div className="space-y-2 text-sm text-[#6D7C75] mb-6">

                        <div className="flex items-center gap-2">
                          <PawPrint size={14} />
                          {pet.species} • {pet.breed}
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin size={14} />
                          {pet.location}
                        </div>

                        <div className="flex items-center gap-2">
                          <ShieldCheck size={14} />
                          {pet.healthStatus}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">

                        <button
                          onClick={() => {
                            setSelectedPet(pet);
                            setIsRequestModalOpen(true);
                          }}
                          className="col-span-2 bg-[#4E6E58] text-white rounded-xl py-3 font-black text-sm flex items-center justify-center gap-2"
                        >
                          <ListChecks size={16} />
                          Requests ({associatedRequests.length})
                        </button>

                        <button
                          onClick={() =>
                            router.push(`/our-gems/${pet._id}`)
                          }
                          className="bg-[#FBF8F3] rounded-xl py-3 font-black text-sm flex items-center justify-center gap-2 hover:bg-[#EADFC9]"
                        >
                          <Eye size={16} />
                          View
                        </button>

                        <button
                          onClick={() => {
                            setFormData(pet);
                            setModalMode('edit');
                          }}
                          className="bg-[#FBF8F3] rounded-xl py-3 font-black text-sm flex items-center justify-center gap-2 hover:bg-[#EADFC9]"
                        >
                          <Edit2 size={16} />
                          Edit
                        </button>

                        <button
                          onClick={() => handleDeletePet(pet._id)}
                          className="col-span-2 bg-[#FFF0F0] text-[#E29393] rounded-xl py-3 font-black text-sm flex items-center justify-center gap-2 hover:bg-[#E29393] hover:text-white"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>

        {/* RIGHT */}
        <aside className="lg:col-span-4">
          <div className="bg-[#EADFC9] rounded-[2.5rem] p-8 h-[760px] flex flex-col shadow-xl">

            <div className="mb-6">
              <p className="text-[10px] uppercase tracking-widest font-black text-[#3C3232]/60">
                Dashboard Component
              </p>

              <div className="flex items-center gap-3 mt-1">
                <Heart
                  size={28}
                  className="text-[#E29393] fill-[#E29393]"
                />

                <h2 className="text-2xl font-black">
                  My Requests 💌
                </h2>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto cozy-scrollbar pr-1 space-y-4">

              {sentRequests.length === 0 ? (
                <div className="text-center py-20 opacity-60">
                  <p className="font-black text-lg">
                    No requests yet.
                  </p>

                  <p className="text-sm mt-2">
                    Go adopt somebody's tiny goblin 🐕
                  </p>
                </div>
              ) : (
                sentRequests.map((req) => (
                  <div
                    key={req._id}
                    className="bg-white rounded-[1.5rem] p-5 shadow-sm"
                  >

                    <h3 className="text-lg font-black">
                      {req.petName}
                    </h3>

                    <div className="mt-3 text-xs text-[#8A7979] space-y-2">

                      <div className="flex items-center gap-2">
                        <Calendar size={12} />

                        Request Date:{' '}
                        {req.createdAt
                          ? new Date(
                              req.createdAt
                            ).toLocaleDateString()
                          : 'N/A'}
                      </div>

                      <div className="flex items-center gap-2">
                        <Check size={12} />
                        Pickup: {req.pickupDate || 'TBD'}
                      </div>

                      <p className="italic text-[#A89898]">
                        "{req.message || 'No message attached.'}"
                      </p>
                    </div>

                    <div className="mt-5 flex items-center justify-between">

                      <span
                        className={`px-3 py-1.5 rounded-xl text-[10px] uppercase font-black ${
                          req.status?.toLowerCase() === 'approved'
                            ? 'bg-[#C1D6C7] text-[#4E6E58]'
                            : req.status?.toLowerCase() === 'rejected'
                            ? 'bg-[#FFF0F0] text-[#E29393]'
                            : 'bg-[#FBF8F3] text-[#8A7979]'
                        }`}
                      >
                        {req.status}
                      </span>

                      <div className="flex gap-2">

                        <button
                          onClick={() =>
                            router.push(`/our-gems/${req.petId}`)
                          }
                          className="p-2 rounded-lg bg-[#FBF8F3] hover:bg-[#EADFC9]"
                        >
                          <Eye size={14} />
                        </button>

                        <button
                          onClick={() =>
                            handleCancelRequest(req._id)
                          }
                          className="p-2 rounded-lg bg-[#FFF0F0] text-[#E29393] hover:bg-[#E29393] hover:text-white"
                        >
                          <Trash2 size={14} />
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

      {/* ================= MODALS ================= */}

      <AnimatePresence>

        {/* REQUESTS MODAL */}
        {isRequestModalOpen && selectedPet && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white w-full max-w-md rounded-[2.5rem] p-8 border-4 border-[#EADFC9] shadow-2xl"
            >

              <div className="flex items-center justify-between mb-5">

                <div>
                  <h2 className="text-2xl font-black">
                    Adopters for {selectedPet.name}
                  </h2>

                  <p className="text-sm text-[#8A7979] mt-1">
                    Incoming requests.
                  </p>
                </div>

                <button
                  onClick={() => setIsRequestModalOpen(false)}
                  className="w-10 h-10 rounded-full bg-[#FBF8F3] flex items-center justify-center"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="max-h-[500px] overflow-y-auto cozy-scrollbar pr-1 space-y-4">

                {receivedRequests.filter(
                  (r) => r.petId === selectedPet._id
                ).length === 0 ? (
                  <div className="text-center py-12 bg-[#FBF8F3] rounded-2xl">
                    <p className="font-black">
                      No requests yet 🐾
                    </p>
                  </div>
                ) : (
                  receivedRequests
                    .filter(
                      (r) => r.petId === selectedPet._id
                    )
                    .map((r) => (
                      <div
                        key={r._id}
                        className="bg-[#FBF8F3] rounded-2xl border-2 border-[#EADFC9] p-5"
                      >

                        <div className="space-y-2 text-sm">

                          <div className="flex items-center gap-2">
                            <User size={14} />
                            <span className="font-black">
                              {r.userName}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-[#8A7979]">
                            <Mail size={14} />
                            {r.userEmail}
                          </div>

                          <div className="flex items-center gap-2 text-[#8A7979]">
                            <Calendar size={14} />
                            Pickup: {r.pickupDate || 'Not set'}
                          </div>
                        </div>

                        <p className="mt-4 text-sm italic bg-white rounded-xl border border-[#EADFC9] p-3 text-[#6D7C75]">
                          "{r.message}"
                        </p>

                        {r.status?.toLowerCase() === 'pending' &&
                        selectedPet.status?.toLowerCase() !==
                          'adopted' ? (
                          <div className="grid grid-cols-2 gap-2 mt-4">

                            <button
                              disabled={actionLoading}
                              onClick={() =>
                                handleUpdateAppStatus(
                                  r._id,
                                  selectedPet._id!,
                                  'approved'
                                )
                              }
                              className="bg-[#4E6E58] text-white rounded-xl py-2.5 text-sm font-black"
                            >
                              Approve
                            </button>

                            <button
                              disabled={actionLoading}
                              onClick={() =>
                                handleUpdateAppStatus(
                                  r._id,
                                  selectedPet._id!,
                                  'rejected'
                                )
                              }
                              className="bg-[#E29393] text-white rounded-xl py-2.5 text-sm font-black"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <div
                            className={`mt-4 text-center rounded-xl py-2 text-xs uppercase font-black ${
                              r.status?.toLowerCase() ===
                              'approved'
                                ? 'bg-[#C1D6C7] text-[#4E6E58]'
                                : r.status?.toLowerCase() ===
                                  'rejected'
                                ? 'bg-[#FFF0F0] text-[#E29393]'
                                : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            {r.status}
                          </div>
                        )}
                      </div>
                    ))
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* ADD / EDIT MODAL */}
        {modalMode && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white w-full max-w-2xl rounded-[2.75rem] border-[3px] border-[#EADFC9] shadow-2xl p-8"
            >

              <div className="flex items-start justify-between mb-6">

                <div>
                  <p className="text-[10px] uppercase tracking-widest font-black text-[#4E6E58]">
                    Dashboard Form
                  </p>

                  <h2 className="text-3xl font-black mt-1">
                    {modalMode === 'add'
                      ? 'List a New Gem 💎'
                      : 'Edit Your Gem ✨'}
                  </h2>
                </div>

                <button
                  onClick={() => setModalMode(null)}
                  className="w-10 h-10 rounded-full bg-[#FBF8F3] flex items-center justify-center"
                >
                  <X size={18} />
                </button>
              </div>

              <form
                onSubmit={handleAddOrUpdateSubmit}
                className="space-y-5 max-h-[70vh] overflow-y-auto cozy-scrollbar pr-1"
              >

                {/* EMAIL */}
                <div>
                  <label className="text-xs font-black uppercase text-[#4E6E58] block mb-2">
                    Owner Email
                  </label>

                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-4 text-slate-400"
                      size={18}
                    />

                    <input
                      type="email"
                      value={user?.email || ''}
                      readOnly
                      className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-100 border-2 border-slate-200 text-slate-500 font-bold"
                    />
                  </div>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  <div className="relative">
                    <PawPrint
                      className="absolute left-4 top-4 text-[#A89898]"
                      size={18}
                    />

                    <input
                      name="name"
                      placeholder="Pet Name"
                      value={formData.name}
                      onChange={handleFormChange}
                      className={`${inputClass} pl-11`}
                      required
                    />
                  </div>

                  <div className="relative">
                    <Tag
                      className="absolute left-4 top-4 text-[#A89898]"
                      size={18}
                    />

                    <input
                      name="species"
                      placeholder="Species"
                      value={formData.species}
                      onChange={handleFormChange}
                      className={`${inputClass} pl-11`}
                      required
                    />
                  </div>

                  <input
                    name="breed"
                    placeholder="Breed"
                    value={formData.breed}
                    onChange={handleFormChange}
                    className={inputClass}
                    required
                  />

                  <input
                    name="age"
                    placeholder="Age"
                    value={formData.age}
                    onChange={handleFormChange}
                    className={inputClass}
                    required
                  />

                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleFormChange}
                    className={inputClass}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Unknown">Unknown</option>
                  </select>

                  <div className="relative">
                    <DollarSign
                      className="absolute left-4 top-4 text-[#A89898]"
                      size={18}
                    />

                    <input
                      type="number"
                      name="adoptionFee"
                      placeholder="Adoption Fee"
                      value={formData.adoptionFee}
                      onChange={handleFormChange}
                      className={`${inputClass} pl-11`}
                      required
                    />
                  </div>
                </div>

                {/* IMAGE */}
                <div className="relative">
                  <ImageIcon
                    className="absolute left-4 top-4 text-[#A89898]"
                    size={18}
                  />

                  <input
                    name="image"
                    placeholder="Image URL"
                    value={formData.image}
                    onChange={handleFormChange}
                    className={`${inputClass} pl-11`}
                    required
                  />
                </div>

                {/* HEALTH */}
                <div className="grid grid-cols-2 gap-5">

                  <input
                    name="healthStatus"
                    placeholder="Health Status"
                    value={formData.healthStatus}
                    onChange={handleFormChange}
                    className={inputClass}
                    required
                  />

                  <input
                    name="vaccinationStatus"
                    placeholder="Vaccination Status"
                    value={formData.vaccinationStatus}
                    onChange={handleFormChange}
                    className={inputClass}
                    required
                  />
                </div>

                {/* LOCATION */}
                <div className="grid grid-cols-2 gap-5">

                  <input
                    name="location"
                    placeholder="Location"
                    value={formData.location}
                    onChange={handleFormChange}
                    className={inputClass}
                    required
                  />

                  {modalMode === 'edit' && (
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleFormChange}
                      className={inputClass}
                    >
                      <option value="Available">
                        Available
                      </option>

                      <option value="Adopted">
                        Adopted
                      </option>
                    </select>
                  )}
                </div>

                {/* DESCRIPTION */}
                <textarea
                  name="description"
                  placeholder="Tell us about this tiny criminal..."
                  rows={5}
                  value={formData.description}
                  onChange={handleFormChange}
                  className="w-full rounded-2xl border-2 border-[#EADFC9] bg-[#FBF8F3] p-4 outline-none resize-none focus:border-[#4E6E58]"
                  required
                />

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full bg-[#4E6E58] text-white rounded-2xl py-4 font-black text-lg hover:bg-[#3B5443] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {actionLoading && (
                    <Loader2 className="animate-spin" size={20} />
                  )}

                  {modalMode === 'add'
                    ? 'Submit Listing 🐾'
                    : 'Save Changes ✨'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}