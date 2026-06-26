import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Code, Heart, ShieldCheck, Mail, Globe, Cpu, Github, Award } from 'lucide-react';
import { motion } from 'motion/react';

export const AboutPage: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 w-full relative z-10 animate-fade-in text-left">
      
      {/* Header */}
      <div className="text-center py-12">
        <div className="p-3 bg-gradient-to-tr from-[#FF8A3D] to-[#FF6B6B] text-white rounded-3xl w-fit mx-auto shadow-md mb-6 animate-pulse" style={{ animationDuration: '4s' }}>
          <Sparkles className="w-8 h-8" />
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-800 tracking-tight leading-none mb-3">
          About TaskFlow
        </h1>
        <p className="text-[#FF8A3D] font-extrabold text-sm md:text-base uppercase tracking-widest">
          "Plan Better. Work Smarter. Stay Organized."
        </p>
      </div>

      {/* Main pitch block */}
      <div className="p-6 md:p-10 rounded-[32px] bg-white/70 border border-white/50 shadow-sm mb-8 leading-relaxed">
        <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 mb-4">The Startup Mission</h2>
        <p className="text-slate-600 text-sm md:text-base mb-4 font-medium">
          TaskFlow was born out of a simple frustration: typical to-do lists are boring, dry, and feel like homework assignments. We believe that managing your daily schedule should be a beautiful, engaging, and motivating experience.
        </p>
        <p className="text-slate-600 text-sm md:text-base font-medium">
          By wrapping client-first data privacy in modern <strong>Glassmorphism styling</strong> and pairing it with a <strong>Gamification level engine</strong>, TaskFlow transforms dull checklists into an interactive progression system. Earning badges, building daily completion streaks, and seeing productivity charts in real-time gives users the healthy dopamine hit needed to accomplish complex startup goals.
        </p>
      </div>

      {/* Product architecture specs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        <div className="p-6 rounded-3xl bg-white/70 border border-white/40 shadow-sm">
          <div className="flex items-center gap-2.5 text-[#FF8A3D] font-bold text-base mb-3">
            <Cpu className="w-5 h-5" />
            <span>Modern Tech Stack Specs</span>
          </div>
          <ul className="text-slate-600 text-xs md:text-sm font-semibold flex flex-col gap-2.5">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A3D]" />
              <span>React v19 + Vite for ultra-fast loadtimes</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A3D]" />
              <span>Tailwind CSS for bright glassmorphic layouts</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A3D]" />
              <span>Framer Motion for beautiful floating entrances</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A3D]" />
              <span>HTML5 Local Storage for offline persistence</span>
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-3xl bg-white/70 border border-white/40 shadow-sm">
          <div className="flex items-center gap-2.5 text-[#67C587] font-bold text-base mb-3">
            <ShieldCheck className="w-5 h-5" />
            <span>Guaranteed Security & Core Values</span>
          </div>
          <ul className="text-slate-600 text-xs md:text-sm font-semibold flex flex-col gap-2.5">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#67C587]" />
              <span>Private-by-design (0 cookies, 0 server trackers)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#67C587]" />
              <span>Desktop-first responsive design parity</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#67C587]" />
              <span>Custom SVG data visualizations</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#67C587]" />
              <span>Clean reusable component structure</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Developer bio card */}
      <div className="p-6 md:p-8 rounded-[32px] bg-gradient-to-tr from-orange-500/10 via-pink-500/5 to-teal-500/10 border border-white/60">
        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <span className="text-5xl md:text-6xl p-4 bg-white/80 rounded-3xl shadow-sm border border-slate-100">👩‍💻</span>
          <div className="flex-1">
            <div className="flex flex-wrap justify-center md:justify-between items-center gap-2 mb-1">
              <h3 className="font-extrabold text-slate-800 text-lg md:text-xl">Pragathi — Senior Frontend Architect</h3>
              <span className="text-[10px] bg-slate-900 text-white font-extrabold px-2.5 py-1 rounded-full uppercase">
                Available for hire
              </span>
            </div>
            <p className="text-slate-500 text-xs font-semibold mb-4">
              Specialized in high-fidelity user interfaces, animations, and premium reactive dashboards.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-bold text-slate-600">
              <span className="flex items-center gap-1">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>gpragathi04@gmail.com</span>
              </span>
              <span className="flex items-center gap-1">
                <Globe className="w-4 h-4 text-slate-400" />
                <span>portfolio.dev/pragathi</span>
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
