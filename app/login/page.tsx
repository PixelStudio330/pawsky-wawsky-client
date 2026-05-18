'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      console.log("Logging in with credentials:", formData);
      // Backend hook will connect here to set HTTPOnly token cookie
      router.push("/");
    } catch (err) {
      setError("Invalid email or password. Please try again! 🐾");
    }
  };

  const handleGoogleLogin = () => {
    console.log("Triggering social popup route mapping...");
    // Will hook into passport/google backend route redirection
  };

  return (
    <main className="min-h-screen bg-[#FFFDFB] flex items-center justify-center py-20 px-4 relative overflow-hidden">
      {/* Aesthetic Accents */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-20 right-20 text-5xl opacity-15 rotate-12">💎</div>
        <div className="absolute bottom-12 left-20 text-4xl opacity-15 -rotate-12">🐾</div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#E7C78A]/10 rounded-full blur-[110px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white w-full max-w-md rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(240,168,168,0.12)] border-4 border-white relative z-10"
      >
        <div className="text-center mb-8">
          <span className="text-[10px] uppercase tracking-widest font-black text-[#C9A68D] bg-[#FAF5E7] px-3 py-1 rounded-full border border-[#E7C78A]/20">
            Welcome Back
          </span>
          <h1 className="text-3xl font-black text-[#524444] mt-3">Hello, Friend!</h1>
          <p className="text-sm text-[#8A7979] italic mt-1">Our tiny companions missed your presence.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-[#FFF2F2] border-l-4 border-[#F0A8A8] rounded-xl text-xs font-bold text-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleCredentialsLogin} className="space-y-5">
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

          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: "#E2B4B4" }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-4 bg-[#F0A8A8] text-white rounded-2xl font-black text-sm tracking-wide shadow-[0_8px_20px_rgba(240,168,168,0.3)] transition-all mt-2"
          >
            Sign In ✨
          </motion.button>
        </form>

        <div className="relative my-6 text-center">
          <hr className="border-[#FFF0ED]" />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-[10px] uppercase tracking-widest font-bold text-[#C6B6B6]">OR</span>
        </div>

        {/* Google Login Button Layout */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={handleGoogleLogin}
          className="w-full py-3.5 border-2 border-[#FFF0ED] text-[#524444] rounded-2xl font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-[#FFF8F8] transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.58 14.98 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.6 2.8C6.01 7.14 8.79 5.04 12 5.04z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.25c0-.82-.07-1.6-.22-2.35H12v4.45h6.45c-.28 1.47-1.11 2.71-2.36 3.55l3.65 2.83c2.14-1.97 3.36-4.88 3.36-8.48z"
            />
            <path
              fill="#FBBC05"
              d="M5.1 14.9c-.23-.68-.35-1.41-.35-2.15s.12-1.47.35-2.15L1.5 7.8C.54 9.72 0 11.82 0 14s.54 4.28 1.5 6.2l3.6-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.65-2.83c-1.01.67-2.3 1.07-4.31 1.07-3.21 0-5.99-2.1-6.95-5.26l-3.6 2.8C3.4 20.35 7.35 23 12 23z"
            />
          </svg>
          Continue with Google
        </motion.button>

        {/* Register Link */}
        <p className="text-center text-xs text-[#8A7979] font-medium mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-[#F0A8A8] font-bold hover:underline ml-1">
            Register here
          </Link>
        </p>
      </motion.div>
    </main>
  );
}