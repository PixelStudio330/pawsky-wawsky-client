'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  LogOut,
  User,
  Mail,
  Image as ImageIcon,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import api from "@/lib/axios";
import toast from "react-hot-toast";

// --- Framer Motion Orchestration ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { y: 25, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

// --- Floating Fluid Emojis ---
interface FloatingEmojiProps {
  emoji: string;
  delay?: number;
  initialPos?: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  rotateRange?: number;
}

function FloatingEmoji({
  emoji,
  delay = 0,
  initialPos = { top: "50%", left: "50%" },
  rotateRange = 15,
}: FloatingEmojiProps) {
  const driftX = useState(() => Math.random() * 80 - 40)[0];
  const driftY = useState(() => Math.random() * 80 - 40)[0];
  const rotateEnd = useState(
    () => Math.random() * (rotateRange * 2) - rotateRange
  )[0];

  return (
    <motion.div
      initial={{ opacity: 0, ...initialPos }}
      animate={{
        opacity: [0, 0.18, 0.18, 0],
        x: driftX,
        y: driftY,
        rotate: rotateEnd,
      }}
      transition={{
        duration: 12,
        delay,
        ease: "linear",
        repeat: Infinity,
        repeatType: "loop",
      }}
      className="absolute text-5xl select-none z-0"
    >
      {emoji}
    </motion.div>
  );
}

export default function ProfilePage() {
  const { user, loading, logout, setUser } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    photoUrl: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({
    status: "",
    text: "",
  });

  const [updating, setUpdating] = useState(false);

  // --- INITIAL FORM SYNC ---
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else {
        setFormData({
          name: user.name || "",
          photoUrl: user.photoUrl || "",
        });
      }
    }
  }, [user, loading, router]);

  // --- LOADER ---
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#FBF8F3] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
          className="w-12 h-12 rounded-full border-[3px] border-[#4E6E58] border-t-transparent"
        />
      </div>
    );
  }

  // --- DETECT FORM CHANGES ---
  const isFormChanged =
    formData.name.trim() !== (user.name || "") ||
    formData.photoUrl.trim() !== (user.photoUrl || "");

  // --- UPDATE PROFILE ---
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormChanged || updating) return;

    setMessage({ status: "", text: "" });
    setUpdating(true);

    const loadingToast = toast.loading(
      "Updating your sanctuary metadata...",
      {
        style: {
          background: "#F4EBE1",
          color: "#4A3E3D",
          borderRadius: "1rem",
          border: "2px solid #E6D5C3",
          fontSize: "13px",
          fontWeight: "bold",
        },
      }
    );

    try {
      // ✨ THIS is the actual final boss fix.
      // No localhost hardcode anymore.
      // Uses your deployed axios baseURL automatically.
      const response = await api.put(
        "/api/auth/update-profile",
        {
          name: formData.name.trim(),
          photoUrl: formData.photoUrl.trim(),
        },
        {
          withCredentials: true,
        }
      );

      if (response.data?.success) {
        const updatedUser = response.data.user;

        // --- UPDATE AUTH CONTEXT LIVE ---
        setUser(updatedUser);

        // --- UPDATE LOCAL STORAGE TOO ---
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // --- UPDATE UI STATE ---
        setFormData({
          name: updatedUser.name || "",
          photoUrl: updatedUser.photoUrl || "",
        });

        setIsEditing(false);

        toast.success("Profile sync completed! 🌸", {
          id: loadingToast,
        });

        window.location.reload();
      }
    } catch (err: any) {
      console.error("PROFILE UPDATE ERROR:", err);

      const errTxt =
        err?.response?.data?.message ||
        "Failed to save profile updates. 🐾";

      setMessage({
        status: "error",
        text: errTxt,
      });

      toast.error(errTxt, {
        id: loadingToast,
      });
    } finally {
      setUpdating(false);
    }
  };

  // --- LOGOUT ---
  const handleLogout = async () => {
    try {
      await logout();

      toast.success("Safe travels, friend! 🌿");

      localStorage.removeItem("user");

      window.location.href = "/";
    } catch (err) {
      console.error("Logout execution error:", err);
    }
  };

  return (
    <main className="min-h-screen bg-[#FBF8F3] flex items-center justify-center py-28 px-4 relative overflow-hidden selection:bg-[#F0A8A8]/30">
      {/* Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-0 bg-[linear-gradient(to_right,#4A3E3D_1px,transparent_1px),linear-gradient(to_bottom,#4A3E3D_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Decorative Vectors */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <FloatingEmoji
          emoji="🌸"
          delay={0}
          initialPos={{ top: "14%", left: "8%" }}
        />

        <FloatingEmoji
          emoji="🐾"
          delay={2.5}
          initialPos={{ bottom: "12%", right: "10%" }}
          rotateRange={25}
        />

        <FloatingEmoji
          emoji="🌿"
          delay={5}
          initialPos={{ top: "30%", right: "7%" }}
          rotateRange={-15}
        />

        <FloatingEmoji
          emoji="🎨"
          delay={7.5}
          initialPos={{ bottom: "25%", left: "6%" }}
          rotateRange={15}
        />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#4E6E58]/5 rounded-full blur-[140px]" />

        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-[#F0A8A8]/10 rounded-full blur-[110px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{
          duration: 1.6,
          ease: "easeOut",
        }}
        className="absolute w-[700px] h-[700px] bg-[#F0A8A8]/15 rounded-full blur-[130px] pointer-events-none z-5"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-3xl flex flex-col items-stretch relative z-10 gap-8"
      >
        {/* HERO CARD */}
        <motion.div
          variants={itemVariants}
          className="bg-[#FCFAF7] border-[3px] border-[#EADFC9] rounded-[2.75rem] p-8 shadow-[0_20px_50px_rgba(78,110,88,0.06)] relative overflow-hidden flex flex-col md:flex-row items-center gap-6 md:gap-8 text-center md:text-left"
        >
          <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-[2.2rem] border-3 border-[#4E6E58] overflow-hidden bg-[#FFF] p-2 rotate-2 shadow-md flex-shrink-0">
            <img
              src={
                formData.photoUrl ||
                user.photoUrl ||
                "https://api.dicebear.com/7.x/adventurer/svg?seed=Nyra"
              }
              alt="Avatar Profile"
              className="w-full h-full object-cover rounded-[1.6rem]"
            />
          </div>

          <div className="flex-1 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E8EFE9] border border-[#C4D7CB] text-[9px] uppercase tracking-widest font-black text-[#3B5443]">
              <Sparkles size={10} className="text-[#4E6E58]" />
              Sanctuary Core Resident
            </div>

            <h1 className="text-3xl font-black text-[#3C3232] tracking-tight">
              {formData.name || user.name}
            </h1>

            <p className="text-xs text-[#7A6A6A] font-semibold flex items-center justify-center md:justify-start gap-1.5 italic">
              <Mail size={13} className="text-[#4E6E58]" />
              {user.email}
            </p>
          </div>
        </motion.div>

        {/* SETTINGS CARD */}
        <motion.div
          variants={itemVariants}
          className="bg-[#FCFAF7] rounded-[2.75rem] p-10 md:p-14 shadow-[0_30px_70px_rgba(78,110,88,0.08)] border-[3px] border-[#EADFC9] relative overflow-hidden"
        >
          <div className="absolute top-0 inset-x-0 h-2 bg-[#4E6E58]" />

          <AnimatePresence>
            {message.text && (
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="mb-6 p-4 rounded-2xl flex items-center gap-3 text-xs font-bold bg-[#FDF1F1] border-2 border-[#F0C7C7] text-[#613A3A]"
              >
                <AlertCircle
                  size={16}
                  className="text-[#DB8B8B]"
                />

                {message.text}
              </motion.div>
            )}
          </AnimatePresence>

          <form
            onSubmit={handleUpdateProfile}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* NAME */}
              <div className="group">
                <label className="block text-[11px] font-black text-[#5C4D4D] uppercase tracking-wider mb-2.5 ml-1 flex items-center gap-1.5">
                  <User size={14} className="text-[#4E6E58]" />
                  Full Name Identity
                </label>

                <div className="relative rounded-2xl bg-[#FFF]/80 border-2 border-[#EADFC9] group-focus-within:border-[#4E6E58] shadow-sm transition-all overflow-hidden">
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value,
                      })
                    }
                    placeholder="Your legal or chosen moniker"
                    className="w-full px-5 py-3.5 bg-transparent text-sm text-[#3C3232] font-semibold placeholder-[#C6B6B6] focus:outline-none disabled:bg-gray-100/40 disabled:text-gray-400 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-[11px] font-black text-[#5C4D4D] uppercase tracking-wider mb-2.5 ml-1 flex items-center gap-1.5 opacity-60">
                  <Mail size={14} className="text-[#A89898]" />
                  Locked Core Email
                </label>

                <div className="w-full px-5 py-4 rounded-2xl bg-[#FAF5E7]/50 border-2 border-[#EADFC9]/70 text-sm text-[#A89898] font-bold flex items-center cursor-not-allowed select-none italic">
                  {user.email}
                </div>
              </div>
            </div>

            {/* PHOTO URL */}
            <div className="group">
              <label className="block text-[11px] font-black text-[#5C4D4D] uppercase tracking-wider mb-2.5 ml-1 flex items-center gap-1.5">
                <ImageIcon
                  size={14}
                  className="text-[#4E6E58]"
                />
                Avatar Photo Resource URL
              </label>

              <div className="relative rounded-2xl bg-[#FFF]/80 border-2 border-[#EADFC9] group-focus-within:border-[#4E6E58] shadow-sm transition-all overflow-hidden">
                <input
                  type="url"
                  disabled={!isEditing}
                  value={formData.photoUrl}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      photoUrl: e.target.value,
                    })
                  }
                  placeholder="https://images.com/your-art.jpg"
                  className="w-full px-5 py-3.5 bg-transparent text-sm text-[#3C3232] font-semibold placeholder-[#C6B6B6] focus:outline-none disabled:bg-gray-100/40 disabled:text-gray-400 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* ACTIONS */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-5 border-t-2 border-dashed border-[#EADFC9]">
              <motion.button
                whileHover={{
                  scale: 1.02,
                  backgroundColor: "#FFF1F1",
                }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleLogout}
                className="w-full sm:w-auto px-6 py-3.5 border-2 border-[#F0C7C7] text-[#613A3A] rounded-2xl font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all bg-transparent"
              >
                <LogOut size={15} />
                Log Out
              </motion.button>

              <div className="flex w-full sm:w-auto items-center justify-end gap-4">
                {!isEditing ? (
                  <motion.button
                    whileHover={{
                      scale: 1.01,
                      borderColor: "#B2A48D",
                      backgroundColor: "#F7F2E9",
                    }}
                    whileTap={{ scale: 0.99 }}
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="w-full sm:w-auto px-8 py-3.5 border-2 border-[#EADFC9] text-[#5C4D4D] rounded-2xl font-black text-xs tracking-wider uppercase flex items-center justify-center bg-transparent transition-all"
                  >
                    Edit Settings ✨
                  </motion.button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);

                        setFormData({
                          name: user.name || "",
                          photoUrl: user.photoUrl || "",
                        });
                      }}
                      className="text-xs font-black uppercase text-[#A89898] hover:text-[#5C4D4D] tracking-wider transition-colors px-3 py-2"
                    >
                      Cancel
                    </button>

                    <AnimatePresence>
                      {isFormChanged && (
                        <motion.button
                          initial={{
                            opacity: 0,
                            scale: 0.9,
                            x: 10,
                          }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                            x: 0,
                          }}
                          exit={{
                            opacity: 0,
                            scale: 0.9,
                            x: 10,
                          }}
                          transition={{
                            duration: 0.3,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          whileHover={{
                            scale: 1.01,
                            backgroundColor: "#425E4B",
                          }}
                          whileTap={{ scale: 0.99 }}
                          type="submit"
                          disabled={updating}
                          className="w-full sm:w-auto px-8 py-3.5 bg-[#4E6E58] text-[#F9F6F0] rounded-2xl font-black text-xs tracking-wider uppercase shadow-[0_6px_20px_rgba(78,110,88,0.15)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {updating ? (
                            "Saving Changes..."
                          ) : (
                            <>
                              Save Changes
                              <Sparkles size={13} />
                            </>
                          )}
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </main>
  );
}