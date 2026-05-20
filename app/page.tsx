'use client';

import { useEffect } from "react";
import Hero from "./components/Hero";
import Pets from "./components/our-gems";
import WhyAdopt from "./components/WhyAdopt";
import SuccessStories from "./components/SuccessStories";
import PetCare from "./components/PetCare";
import PetQuizDeck from "./components/PetQuizDeck";
import PetStickerStudio from "./components/PetStickerStudio";
import Footer from "./components/Footer";

export default function Home() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#pet-')) {
      let attempts = 0;
      
      // Poll the DOM until the asynchronous backend list populates the targeted card frame
      const scrollInterval = setInterval(() => {
        const targetCard = document.querySelector(hash);
        attempts++;

        if (targetCard) {
          targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
          clearInterval(scrollInterval);
        } else if (attempts > 30) { 
          // Stop checking after 3 seconds if data fails to connect
          clearInterval(scrollInterval);
        }
      }, 100);

      return () => clearInterval(scrollInterval);
    }
  }, []);

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
      
      {/* Dynamic target cards container */}
      <div>
        <Pets />
        <WhyAdopt />
        <SuccessStories />
        <PetCare />
        <PetQuizDeck />
        <PetStickerStudio />
        <Footer />
      </div>

    </main>
  );
}