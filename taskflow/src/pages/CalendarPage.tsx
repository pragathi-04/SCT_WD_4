import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Task } from '../types';
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, AlertCircle, 
  Sparkles, Check, CheckSquare, ListTodo, Pin, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CalendarPage: React.FC = () => {
  const { tasks, toggleTaskComplete } = useApp();
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  
  // Date states
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Month names
  const monthsList = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Calculations for Dynamic Monthly Grid
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // Day of week index (0 - 6)

  // Get previous month padding days
  const prevMonthDays = new Date(year, month, 0).getDate();
  const prevMonthPadding = Array.from({ length: firstDayIndex }, (_, i) => {
    return {
      day: prevMonthDays - firstDayIndex + i + 1,
      isCurrentMonth: false,
      monthOffset: -1
    };
  });

  // Current month days
  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => {
    return {
      day: i + 1,
      isCurrentMonth: true,
      monthOffset: 0
    };
  });

  // Combined calendar items (cells)
  const totalCellsNeeded = 42; // standard 6-row grid
  const nextMonthPaddingLength = totalCellsNeeded - (prevMonthPadding.length + currentMonthDays.length);
  const nextMonthPadding = Array.from({ length: nextMonthPaddingLength }, (_, i) => {
    return {
      day: i + 1,
      isCurrentMonth: false,
      monthOffset: 1
    };
  });

  const calendarDaysCells = [...prevMonthPadding, ...currentMonthDays, ...nextMonthPadding];

  // Helper to format Date string from cell
  const getCellDateString = (day: number, monthOffset: number) => {
    const targetDate = new Date(year, month + monthOffset, day);
    // Correct local date parsing to match YYYY-MM-DD
    const y = targetDate.getFullYear();
    const m = String(targetDate.getMonth() + 1).padStart(2, '0');
    const d = String(targetDate.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // Get tasks matching specific date
  const getTasksForDate = (dateStr: string) => {
    return tasks.filter(t => !t.archived && t.dueDate === dateStr);
  };

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Selected date's active tasks
  const selectedDateTasks = getTasksForDate(selectedDateStr);

  // Stats calculation
  const todayStr = new Date().toISOString().split('T')[0];
  const overdueTasks = tasks.filter(t => !t.completed && !t.archived && t.dueDate && t.dueDate < todayStr);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 w-full relative z-10 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-8 h-8 text-[#FF8A3D]" />
            <span>Interactive Calendar</span>
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-1">
            Browse tasks, highlight upcoming reminders, and organize schedules dynamically.
          </p>
        </div>

        {/* View Switcher Controls */}
        <div className="flex bg-white/75 p-1 rounded-2xl border border-slate-200/50 shadow-sm max-w-fit">
          <button
            onClick={() => setViewMode('month')}
            className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              viewMode === 'month' ? 'bg-[#FF8A3D] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Monthly View
          </button>
          <button
            onClick={() => {
              setViewMode('week');
              // Set selected to today for week view simulation
              setSelectedDateStr(todayStr);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              viewMode === 'week' ? 'bg-[#FF8A3D] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Weekly View
          </button>
          <button
            onClick={() => {
              setViewMode('day');
              setSelectedDateStr(todayStr);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              viewMode === 'day' ? 'bg-[#FF8A3D] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Daily Checklist
          </button>
        </div>
      </div>

      {/* Main Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Calendar Grid Frame */}
        <div className="lg:col-span-2 p-6 md:p-8 rounded-[32px] bg-white/75 border border-white/50 shadow-sm flex flex-col justify-between">
          
          {/* Calendar Controller Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-800">
                {monthsList[month]} {year}
              </h2>
              <p className="text-slate-400 text-xs mt-0.5 font-semibold">
                Click on any square cell to pull its scheduled item tasks.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={handlePrevMonth}
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/40 text-slate-600 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setCurrentDate(new Date())}
                className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/40 text-xs font-bold text-slate-600 cursor-pointer"
              >
                Today
              </button>
              <button 
                onClick={handleNextMonth}
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/40 text-slate-600 cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Render Calendar based on View Mode */}
          {viewMode === 'month' && (
            <div>
              {/* Day Labels */}
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>

              {/* Monthly grid */}
              <div className="grid grid-cols-7 gap-2">
                {calendarDaysCells.map((cell, idx) => {
                  const dateStr = getCellDateString(cell.day, cell.monthOffset);
                  const dayTasks = getTasksForDate(dateStr);
                  const isSelected = dateStr === selectedDateStr;
                  const isToday = dateStr === todayStr;

                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedDateStr(dateStr)}
                      className={`min-h-[75px] p-2 rounded-2xl border flex flex-col justify-between transition-all cursor-pointer ${
                        isSelected 
                          ? 'border-[#FF8A3D] bg-orange-50/10 shadow-sm ring-1 ring-[#FF8A3D]' 
                          : isToday 
                            ? 'border-indigo-200 bg-indigo-50/20 shadow-sm'
                            : cell.isCurrentMonth
                              ? 'border-slate-100 bg-white/40 hover:bg-white/90'
                              : 'border-slate-50 bg-slate-50/20 text-slate-300 opacity-50'
                      }`}
                    >
                      <span className={`text-xs font-bold ${
                        isToday ? 'text-indigo-600 font-extrabold' : cell.isCurrentMonth ? 'text-slate-800' : 'text-slate-400'
                      }`}>
                        {cell.day}
                      </span>

                      {/* Render micro indicators for daily tasks */}
                      {dayTasks.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {dayTasks.slice(0, 3).map((task) => {
                            let priorityDot = 'bg-slate-400';
                            if (task.priority === 'high') priorityDot = 'bg-[#FF6B6B]';
                            else if (task.priority === 'medium') priorityDot = 'bg-[#FF8A3D]';
                            else if (task.priority === 'low') priorityDot = 'bg-[#67C587]';

                            return (
                              <span 
                                key={task.id} 
                                title={task.title}
                                className={`w-2 h-2 rounded-full ${priorityDot} ${task.completed ? 'opacity-40 line-through' : ''}`} 
                              />
                            );
                          })}
                          {dayTasks.length > 3 && (
                            <span className="text-[8px] font-black text-[#FF8A3D] mt-[-2px]">+{dayTasks.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {viewMode === 'week' && (
            <div className="flex flex-col gap-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">7-Day Weekly Planner Rollout</span>
              <div className="grid grid-cols-7 gap-3 text-center">
                {Array.from({ length: 7 }).map((_, offset) => {
                  // Generate weekly dates from currentDate
                  const d = new Date(currentDate);
                  const distance = offset - d.getDay();
                  d.setDate(d.getDate() + distance);
                  
                  const dateStr = d.toISOString().split('T')[0];
                  const dayTasks = getTasksForDate(dateStr);
                  const isSelected = dateStr === selectedDateStr;
                  const isToday = dateStr === todayStr;

                  return (
                    <button
                      key={offset}
                      onClick={() => setSelectedDateStr(dateStr)}
                      className={`p-3 rounded-2xl border flex flex-col items-center justify-between gap-2 transition-all cursor-pointer ${
                        isSelected 
                          ? 'border-[#FF8A3D] bg-orange-50/20 shadow-md ring-1 ring-[#FF8A3D]' 
                          : isToday 
                            ? 'border-indigo-300 bg-indigo-50/30' 
                            : 'border-slate-100 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {d.toLocaleDateString([], { weekday: 'short' })}
                      </span>
                      <span className={`text-base font-black ${isToday ? 'text-indigo-600' : 'text-slate-800'}`}>
                        {d.getDate()}
                      </span>
                      <span className="text-[10px] font-extrabold text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded-lg border border-slate-100/50">
                        {dayTasks.length} T
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Tasks layout in week selection */}
              <div className="mt-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase block mb-3">Tasks on selected week date</span>
                {selectedDateTasks.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No tasks scheduled for {selectedDateStr}.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {selectedDateTasks.map(t => (
                      <div key={t.id} className="p-2.5 rounded-xl bg-white border border-slate-100 flex items-center justify-between text-xs font-semibold">
                        <span>{t.emoji} {t.title}</span>
                        <span className="text-[10px] text-slate-400">{t.dueTime || 'All day'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {viewMode === 'day' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl font-black text-slate-800">
                  Daily Timeline Tracker
                </span>
                <span className="px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold">
                  {selectedDateStr}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {selectedDateTasks.length === 0 ? (
                  <div className="py-12 text-center bg-slate-50/40 rounded-2xl border border-dashed border-slate-200">
                    <span className="text-3xl block mb-2">⛳</span>
                    <p className="text-slate-500 font-bold text-sm">No tasks listed for today</p>
                    <p className="text-slate-400 text-xs mt-0.5">Use My Tasks panel to populate schedule.</p>
                  </div>
                ) : (
                  selectedDateTasks.map(t => (
                    <div key={t.id} className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{t.emoji}</span>
                        <div>
                          <h4 className={`text-sm font-bold text-slate-700 ${t.completed ? 'line-through text-slate-400' : ''}`}>{t.title}</h4>
                          <span className="text-[10px] text-slate-400">⏱️ Scheduled: {t.dueTime || 'All day'}</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full border text-[10px] font-bold bg-slate-50 uppercase">{t.category}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>

        {/* Right Pane Checklist details panel */}
        <div className="flex flex-col gap-8">
          
          {/* Active Date schedule view details */}
          <div className="p-6 rounded-[32px] bg-white/70 border border-white/40 shadow-sm">
            <div className="mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
              <div className="p-2 rounded-xl bg-orange-50 text-[#FF8A3D]">
                <ListTodo className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 text-base">Checklist on {selectedDateStr}</h3>
                <p className="text-slate-400 text-[11px] font-semibold">Scheduled items count: {selectedDateTasks.length}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
              {selectedDateTasks.length === 0 ? (
                <div className="py-12 text-center">
                  <span className="text-3xl block mb-1">📅</span>
                  <p className="text-slate-500 font-bold text-xs">No Scheduled Tasks</p>
                  <p className="text-slate-400 text-[10px] mt-0.5">Perfect day for relaxing or self care!</p>
                </div>
              ) : (
                selectedDateTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className={`p-3 rounded-2xl border flex items-center justify-between gap-3 bg-white ${
                      task.completed ? 'border-emerald-100 bg-emerald-50/10 opacity-75' : 'border-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 text-left">
                      <button
                        onClick={() => toggleTaskComplete(task.id)}
                        className={`w-4 h-4 rounded-full border flex items-center justify-center cursor-pointer transition-all ${
                          task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'
                        }`}
                      >
                        {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                      </button>
                      <div>
                        <h4 className={`text-xs font-bold text-slate-700 ${task.completed ? 'line-through text-slate-400' : ''}`}>
                          {task.title}
                        </h4>
                        <span className="text-[9px] text-slate-400 font-bold block mt-0.5">
                          Category: {task.category} • {task.dueTime || 'All Day'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Overdue Items Alert Panel */}
          {overdueTasks.length > 0 && (
            <div className="p-6 rounded-[32px] bg-red-50/30 border border-red-100 shadow-sm">
              <div className="flex items-center gap-2 text-red-600 font-extrabold text-sm mb-3">
                <AlertCircle className="w-5 h-5 animate-pulse" />
                <span>Overdue Alert ({overdueTasks.length})</span>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed mb-4 font-medium">
                You have {overdueTasks.length} uncompleted tasks that are past their due date. We recommend updating their dates inside the "My Tasks" board.
              </p>

              <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto">
                {overdueTasks.slice(0, 3).map((task) => (
                  <div key={task.id} className="p-2 rounded-xl bg-white border border-red-100 flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="truncate flex items-center gap-1">
                      <span>{task.emoji}</span>
                      <span>{task.title}</span>
                    </span>
                    <span className="text-[10px] text-red-500 whitespace-nowrap bg-red-50 px-1.5 py-0.5 rounded-md font-bold">
                      {task.dueDate}
                    </span>
                  </div>
                ))}
                {overdueTasks.length > 3 && (
                  <span className="text-[10px] text-slate-400 font-extrabold text-center block mt-1">
                    + {overdueTasks.length - 3} more overdue items
                  </span>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
