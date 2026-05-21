"use client";
import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  life: number;
  speedX: number;
  speedY: number;
  color: string;
  type: "star" | "sparkle" | "emoji";
  emoji?: string;
  angle: number;
}

export default function SparkleTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    const particles: Particle[] = [];
    const emojis = ["🌙", "🍄"];
    
    // The "Brown & Rainbow" Palette
    const colors = [
      "#8b5a2b", // Theme Brown
      "#FAF9F6", // Bright Cream
      "#ffd166", // Warm Yellow
      "#ff9a9e", // Soft Pink
      "#e0f2f1"  // Soft Teal
    ];

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      // Spawn 1-2 particles per move for a thick but clean trail
      const count = Math.random() > 0.7 ? 2 : 1;
      
      for (let i = 0; i < count; i++) {
        const typeRand = Math.random();
        particles.push({
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 2 + 1.8, // Medium size: visible but aesthetic
          life: 1,
          speedX: (Math.random() - 0.5) * 1.2,
          speedY: (Math.random() - 0.5) * 1.2,
          color: colors[Math.floor(Math.random() * colors.length)],
          angle: Math.random() * Math.PI * 2,
          // Logic: 3% Emojis, 17% Stars, 80% Sparkles
          type: typeRand > 0.97 ? "emoji" : typeRand > 0.8 ? "star" : "sparkle",
          emoji: emojis[Math.floor(Math.random() * emojis.length)]
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        ctx.lineTo(
          Math.cos(((18 + i * 72) / 180) * Math.PI) * r + x,
          -Math.sin(((18 + i * 72) / 180) * Math.PI) * r + y
        );
        ctx.lineTo(
          Math.cos(((54 + i * 72) / 180) * Math.PI) * (r / 2.2) + x,
          -Math.sin(((54 + i * 72) / 180) * Math.PI) * (r / 2.2) + y
        );
      }
      ctx.closePath();
      ctx.fill();
    }

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.life -= 0.015; // Slightly slower fade for better visibility
        p.size *= 0.98;

        if (p.life <= 0 || p.size <= 0.2) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        
        // High glow effect
        ctx.shadowBlur = 10; 
        ctx.shadowColor = p.color;

        if (p.type === "emoji" && p.emoji) {
          // Emojis are slightly larger so you can actually see them
          ctx.font = `${p.size * 7}px serif`;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          ctx.fillText(p.emoji, 0, 0);
        } else if (p.type === "star") {
          drawStar(ctx, p.x, p.y, p.size * 2.2);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-9999"
    />
  );
}