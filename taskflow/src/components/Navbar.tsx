import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Calendar, Settings, CheckSquare, Flame, TrendingUp, Info, Menu, X, Award, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, progress, settings } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'tasks', label: 'My Tasks', icon: CheckSquare },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: Award },
    { id: 'about', label: 'About', icon: Info },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const getThemeAccent = () => {
    switch (settings.themeColor) {
      case 'peach': return 'text-[#FF8A3D] bg-[#FF8A3D]/10 hover:bg-[#FF8A3D]/20';
      case 'pink': return 'text-[#FF6B6B] bg-[#FF6B6B]/10 hover:bg-[#FF6B6B]/20';
      case 'mint': return 'text-[#67C587] bg-[#67C587]/10 hover:bg-[#67C587]/20';
      default: return 'text-[#FF8A3D] bg-[#FF8A3D]/10 hover:bg-[#FF8A3D]/20';
    }
  };

  const getThemeBorder = (id: string) => {
    if (activeTab !== id) return 'border-transparent';
    switch (settings.themeColor) {
      case 'peach': return 'border-[#FF8A3D] text-[#FF8A3D] font-semibold';
      case 'pink': return 'border-[#FF6B6B] text-[#FF6B6B] font-semibold';
      case 'mint': return 'border-[#67C587] text-[#67C587] font-semibold';
      default: return 'border-[#FF8A3D] text-[#FF8A3D] font-semibold';
    }
  };

  const getThemeText = () => {
    switch (settings.themeColor) {
      case 'peach': return 'text-[#FF8A3D]';
      case 'pink': return 'text-[#FF6B6B]';
      case 'mint': return 'text-[#67C587]';
      default: return 'text-[#FF8A3D]';
    }
  };

  return (
    <nav className="sticky top-0 z-50 px-4 py-3 md:px-8 max-w-7xl mx-auto w-full">
      <div className="backdrop-blur-md bg-white/70 border border-white/40 shadow-sm rounded-3xl px-4 py-3 md:px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <button 
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-2 font-bold text-lg md:text-xl tracking-tight cursor-pointer"
        >
          <div className="p-2 rounded-2xl bg-gradient-to-tr from-[#FF8A3D] to-[#FF6B6B] text-white shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="bg-gradient-to-r from-slate-800 to-slate-900 bg-clip-text text-transparent font-extrabold">TaskFlow</span>
        </button>

        {/* Desktop Nav Items */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-sm font-medium transition-all duration-200 border-b-2 cursor-pointer ${
                  activeTab === item.id 
                    ? `bg-white shadow-sm border-slate-200 ${getThemeText()}` 
                    : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-50/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* User Stats / Gamification Pills */}
        <div className="hidden md:flex items-center gap-3">
          {/* Streak Indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-orange-50 border border-orange-100 text-orange-600 font-bold text-sm shadow-sm animate-bounce" style={{ animationDuration: '3s' }}>
            <Flame className="w-4 h-4 fill-orange-500 stroke-orange-600" />
            <span>{progress.streak} Day{progress.streak !== 1 ? 's' : ''}</span>
          </div>

          {/* Level Progress Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm">
            <span className="text-xs font-semibold text-slate-500">LVL {progress.level}</span>
            <div className="w-16 h-2 rounded-full bg-slate-200 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500" 
                style={{ width: `${(progress.xp / (progress.level * 100)) * 100}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-slate-600 font-mono">{progress.xp}/{progress.level * 100}XP</span>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden items-center gap-2">
          {/* Streak Indicator (visible on mobile too for fun!) */}
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-orange-50 border border-orange-100 text-orange-600 font-extrabold text-xs">
            <Flame className="w-3.5 h-3.5 fill-orange-500 stroke-orange-600" />
            <span>{progress.streak}d</span>
          </div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute left-4 right-4 mt-2 z-50 backdrop-blur-lg bg-white/95 border border-white/40 shadow-xl rounded-3xl p-4 flex flex-col gap-2"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-left text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    activeTab === item.id
                      ? `${getThemeAccent()}`
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Mobile Level progress */}
            <div className="mt-2 pt-3 border-t border-slate-100 flex flex-col gap-2 px-1">
              <div className="flex justify-between text-xs font-bold text-slate-500">
                <span>Level {progress.level} Progress</span>
                <span className="font-mono">{progress.xp} / {progress.level * 100} XP</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden border border-slate-200/50">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full" 
                  style={{ width: `${(progress.xp / (progress.level * 100)) * 100}%` }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
