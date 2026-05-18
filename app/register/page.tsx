'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    photoUrl: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // --- ASSIGNMENT PASSWORD VALIDATION RULES ---
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long! 🐾");
      return;
    }
    if (!/[A-Z]/.test(formData.password)) {
      setError("Password needs at least one uppercase letter! 🌸");
      return;
    }
    if (!/[a-z]/.test(formData.password)) {
      setError("Password needs at least one lowercase letter! ✨");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match! Please check again. 💎");
      return;
    }

    try {
      // API integration will hook in right here!
      console.log("Registering user:", formData);
      router.push("/login");
    } catch (err) {
      setError("Something went wrong during registration.");
    }
  };

  return (
    <main className="min-h-screen bg-[#FFFDFB] flex items-center justify-center py-20 px-4 relative overflow-hidden">
      {/* Background Decoratives */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-12 left-12 text-4xl opacity-20 animate-pulse">🌸</div>
        <div className="absolute bottom-16 right-16 text-4xl opacity-20 rotate-12">🐾</div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FADCD5]/20 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(240,168,168,0.12)] border-4 border-white relative z-10"
      >
        <div className="text-center mb-8">
          <span className="text-[10px] uppercase tracking-widest font-black text-[#F0A8A8] bg-[#FFF0F0] px-3 py-1 rounded-full">
            Join Our Sanctuary
          </span>
          <h1 className="text-3xl font-black text-[#524444] mt-3">Create an Account</h1>
          <p className="text-sm text-[#8A7979] italic mt-1">Start your journey to finding a perfect companion</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 p-4 bg-[#FFF2F2] border-l-4 border-[#F0A8A8] rounded-xl text-xs font-bold text-red-800"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-[#524444] uppercase tracking-wider mb-1.5 ml-1">Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Elowyn Estelle"
              className="w-full px-5 py-3.5 rounded-2xl bg-[#FFFFA]/40 border-2 border-[#FFF0ED] text-sm text-[#524444] placeholder-[#C6B6B6] focus:outline-none focus:border-[#F0A8A8] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-[#524444] uppercase tracking-wider mb-1.5 ml-1">Email Address</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-5 py-3.5 rounded-2xl bg-[#FFFFA]/40 border-2 border-[#FFF0ED] text-sm text-[#524444] placeholder-[#C6B6B6] focus:outline-none focus:border-[#F0A8A8] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-[#524444] uppercase tracking-wider mb-1.5 ml-1">Photo URL</label>
            <input
              type="url"
              name="photoUrl"
              required
              value={formData.photoUrl}
              onChange={handleChange}
              placeholder="https://images.com/your-avatar.jpg"
              className="w-full px-5 py-3.5 rounded-2xl bg-[#FFFFA]/40 border-2 border-[#FFF0ED] text-sm text-[#524444] placeholder-[#C6B6B6] focus:outline-none focus:border-[#F0A8A8] transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-[#524444] uppercase tracking-wider mb-1.5 ml-1">Password</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-5 py-3.5 rounded-2xl bg-[#FFFFA]/40 border-2 border-[#FFF0ED] text-sm text-[#524444] placeholder-[#C6B6B6] focus:outline-none focus:border-[#F0A8A8] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-[#524444] uppercase tracking-wider mb-1.5 ml-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-5 py-3.5 rounded-2xl bg-[#FFFFA]/40 border-2 border-[#FFF0ED] text-sm text-[#524444] placeholder-[#C6B6B6] focus:outline-none focus:border-[#F0A8A8] transition-colors"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: "#E2B4B4" }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-4 bg-[#F0A8A8] text-white rounded-2xl font-black text-sm tracking-wide shadow-[0_8px_20px_rgba(240,168,168,0.3)] transition-all mt-6"
          >
            Sign Up ✨
          </motion.button>
        </form>

        {/* 🔗 This is your requested Login Link alignment */}
        <p className="text-center text-xs text-[#8A7979] font-medium mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-[#F0A8A8] font-bold hover:underline ml-1">
            Login here
          </Link>
        </p>
      </motion.div>
    </main>
  );
}