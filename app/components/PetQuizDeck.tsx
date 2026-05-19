'use client';

import { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Sparkles, Heart, Award, ArrowRight, RotateCcw, AlertTriangle } from "lucide-react";

// --- Quiz 1: Personality Matcher Data (Mapping to Database Profiles) ---
const personalityQuiz = {
  title: "The Pet Match Mirror",
  subtitle: "Which active rescue soul shares your cosmic energy?",
  questions: [
    {
      question: "What is your absolute ideal environment to focus or relax in?",
      options: [
        { text: "A bright room filled with soft background chatter or whistling melodies.", match: "Pip (Cockatiel)" },
        { text: "A quiet, green garden corner scented with fresh herbs and mint leaves.", match: "Clover (Angora Bunny)" },
        { text: "A plush, carpeted living room with lots of soft pillows to collapse onto.", match: "Peanut (Ragdoll)" },
        { text: "Out in an open meadow, running around under a wide, breezy sky.", match: "Waffles (Corgi)" }
      ]
    },
    {
      question: "If your friend is feeling deeply burnt out, how do you try to cheer them up?",
      options: [
        { text: "Hum or sing a sweet, upbeat tune to completely break the heavy silence.", match: "Pip (Cockatiel)" },
        { text: "Bring them a warm comforting treat and sit closely without demanding attention.", match: "Clover (Angora Bunny)" },
        { text: "Go completely limp beside them on the sofa, offering warm, silent hugs.", match: "Peanut (Ragdoll)" },
        { text: "Encourage them to throw on a jacket and go for an energetic walk outdoors.", match: "Waffles (Corgi)" }
      ]
    },
    {
      question: "Choose a tactile craft texture that makes you feel instantly safe and grounded:",
      options: [
        { text: "The crisp, light flutter of delicate paper crafts or clean feathers.", match: "Pip (Cockatiel)" },
        { text: "An absolute cloud of unspun, thick, fluffy pastel yarn.", match: "Clover (Angora Bunny)" },
        { text: "A heavy, luxurious silk blanket that wraps you up like a warm cloud.", match: "Peanut (Ragdoll)" },
        { text: "A sturdy, textured woven woolen glove ready for outdoor adventures.", match: "Waffles (Corgi)" }
      ]
    },
    {
      question: "How do you usually handle meeting completely unfamiliar people or environments?",
      options: [
        { text: "Show off a little bit of your talent early to test the waters!", match: "Pip (Cockatiel)" },
        { text: "Observe quietly from a safe distance, then gently step forward if it feels calm.", match: "Clover (Angora Bunny)" },
        { text: "Trust them immediately and easily adapt to whoever holds you.", match: "Peanut (Ragdoll)" },
        { text: "Run straight in with a big, bright smile and an open heart!", match: "Waffles (Corgi)" }
      ]
    },
    {
      question: "What kind of small daily routine brings you the most genuine fulfillment?",
      options: [
        { text: "Listening to the therapeutic drip-drop sound of running water or soft rain.", match: "Pip (Cockatiel)" },
        { text: "A slow, meticulous self-care grooming routine with a soft hairbrush.", match: "Clover (Angora Bunny)" },
        { text: "Enjoying a specialized, high-quality meal customized exactly to your liking.", match: "Peanut (Ragdoll)" },
        { text: "Exploring an entirely new neighborhood alleyway or path with high energy.", match: "Waffles (Corgi)" }
      ]
    }
  ]
};

// --- Quiz 2: Capability Quiz Data (Tied directly to their specific health/breed traits) ---
const capabilityQuiz = {
  title: "Sanctuary Readiness Ledger",
  subtitle: "Are you fully prepared for their specific needs?",
  questions: [
    {
      question: "You notice Clover the Angora Bunny's magnificent cloud of fur is looking a bit messy. You should...",
      options: [
        { text: "Give her a deep, soapy bath in the sink immediately to get her clean.", correct: false, points: 0, avoidText: "Avoid bathing rabbits; water shocks their fragile nervous systems. Instead, brush Clover regularly to maintain her coat health." },
        { text: "Gently run through her fur daily with a soft-bristle brush, avoiding water.", correct: true, points: 10, avoidText: "" }
      ]
    },
    {
      question: "Peanut the Ragdoll cat has a slight food allergy. When stocking up on his monthly supplies, you...",
      options: [
        { text: "Buy standard commercial kibble since cats can easily acclimate to any dry food over time.", correct: false, points: 0, avoidText: "Avoid switching allergic pets like Peanut to standard grocery kibble. He strictly requires his customized, allergen-free diet." },
        { text: "Meticulously double-check ingredients to ensure it matches his exact specific kibble layout.", correct: true, points: 10, avoidText: "" }
      ]
    },
    {
      question: "Pip the Cockatiel is whistling beautifully in his enclosure near the window, but you want to cook nearby. You must...",
      options: [
        { text: "Ensure no non-stick Teflon pans are used, as their heated fumes are instantly fatal to birds.", correct: true, points: 10, avoidText: "" },
        { text: "Light an air-freshening scented candle near his cage to clear any smoky kitchen odors.", correct: false, points: 0, avoidText: "Avoid scented candles, aerosols, or Teflon fumes near birds like Pip; their respiratory systems are highly sensitive." }
      ]
    },
    {
      question: "Waffles the Corgi has short little legs but high energy. For his daily exercise routine, you plan to...",
      options: [
        { text: "Force him to jump up and down high concrete steps or high beds to burn energy quickly.", correct: false, points: 0, avoidText: "Avoid high-impact jumping for long-backed breeds like Waffles. Corgis are prone to back injuries; stick to level outdoor runs." },
        { text: "Take him out on structured, level ground walks and interactive meadow games.", correct: true, points: 10, avoidText: "" }
      ]
    },
    {
      question: "You are setting up budgets. Waffles, Peanut, and Clover are fully vaccinated, but Pip's profile says 'Not Required'. You...",
      options: [
        { text: "Skip setting aside emergency medical funds for Pip entirely since he doesn't need basic shots.", correct: false, points: 0, avoidText: "Avoid neglecting avian checkups. Even if routine vaccines aren't required for Pip, exotic birds still require specialized vet funds." },
        { text: "Still allocate a distinct financial emergency fund for potential specialized avian vet visits.", correct: true, points: 10, avoidText: "" }
      ]
    }
  ]
};

export default function PetQuizDeck() {
  const [activeQuiz, setActiveQuiz] = useState<"match" | "capability">("match");
  const sectionRef = useRef<HTMLDivElement>(null);

  // Core State Engines
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [personalityAnswers, setPersonalityAnswers] = useState<string[]>([]);
  const [matchResult, setMatchResult] = useState<{ name: string; harmony: string; image: string } | null>(null);
  const [capabilityScore, setCapabilityScore] = useState<number>(0);
  const [isCapabilityFinished, setIsCapabilityFinished] = useState(false);
  const [avoidList, setAvoidList] = useState<string[]>([]);

  // --- Aura Mouse Interactive System ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 22 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 22 });
  const auraX = useTransform(springX, (val) => `${val * 0.04}px`);
  const auraY = useTransform(springY, (val) => `${val * 0.04}px`);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sectionRef.current) return;
    const { left, top, width, height } = sectionRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - left - width / 2);
    mouseY.set(e.clientY - top - height / 2);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setPersonalityAnswers([]);
    setMatchResult(null);
    setCapabilityScore(0);
    setIsCapabilityFinished(false);
    setAvoidList([]);
  };

  // --- Dynamic Character Image/Harmony Router ---
  const calculatePersonalityMatch = (answers: string[]) => {
    const counts: { [key: string]: number } = {};
    let maxAnimal = answers[0];
    let maxCount = 0;

    answers.forEach((ans) => {
      counts[ans] = (counts[ans] || 0) + 1;
      if (counts[ans] > maxCount) {
        maxCount = counts[ans];
        maxAnimal = ans;
      }
    });

    const animalDataProfiles: { [key: string]: { img: string; rate: string } } = {
      "Pip (Cockatiel)": { img: "https://i.pinimg.com/1200x/08/f7/c2/08f7c21d4ec7cde9bcf0068b30949159.jpg", rate: "98% Harmony Rate" },
      "Clover (Angora Bunny)": { img: "https://i.pinimg.com/736x/b2/12/95/b21295a6ee3544a07c480d272288d5d3.jpg", rate: "95% Harmony Rate" },
      "Peanut (Ragdoll)": { img: "https://i.pinimg.com/736x/a9/f1/77/a9f1779158cc3f1586f6e736c03571b6.jpg", rate: "99% Harmony Rate" },
      "Waffles (Corgi)": { img: "https://i.pinimg.com/736x/d9/8f/84/d98f848cd623cedc704d0bc470df41dc.jpg", rate: "92% Harmony Rate" }
    };

    const targetProfile = animalDataProfiles[maxAnimal] || animalDataProfiles["Peanut (Ragdoll)"];
    setMatchResult({
      name: maxAnimal,
      harmony: targetProfile.rate,
      image: targetProfile.img
    });
  };

  const handleOptionClick = (option: any) => {
    const activeData = activeQuiz === "match" ? personalityQuiz : capabilityQuiz;
    
    if (activeQuiz === "match") {
      const updatedAnswers = [...personalityAnswers, option.match];
      setPersonalityAnswers(updatedAnswers);

      if (currentQuestion + 1 < activeData.questions.length) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        calculatePersonalityMatch(updatedAnswers);
      }
    } else {
      // Accumulate points and bad practices correctly
      if (!option.correct && option.avoidText) {
        setAvoidList(prev => [...prev, option.avoidText]);
      }
      setCapabilityScore(prev => prev + (option.points || 0));

      if (currentQuestion + 1 < activeData.questions.length) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setIsCapabilityFinished(true);
      }
    }
  };

  const activeData = activeQuiz === "match" ? personalityQuiz : capabilityQuiz;
  const isFinished = activeQuiz === "match" ? !!matchResult : isCapabilityFinished;

  return (
    <section 
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen py-24 px-4 sm:px-6 bg-[#FFFFF7] overflow-hidden text-[#5A4E4E] select-none flex flex-col items-center justify-center"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#EADFC9_1px,transparent_1px),linear-gradient(to_bottom,#EADFC9_1px,transparent_1px)] bg-[size:24px_24px] opacity-[0.2] pointer-events-none z-0" />
      
      <motion.div style={{ x: auraX, y: auraY }} className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[15%] w-[380px] h-[380px] bg-[#FADCD5] rounded-full blur-[100px] opacity-50" />
        <div className="absolute bottom-[10%] right-[15%] w-[400px] h-[400px] bg-[#E2ECE9] rounded-full blur-[110px] opacity-60" />
      </motion.div>

      {/* Switcher System */}
      <div className="relative z-10 bg-white border-2 border-[#EADFC9] p-1.5 rounded-2xl flex items-center gap-2 shadow-sm mb-12">
        <button
          onClick={() => { setActiveQuiz("match"); resetQuiz(); }}
          className={`px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all duration-300 ${
            activeQuiz === "match" ? "bg-[#3C3232] text-[#FFFFF7] shadow-md" : "text-[#6E5D5D] hover:bg-[#FFFFF7]"
          }`}
        >
          🐾 Personality Mirror
        </button>
        <button
          onClick={() => { setActiveQuiz("capability"); resetQuiz(); }}
          className={`px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all duration-300 ${
            activeQuiz === "capability" ? "bg-[#3C3232] text-[#FFFFF7] shadow-md" : "text-[#6E5D5D] hover:bg-[#FFFFF7]"
          }`}
        >
          🏡 Care Readiness Ledger
        </button>
      </div>

      {/* Main Form Frame Layout */}
      <div className="w-full max-w-2xl relative z-10 min-h-[440px]">
        <div className="absolute -inset-3 bg-[#EADFC9]/30 rounded-[2.5rem] rotate-1 shadow-inner pointer-events-none" />
        <div className="absolute -inset-1 bg-[#E7C78A]/10 rounded-[2.2rem] -rotate-1 pointer-events-none" />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeQuiz + "-" + isFinished + "-" + currentQuestion}
            initial={{ opacity: 0, x: 20, scale: 0.99 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.99 }}
            transition={{ type: "spring", stiffness: 140, damping: 22 }}
            className="w-full h-full bg-white border-4 border-[#3C3232] rounded-[2rem] p-6 sm:p-10 shadow-xl flex flex-col justify-between relative overflow-hidden"
          >
            {!isFinished ? (
              <>
                <div>
                  <div className="flex items-center justify-between border-b-2 border-dashed border-[#EADFC9] pb-4 mb-6">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-[#3C3232] tracking-tight">{activeData.title}</h3>
                      <p className="text-xs text-[#E29393] font-bold italic">{activeData.subtitle}</p>
                    </div>
                    <span className="text-[10px] uppercase font-black bg-[#FFFFF7] px-3 py-1.5 rounded-md border border-[#EADFC9] text-[#6E5D5D]">
                      Q: {currentQuestion + 1} / {activeData.questions.length}
                    </span>
                  </div>

                  <h4 className="text-sm sm:text-base font-black text-[#3C3232] leading-relaxed my-4 italic text-left bg-[#FFFFF7] border border-[#EADFC9]/60 p-4 rounded-xl">
                    "{activeData.questions[currentQuestion].question}"
                  </h4>

                  <div className="space-y-2.5 mt-6">
                    {activeData.questions[currentQuestion].options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleOptionClick(option)}
                        className="w-full text-left bg-white hover:bg-[#FFFFF7] border-2 border-[#EADFC9] hover:border-[#3C3232] p-4 rounded-xl font-bold text-xs sm:text-sm text-[#5A4E4E] hover:text-[#3C3232] transition-all duration-150 flex items-center justify-between group shadow-sm"
                      >
                        <span className="max-w-[90%]">{option.text}</span>
                        <ArrowRight className="w-4 h-4 text-[#E29393] opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-[#EADFC9]/50">
                  <div className="w-full bg-[#EADFC9]/40 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-[#E7C78A] to-[#E29393] h-full transition-all duration-300"
                      style={{ width: `${((currentQuestion) / activeData.questions.length) * 100}%` }}
                    />
                  </div>
                </div>
              </>
            ) : (
              // --- END RESULT PAGES ---
              <div className="text-center py-2 space-y-5">
                <div className="w-20 h-20 bg-white border-4 border-[#3C3232] rounded-3xl flex items-center justify-center mx-auto shadow-md overflow-hidden relative">
                  {activeQuiz === "match" && matchResult ? (
                    <img src={matchResult.image} alt="Matched pet" className="w-full h-full object-cover" />
                  ) : (
                    <Award className="w-8 h-8 text-[#8AB69B]" />
                  )}
                </div>

                {activeQuiz === "match" ? (
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#E29393]">Your Core Kinship Reflection</p>
                    <h3 className="text-2xl sm:text-3xl font-black text-[#3C3232] mt-1 tracking-tight">{matchResult?.name}</h3>
                    <div className="inline-block bg-[#FFF0F0] border border-[#FCD4D4] rounded-full px-4 py-1.5 text-xs font-black text-[#E29393] mt-2 shadow-inner">
                      ✨ {matchResult?.harmony}
                    </div>
                    <p className="text-xs sm:text-sm text-[#6E5D5D] italic font-bold max-w-md mx-auto mt-4 leading-relaxed">
                      Your spatial rhythms map beautifully onto this little soul's profile. You both treasure peaceful security balanced with specialized routines of quiet affection.
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#8AB69B]">Sanctuary Capabilities Assessment</p>
                    <h3 className="text-3xl sm:text-4xl font-black text-[#3C3232] mt-1">{capabilityScore} / 50</h3>
                    
                    {avoidList.length > 0 ? (
                      <div className="mt-5 text-left max-w-md mx-auto bg-[#FFF0F0] border-2 border-[#FCD4D4] rounded-2xl p-4 max-h-[220px] overflow-y-auto custom-scrollbar">
                        <div className="flex items-center gap-2 text-[#C96A6A] font-black text-xs uppercase tracking-wider mb-2 sticky top-0 bg-[#FFF0F0] pb-1">
                          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                          <span>Behaviors to Avoid to Improve:</span>
                        </div>
                        <div className="space-y-2.5">
                          {avoidList.map((tip, tIdx) => (
                            <div key={tIdx} className="flex items-start gap-2 text-xs text-[#6E5D5D] font-bold italic leading-relaxed">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#C96A6A] mt-1.5 flex-shrink-0" />
                              <p>{tip}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs sm:text-sm text-[#4E6E58] bg-[#F4F9F6] border border-[#D2E6DA] p-4 rounded-xl italic font-black max-w-md mx-auto mt-4">
                        🎉 Immaculate Knowledge! You perfectly understand the boundaries of medical safety and specialized boundaries for our rescue array.
                      </p>
                    )}
                  </div>
                )}

                <button
                  onClick={resetQuiz}
                  className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-[#3C3232] bg-white text-[#3C3232] font-black text-xs hover:bg-[#FFFFF7] active:scale-95 transition-all shadow-[3px_3px_0px_#3C3232]"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reconsult the Ledger</span>
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}