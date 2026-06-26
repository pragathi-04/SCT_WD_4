import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CheckSquare, Calendar, Star, Clock, AlertCircle, Sparkles, LogIn, ChevronRight, Award, Flame, Quote as QuoteIcon, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

export const Dashboard: React.FC = () => {
  const { tasks, logs, progress, quotes, setActiveTab } = useApp();
  const [greeting, setGreeting] = useState('Welcome back');
  const [currentQuote, setCurrentQuote] = useState({ text: '', author: '' });

  // Custom User Profile name from additional metadata
  const userName = 'Pragathi';
  const userEmail = 'gpragathi04@gmail.com';

  // Dynamic time-based greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 5) setGreeting('Good quiet night');
    else if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  // Set random quote on mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setCurrentQuote(quotes[randomIndex]);
  }, [quotes]);

  const cycleQuote = () => {
    const currentIndex = quotes.findIndex(q => q.text === currentQuote.text);
    const nextIndex = (currentIndex + 1) % quotes.length;
    setCurrentQuote(quotes[nextIndex]);
  };

  const getTodayDateString = () => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  // Stats Calculations
  const nonArchivedTasks = tasks.filter(t => !t.archived);
  const totalTasksCount = nonArchivedTasks.length;
  const completedTasksCount = nonArchivedTasks.filter(t => t.completed).length;
  const pendingTasksCount = nonArchivedTasks.filter(t => !t.completed).length;

  // Overdue calculation
  const todayStr = new Date().toISOString().split('T')[0];
  const overdueTasksCount = nonArchivedTasks.filter(t => !t.completed && t.dueDate && t.dueDate < todayStr).length;

  // Pin / Favorite count
  const pinnedTasksCount = nonArchivedTasks.filter(t => t.pinned).length;
  const favoriteTasksCount = nonArchivedTasks.filter(t => t.favorite).length;

  // Completed percentage
  const completionPercentage = totalTasksCount > 0 
    ? Math.round((completedTasksCount / totalTasksCount) * 100) 
    : 0;

  // Tasks due today
  const todayTasks = nonArchivedTasks.filter(t => t.dueDate === todayStr);
  const todayCompletedCount = todayTasks.filter(t => t.completed).length;
  const todayPendingTasks = todayTasks.filter(t => !t.completed);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 w-full animate-fade-in relative z-10">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-[#FF8A3D] uppercase tracking-widest block mb-1">
            {getTodayDateString()}
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <span>{greeting}, {userName}!</span>
            <span className="animate-wiggle inline-block">👋</span>
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#67C587]" />
            Account: <span className="font-semibold text-slate-600">{userEmail}</span>
          </p>
        </div>

        {/* Level Banner Card */}
        <div className="p-4 rounded-2xl bg-white/60 border border-white/40 backdrop-blur-md shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#FF8A3D] to-[#FF6B6B] text-white flex items-center justify-center font-black text-lg shadow-md">
            L{progress.level}
          </div>
          <div>
            <div className="flex justify-between items-center text-xs font-bold text-slate-500 mb-1 gap-4">
              <span>PRO LEVEL Progress</span>
              <span>{progress.xp} / {progress.level * 100} XP</span>
            </div>
            <div className="w-40 h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200/40">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 to-[#FF8A3D] rounded-full transition-all duration-500" 
                style={{ width: `${(progress.xp / (progress.level * 100)) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Summary Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {/* Metric 1 */}
        <div className="p-5 rounded-3xl bg-white/70 border border-white/40 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Tasks</span>
            <div className="p-2 rounded-xl bg-orange-50 text-[#FF8A3D]">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-extrabold text-slate-800">{totalTasksCount}</span>
          <p className="text-[11px] text-slate-500 mt-1">{pendingTasksCount} remaining to check off</p>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-3xl bg-white/70 border border-white/40 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-[#67C587]">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-extrabold text-slate-800">{completedTasksCount}</span>
          <p className="text-[11px] text-slate-500 mt-1">{completionPercentage}% of target achieved</p>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-3xl bg-white/70 border border-white/40 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Today</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-500">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-extrabold text-slate-800">{todayPendingTasks.length}</span>
          <p className="text-[11px] text-slate-500 mt-1">{todayCompletedCount} of {todayTasks.length} done today</p>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-3xl bg-white/70 border border-white/40 shadow-sm hover:shadow-md border-red-100 bg-red-50/5 hover:bg-red-50/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider text-red-500">Overdue Tasks</span>
            <div className="p-2 rounded-xl bg-red-50 text-red-500">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-extrabold text-red-500">{overdueTasksCount}</span>
          <p className="text-[11px] text-slate-500 mt-1">Requires urgent rescheduling</p>
        </div>
      </div>

      {/* Main Core Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2-Column Section */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Circular Progress & Focus Area Combined Card */}
          <div className="p-6 md:p-8 rounded-[32px] bg-gradient-to-br from-white/90 via-white/80 to-white/70 border border-white/50 shadow-sm flex flex-col md:flex-row items-center gap-8">
            {/* SVG Progress Arc */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle 
                  cx="72" 
                  cy="72" 
                  r="60" 
                  stroke="#E2E8F0" 
                  strokeWidth="10" 
                  fill="transparent" 
                />
                <circle 
                  cx="72" 
                  cy="72" 
                  r="60" 
                  stroke="url(#gradientColor)" 
                  strokeWidth="10" 
                  fill="transparent" 
                  strokeDasharray={`${2 * Math.PI * 60}`}
                  strokeDashoffset={`${2 * Math.PI * 60 * (1 - completionPercentage / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="gradientColor" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF8A3D" />
                    <stop offset="100%" stopColor="#FF6B6B" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute text-center">
                <span className="text-3xl font-black text-slate-800">{completionPercentage}%</span>
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Completed</span>
              </div>
            </div>

            {/* Focus Action Description */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-xl text-xs font-bold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>STREAK ACTIVE</span>
              </div>
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 leading-tight mb-2">
                You are currently on a <span className="text-orange-500 font-black">{progress.streak}-Day streak</span>!
              </h2>
              <p className="text-slate-500 text-xs md:text-sm mb-4 leading-relaxed font-medium">
                Keep checking off high-priority items daily to level up your XP score and earn premium badges. Ready to inspect today's checklist?
              </p>
              <button 
                onClick={() => setActiveTab('tasks')}
                className="px-5 py-2.5 rounded-xl bg-[#FF8A3D] text-white text-xs font-bold shadow-md shadow-orange-500/10 hover:shadow-lg hover:bg-[#FF6B6B] transition-all inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>View Tasks List</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Today's Tasks List Highlights */}
          <div className="p-6 rounded-[32px] bg-white/70 border border-white/40 shadow-sm flex-1">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-800 text-lg">Today's Focus Items</h3>
                <p className="text-slate-400 text-xs mt-0.5">Directly schedule your day</p>
              </div>
              <button 
                onClick={() => setActiveTab('tasks')}
                className="text-xs font-bold text-[#FF8A3D] hover:text-[#FF6B6B] flex items-center gap-0.5 cursor-pointer"
              >
                <span>Manage all</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {todayTasks.length === 0 ? (
                <div className="py-8 text-center bg-white/30 rounded-2xl border border-dashed border-slate-200">
                  <span className="text-3xl block mb-2">🎈</span>
                  <p className="text-slate-500 font-semibold text-sm">No tasks scheduled for today!</p>
                  <p className="text-slate-400 text-xs mt-1">Take a deep breath or add a new focus item.</p>
                </div>
              ) : (
                todayTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 bg-white/80 transition-all ${
                      task.completed ? 'border-emerald-100 bg-emerald-50/10 opacity-75' : 'border-slate-100 hover:scale-[1.01]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{task.emoji || '🎯'}</span>
                      <div>
                        <h4 className={`text-sm font-bold text-slate-700 ${task.completed ? 'line-through text-slate-400' : ''}`}>
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            task.priority === 'high' ? 'bg-red-50 text-red-500' : task.priority === 'medium' ? 'bg-amber-50 text-amber-500' : 'bg-slate-50 text-slate-500'
                          }`}>
                            {task.priority}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold">
                            {task.dueTime ? `⏱️ ${task.dueTime}` : 'All day'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 rounded-xl bg-slate-50 border border-slate-100/60 text-[11px] font-bold text-slate-500">
                        {task.category}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Side Column */}
        <div className="flex flex-col gap-8">
          {/* Quote of the day widget */}
          <div className="p-6 rounded-[32px] bg-gradient-to-br from-orange-50 to-pink-50 border border-orange-100/50 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-xl bg-orange-100/60 text-[#FF8A3D]">
                  <QuoteIcon className="w-4 h-4 fill-[#FF8A3D]/20" />
                </div>
                <button 
                  onClick={cycleQuote}
                  className="text-[10px] font-bold text-slate-500 hover:text-orange-500 bg-white/60 hover:bg-white px-2 py-1 rounded-lg border border-slate-200/40 cursor-pointer transition-all"
                >
                  Refresh Quote
                </button>
              </div>
              <p className="text-slate-700 font-medium text-sm italic leading-relaxed mb-4">
                "{currentQuote.text}"
              </p>
            </div>
            <p className="text-right text-xs font-bold text-slate-500">
              — {currentQuote.author}
            </p>
          </div>

          {/* Recent Activity Log panel */}
          <div className="p-6 rounded-[32px] bg-white/70 border border-white/40 shadow-sm flex-1 flex flex-col">
            <div className="mb-4 pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-800 text-base">Recent Achievements & Logs</h3>
              <p className="text-slate-400 text-xs">Live updates of your work</p>
            </div>

            <div className="flex flex-col gap-3.5 overflow-y-auto max-h-[340px] flex-1 pr-1">
              {logs.length === 0 ? (
                <div className="my-auto text-center py-8">
                  <span className="text-2xl block mb-1">📋</span>
                  <p className="text-slate-400 text-xs font-semibold">No recent logs recorded yet</p>
                </div>
              ) : (
                logs.map((log) => {
                  let logEmoji = '📝';
                  if (log.type === 'complete') logEmoji = '✅';
                  else if (log.type === 'undo_complete') logEmoji = '🔄';
                  else if (log.type === 'badge_earned') logEmoji = '🏆';
                  else if (log.type === 'streak_increase') logEmoji = '🔥';
                  else if (log.type === 'delete') logEmoji = '🗑️';

                  return (
                    <div key={log.id} className="flex gap-3 text-left">
                      <span className="text-lg mt-0.5">{logEmoji}</span>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-700">
                          {log.taskTitle}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-slate-400 font-semibold">
                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {log.pointsEarned && (
                            <span className="text-[10px] font-bold text-orange-500">
                              +{log.pointsEarned} XP
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
