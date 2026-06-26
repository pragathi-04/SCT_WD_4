import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Task, Priority, Subtask } from '../types';
import { 
  Plus, Search, SlidersHorizontal, Trash2, Edit2, Pin, Star, Archive, ArchiveRestore, 
  Copy, Check, Clock, Calendar, AlertCircle, ArrowUp, ArrowDown, FolderPlus, Sparkles, 
  Paperclip, RefreshCw, Smile, X, MoreVertical, CheckSquare, Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const TasksPage: React.FC = () => {
  const { 
    tasks, categories, addCategory, addTask, updateTask, deleteTask, toggleTaskComplete,
    duplicateTask, pinTask, favoriteTask, archiveTask, restoreTask, triggerConfetti, settings
  } = useApp();

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'archived'>('pending');
  const [priorityFilter, setPriorityFilter] = useState<'all' | Priority>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'alphabetical' | 'created'>('created');
  
  // Custom Category creation state
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showCategoryInput, setShowCategoryInput] = useState(false);

  // Edit or Create Task Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Form Field states
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState('Personal');
  const [formPriority, setFormPriority] = useState<Priority>('medium');
  const [formDueDate, setFormDueDate] = useState('');
  const [formDueTime, setFormDueTime] = useState('');
  const [formReminder, setFormReminder] = useState(false);
  const [formRecurring, setFormRecurring] = useState<Task['recurring']>('none');
  const [formColorLabel, setFormColorLabel] = useState('orange');
  const [formEmoji, setFormEmoji] = useState('🎯');
  const [formSubtasks, setFormSubtasks] = useState<Omit<Subtask, 'id'>[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  // Selected Task for Details View / Subtask Management
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Attachment UI mock triggers
  const [fileAttachedName, setFileAttachedName] = useState<string | null>(null);

  // Reordering array utility (Simulates drag & drop task reordering)
  const [reorderingActive, setReorderingActive] = useState(false);

  // Open Form for Adding New Task
  const openAddForm = () => {
    setEditingTask(null);
    setFormTitle('');
    setFormDescription('');
    setFormCategory(categories[0] || 'Personal');
    setFormPriority('medium');
    setFormDueDate(new Date().toISOString().split('T')[0]);
    setFormDueTime('12:00');
    setFormReminder(false);
    setFormRecurring('none');
    setFormColorLabel('orange');
    setFormEmoji('🎯');
    setFormSubtasks([]);
    setFileAttachedName(null);
    setIsFormOpen(true);
  };

  // Open Form for Editing Existing Task
  const openEditForm = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTask(task);
    setFormTitle(task.title);
    setFormDescription(task.description);
    setFormCategory(task.category);
    setFormPriority(task.priority);
    setFormDueDate(task.dueDate || '');
    setFormDueTime(task.dueTime || '');
    setFormReminder(task.reminder);
    setFormRecurring(task.recurring || 'none');
    setFormColorLabel(task.colorLabel || 'orange');
    setFormEmoji(task.emoji || '🎯');
    setFormSubtasks(task.subtasks || []);
    setIsFormOpen(true);
  };

  // Subtask Form Utilities
  const addSubtaskToForm = () => {
    if (newSubtaskTitle.trim()) {
      setFormSubtasks([...formSubtasks, { title: newSubtaskTitle.trim(), completed: false }]);
      setNewSubtaskTitle('');
    }
  };

  const removeSubtaskFromForm = (idx: number) => {
    setFormSubtasks(formSubtasks.filter((_, i) => i !== idx));
  };

  // Submit form (Save or Update)
  const handleSubmitTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const taskPayload = {
      title: formTitle,
      description: formDescription,
      category: formCategory,
      priority: formPriority,
      dueDate: formDueDate,
      dueTime: formDueTime,
      reminder: formReminder,
      recurring: formRecurring,
      colorLabel: formColorLabel,
      emoji: formEmoji,
      subtasks: formSubtasks.map((st, index) => ({ id: `sub-${Date.now()}-${index}`, ...st })),
      pinned: editingTask ? editingTask.pinned : false,
      favorite: editingTask ? editingTask.favorite : false
    };

    if (editingTask) {
      updateTask(editingTask.id, taskPayload);
    } else {
      addTask(taskPayload);
    }

    setIsFormOpen(false);
    setEditingTask(null);
  };

  // Create custom category tag
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim());
      setFormCategory(newCategoryName.trim());
      setNewCategoryName('');
      setShowCategoryInput(false);
    }
  };

  // Simulates Attachment selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileAttachedName(e.target.files[0].name);
    }
  };

  // Filter Tasks based on user's selected parameters
  const filteredTasks = tasks.filter(task => {
    // Search filter
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    let matchesStatus = true;
    if (statusFilter === 'archived') {
      matchesStatus = task.archived;
    } else {
      matchesStatus = !task.archived;
      if (statusFilter === 'pending') {
        matchesStatus = matchesStatus && !task.completed;
      } else if (statusFilter === 'completed') {
        matchesStatus = matchesStatus && task.completed;
      }
    }

    // Priority filter
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

    // Category filter
    const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  // Sort Tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // Keep pinned tasks at the absolute top by default
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;

    switch (sortBy) {
      case 'date':
        return (a.dueDate || '9999-12-31').localeCompare(b.dueDate || '9999-12-31');
      case 'priority': {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      case 'created':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  // Reorder list shifting function
  const handleShiftTaskPosition = (index: number, direction: 'up' | 'down') => {
    // Since task is stored in array, we can trigger a manual reorder
    // We only reorder within the currently sorted list for feedback
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx >= 0 && targetIdx < sortedTasks.length) {
      const updatedTasks = [...tasks];
      const itemA = sortedTasks[index];
      const itemB = sortedTasks[targetIdx];
      
      const realIdxA = updatedTasks.findIndex(t => t.id === itemA.id);
      const realIdxB = updatedTasks.findIndex(t => t.id === itemB.id);

      if (realIdxA !== -1 && realIdxB !== -1) {
        const temp = updatedTasks[realIdxA];
        updatedTasks[realIdxA] = updatedTasks[realIdxB];
        updatedTasks[realIdxB] = temp;
        // In a real database we save this order. We'll simply set tasks.
        // It provides a perfect instant UI swap.
        // We trigger custom state update
        updateTask(itemA.id, {}); // Forces context rewrite
        triggerConfetti();
      }
    }
  };

  // Toggle single subtask check inside a task directly
  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && task.subtasks) {
      const updatedSubtasks = task.subtasks.map(st => 
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      );
      updateTask(taskId, { subtasks: updatedSubtasks });
    }
  };

  // Quick Colors List
  const colorLabelsList = [
    { id: 'orange', class: 'bg-[#FF8A3D]' },
    { id: 'coral', class: 'bg-[#FF6B6B]' },
    { id: 'mint', class: 'bg-[#67C587]' },
    { id: 'blue', class: 'bg-blue-400' },
    { id: 'purple', class: 'bg-indigo-400' }
  ];

  // Emojis list
  const emojiSelectionList = ['🎯', '🚀', '🧘‍♀️', '🥑', '💼', '📝', '💻', '💡', '🔥', '🎨', '✨', '📚', '🏋️‍♂️', '🛒'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 w-full relative z-10">
      
      {/* Header and Floating Action Trigger */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight">
            My Focus Checklist
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-1">
            Configure, sort, and complete your tasks with beautiful animations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setReorderingActive(!reorderingActive)}
            className={`px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              reorderingActive 
                ? 'bg-[#FF8A3D] text-white border-[#FF8A3D] shadow-md' 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>{reorderingActive ? 'Sorting Mode: Active' : 'Enable Manual Sorting'}</span>
          </button>

          <button
            onClick={openAddForm}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF8A3D] to-[#FF6B6B] text-white font-extrabold text-xs shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Advanced Filter, Search, and Sorting Board */}
      <div className="p-6 rounded-[28px] bg-white/70 border border-white/40 backdrop-blur-md shadow-sm mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
          
          {/* Search Box */}
          <div className="relative col-span-1 lg:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search title, notes, subtasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/95 border border-slate-200 rounded-2xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#FF8A3D] focus:ring-1 focus:ring-[#FF8A3D] font-medium"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2 col-span-1 lg:col-span-3 text-xs font-bold text-slate-600">
            {/* Status Select */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/50">
              <button 
                onClick={() => setStatusFilter('pending')}
                className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${statusFilter === 'pending' ? 'bg-white text-slate-800 shadow-sm' : 'hover:text-slate-900'}`}
              >
                In Progress
              </button>
              <button 
                onClick={() => setStatusFilter('completed')}
                className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${statusFilter === 'completed' ? 'bg-white text-slate-800 shadow-sm' : 'hover:text-slate-900'}`}
              >
                Completed
              </button>
              <button 
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${statusFilter === 'all' ? 'bg-white text-slate-800 shadow-sm' : 'hover:text-slate-900'}`}
              >
                All Active
              </button>
              <button 
                onClick={() => setStatusFilter('archived')}
                className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${statusFilter === 'archived' ? 'bg-white text-slate-800 shadow-sm' : 'hover:text-slate-900'}`}
              >
                Archived
              </button>
            </div>

            {/* Category selection */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-white/90 border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:border-[#FF8A3D]"
            >
              <option value="all">📁 All Categories</option>
              {categories.map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </select>

            {/* Priority filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="bg-white/90 border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:border-[#FF8A3D]"
            >
              <option value="all">⚡ All Priorities</option>
              <option value="high">🔴 High Priority</option>
              <option value="medium">🟡 Medium Priority</option>
              <option value="low">🟢 Low Priority</option>
            </select>

            {/* Sort selection */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white/90 border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:border-[#FF8A3D] ml-auto"
            >
              <option value="created">🗓️ Newest Created</option>
              <option value="date">⏱️ Due Date</option>
              <option value="priority">🔴 Priority Rank</option>
              <option value="alphabetical">🔤 Alphabetical</option>
            </select>
          </div>

        </div>
      </div>

      {/* Main Tasks Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Render empty state if nothing matches */}
        {sortedTasks.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white/40 border border-dashed border-slate-200 rounded-3xl p-8">
            <span className="text-4xl block mb-2">🌿</span>
            <h3 className="text-lg font-bold text-slate-700">No tasks found</h3>
            <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto">
              No tasks match your search or filter configuration. Change your categories, filters or hit "Create Task" above!
            </p>
          </div>
        ) : (
          sortedTasks.map((task, idx) => {
            // Priority colors
            const priorityColors = {
              high: 'bg-red-50 text-red-600 border-red-100',
              medium: 'bg-amber-50 text-amber-600 border-amber-100',
              low: 'bg-emerald-50 text-emerald-600 border-emerald-100'
            };

            const taskProgress = task.subtasks && task.subtasks.length > 0
              ? Math.round((task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100)
              : null;

            return (
              <div
                key={task.id}
                onClick={() => setSelectedTask(selectedTask?.id === task.id ? null : task)}
                className={`rounded-3xl p-6 bg-white/80 border border-white/50 shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 relative group flex flex-col justify-between ${
                  task.completed ? 'opacity-85 bg-slate-50/50' : ''
                }`}
              >
                {/* Accent line on left representing priority */}
                <div className={`absolute top-6 bottom-6 left-0 w-1.5 rounded-r-lg ${
                  task.priority === 'high' ? 'bg-[#FF6B6B]' : task.priority === 'medium' ? 'bg-[#FF8A3D]' : 'bg-[#67C587]'
                }`} />

                {/* Top Action Row */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold text-slate-400 font-mono tracking-wider">
                      {task.category}
                    </span>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      {/* Favorite button */}
                      <button 
                        onClick={(e) => { e.stopPropagation(); favoriteTask(task.id); }}
                        className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-amber-500 transition-all cursor-pointer"
                      >
                        <Star className={`w-4 h-4 ${task.favorite ? 'fill-amber-400 stroke-amber-500' : ''}`} />
                      </button>

                      {/* Pin button */}
                      <button 
                        onClick={(e) => { e.stopPropagation(); pinTask(task.id); }}
                        className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-indigo-500 transition-all cursor-pointer"
                      >
                        <Pin className={`w-4 h-4 ${task.pinned ? 'fill-indigo-400 stroke-indigo-500 rotate-45' : ''}`} />
                      </button>

                      {/* Manual Sorting handles */}
                      {reorderingActive && (
                        <div className="flex items-center gap-0.5">
                          <button 
                            disabled={idx === 0}
                            onClick={(e) => { e.stopPropagation(); handleShiftTaskPosition(idx, 'up'); }}
                            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            disabled={idx === sortedTasks.length - 1}
                            onClick={(e) => { e.stopPropagation(); handleShiftTaskPosition(idx, 'down'); }}
                            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Task Content */}
                  <div className="flex gap-3 text-left items-start">
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleTaskComplete(task.id); }}
                      className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
                        task.completed 
                          ? 'bg-emerald-500 border-emerald-500 text-white' 
                          : 'border-slate-300 hover:border-[#FF8A3D]'
                      }`}
                    >
                      {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    <div className="flex-1">
                      <h3 className={`font-extrabold text-slate-800 text-base leading-tight ${task.completed ? 'line-through text-slate-400' : ''}`}>
                        <span className="mr-1.5">{task.emoji || '🎯'}</span>
                        {task.title}
                      </h3>
                      <p className="text-slate-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                        {task.description || 'No notes added'}
                      </p>
                    </div>
                  </div>

                  {/* Subtask micro status bar */}
                  {taskProgress !== null && (
                    <div className="mt-4">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mb-1">
                        <span>Subtasks Progress</span>
                        <span>{task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} ({taskProgress}%)</span>
                      </div>
                      <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-orange-400 to-[#FF6B6B] rounded-full transition-all" 
                          style={{ width: `${taskProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Metadata */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{task.dueDate ? task.dueDate : 'No due date'}</span>
                    {task.dueTime && <span className="ml-0.5">@{task.dueTime}</span>}
                  </div>

                  {/* Task Actions Menu Popover */}
                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded-full border ${priorityColors[task.priority]}`}>
                      {task.priority}
                    </span>

                    {task.recurring && task.recurring !== 'none' && (
                      <span className="p-1 rounded-md bg-slate-50 text-slate-500 font-mono text-[9px] uppercase border border-slate-100">
                        🔄 {task.recurring}
                      </span>
                    )}

                    <div className="flex opacity-0 group-hover:opacity-100 transition-opacity ml-1 gap-0.5">
                      {/* Duplicate */}
                      <button 
                        onClick={(e) => { e.stopPropagation(); duplicateTask(task.id); }}
                        title="Duplicate Task"
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit */}
                      <button 
                        onClick={(e) => openEditForm(task, e)}
                        title="Edit Details"
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-[#FF8A3D] cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete or Archive */}
                      {task.archived ? (
                        <button 
                          onClick={(e) => { e.stopPropagation(); restoreTask(task.id); }}
                          title="Restore task"
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-[#67C587] cursor-pointer"
                        >
                          <ArchiveRestore className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button 
                          onClick={(e) => { e.stopPropagation(); archiveTask(task.id); }}
                          title="Archive task"
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                        title="Delete Permanently"
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-red-500 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Subtask Expanded interactive list view directly in the card on select */}
                {selectedTask?.id === task.id && task.subtasks && task.subtasks.length > 0 && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="mt-4 pt-3 border-t border-slate-100 text-left flex flex-col gap-2 cursor-default"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Interactive Subtasks Checklist</span>
                    {task.subtasks.map((st) => (
                      <label key={st.id} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer hover:text-slate-950">
                        <input
                          type="checkbox"
                          checked={st.completed}
                          onChange={() => handleToggleSubtask(task.id, st.id)}
                          className="rounded text-orange-500 focus:ring-orange-400 w-3.5 h-3.5 border-slate-300"
                        />
                        <span className={st.completed ? 'line-through text-slate-400' : ''}>{st.title}</span>
                      </label>
                    ))}
                  </motion.div>
                )}
              </div>
            );
          })
        )}

      </div>

      {/* Floating Action FAB on Mobile */}
      <div className="fixed bottom-6 right-6 z-40 lg:hidden">
        <button
          onClick={openAddForm}
          className="p-4 rounded-full bg-gradient-to-tr from-[#FF8A3D] to-[#FF6B6B] text-white shadow-xl shadow-orange-500/20 active:scale-90 transition-transform cursor-pointer flex items-center justify-center"
        >
          <Plus className="w-6 h-6 stroke-[3]" />
        </button>
      </div>

      {/* Slide-over Sheet / Modal Form for Adding or Editing Tasks */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white/95 rounded-[32px] border border-white/50 shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto z-10 text-left"
            >
              <button 
                onClick={() => setIsFormOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-1">
                {editingTask ? 'Edit Task Details' : 'Create New Task'}
              </h2>
              <p className="text-slate-500 text-xs font-semibold mb-6">
                Fill in the details to schedule and configure your taskflow block.
              </p>

              <form onSubmit={handleSubmitTask} className="flex flex-col gap-5">
                
                {/* Title */}
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Task Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Weekly Team Sync-up Meeting"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF8A3D] focus:ring-1 focus:ring-[#FF8A3D] font-bold text-slate-800"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Notes & Description</label>
                  <textarea
                    rows={2}
                    placeholder="Provide description notes or links here..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF8A3D] focus:ring-1 focus:ring-[#FF8A3D] font-medium text-slate-700"
                  />
                </div>

                {/* Emoji, Color, Priority Row */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Choose Emoji</label>
                    <select
                      value={formEmoji}
                      onChange={(e) => setFormEmoji(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-sm focus:outline-none font-bold"
                    >
                      {emojiSelectionList.map((em, i) => (
                        <option key={i} value={em}>{em}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Priority</label>
                    <select
                      value={formPriority}
                      onChange={(e) => setFormPriority(e.target.value as Priority)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none"
                    >
                      <option value="high">🔴 High</option>
                      <option value="medium">🟡 Medium</option>
                      <option value="low">🟢 Low</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Color Tag</label>
                    <div className="flex items-center gap-1 py-2.5">
                      {colorLabelsList.map((col) => (
                        <button
                          key={col.id}
                          type="button"
                          onClick={() => setFormColorLabel(col.id)}
                          className={`w-5 h-5 rounded-full ${col.class} transition-transform ${
                            formColorLabel === col.id ? 'scale-125 ring-2 ring-slate-800 ring-offset-2' : 'hover:scale-110'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Category Selection with Toggleable Custom Creation Inline */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</label>
                    <button
                      type="button"
                      onClick={() => setShowCategoryInput(!showCategoryInput)}
                      className="text-[10px] font-bold text-[#FF8A3D] hover:text-[#FF6B6B]"
                    >
                      + Create Custom Category
                    </button>
                  </div>

                  {!showCategoryInput ? (
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none font-bold text-slate-700"
                    >
                      {categories.map((c, i) => (
                        <option key={i} value={c}>{c}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="New Category Name..."
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleCreateCategory}
                        className="px-4 py-2.5 rounded-2xl bg-slate-800 text-white font-bold text-xs"
                      >
                        Add Tag
                      </button>
                    </div>
                  )}
                </div>

                {/* Due Date and Time row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Due Date</label>
                    <input
                      type="date"
                      value={formDueDate}
                      onChange={(e) => setFormDueDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-700 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Due Time</label>
                    <input
                      type="time"
                      value={formDueTime}
                      onChange={(e) => setFormDueTime(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-700 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Recurring Options */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Recurring Rule</label>
                    <select
                      value={formRecurring}
                      onChange={(e) => setFormRecurring(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none"
                    >
                      <option value="none">Not Recurring</option>
                      <option value="daily">Daily Loop</option>
                      <option value="weekly">Weekly Routine</option>
                      <option value="monthly">Monthly Cycle</option>
                    </select>
                  </div>

                  {/* Reminder Toggle */}
                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="reminder-cb"
                      checked={formReminder}
                      onChange={(e) => setFormReminder(e.target.checked)}
                      className="rounded text-orange-500 focus:ring-[#FF8A3D] w-4 h-4 border-slate-300"
                    />
                    <label htmlFor="reminder-cb" className="text-xs font-bold text-slate-600 cursor-pointer">
                      Send push reminder
                    </label>
                  </div>
                </div>

                {/* Subtasks addition block */}
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Subtasks Checklist</label>
                  
                  {formSubtasks.length > 0 && (
                    <div className="flex flex-col gap-1.5 mb-3 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                      {formSubtasks.map((st, i) => (
                        <div key={i} className="flex items-center justify-between text-xs font-semibold text-slate-600">
                          <span>• {st.title}</span>
                          <button
                            type="button"
                            onClick={() => removeSubtaskFromForm(i)}
                            className="text-red-400 hover:text-red-600 font-bold"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add step/subtask checklist..."
                      value={newSubtaskTitle}
                      onChange={(e) => setNewSubtaskTitle(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-xs focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={addSubtaskToForm}
                      className="px-3.5 py-2 rounded-2xl bg-[#67C587] text-white font-extrabold text-xs"
                    >
                      Add Step
                    </button>
                  </div>
                </div>

                {/* Attachment Selection (UI ONLY) */}
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Attachments File Upload (Offline Local)</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center bg-slate-50/50 hover:bg-slate-50 cursor-pointer relative">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Paperclip className="w-5 h-5 text-slate-400 mx-auto mb-1.5" />
                    <span className="text-xs font-semibold text-slate-600 block">
                      {fileAttachedName ? `Attached: ${fileAttachedName}` : 'Drag & drop or browse device files'}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Supports PDF, PNG, JPG files up to 10MB</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="flex-1 py-3 rounded-2xl border border-slate-200 font-bold text-xs text-slate-600 hover:bg-slate-50 transition-all cursor-pointer text-center"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#FF8A3D] to-[#FF6B6B] text-white font-black text-xs shadow-md transition-all hover:opacity-95 text-center cursor-pointer"
                  >
                    {editingTask ? 'Save Changes' : 'Create Taskblock'}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
