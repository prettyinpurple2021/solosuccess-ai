'use client';

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

export default function HomePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', resize);

    // Particle configuration
    const particles: Particle[] = [];
    const particleCount = 60;
    const connectionDistance = 150;
    const mouseDistance = 200;

    const mouse = { x: null as number | null, y: null as number | null };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.x;
      mouse.y = e.y;
    };
    const handleMouseOut = () => {
      mouse.x = null;
      mouse.y = null;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
        this.color = Math.random() > 0.5 ? '#00f3ff' : '#bd00ff';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        if (mouse.x != null && mouse.y != null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouseDistance) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouseDistance - distance) / mouseDistance;
            const directionX = forceDirectionX * force * 0.5;
            const directionY = forceDirectionY * force * 0.5;
            this.vx -= directionX;
            this.vy -= directionY;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let animationId: number;
    function animate() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 243, 255, ${1 - distance / connectionDistance})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      animationId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="min-h-screen bg-cyber-black relative overflow-hidden">
      {/* Canvas Background */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full -z-10"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 0%, #020005 100%)',
        }}
      />

      {/* UI Overlay Lines */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-10 w-px h-full bg-gradient-to-b from-transparent via-cyber-dim to-transparent opacity-20"></div>
        <div className="absolute top-0 right-10 w-px h-full bg-gradient-to-b from-transparent via-cyber-dim to-transparent opacity-20"></div>
        <div className="absolute top-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyber-dim to-transparent opacity-20"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 bg-cyber-black/80 backdrop-blur-md border-b border-cyber-cyan/20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* CUSTOM "SS" SVG LOGO */}
            <svg
              viewBox="0 0 100 100"
              className="w-12 h-12 filter drop-shadow-[0_0_8px_rgba(0,243,255,0.6)]"
            >
              <defs>
                <linearGradient id="logo-grad-cyan" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#00f3ff', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#0088ff', stopOpacity: 1 }} />
                </linearGradient>
                <linearGradient id="logo-grad-purple" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#bd00ff', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#7000ff', stopOpacity: 1 }} />
                </linearGradient>
              </defs>

              {/* Outer Rotating Ring */}
              <g className="origin-center animate-spin-slow">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#333"
                  strokeWidth="1"
                  fill="none"
                  strokeDasharray="10 15"
                  opacity="0.8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="url(#logo-grad-cyan)"
                  strokeWidth="1"
                  fill="none"
                  strokeDasharray="20 70"
                  opacity="1"
                />
              </g>

              {/* Left S (Cyan) */}
              <path
                d="M50 30 L35 30 L30 40 L30 55 L45 55"
                stroke="url(#logo-grad-cyan)"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M30 55 L30 70 L45 70"
                stroke="url(#logo-grad-cyan)"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Right S (Purple) - Interlocked */}
              <path
                d="M50 70 L65 70 L70 60 L70 45 L55 45"
                stroke="url(#logo-grad-purple)"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M70 45 L70 30 L55 30"
                stroke="url(#logo-grad-purple)"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Circuit Nodes */}
              <circle cx="45" cy="70" r="3" fill="#fff" />
              <circle cx="55" cy="30" r="3" fill="#fff" />
            </svg>
            {/* END LOGO */}

            <div className="flex flex-col">
              <span className="font-sci font-bold text-xl tracking-widest text-white">
                SOLO<span className="text-cyber-cyan">SUCCESS</span>.AI
              </span>
              <span className="text-[10px] text-cyber-purple tracking-[0.3em] uppercase">
                System: Operational
              </span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm font-bold uppercase tracking-widest hover:text-cyber-cyan transition-colors text-gray-400"
            >
              Core_Functions
            </a>
            <a
              href="#deploy"
              className="text-sm font-bold uppercase tracking-widest hover:text-cyber-cyan transition-colors text-gray-400"
            >
              Initialize
            </a>
            <Link href="/signin">
              <button className="relative px-6 py-2 overflow-hidden group bg-transparent border border-cyber-purple/50">
                <span className="absolute w-0 h-full bg-cyber-purple left-0 top-0 transition-all duration-300 group-hover:w-full opacity-20"></span>
                <span className="font-sci text-xs font-bold text-cyber-purple tracking-widest group-hover:text-white relative z-10">
                  USER_LOGIN
                </span>
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 lg:min-h-screen flex items-center z-10">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Text */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-cyber-cyan/30 bg-cyber-cyan/5 rounded-none">
              <span className="w-1.5 h-1.5 bg-cyber-cyan rounded-full animate-ping"></span>
              <span className="text-xs font-bold tracking-widest text-cyber-cyan uppercase">
                Neural Link Established ⚡
              </span>
            </div>

            <h1
              className="font-sci text-5xl md:text-7xl font-bold leading-tight text-white glitch-text"
              data-text="YOUR AI CO-FOUNDER"
            >
              YOUR AI <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-white to-cyber-purple">
                CO-FOUNDER
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 max-w-lg border-l-2 border-cyber-purple pl-6">
              Upgrade your business infrastructure with autonomous intelligence. Automate your
              workflow, optimize your sector, and scale with algorithmic precision.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href="#deploy"
                className="group relative px-8 py-4 bg-cyber-cyan/10 border border-cyber-cyan overflow-hidden"
              >
                <div className="absolute inset-0 w-0 bg-cyber-cyan transition-all duration-[250ms] ease-out group-hover:w-full opacity-20"></div>
                <span className="relative font-sci font-bold tracking-widest text-cyber-cyan group-hover:text-white">
                  INITIALIZE_SYSTEM
                </span>
              </a>
              <a
                href="#features"
                className="group relative px-8 py-4 border border-gray-600 hover:border-cyber-purple overflow-hidden"
              >
                <span className="relative font-sci font-bold tracking-widest text-gray-300 group-hover:text-cyber-purple">
                  VIEW_ARCHITECTURE
                </span>
              </a>
            </div>

            <div className="flex items-center gap-8 pt-8 opacity-70">
              <div>
                <div className="text-2xl font-sci font-bold text-white">10k+</div>
                <div className="text-[10px] uppercase tracking-widest text-cyber-cyan">
                  Active Nodes
                </div>
              </div>
              <div>
                <div className="text-2xl font-sci font-bold text-white">500k+</div>
                <div className="text-[10px] uppercase tracking-widest text-cyber-cyan">
                  Tasks Executed
                </div>
              </div>
              <div>
                <div className="text-2xl font-sci font-bold text-white">99.9%</div>
                <div className="text-[10px] uppercase tracking-widest text-cyber-cyan">
                  System Uptime
                </div>
              </div>
            </div>
          </div>

          {/* Hero Graphic (3D HUD Element) */}
          <div className="relative hidden lg:block">
            {/* Outer Ring */}
            <div className="absolute inset-0 border border-dashed border-cyber-cyan/20 rounded-full animate-spin-slow"></div>
            {/* Inner Ring */}
            <div
              className="absolute inset-10 border border-cyber-purple/20 rounded-full animate-spin-slow"
              style={{ animationDirection: 'reverse' }}
            ></div>

            <div className="relative bg-cyber-dark/80 backdrop-blur-xl border border-cyber-cyan/30 p-1">
              {/* Decorative Corners */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyber-cyan"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyber-cyan"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyber-cyan"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyber-cyan"></div>

              {/* Inner Content */}
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="font-sci text-xs text-cyber-cyan">
                    OBJECTIVE: MARKET SINGULARITY
                  </span>
                  {/* SVG Mini Logo in Dashboard */}
                  <svg viewBox="0 0 100 100" className="w-6 h-6 animate-pulse">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#bd00ff"
                      strokeWidth="4"
                      fill="none"
                    />
                    <circle cx="50" cy="50" r="20" fill="#00f3ff" />
                  </svg>
                </div>

                {/* Progress Bars */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>MODULES_ACTIVE</span>
                      <span className="text-cyber-cyan">8/8 ONLINE</span>
                    </div>
                    <div className="h-1 bg-gray-800 w-full overflow-hidden">
                      <div className="h-full bg-cyber-cyan w-full shadow-[0_0_10px_#00f3ff]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>SCALE_VELOCITY</span>
                      <span className="text-cyber-purple">CALCULATING...</span>
                    </div>
                    <div className="h-1 bg-gray-800 w-full overflow-hidden">
                      <div className="h-full bg-cyber-purple w-2/3 animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {/* Data Grid */}
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="bg-cyber-cyan/5 p-3 border border-cyber-cyan/10">
                    <div className="text-[10px] text-gray-500">MODE</div>
                    <div className="font-sci text-sm">AUTONOMOUS</div>
                  </div>
                  <div className="bg-cyber-purple/5 p-3 border border-cyber-purple/10">
                    <div className="text-[10px] text-gray-500">ENCRYPTION</div>
                    <div className="font-sci text-sm text-cyber-purple">QUANTUM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of content continues... */}
      <div className="relative z-10">
        <div className="text-center py-20">
          <p className="text-gray-500 text-sm">
            © 2025 SoloSuccess AI. All rights reserved.
            <br />
            <span className="text-[10px] text-cyber-dim mt-2 block">
              ENCHANTED NIGHTMARE INDUSTRIES
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
