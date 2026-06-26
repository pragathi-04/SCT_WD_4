import React from 'react';
import { useApp } from '../context/AppContext';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export const NotFoundPage: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center relative z-10 animate-fade-in">
      <div className="p-4 bg-red-50 text-red-500 rounded-full w-fit mx-auto mb-6 border border-red-100">
        <AlertCircle className="w-12 h-12" />
      </div>

      <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">404 - Page Not Found</h1>
      <p className="text-slate-500 text-sm font-semibold mb-8 leading-relaxed">
        The task block or board path you are trying to view does not exist. Let's redirect you back to safety!
      </p>

      <button
        onClick={() => setActiveTab('landing')}
        className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm transition-all hover:scale-105 active:scale-95 cursor-pointer inline-flex items-center gap-2 shadow-md"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Home</span>
      </button>
    </div>
  );
};
