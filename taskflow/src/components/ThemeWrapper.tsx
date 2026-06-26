import React from 'react';
import { useApp } from '../context/AppContext';

export const ThemeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useApp();

  // Color Mapping based on theme settings with full linear-gradient frosted base layers
  const themeMap = {
    warm: {
      bg: 'bg-transparent',
      accent: 'text-[#FF8A3D]',
      accentBg: 'bg-[#FF8A3D]/10',
      gradient: 'linear-gradient(135deg, #FFFDF8 0%, #FFE7D6 40%, #FFEFF5 70%, #EAFBF2 100%)',
      blob1: '#FFE7D6',
      blob2: '#FFEFF5'
    },
    peach: {
      bg: 'bg-transparent',
      accent: 'text-[#FF8A3D]',
      accentBg: 'bg-[#FF8A3D]/10',
      gradient: 'linear-gradient(135deg, #FFFDF8 0%, #FFE7D6 45%, #FFEFF5 75%, #FFE7D6 100%)',
      blob1: '#FFE7D6',
      blob2: '#FFEFF5'
    },
    pink: {
      bg: 'bg-transparent',
      accent: 'text-[#FF6B6B]',
      accentBg: 'bg-[#FF6B6B]/10',
      gradient: 'linear-gradient(135deg, #FFFDF8 0%, #FFEFF5 40%, #FFE7D6 70%, #FFEFF5 100%)',
      blob1: '#FFEFF5',
      blob2: '#FFE7D6'
    },
    mint: {
      bg: 'bg-transparent',
      accent: 'text-[#67C587]',
      accentBg: 'bg-[#67C587]/10',
      gradient: 'linear-gradient(135deg, #FFFDF8 0%, #EAFBF2 40%, #FFE7D6 70%, #EAFBF2 100%)',
      blob1: '#EAFBF2',
      blob2: '#FFE7D6'
    }
  };

  const currentTheme = themeMap[settings.themeColor] || themeMap.warm;

  return (
    <div 
      className="min-h-screen relative overflow-x-hidden font-sans transition-all duration-500 pb-16 md:pb-8"
      style={{ background: currentTheme.gradient }}
    >
      {/* Animated gradient backdrop blobs for realistic glass depth */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full filter blur-[120px] animate-pulse duration-10000 pointer-events-none z-0 transition-all duration-500" 
        style={{ backgroundColor: currentTheme.blob1 }} 
      />
      <div 
        className="absolute bottom-[10%] right-[-10%] w-[45vw] h-[45vw] rounded-full filter blur-[120px] animate-pulse duration-8000 pointer-events-none z-0 transition-all duration-500" 
        style={{ backgroundColor: currentTheme.blob2 }} 
      />
      
      {/* Content Layer */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
