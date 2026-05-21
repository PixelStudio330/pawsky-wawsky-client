'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, Mail, Lock, Sparkles, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

// --- Framer Motion Variants for Staggered Animation ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2, 
      staggerChildren: 0.08, 
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

// --- Floating Emoji Component ---
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

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const loadingToast = toast.loading("Connecting to the sanctuary...", {
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
      await login({
        email: formData.email,
        password: formData.password,
      });

      toast.success("Welcome back, friend! 🌸", {
        id: loadingToast,
        duration: 4000,
        icon: "🐾",
        style: {
          background: "#E8EFE9",
          color: "#2F3E33",
          borderRadius: "1.2rem",
          border: "2px solid #C4D7CB",
          fontSize: "13px",
          fontWeight: "bold",
        },
      });

      setIsSubmitting(false);
      router.refresh();
      window.location.href = "/";

    } catch (err: any) {
      setIsSubmitting(false);
      toast.error(err.response?.data?.message || "Invalid credentials. Let's try again! 🍂", {
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

  // --- GOOGLE SIGN IN INTEGRATION ---
  const handleGoogleLogin = () => {
    toast.loading("Redirecting to Google... 🌿", {
      duration: 2000,
      style: {
        background: "#FAF5E7",
        color: "#635347",
        borderRadius: "1rem",
        border: "2px solid #E7C78A",
        fontSize: "12px",
        fontWeight: "bold",
      },
    });

    // Point this to your backend server URL redirect endpoint
    // Example backend route structure: http://localhost:5000/api/auth/google
    const backendBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    window.location.href = `${backendBaseUrl}/api/auth/google`;
  };

  return (
    <main className="min-h-screen bg-[#FBF8F3] flex items-center justify-center py-20 px-4 relative overflow-hidden selection:bg-[#F0A8A8]/30">
      
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-0 bg-[linear-gradient(to_right,#4A3E3D_1px,transparent_1px),linear-gradient(to_bottom,#4A3E3D_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="absolute inset-0 pointer-events-none z-0">
        <FloatingEmoji emoji="🌿" delay={1} initialPos={{ top: "15%", left: "12%" }} />
        <FloatingEmoji emoji="🌸" delay={3} initialPos={{ bottom: "20%", right: "15%" }} rotateRange={20} />
        <FloatingEmoji emoji="🎨" delay={5} initialPos={{ top: "40%", right: "10%" }} rotateRange={-10} />
        <FloatingEmoji emoji="🐾" delay={7} initialPos={{ bottom: "35%", left: "8%" }} rotateRange={30} />
        <FloatingEmoji emoji="💎" delay={9} initialPos={{ top: "60%", left: "25%" }} rotateRange={-20} />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4E6E58]/5 rounded-full blur-[130px]" />
        <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] bg-[#F0A8A8]/10 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
        className="absolute w-[600px] h-[600px] bg-[#F0A8A8]/15 rounded-full blur-[120px] pointer-events-none z-5"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-[#FCFAF7] w-full max-w-xl rounded-[2.75rem] p-10 md:p-14 shadow-[0_30px_70px_rgba(78,110,88,0.08)] border-[3px] border-[#EADFC9] relative z-10 overflow-hidden"
      >
        <div className="absolute top-0 inset-x-0 h-2 bg-[#4E6E58]" />

        <motion.div variants={itemVariants} className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E8EFE9] border border-[#C4D7CB] text-[10px] uppercase tracking-widest font-black text-[#3B5443] mb-4">
            <Sparkles size={10} className="text-[#4E6E58]" /> Sanctuary Login
          </div>
          <h1 className="text-3xl font-black text-[#3C3232] tracking-tight">Welcome Back ᓚᘏᗢ</h1>
          <p className="text-xs text-[#7A6A6A] font-medium italic mt-1.5">
            Step back inside, your cozy companions missed you.
          </p>
        </motion.div>

        <form onSubmit={handleCredentialsLogin} className="space-y-6">
          <motion.div variants={itemVariants} className="group">
            <label className="block text-[11px] font-black text-[#5C4D4D] uppercase tracking-wider mb-2.5 ml-1">
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

          <motion.div variants={itemVariants} className="group">
            <label className="block text-[11px] font-black text-[#5C4D4D] uppercase tracking-wider mb-2.5 ml-1">
              Password
            </label>
            <div className="relative rounded-2xl bg-[#FFF]/80 border-2 border-[#EADFC9] group-focus-within:border-[#4E6E58] shadow-sm transition-all overflow-hidden">
              <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-[#A89898]">
                <Lock size={17} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-12 pr-14 py-4 bg-transparent text-sm text-[#3C3232] font-semibold placeholder-[#C6B6B6] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4.5 flex items-center text-[#A89898] hover:text-[#4E6E58] transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </motion.div>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.01, backgroundColor: "#425E4B" }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4.5 bg-[#4E6E58] text-[#F9F6F0] rounded-2xl font-black text-xs tracking-wider uppercase shadow-[0_6px_20px_rgba(78,110,88,0.15)] transition-all mt-4 flex items-center justify-center gap-2.5 disabled:opacity-50"
          >
            {isSubmitting ? "Unlocking... ✨" : (
              <>
                Enter Sanctuary <ArrowRight size={15} />
              </>
            )}
          </motion.button>
        </form>

        <motion.div variants={itemVariants} className="relative my-8 text-center">
          <hr className="border-[#EADFC9]" />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FCFAF7] px-4.5 text-[10px] uppercase tracking-widest font-black text-[#A89898]">
            OR
          </span>
        </motion.div>

        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.01, borderColor: "#B2A48D", backgroundColor: "#F7F2E9" }}
          whileTap={{ scale: 0.99 }}
          type="button"
          onClick={handleGoogleLogin}
          className="w-full py-4 border-2 border-[#EADFC9] text-[#5C4D4D] rounded-2xl font-black text-xs tracking-wider uppercase flex items-center justify-center gap-3 transition-all bg-transparent"
        >
          <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.58 14.98 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.6 2.8C6.01 7.14 8.79 5.04 12 5.04z"/>
            <path fill="#4285F4" d="M23.5 12.25c0-.82-.07-1.6-.22-2.35H12v4.45h6.45c-.28 1.47-1.11 2.71-2.36 3.55l3.65 2.83c2.14-1.97 3.36-4.88 3.36-8.48z"/>
            <path fill="#FBBC05" d="M5.1 14.9c-.23-.68-.35-1.41-.35-2.15s.12-1.47.35-2.15L1.5 7.8C.54 9.72 0 11.82 0 14s.54 4.28 1.5 6.2l3.6-2.9z"/>
            <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.65-2.83c-1.01.67-2.3 1.07-4.31 1.07-3.21 0-5.99-2.1-6.95-5.26l-3.6 2.8C3.4 20.35 7.35 23 12 23z"/>
          </svg>
          Continue with Google
        </motion.button>

        <motion.p variants={itemVariants} className="text-center text-xs text-[#7A6A6A] font-semibold mt-8">
          New around these parts?{" "}
          <Link href="/register" className="text-[#F0A8A8] font-black hover:text-[#DB8B8B] transition-colors ml-1 underline underline-offset-4 decoration-2">
            Create an account
          </Link>
        </motion.p>
      </motion.div>
    </main>
  );
}