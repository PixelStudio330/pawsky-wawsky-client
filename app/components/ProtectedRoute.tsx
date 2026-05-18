'use client';

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFDFB] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#F0A8A8] border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-xs font-black text-[#524444] tracking-widest uppercase">Loading Sanctuary... 🐾</p>
      </div>
    );
  }

  return user ? <>{children}</> : null;
}