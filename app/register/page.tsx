'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios"; // ✨ Added Axios import
import { Eye, EyeOff, Mail, Lock, User, Image, Sparkles, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

// --- Framer Motion Layout Cascades ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.15,
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

// --- Floating Fluid Emojis Component ---
interface FloatingEmojiProps {
  emoji: string;
  delay?: number;
  initialPos?: { top?: string; bottom?: string; left?: string; right?: string };
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
  const rotateEnd = useState(() => Math.random() * (rotateRange * 2) - rotateRange)[0];

  return (
    <motion.div
      initial={{ opacity: 0, ...initialPos }}
      animate={{
        opacity: [0, 0.2, 0.2, 0],
        x: driftX,
        y: driftY,
        rotate: rotateEnd,
      }}
      transition={{
        duration: 12,
        delay: delay,
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

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    photoUrl: "",
    password: "",
    confirmPassword: "",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();
  // ✂️ Removed useAuth hook since register isn't in the context

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // --- SECURE CUSTOM FIELD COMPLIANCE VALIDATIONS ---
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long! 🐾", {
        style: { background: "#FDF1F1", color: "#613A3A", borderRadius: "1.2rem", border: "2px solid #F0C7C7" }
      });
      return;
    }
    if (!/[A-Z]/.test(formData.password)) {
      toast.error("Password needs at least one uppercase letter! 🌸", {
        style: { background: "#FDF1F1", color: "#613A3A", borderRadius: "1.2rem", border: "2px solid #F0C7C7" }
      });
      return;
    }
    if (!/[a-z]/.test(formData.password)) {
      toast.error("**Password needs at least one lowercase letter!** ✨", {
        style: { background: "#FDF1F1", color: "#613A3A", borderRadius: "1.2rem", border: "2px solid #F0C7C7" }
      });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("**Passwords do not match! Please verify.** 💎", {
        style: { background: "#FDF1F1", color: "#613A3A", borderRadius: "1.2rem", border: "2px solid #F0C7C7" }
      });
      return;
    }

    setIsSubmitting(true);
    
    const loadingToast = toast.loading("Forging your digital sanctuary pass...", {
      style: {
        background: "#F4EBE1",
        color: "#4A3E3D",
        borderRadius: "1rem",
        border: "2px solid #E6D5C3",
        fontSize: "13px",
        fontWeight: "bold",
      },
    });

    try {
      // ✨ Switched to direct Axios call to your Express backend
      await axios.post("http://localhost:5000/api/auth/register", {
        name: formData.name,
        email: formData.email,
        photoUrl: formData.photoUrl,
        password: formData.password
      });

      toast.success("Account constructed perfectly! Redirecting... 🌿", {
        id: loadingToast,
        duration: 3000,
        icon: "✨",
        style: {
          background: "#E8EFE9",
          color: "#2F3E33",
          borderRadius: "1.2rem",
          border: "2px solid #C4D7CB",
          fontSize: "13px",
          fontWeight: "bold",
        },
      });

      router.push("/login");
    } catch (err: any) {
      setIsSubmitting(false);
      toast.error(err.response?.data?.message || "Registration trace failed. Try again! 🐾", {
        id: loadingToast,
        duration: 4000,
        style: {
          background: "#FDF1F1",
          color: "#613A3A",
          borderRadius: "1.2rem",
          border: "2px solid #F0C7C7",
          fontSize: "13px",
          fontWeight: "bold",
        },
      });
    }
  };

  return (
    <main className="min-h-screen bg-[#FBF8F3] flex items-center justify-center py-20 px-4 relative overflow-hidden selection:bg-[#F0A8A8]/30">
      
      {/* Cozy Web Grid Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-0 bg-[linear-gradient(to_right,#4A3E3D_1px,transparent_1px),linear-gradient(to_bottom,#4A3E3D_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Aesthetic Organics & Floating Emojis */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <FloatingEmoji emoji="🌸" delay={0} initialPos={{ top: "12%", left: "10%" }} />
        <FloatingEmoji emoji="🐾" delay={2} initialPos={{ bottom: "15%", right: "12%" }} rotateRange={20} />
        <FloatingEmoji emoji="🌿" delay={4} initialPos={{ top: "35%", right: "8%" }} rotateRange={-15} />
        <FloatingEmoji emoji="💎" delay={6} initialPos={{ bottom: "30%", left: "6%" }} rotateRange={25} />
        <FloatingEmoji emoji="✨" delay={8} initialPos={{ top: "55%", left: "22%" }} rotateRange={-10} />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[#4E6E58]/5 rounded-full blur-[140px]" />
        <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-[#F0A8A8]/10 rounded-full blur-[110px]" />
      </div>

      {/* --- PINK CIRCLE AURA BEHIND FORM --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.45, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.1, ease: "easeOut" }}
        className="absolute w-[650px] h-[650px] bg-[#F0A8A8]/15 rounded-full blur-[130px] pointer-events-none z-5"
      />

      {/* --- EXPANDED HIGH-CONTRAST FORM CONTAINER --- */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-[#FCFAF7] w-full max-w-xl rounded-[2.75rem] p-10 md:p-14 shadow-[0_30px_70px_rgba(78,110,88,0.08)] border-[3px] border-[#EADFC9] relative z-10 overflow-hidden"
      >
        {/* Folk-Art Border Accent Flag */}
        <div className="absolute top-0 inset-x-0 h-2 bg-[#4E6E58]" />

        {/* Header Block */}
        <motion.div variants={itemVariants} className="text-center mb-9">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E8EFE9] border border-[#C4D7CB] text-[10px] uppercase tracking-widest font-black text-[#3B5443] mb-4">
            <Sparkles size={10} className="text-[#4E6E58]" /> Sanctuary Register
          </div>
          <h1 className="text-3xl font-black text-[#3C3232] tracking-tight">Create an Account ᓚᘏᗢ</h1>
          <p className="text-xs text-[#7A6A6A] font-medium italic mt-1.5">
            Start your journey to finding a perfect companion.
          </p>
        </motion.div>

        {/* Registration Input Setup */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Full Name field */}
          <motion.div variants={itemVariants} className="group">
            <label className="block text-[11px] font-black text-[#5C4D4D] uppercase tracking-wider mb-2 ml-1">
              Full Name
            </label>
            <div className="relative rounded-2xl bg-[#FFF]/80 border-2 border-[#EADFC9] group-focus-within:border-[#4E6E58] shadow-sm transition-all overflow-hidden">
              <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-[#A89898]">
                <User size={17} />
              </div>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Sokhina Begum"
                className="w-full pl-12 pr-6 py-4 bg-transparent text-sm text-[#3C3232] font-semibold placeholder-[#C6B6B6] focus:outline-none"
              />
            </div>
          </motion.div>

          {/* Email field */}
          <motion.div variants={itemVariants} className="group">
            <label className="block text-[11px] font-black text-[#5C4D4D] uppercase tracking-wider mb-2 ml-1">
              Email Address
            </label>
            <div className="relative rounded-2xl bg-[#FFF]/80 border-2 border-[#EADFC9] group-focus-within:border-[#4E6E58] shadow-sm transition-all overflow-hidden">
              <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-[#A89898]">
                <Mail size={17} />
              </div>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full pl-12 pr-6 py-4 bg-transparent text-sm text-[#3C3232] font-semibold placeholder-[#C6B6B6] focus:outline-none"
              />
            </div>
          </motion.div>

          {/* Avatar URL field */}
          <motion.div variants={itemVariants} className="group">
            <label className="block text-[11px] font-black text-[#5C4D4D] uppercase tracking-wider mb-2 ml-1">
            Photo URL
            </label>
            <div className="relative rounded-2xl bg-[#FFF]/80 border-2 border-[#EADFC9] group-focus-within:border-[#4E6E58] shadow-sm transition-all overflow-hidden">
              <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-[#A89898]">
                <Image size={17} />
              </div>
              <input
                type="url"
                name="photoUrl"
                required
                value={formData.photoUrl}
                onChange={handleChange}
                placeholder="https://images.com/your-avatar.jpg"
                className="w-full pl-12 pr-6 py-4 bg-transparent text-sm text-[#3C3232] font-semibold placeholder-[#C6B6B6] focus:outline-none"
              />
            </div>
          </motion.div>

          {/* Dual Column Password Field Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Primary Password Input */}
            <motion.div variants={itemVariants} className="group">
              <label className="block text-[11px] font-black text-[#5C4D4D] uppercase tracking-wider mb-2 ml-1">
                Password
              </label>
              <div className="relative rounded-2xl bg-[#FFF]/80 border-2 border-[#EADFC9] group-focus-within:border-[#4E6E58] shadow-sm transition-all overflow-hidden">
                <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-[#A89898]">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-4 bg-transparent text-sm text-[#3C3232] font-semibold placeholder-[#C6B6B6] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#A89898] hover:text-[#4E6E58] transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </motion.div>

            {/* Confirmation Input */}
            <motion.div variants={itemVariants} className="group">
              <label className="block text-[11px] font-black text-[#5C4D4D] uppercase tracking-wider mb-2 ml-1">
                Confirm Password
              </label>
              <div className="relative rounded-2xl bg-[#FFF]/80 border-2 border-[#EADFC9] group-focus-within:border-[#4E6E58] shadow-sm transition-all overflow-hidden">
                <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-[#A89898]">
                  <Lock size={16} />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-4 bg-transparent text-sm text-[#3C3232] font-semibold placeholder-[#C6B6B6] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#A89898] hover:text-[#4E6E58] transition-colors focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </motion.div>
          </div>

          {/* Action Trigger Button */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.01, backgroundColor: "#425E4B" }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4.5 bg-[#4E6E58] text-[#F9F6F0] rounded-2xl font-black text-xs tracking-wider uppercase shadow-[0_6px_20px_rgba(78,110,88,0.15)] transition-all mt-5 flex items-center justify-center gap-2.5 disabled:opacity-50"
          >
            {isSubmitting ? "Creating Account... ✨" : (
              <>
                Create Account <ArrowRight size={15} />
              </>
            )}
          </motion.button>
        </form>

        {/* Dynamic Route Handshake Footer */}
        <motion.p variants={itemVariants} className="text-center text-xs text-[#7A6A6A] font-semibold mt-8">
          Already have an account?{" "}
          <Link href="/login" className="text-[#F0A8A8] font-black hover:text-[#DB8B8B] transition-colors ml-1 underline underline-offset-4 decoration-2">
            Login here
          </Link>
        </motion.p>
      </motion.div>
    </main>
  );
}