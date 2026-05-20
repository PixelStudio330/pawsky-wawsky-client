'use client';

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { 
  Sparkles, Trash2, Download, Upload, Palette, Smile, Shirt, 
  Undo2, Redo2, RotateCcw, RotateCw, History, Layers, ChevronUp, ChevronDown, X
} from "lucide-react";
import { toPng } from "html-to-image";
import toast, { Toaster } from "react-hot-toast"; // Imported react-hot-toast for cozy popup notifications

const STICKER_ASSETS = {
  pets: [
    { id: "p1", url: "/img/sleepy-cat.png", label: "Sleepy Cat", defaultScale: 2.0 },
    { id: "p2", url: "/img/fluffy-golden.png", label: "Fluffy Golden", defaultScale: 1.3 },
    { id: "p3", url: "/img/loafing-calico.png", label: "Loafing Bun", defaultScale: 1.0 },
    { id: "p4", url: "/img/bird.jpg", label: "Chirping Bird", defaultScale: 1.3 },
  ],
  outfits: [
    { id: "o1", url: "/img/tiny-beret.jpg", label: "Tiny Beret", defaultScale: 1.0 },
    { id: "o2", url: "/img/hair-clip.png", label: "Cherry Blossom Clips", defaultScale: 1.0 },
    { id: "o3", url: "/img/flower.png", label: "Hibiscus Flower", defaultScale: 1.0 },
    { id: "o4", url: "/img/bow.png", label: "Gingham Bow", defaultScale: 1.0 },
  ],
  elements: [
    { id: "e1", url: "/img/flower-doodle.png", label: "Vibrant Folk Flower", defaultScale: 1.0 },
    { id: "e2", url: "/img/hearts.png", label: "Pixel Heart", defaultScale: 1.0 },
    { id: "e3", url: "/img/buttons.png", label: "Brown Button", defaultScale: 1.0 },
    { id: "e4", url: "/img/leaf.png", label: "Green Leaf", defaultScale: 1.0 },
  ],
};

interface CanvasItem {
  id: string;
  url: string;
  label: string;
  type: "pets" | "outfits" | "elements" | "custom";
  x: number;
  y: number;
  scale: number;
  rotate: number;
  zIndex: number;
}

// 🌸 Helper structure for uniform aesthetic toast alerts
const showCozyToast = (message: string, icon: string) => {
  toast(message, {
    icon: icon,
    style: {
      background: "#FFFFF7",
      color: "#3C3232",
      border: "3px solid #3C3232",
      borderRadius: "1rem",
      fontFamily: "var(--font-rounded), inherit",
      fontSize: "11px",
      fontWeight: "900",
      letterSpacing: "0.025em",
      boxShadow: "3px 3px 0px #3C3232",
    },
  });
};

export default function PetStickerStudio() {
  const [activeTab, setActiveTab] = useState<"pets" | "outfits" | "elements">("pets");
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [maxZIndex, setMaxZIndex] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const [stickerHistory, setStickerHistory] = useState<string[]>([]);
  
  const [historyStack, setHistoryStack] = useState<CanvasItem[][]>([]);
  const [redoStack, setRedoStack] = useState<CanvasItem[][]>([]);

  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const studioRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // --- Ambient Aura Mouse Interaction ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 22 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 22 });

  const auraX = useTransform(springX, (val) => `${val * 0.04}px`);
  const auraY = useTransform(springY, (val) => `${val * 0.04}px`);

  useEffect(() => {
    const savedItems = localStorage.getItem("studio_canvas_items");
    const savedHistory = localStorage.getItem("studio_sticker_history");
    if (savedItems) {
      try {
        const parsed = JSON.parse(savedItems);
        setCanvasItems(parsed);
        if (parsed.length > 0) {
          const highestZ = Math.max(...parsed.map((i: CanvasItem) => i.zIndex), 1);
          setMaxZIndex(highestZ);
        }
      } catch (e) {
        console.error("Error reading canvas cache storage:", e);
      }
    }
    if (savedHistory) {
      try { setStickerHistory(JSON.parse(savedHistory)); } catch (e) { console.error(e); }
    }
  }, []);

  const saveToBoardState = (newItems: CanvasItem[]) => {
    setHistoryStack(prev => [...prev, canvasItems]);
    setRedoStack([]); 
    setCanvasItems(newItems);
    localStorage.setItem("studio_canvas_items", JSON.stringify(newItems));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!studioRef.current) return;
    const { left, top, width, height } = studioRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - left - width / 2);
    mouseY.set(e.clientY - top - height / 2);
  };

  const handleStickerDeckWheelScroll = (e: React.WheelEvent) => {
    if (scrollContainerRef.current) {
      e.preventDefault();
      scrollContainerRef.current.scrollLeft += e.deltaY;
    }
  };

  const getBroughtToFrontItems = (items: CanvasItem[], id: string, currentMaxZ: number) => {
    const nextZ = currentMaxZ + 1;
    setMaxZIndex(nextZ);
    return items.map(item => item.id === id ? { ...item, zIndex: nextZ } : item);
  };

  const addAssetToCanvas = (url: string, label: string, type: CanvasItem["type"], initialScale: number = 1.0) => {
    const nextZ = maxZIndex + 1;
    const offsetScatter = (canvasItems.length * 12) % 60; 

    const newItem: CanvasItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      url,
      label,
      type,
      x: 80 + offsetScatter, 
      y: 80 + offsetScatter,
      scale: initialScale,
      rotate: 0,
      zIndex: nextZ
    };
    setMaxZIndex(nextZ);
    saveToBoardState([...canvasItems, newItem]);
    setSelectedItemId(newItem.id);

    // Dynamic cute icons based on type
    const visualIcons = { pets: "🐱", outfits: "🎀", elements: "🌸", custom: "🎨" };
    showCozyToast(`${label} added to the nest!`, visualIcons[type] || "✨");
  };

  const handlePetPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      addAssetToCanvas(url, "Custom Cutout", "custom", 1.0);
    }
  };

  const updateTransform = (property: 'scale' | 'rotate', amount: number) => {
    if (!selectedItemId) return;
    const nextItems = canvasItems.map(item => {
      if (item.id === selectedItemId) {
        const fallback = property === 'scale' ? 1 : 0;
        const currentVal = item[property] ?? fallback;
        let nextVal = currentVal + amount;
        if (property === 'scale') nextVal = Math.max(0.2, Math.min(nextVal, 4.0));
        return { ...item, [property]: nextVal };
      }
      return item;
    });
    saveToBoardState(nextItems);
  };

  const handleCanvasWheel = (e: React.WheelEvent, id: string) => {
    if (id !== selectedItemId) return;
    e.preventDefault();
    const direction = e.deltaY < 0 ? 0.05 : -0.05;
    updateTransform('scale', direction);
  };

  const resetSelectedItem = () => {
    if (!selectedItemId) return;
    const nextItems = canvasItems.map(item => 
      item.id === selectedItemId ? { ...item, scale: 1.0, rotate: 0 } : item
    );
    saveToBoardState(nextItems);
    showCozyToast("Sticker resets back to normal!", "🌱");
  };

  const deleteSelectedItem = () => {
    if (!selectedItemId) return;
    const targetItem = canvasItems.find(item => item.id === selectedItemId);
    const filtered = canvasItems.filter(item => item.id !== selectedItemId);
    saveToBoardState(filtered);
    setSelectedItemId(null);
    
    if (targetItem) {
      showCozyToast(`${targetItem.label} sent back to storage!`, "🧹");
    }
  };

  const clearWholeCanvas = () => {
    if (canvasItems.length === 0) return;
    saveToBoardState([]);
    setSelectedItemId(null);
    showCozyToast("Canvas swept clean!", "🧼");
  };

  const handleUndo = () => {
    if (historyStack.length === 0) return;
    const previous = historyStack[historyStack.length - 1];
    setRedoStack(prev => [canvasItems, ...prev]);
    setHistoryStack(prev => prev.slice(0, -1));
    setCanvasItems(previous);
    localStorage.setItem("studio_canvas_items", JSON.stringify(previous));
    showCozyToast("Stepped back in time!", "⏳");
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    setHistoryStack(prev => [...prev, canvasItems]);
    setRedoStack(prev => prev.slice(1));
    setCanvasItems(next);
    localStorage.setItem("studio_canvas_items", JSON.stringify(next));
    showCozyToast("Restored your asset!", "🔮");
  };

  const selectAndBringToFront = (id: string) => {
    const updated = getBroughtToFrontItems(canvasItems, id, maxZIndex);
    setCanvasItems(updated);
    localStorage.setItem("studio_canvas_items", JSON.stringify(updated));
    setSelectedItemId(id);
  };

  const adjustLayerDepth = (id: string, direction: 'up' | 'down') => {
    const targetIndex = canvasItems.findIndex(i => i.id === id);
    if (targetIndex === -1) return;

    const updated = [...canvasItems];
    if (direction === 'up' && targetIndex < updated.length - 1) {
      const tempZ = updated[targetIndex].zIndex;
      updated[targetIndex].zIndex = updated[targetIndex + 1].zIndex;
      updated[targetIndex + 1].zIndex = tempZ;
    } else if (direction === 'down' && targetIndex > 0) {
      const tempZ = updated[targetIndex].zIndex;
      updated[targetIndex].zIndex = updated[targetIndex - 1].zIndex;
      updated[targetIndex - 1].zIndex = tempZ;
    }
    
    updated.sort((a, b) => a.zIndex - b.zIndex);
    saveToBoardState(updated);
  };

  const handleDragEnd = (id: string, info: any) => {
    const updated = canvasItems.map(item => {
      if (item.id === id) {
        return { ...item, x: item.x + info.offset.x, y: item.y + info.offset.y };
      }
      return item;
    });
    const broughtToFront = getBroughtToFrontItems(updated, id, maxZIndex);
    saveToBoardState(broughtToFront);
  };

  const exportStickerCanvas = async () => {
    if (!canvasRef.current) return;
    try {
      setIsExporting(true);
      setSelectedItemId(null); 
      await new Promise((resolve) => setTimeout(resolve, 250));

      const dataUrl = await toPng(canvasRef.current, {
        cacheBust: true,
        backgroundColor: "transparent", 
        style: { background: "transparent", backgroundImage: "none" }
      });

      const link = document.createElement("a");
      link.download = `sticker-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      const updatedHistory = [dataUrl, ...stickerHistory.slice(0, 5)];
      setStickerHistory(updatedHistory);
      localStorage.setItem("studio_sticker_history", JSON.stringify(updatedHistory));
      
      showCozyToast("Sticker compiled successfully!", "✨");
    } catch (error) {
      console.error("Snapshot failure:", error);
      showCozyToast("Oops, snapshot lost track!", "🩹");
    } finally {
      setIsExporting(false);
    }
  };

  const deleteHistoryItem = (indexToDelete: number) => {
    const updated = stickerHistory.filter((_, idx) => idx !== indexToDelete);
    setStickerHistory(updated);
    localStorage.setItem("studio_sticker_history", JSON.stringify(updated));
    showCozyToast("History frame dropped!", "🗑️");
  };

  const clearAllHistory = () => {
    setStickerHistory([]);
    localStorage.removeItem("studio_sticker_history");
    showCozyToast("Studio scrapbook cleared!", "🧺");
  };

  return (
    <section 
      ref={studioRef}
      id="pet-sticker-maker"
      onMouseMove={handleMouseMove}
      className="relative min-h-screen pt-25 pb-20 px-4 sm:px-6 bg-[#FFFFF7] overflow-hidden text-[#5A4E4E] select-none flex flex-col items-center justify-start lg:justify-start"
    >

      {/* 🏁 Checkered Texture Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#EADFC9_1px,transparent_1px),linear-gradient(to_bottom,#EADFC9_1px,transparent_1px)] bg-[size:24px_24px] opacity-[0.25] pointer-events-none z-0" />

      {/* 💫 Ambient Glow Suns */}
      <motion.div style={{ x: auraX, y: auraY }} className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] right-[8%] w-[380px] h-[380px] bg-[#F7EAC9] rounded-full blur-[100px] opacity-50" />
        <div className="absolute bottom-[25%] left-[5%] w-[420px] h-[420px] bg-[#FFF0F0] rounded-full blur-[110px] opacity-60" />
      </motion.div>

      {/* ✨ Single-line Balanced Clean Header */}
      <div className="relative z-10 flex items-center justify-center gap-3 mb-8 w-full max-w-4xl px-2">
        <h1 className="text-3xl sm:text-5xl font-black text-[#3C3232] tracking-tight whitespace-nowrap">
          The Sticker Studio
        </h1>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-[#EADFC9] text-[9px] font-black uppercase tracking-wider text-[#E29393] shadow-sm whitespace-nowrap">
          <Sparkles className="w-2.5 h-2.5 animate-pulse text-[#8AB69B]" /> Creative Workshop
        </span>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-5 relative z-10 items-start pb-6">
        
        {/* WORKSPACE */}
        <div className="col-span-1 lg:col-span-5 flex flex-col items-center w-full max-w-[400px] mx-auto">
          <div className="w-full flex items-center justify-between mb-1.5 px-1">
            <div className="flex gap-1 items-center">
              <button onClick={handleUndo} disabled={historyStack.length === 0} className="p-1.5 rounded-md bg-white border border-[#EADFC9] hover:border-[#3C3232] disabled:opacity-30 transition-all">
                <Undo2 className="w-3.5 h-3.5" />
              </button>
              <button onClick={handleRedo} disabled={redoStack.length === 0} className="p-1.5 rounded-md bg-white border border-[#EADFC9] hover:border-[#3C3232] disabled:opacity-30 transition-all">
                <Redo2 className="w-3.5 h-3.5" />
              </button>
              <div className="w-[1px] h-4 bg-[#EADFC9] mx-1" />
              <button 
                onClick={clearWholeCanvas} 
                disabled={canvasItems.length === 0}
                className="text-[9px] font-black uppercase px-2 py-1.5 rounded-md border border-[#C96A6A] text-[#C96A6A] hover:bg-[#FFF0F0] disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              >
                Clear Board
              </button>
            </div>
            <span className="text-[9px] uppercase font-black text-[#A69797] tracking-wider">Transparent Board</span>
          </div>

          <div 
            ref={canvasRef}
            className="relative w-full aspect-square bg-transparent border-4 border-[#3C3232] rounded-[2rem] shadow-sm overflow-hidden" 
            onClick={(e) => { if (e.target === e.currentTarget) setSelectedItemId(null); }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(#3C3232_1px,transparent_1px)] bg-[size:14px_14px] opacity-[0.06] pointer-events-none" />
            
            {canvasItems.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center pointer-events-none opacity-40">
                <Palette className="w-8 h-8 text-[#6E5D5D] mb-1 stroke-[1.5]" />
                <p className="font-black text-xs text-[#3C3232]">Canvas is Empty</p>
              </div>
            )}

            {canvasItems.map((item) => {
              const isSelected = selectedItemId === item.id;

              return (
                <motion.div
                  key={item.id}
                  drag
                  dragMomentum={false}
                  dragElastic={0}
                  onDragStart={() => selectAndBringToFront(item.id)}
                  onDragEnd={(e, info) => handleDragEnd(item.id, info)}
                  onWheel={(e) => handleCanvasWheel(e, item.id)}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    selectAndBringToFront(item.id);
                  }}
                  style={{
                    position: 'absolute',
                    x: item.x,
                    y: item.y,
                    zIndex: item.zIndex,
                    scale: item.scale,
                    rotate: item.rotate,
                    cursor: 'grab',
                    pointerEvents: selectedItemId && !isSelected ? 'none' : 'auto'
                  }}
                  className="absolute p-2 select-none active:cursor-grabbing touch-none transition-shadow"
                >
                  <img 
                    src={item.url} 
                    alt={item.label} 
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain pointer-events-none drop-shadow-md"
                    draggable={false}
                  />
                </motion.div>
              );
            })}
          </div>

          <AnimatePresence>
            {selectedItemId && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="w-full mt-2 bg-white border-2 border-[#3C3232] rounded-xl p-1.5 shadow-sm flex items-center justify-between gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-1">
                  <button onClick={() => updateTransform('scale', -0.1)} className="w-6 h-6 rounded bg-[#FFFFF7] border border-[#EADFC9] font-black text-[10px] hover:border-[#3C3232]">🔍-</button>
                  <button onClick={() => updateTransform('scale', 0.1)} className="w-6 h-6 rounded bg-[#FFFFF7] border border-[#EADFC9] font-black text-[10px] hover:border-[#3C3232]">🔍+</button>
                  <div className="h-3 w-[1px] bg-[#EADFC9] mx-0.5" />
                  <button onClick={() => updateTransform('rotate', -15)} className="w-6 h-6 rounded bg-[#FFFFF7] border border-[#EADFC9] flex items-center justify-center hover:border-[#3C3232]"><RotateCcw className="w-2.5 h-2.5" /></button>
                  <button onClick={() => updateTransform('rotate', 15)} className="w-6 h-6 rounded bg-[#FFFFF7] border border-[#EADFC9] flex items-center justify-center hover:border-[#3C3232]"><RotateCw className="w-2.5 h-2.5" /></button>
                  <button onClick={resetSelectedItem} className="text-[9px] font-black px-1.5 h-6 rounded bg-[#FFFFF7] border border-[#EADFC9] hover:border-[#3C3232]">Reset</button>
                </div>
                <button onClick={deleteSelectedItem} className="p-1 text-[#C96A6A] hover:bg-[#FFF0F0] rounded"><Trash2 className="w-3.5 h-3.5" /></button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* SIDEBAR PANELS */}
        <div className="col-span-1 lg:col-span-4 flex flex-col w-full max-w-[400px] lg:max-w-none mx-auto">
          <div className="bg-white border-4 border-[#3C3232] rounded-[1.5rem] shadow-sm p-3.5 flex flex-col justify-between">
            <div>
              <div className="grid grid-cols-3 border-2 border-[#EADFC9] p-0.5 rounded-lg bg-[#FFFFF7] mb-3">
                <button type="button" onClick={() => setActiveTab("pets")} className={`py-1 rounded-md font-black text-[10px] sm:text-[11px] flex items-center justify-center gap-1 transition-colors ${activeTab === "pets" ? "bg-[#3C3232] text-[#FFFFF7]" : "text-[#6E5D5D]"}`}><Smile className="w-3 h-3" /> Pets</button>
                <button type="button" onClick={() => setActiveTab("outfits")} className={`py-1 rounded-md font-black text-[10px] sm:text-[11px] flex items-center justify-center gap-1 transition-colors ${activeTab === "outfits" ? "bg-[#3C3232] text-[#FFFFF7]" : "text-[#6E5D5D]"}`}><Shirt className="w-3 h-3" /> Outfits</button>
                <button type="button" onClick={() => setActiveTab("elements")} className={`py-1 rounded-md font-black text-[10px] sm:text-[11px] flex items-center justify-center gap-1 transition-colors ${activeTab === "elements" ? "bg-[#3C3232] text-[#FFFFF7]" : "text-[#6E5D5D]"}`}><Palette className="w-3 h-3" /> Doodles</button>
              </div>

              {/* STICKER CHOOSER CARD WITH MOUSE SCROLL SUPPORT */}
              <div 
                ref={scrollContainerRef}
                onWheel={handleStickerDeckWheelScroll}
                className="max-h-[160px] sm:max-h-[220px] overflow-x-auto lg:overflow-y-auto pr-0.5 custom-scrollbar min-h-[130px]"
              >
                <div className="flex flex-row lg:grid lg:grid-cols-2 gap-2 pb-2 lg:pb-0">
                  {STICKER_ASSETS[activeTab].map((asset) => {
                    const keepSmall = asset.id === "e1" || asset.id === "p3"; 
                    const imageSizeClass = keepSmall 
                      ? "w-10 h-10 object-contain" 
                      : "w-14 h-14 object-contain scale-110";

                    return (
                      <button
                        type="button"
                        key={asset.id}
                        onClick={() => addAssetToCanvas(asset.url, asset.label, activeTab, asset.defaultScale)}
                        className="group bg-[#FFFFF7] hover:bg-white border-2 border-[#EADFC9] hover:border-[#3C3232] p-1.5 rounded-xl transition-all flex flex-col items-center justify-center gap-1 text-center min-w-[90px] lg:min-w-0"
                      >
                        <div className="w-14 h-14 flex items-center justify-center overflow-hidden">
                          <img 
                            src={asset.url} 
                            alt={asset.label} 
                            className={`${imageSizeClass} group-hover:scale-105 transition-all duration-200`} 
                            draggable={false}
                          />
                        </div>
                        <span className="text-[9px] font-black text-[#6E5D5D] group-hover:text-[#3C3232] truncate w-full px-0.5">{asset.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t-2 border-dashed border-[#EADFC9] space-y-1.5">
              <input type="file" ref={fileInputRef} onChange={handlePetPhotoUpload} accept="image/*" className="hidden" />
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-1.5 py-2 bg-[#FFFFF7] hover:bg-[#EADFC9]/20 border-2 border-[#3C3232] text-[#3C3232] font-black text-[10px] rounded-lg shadow-[2px_2px_0px_#3C3232] transition-all"
              >
                <Upload className="w-3 h-3" />
                <span>Upload Custom Cutout</span>
              </button>

              {canvasItems.length > 0 && (
                <button
                  type="button"
                  onClick={exportStickerCanvas}
                  disabled={isExporting}
                  className="w-full flex items-center justify-center gap-1.5 py-2 bg-[#8AB69B] hover:bg-[#7AA58B] border-2 border-[#3C3232] text-white font-black text-[10px] rounded-lg shadow-[2px_2px_0px_#3C3232] transition-all disabled:opacity-50"
                >
                  <Download className="w-3 h-3" />
                  <span>{isExporting ? "Compiling PNG..." : "Export Clear Sticker"}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* LAYERS DECK & UTILITY HISTORY LOG */}
        <div className="col-span-1 lg:col-span-3 flex flex-col gap-4 w-full max-w-[400px] lg:max-w-none mx-auto h-full">
          
          {/* Active Canvas Layer Management Panel */}
          <div className="bg-white border-4 border-[#3C3232] rounded-[1.5rem] shadow-sm p-3 flex flex-col flex-1 min-h-[160px]">
            <span className="font-black text-[11px] text-[#3C3232] flex items-center gap-1 mb-2">
              <Layers className="w-3 h-3 text-[#8AB69B]" /> Canvas Layers
            </span>
            
            {canvasItems.length === 0 ? (
              <div className="flex-1 flex items-center justify-center border-2 border-dashed border-[#EADFC9] rounded-xl bg-[#FFFFF7] text-[9px] font-black opacity-40">
                No active objects
              </div>
            ) : (
              <div className="flex flex-col gap-1 overflow-y-auto max-h-[140px] pr-0.5 custom-scrollbar">
                {[...canvasItems].reverse().map((item, index) => {
                  const actualIdx = canvasItems.length - 1 - index;
                  return (
                    <div 
                      key={item.id}
                      onClick={() => selectAndBringToFront(item.id)}
                      className={`flex items-center justify-between p-1.5 rounded-lg border text-[10px] font-bold cursor-pointer transition-all ${
                        selectedItemId === item.id 
                          ? 'bg-[#FFF0F0] border-[#E29393] text-[#3C3232]' 
                          : 'bg-[#FFFFF7] border-[#EADFC9] text-[#6E5D5D] hover:border-[#3C3232]'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <img src={item.url} className="w-5 h-5 object-contain rounded bg-white border border-[#EADFC9]" alt="" />
                        <span className="truncate max-w-[90px]">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-0.5" onClick={e => e.stopPropagation()}>
                        <button 
                          disabled={actualIdx === canvasItems.length - 1} 
                          onClick={() => adjustLayerDepth(item.id, 'up')}
                          className="p-0.5 hover:bg-white rounded border border-transparent hover:border-[#EADFC9] disabled:opacity-20"
                        >
                          <ChevronUp className="w-3 h-3" />
                        </button>
                        <button 
                          disabled={actualIdx === 0} 
                          onClick={() => adjustLayerDepth(item.id, 'down')}
                          className="p-0.5 hover:bg-white rounded border border-transparent hover:border-[#EADFC9] disabled:opacity-20"
                        >
                          <ChevronDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Studio Export History Log */}
          <div className="bg-white border-4 border-[#3C3232] rounded-[1.5rem] shadow-sm p-3.5 flex flex-col min-h-[140px] h-fit">
            <div className="flex items-center justify-between mb-2.5">
              <span className="font-black text-[11px] text-[#3C3232] flex items-center gap-1">
                <History className="w-3 h-3 text-[#E29393]" /> Studio History
              </span>
              {stickerHistory.length > 0 && (
                <button 
                  onClick={clearAllHistory}
                  className="text-[8px] font-black uppercase text-[#C96A6A] hover:bg-[#FFF0F0] px-1.5 py-0.5 rounded border border-[#FCD4D4] transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            {stickerHistory.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40 p-3 border-2 border-dashed border-[#EADFC9] rounded-xl bg-[#FFFFF7]">
                <p className="text-[9px] font-black">History Log Clear</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 xs:grid-cols-4 lg:grid-cols-2 gap-2 overflow-y-auto max-h-[140px] pr-1 scrollbar-thin">
                {stickerHistory.map((srcUrl, idx) => (
                  <div 
                    key={idx} 
                    className="relative aspect-square border-2 border-[#EADFC9] rounded-xl p-1 bg-[radial-gradient(#3C3232_1px,transparent_1px)] bg-[size:6px_6px] group overflow-hidden transition-all hover:border-[#3C3232] bg-white flex items-center justify-center"
                  >
                    <img src={srcUrl} alt="Exported asset frame" className="w-full h-full object-contain pointer-events-none" />
                    
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-all duration-150 p-1.5 z-10">
                      <a 
                        href={srcUrl} 
                        download={`studio-sticker-${idx}.png`} 
                        className="w-full bg-[#8AB69B] text-white rounded text-[8px] font-black uppercase text-center py-1 transition-colors hover:bg-[#7AA58B]"
                      >
                        Save
                      </a>
                      <button 
                        type="button"
                        onClick={() => deleteHistoryItem(idx)}
                        className="w-full bg-[#C96A6A] text-white rounded text-[8px] font-black uppercase text-center py-1 transition-colors hover:bg-[#B85959] flex items-center justify-center gap-0.5"
                      >
                        <X className="w-2 h-2" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}