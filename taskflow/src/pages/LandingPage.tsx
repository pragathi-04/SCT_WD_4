import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowRight, Zap, Target, Flame, Heart, ChevronDown, Check, ShieldCheck, Users, Code, Award } from 'lucide-react';
import { motion } from 'motion/react';

export const LandingPage: React.FC = () => {
  const { setActiveTab, triggerConfetti } = useApp();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const features = [
    {
      icon: Zap,
      title: 'Smart Gamification',
      description: 'Earn XP, level up, and unlock elegant achievements and badges as you check off your daily goals.',
      color: 'from-orange-400 to-amber-400'
    },
    {
      icon: Target,
      title: 'Glassmorphism Design',
      description: 'A beautiful, clean, light-theme interface designed with elegant blur effects and soft pastel accents.',
      color: 'from-pink-400 to-coral-400'
    },
    {
      icon: Flame,
      title: 'Streak & Habits Tracking',
      description: 'Maintain daily completion streaks. Cultivate healthy habits with recurring daily, weekly, and monthly tasks.',
      color: 'from-red-400 to-orange-500'
    },
    {
      icon: Award,
      title: 'Rich Productivity Analytics',
      description: 'Visualize your progress with custom weekly completion tracking, category distribution, and task density charts.',
      color: 'from-emerald-400 to-teal-400'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Jenkins',
      role: 'Lead Designer, Notion',
      quote: 'TaskFlow is an absolute masterpiece of minimalist UI. It combines utility with game-like dopamine hits better than any task manager I have ever used.',
      avatar: '👩‍💻'
    },
    {
      name: 'Marcus Vance',
      role: 'Product Engineer, Linear',
      quote: 'The level of craftsmanship in TaskFlow is spectacular. The glassmorphic cards, the micro-interactions, and the local-first speed are production-grade.',
      avatar: '👨‍💻'
    },
    {
      name: 'Elena Rostova',
      role: 'Productivity Architect',
      quote: 'TaskFlow matches the exact bright premium mood of Apple or Todoist. The streak engine and confetti complete an amazing UX.',
      avatar: '👩‍🎨'
    }
  ];

  const faqs = [
    {
      question: 'Is TaskFlow completely free to use?',
      answer: 'Yes! TaskFlow is a client-first, private-by-design task manager. All of your tasks, streaks, settings, and progress statistics are stored safely directly on your device via Local Storage.'
    },
    {
      question: 'How does the leveling and XP system work?',
      answer: 'Every time you add a task, you get 10 XP. Completing a task awards you additional XP depending on its priority (High: 30 XP, Medium: 20 XP, Low: 10 XP). Earning badges grants a huge 50 XP boost! Accumulating 100 XP levels you up.'
    },
    {
      question: 'Does it support reminders and recurring tasks?',
      answer: 'Absolutely. You can schedule tasks as daily, weekly, or monthly, set due times, toggle active reminders, pin important notes, and mark them as personal favorites.'
    },
    {
      question: 'Can I export or backup my tasks?',
      answer: 'Yes! Inside settings, you can export your entire database as a clean JSON file and import it anytime. You can also print your checklist or generate a PDF report.'
    }
  ];

  return (
    <div className="relative pt-6 md:pt-12 px-4 max-w-7xl mx-auto w-full">
      {/* Hero Section */}
      <div className="text-center relative py-16 md:py-24 z-10">
        {/* Top Feature Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100/60 border border-orange-200 text-orange-700 text-xs font-bold mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
          <span>GAMIFIED PRODUCTIVITY ENGINE</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-slate-800 tracking-tight leading-[1.1] mb-6 max-w-4xl mx-auto">
          Organize Your Life{' '}
          <span className="bg-gradient-to-r from-[#FF8A3D] via-[#FF6B6B] to-[#67C587] bg-clip-text text-transparent font-black block sm:inline">
            Beautifully
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
          Manage tasks, stay productive, and accomplish your goals effortlessly. Plan better, work smarter, and gamify your daily achievements.
        </p>

        {/* Hero CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <button
            onClick={() => {
              triggerConfetti();
              setActiveTab('tasks');
            }}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FF8A3D] to-[#FF6B6B] text-white font-extrabold text-base shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200 text-slate-700 font-extrabold text-base shadow-sm hover:bg-white hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Explore Dashboard</span>
            <span className="w-2 h-2 rounded-full bg-[#67C587] animate-ping" />
          </button>
        </div>

        {/* Floating Mockup Illustration */}
        <div className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden border border-white/60 bg-white/40 backdrop-blur-md shadow-2xl p-4 md:p-6 mb-12">
          <div className="flex items-center justify-between border-b border-white/30 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-red-400" />
              <span className="w-3.5 h-3.5 rounded-full bg-amber-400" />
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-400" />
              <span className="text-xs font-mono text-slate-500 ml-2">taskflow_dashboard_v1.0</span>
            </div>
            <div className="flex items-center gap-1 bg-white/60 px-3 py-1 rounded-full border border-slate-100 text-xs font-bold text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
              Local Storage Connected
            </div>
          </div>

          {/* Quick Mock Visual */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="p-4 rounded-2xl bg-white/80 border border-slate-100 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Weekly Focus</span>
              <span className="text-2xl font-black text-slate-700">92%</span>
              <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-400 to-amber-400 rounded-full" style={{ width: '92%' }} />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 border border-slate-100 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Streak Status</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-slate-700">7 Days</span>
                <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Productivity Master level active</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 border border-slate-100 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Active Badges</span>
              <div className="flex gap-1.5 mt-1.5">
                <span className="p-1 rounded-lg bg-orange-100 text-orange-600 text-xs font-bold">🎯 First Step</span>
                <span className="p-1 rounded-lg bg-amber-100 text-amber-600 text-xs font-bold">⚡ Fast Thinker</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Bento Grid */}
      <div className="py-16 border-t border-slate-200/40">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight">
            Features Tailored For Creators
          </h2>
          <p className="text-slate-600 mt-3 font-medium max-w-xl mx-auto text-sm md:text-base">
            Everything you need to organize your days beautifully with smooth micro-interactions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white/60 border border-white/40 backdrop-blur-md shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group"
              >
                <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${feat.color} text-white w-fit mb-5 shadow-md group-hover:rotate-6 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{feat.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-16 border-t border-slate-200/40">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight">Loved by Product Builders</h2>
          <p className="text-slate-600 mt-3 font-medium max-w-lg mx-auto text-sm">
            See why high-achievers use TaskFlow to plan their design reviews, standups, and routines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white/75 border border-white/40 shadow-sm flex flex-col justify-between"
            >
              <p className="text-slate-600 italic leading-relaxed text-sm">"{test.quote}"</p>
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100">
                <span className="text-2xl">{test.avatar}</span>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{test.name}</h4>
                  <p className="text-xs text-slate-500">{test.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="py-16 border-t border-slate-200/40 max-w-3xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">Frequently Asked Questions</h2>
          <p className="text-slate-600 mt-2 font-medium text-sm">All you need to know about TaskFlow workflow.</p>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-white/50 bg-white/50 backdrop-blur-md overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left font-bold text-slate-800 text-sm md:text-base cursor-pointer hover:bg-white/40"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-slate-600 text-xs md:text-sm leading-relaxed border-t border-white/20">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Trust Callout */}
      <div className="my-16 p-8 rounded-3xl bg-gradient-to-r from-orange-500/10 via-pink-500/5 to-teal-500/10 border border-white/60 text-center max-w-4xl mx-auto">
        <h3 className="text-xl md:text-2xl font-extrabold text-slate-800 mb-2">Ready to master your schedule?</h3>
        <p className="text-slate-600 text-xs md:text-sm max-w-lg mx-auto mb-6 font-medium">
          Set your custom categories, build daily streaks, and stay motivated with beautiful badges and sound celebrations.
        </p>
        <button
          onClick={() => setActiveTab('tasks')}
          className="px-6 py-3 rounded-xl bg-slate-950 text-white hover:bg-slate-800 text-sm font-extrabold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md"
        >
          Create Your First Task
        </button>
      </div>

      {/* Elegant Footer */}
      <footer className="border-t border-slate-200/50 pt-12 pb-6 mt-12 text-slate-500 text-center">
        <div className="flex justify-center items-center gap-2 text-slate-700 font-bold text-lg mb-4">
          <span className="p-1.5 rounded-xl bg-orange-100 text-orange-600">
            <Sparkles className="w-4 h-4" />
          </span>
          <span>TaskFlow</span>
        </div>
        <p className="text-xs max-w-md mx-auto mb-6 leading-relaxed">
          The ultimate productivity companion designed with modern Glassmorphism aesthetics and premium micro-interactions. Plan better, work smarter.
        </p>
        <div className="flex justify-center gap-6 text-xs font-bold text-slate-600 mb-8">
          <button onClick={() => setActiveTab('dashboard')} className="hover:text-orange-500">Dashboard</button>
          <button onClick={() => setActiveTab('tasks')} className="hover:text-orange-500">Tasks</button>
          <button onClick={() => setActiveTab('calendar')} className="hover:text-orange-500">Calendar</button>
          <button onClick={() => setActiveTab('settings')} className="hover:text-orange-500">Settings</button>
        </div>
        <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
          Made with <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" /> for recruiters and creators everywhere. © {new Date().getFullYear()} TaskFlow Corp.
        </p>
      </footer>
    </div>
  );
};
