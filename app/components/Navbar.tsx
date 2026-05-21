'use client';

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, LayoutDashboard, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ─── UTILITY TO STRIP HASH AFTER 500ms ───
  const startHashVanishingTimer = () => {
    setTimeout(() => {
      if (window.location.hash === "#all-pets-section") {
        window.history.replaceState(
          null,
          document.title,
          window.location.pathname + window.location.search
        );
      }
    }, 500);
  };

  // Handle direct URL hits / deep links on initial page mount
  useEffect(() => {
    if (window.location.hash === "#all-pets-section") {
      startHashVanishingTimer();
    }
  }, []);

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    router.push("/");
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "All Pets", href: "/#all-pets-section" },
  ];

  return (
    <>
      <nav className={`fixed left-0 right-0 z-[100] w-full transition-all duration-500 ease-in-out ${
        isScrolled ? "top-0 px-0" : "top-4 md:top-6 px-4 lg:px-8"
      }`}>
        <div className={`mx-auto relative transition-all duration-500 w-full ${
          isScrolled ? "max-w-full" : "max-w-7xl"
        }`}>
          
          <div className={`
            flex items-center justify-between transition-all duration-500 ease-in-out
            bg-white/80 backdrop-blur-xl shadow-md lg:shadow-xl relative w-full
            ${isScrolled 
              ? "px-6 md:px-12 lg:px-20 py-4 rounded-none border-b border-[#EAD7C3]/40" 
              : "px-5 md:px-8 py-3 rounded-full border border-white/60"} 
          `}>
            
            {/* ─── LEFT SECTION (Desktop Links / Scrolled Brand Layout) ─── */}
            <div className="flex items-center gap-6 lg:gap-8 flex-1">
              {/* Mobile/Tablet Burger Menu Trigger */}
              <button 
                onClick={() => setMobileMenuOpen(true)} 
                className="lg:hidden p-1.5 text-[#4E5C56] hover:bg-[#6D7C75]/10 rounded-full transition-colors"
                aria-label="Toggle menu"
              >
                <Menu size={22} />
              </button>

              <AnimatePresence mode="wait">
                {isScrolled ? (
                  <motion.div 
                    key="scrolled-logo"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                  >
                    <Link href="/" className="flex items-center gap-2.5 group">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105 relative">
                         <Image 
                            src="/img/logo.jpg" 
                            alt="Pawsky Wawsky Logo" 
                            fill
                            className="object-contain"
                         />
                      </div>
                      <span className="text-base md:text-lg font-black tracking-tighter text-[#4E5C56] font-sans">
                        PAWSKY<span className="text-[#E7C78A]">WAWSKY</span>
                      </span>
                    </Link>
                  </motion.div>
                ) : (
                  /* Standard Desktop Links Left Side */
                  <motion.div 
                    key="top-links-left"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hidden lg:flex items-center gap-8"
                  >
                    {navLinks.map((link) => (
                      <Link 
                        key={link.name} 
                        href={link.href} 
                        onClick={() => {
                          if (link.href.includes('#')) startHashVanishingTimer();
                        }}
                        className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4E5C56] hover:text-[#6D7C75] transition-colors"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Spacer to prevent center logo collision on Desktop when un-scrolled */}
            {!isScrolled && <div className="w-16 hidden lg:block" />}

            {/* ─── CENTER BRAND LOGO ─── */}
            <AnimatePresence>
              {!isScrolled && (
                <motion.div 
                  initial={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[110] lg:block hidden"
                >
                  <Link href="/" className="relative group block">
                    <div className="absolute inset-0 bg-white rounded-full scale-110 shadow-md group-hover:bg-[#EAD7C3]/40 transition-colors duration-500" />
                    <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center overflow-hidden bg-white border border-[#EAD7C3]/20 transition-transform duration-500 group-hover:scale-110 p-2">
                      <div className="relative w-full h-full">
                        <Image 
                          src="/img/logo.jpg" 
                          alt="Pawsky Wawsky Central Logo" 
                          fill
                          className="object-contain"
                          priority
                        />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Brand Title visibility fix for Tablet/Mobile viewports */}
            {!isScrolled && (
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:hidden">
                <Link href="/" className="text-lg font-black tracking-tighter text-[#4E5C56]">
                  PAWSKY<span className="text-[#E7C78A]">WAWSKY</span>
                </Link>
              </div>
            )}

            {/* ─── RIGHT SECTION (Profiles / Actions) ─── */}
            <div className="flex items-center justify-end gap-2 md:gap-4 lg:gap-6 flex-1">
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-[#EAD7C3]/50 animate-pulse" />
              ) : user ? (
                <div className="flex items-center gap-2 md:gap-4">
                  <Link 
                    href="/dashboard" 
                    title="Go to Dashboard"
                    className="p-2 text-[#4E5C56] hover:bg-[#6D7C75]/10 rounded-full transition-colors"
                  >
                    <LayoutDashboard size={18} />
                  </Link>

                  <Link href="/profile" className="flex items-center gap-2 group cursor-pointer">
                    <div className="text-right hidden xl:block">
                      <p className="text-[10px] font-black text-[#E7C78A] uppercase leading-none">Hello,</p>
                      <p className="text-[12px] font-bold text-slate-700 truncate max-w-[80px]">{user.name?.split(' ')[0]}</p>
                    </div>
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-[#E7C78A] overflow-hidden group-hover:scale-105 transition-transform bg-[#FDF6EC] relative">
                      <img 
                        src={user.photoUrl || "https://api.dicebear.com/7.x/adventurer/svg?seed=Nyra"} 
                        alt="User Profile Avatar" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>

                  <button 
                    onClick={handleLogout}
                    className="p-2 text-[#4E5C56] hover:bg-[#6D7C75]/10 rounded-full transition-colors hidden sm:block"
                    title="Logout Session"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4 md:gap-6">
                  <Link href="/login" className="text-[11px] font-black uppercase tracking-[0.2em] text-[#4E5C56] hover:text-[#6D7C75] transition-colors">
                    Login
                  </Link>
                  <Link href="/register" className="text-[11px] font-black uppercase tracking-[0.2em] text-[#E7C78A] hover:text-[#6D7C75] transition-colors hidden sm:block">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ─── MOBILE & TABLET DRAWER OVERLAY ─── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 190 }}
            className="fixed inset-y-0 left-0 z-[200] w-full max-w-sm bg-[#EAD7C3] flex flex-col p-6 md:p-10 shadow-2xl overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-10">
              <span className="text-[#4E5C56] font-black tracking-tighter text-xl md:text-2xl uppercase">
                PAWSKY<span className="text-white">WAWSKY</span>
              </span>
              <button 
                onClick={() => setMobileMenuOpen(false)} 
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-[#4E5C56] hover:bg-white/30 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex flex-col gap-5">
              <p className="text-[10px] uppercase font-black tracking-widest text-[#4E5C56]/60 -mb-2">Navigation</p>
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (link.href.includes('#')) startHashVanishingTimer();
                  }} 
                  className="text-3xl font-black uppercase text-[#4E5C56] hover:text-white transition-colors tracking-tight"
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="h-[2px] bg-dashed bg-[linear-gradient(to_right,#6D7C75_4px,transparent_4px)] bg-[size:8px_2px] opacity-20 my-4" />
              
              <p className="text-[10px] uppercase font-black tracking-widest text-[#4E5C56]/60 -mb-2">Account Portal</p>
              {user ? (
                <>
                  <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-black uppercase text-white hover:text-[#4E5C56] transition-colors flex items-center gap-3">
                    <User size={20} /> Profile Setting
                  </Link>
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-black uppercase text-white hover:text-[#4E5C56] transition-colors flex items-center gap-3">
                    <LayoutDashboard size={20} /> Dashboard
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="text-left text-2xl font-black uppercase text-[#4E5C56] hover:text-red-700 transition-colors flex items-center gap-3 mt-4 pt-4 border-t border-[#4E5C56]/10"
                  >
                    <LogOut size={20} /> Exit Session
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-black uppercase text-white hover:text-[#4E5C56] transition-colors">
                    Login
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-black uppercase text-[#4E5C56] hover:text-white transition-colors">
                    Register
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}