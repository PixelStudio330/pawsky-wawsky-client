'use client';

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
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

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    router.push("/");
  };

  const leftLinks = [
    { name: "Home", href: "/" },
    { name: "All Pets", href: "/pets" },
  ];

  return (
    <>
      <nav className={`fixed left-0 right-0 z-[100] w-full transition-all duration-500 ease-in-out ${
        isScrolled ? "top-0 px-0" : "top-6 px-4 md:px-8"
      }`}>
        <div className={`mx-auto relative transition-all duration-500 w-full ${
          isScrolled ? "max-w-full" : "max-w-7xl"
        }`}>
          
          <div className={`
            flex items-center justify-between transition-all duration-500 ease-in-out
            bg-white/80 backdrop-blur-xl shadow-xl relative
            ${isScrolled 
              ? "px-10 lg:px-20 py-4 rounded-none border-b border-[#EAD7C3]/40" 
              : "px-8 py-3 rounded-full border border-white/60"} 
          `}>
            
            {/* left section */}
            <div className="flex items-center gap-8 flex-1">
              <AnimatePresence mode="wait">
                {isScrolled ? (
                  <motion.div 
                    key="scrolled-logo"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Link href="/" className="flex items-center gap-3 group">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden transition-transform group-hover:scale-110 relative">
                         <Image 
                            src="/img/logo.jpg" 
                            alt="Pawsky Wawsky Logo" 
                            fill
                            className="object-contain"
                         />
                      </div>
                      <span className="text-xl font-black tracking-tighter text-[#4E5C56] font-sans">
                        PAWSKY<span className="text-[#E7C78A]">WAWSKY</span>
                      </span>
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="top-links-left"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hidden md:flex items-center gap-8"
                  >
                    {leftLinks.map((link) => (
                      <Link 
                        key={link.name} 
                        href={link.href} 
                        className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4E5C56] hover:text-[#6D7C75] transition-colors"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              
              <button onClick={() => setMobileMenuOpen(true)} className="md:hidden text-[#4E5C56]">
                <Menu size={24} />
              </button>
            </div>

            {!isScrolled && <div className="w-20 hidden md:block" />}

            {/* right section */}
            <div className="flex items-center justify-end gap-4 md:gap-6 flex-1">
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-[#EAD7C3]/50 animate-pulse" />
              ) : user ? (
                <div className="flex items-center gap-4">
                  <Link 
                    href="/dashboard/my-requests" 
                    title="Go to Dashboard"
                    className="p-2 text-[#4E5C56] hover:bg-[#6D7C75]/10 rounded-full transition-colors"
                  >
                    <LayoutDashboard size={18} />
                  </Link>

                  {/* Clicking this profile block links straight to the profile edit page */}
                  <Link href="/profile" className="flex items-center gap-2 group cursor-pointer">
                    <div className="text-right hidden lg:block">
                      <p className="text-[10px] font-black text-[#E7C78A] uppercase leading-none">Hello,</p>
                      <p className="text-[12px] font-bold text-slate-700 truncate max-w-[80px]">{user.name?.split(' ')[0]}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-[#E7C78A] overflow-hidden group-hover:scale-110 transition-transform bg-[#FDF6EC] relative">
                      <img 
                        src={user.photoUrl || "https://api.dicebear.com/7.x/adventurer/svg?seed=Nyra"} 
                        alt="User Profile Avatar" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>

                  <button 
                    onClick={handleLogout}
                    className="p-2 text-[#4E5C56] hover:bg-[#6D7C75]/10 rounded-full transition-colors"
                    title="Logout Session"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-6">
                  <Link href="/login" className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4E5C56] hover:text-[#6D7C75]">
                    Login
                  </Link>
                  <Link href="/register" className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#E7C78A] hover:text-[#6D7C75]">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Logo */}
          <AnimatePresence>
            {!isScrolled && (
              <motion.div 
                initial={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[110]"
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
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 180 }}
            className="fixed inset-0 z-[200] bg-[#EAD7C3] flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="text-[#4E5C56] font-black tracking-tighter text-2xl uppercase">
                PAWSKY<span className="text-white">WAWSKY</span>
              </span>
              <button onClick={() => setMobileMenuOpen(false)} className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-[#4E5C56]">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex flex-col gap-6">
              {leftLinks.map((link) => (
                <Link key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className="text-4xl font-black uppercase text-[#4E5C56]">
                  {link.name}
                </Link>
              ))}
              
              <div className="h-px bg-[#6D7C75]/20 my-4" />
              
              {user ? (
                <>
                  <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="text-4xl font-black uppercase text-white italic">My Profile</Link>
                  <Link href="/dashboard/my-requests" onClick={() => setMobileMenuOpen(false)} className="text-4xl font-black uppercase text-white italic">Dashboard</Link>
                  <button onClick={handleLogout} className="text-left text-4xl font-black uppercase text-[#4E5C56] flex items-center gap-2">
                    Logout <LogOut size={28} />
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-4xl font-black uppercase text-white italic">Login</Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="text-4xl font-black uppercase text-[#4E5C56]">Register</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}