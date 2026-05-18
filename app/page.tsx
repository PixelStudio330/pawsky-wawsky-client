'use client';

import Hero from "./components/Hero";

export default function Home() {
  return (
   
    <main className="relative min-h-screen bg-[#FDF6EC] text-[#5C6B64] w-full overflow-x-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute bottom-20 right-10 text-4xl opacity-10 animate-pulse">🌿</div>
        <div className="absolute top-1/2 left-5 text-4xl opacity-10 animate-bounce delay-700">🦴</div>
        <div className="absolute inset-0 bg-[url('/images/paper-texture.png')] bg-repeat opacity-5">🍀</div>
      </div>

      {/* section components */}
      <Hero />  

    </main>
  );
}