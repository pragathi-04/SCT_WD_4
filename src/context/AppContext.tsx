import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, ActivityLog, UserSettings, UserProgress, Badge, Quote } from '../types';
import confetti from 'canvas-confetti';

interface AppContextProps {
  tasks: Task[];
  logs: ActivityLog[];
  settings: UserSettings;
  progress: UserProgress;
  badges: Badge[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  addTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'completed' | 'archived'>) => void;
  updateTask: (taskId: string, updated: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  toggleTaskComplete: (taskId: string) => void;
  duplicateTask: (taskId: string) => void;
  pinTask: (taskId: string) => void;
  favoriteTask: (taskId: string) => void;
  archiveTask: (taskId: string) => void;
  restoreTask: (taskId: string) => void;
  resetAllData: () => void;
  addXP: (amount: number) => void;
  importTasks: (tasksList: Task[]) => void;
  exportTasks: () => void;
  triggerConfetti: () => void;
  updateSettings: (newSettings: UserSettings) => void;
  categories: string[];
  addCategory: (category: string) => void;
  deleteCategory: (category: string) => void;
  quotes: Quote[];
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

const SEED_TASKS: Task[] = [
  {
    id: 'seed-1',
    title: 'Welcome to TaskFlow! 🎯',
    description: 'Explore the dashboard, check out your analytics, and customize your theme in settings! Add a new task to earn your first badge.',
    category: 'Personal',
    priority: 'high',
    completed: false,
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '09:00',
    reminder: true,
    recurring: 'none',
    colorLabel: 'coral',
    emoji: '✨',
    subtasks: [
      { id: 'sub-1', title: 'Complete this onboarding task', completed: false },
      { id: 'sub-2', title: 'Customize TaskFlow theme in Settings', completed: false },
      { id: 'sub-3', title: 'Earn 100 XP to level up!', completed: false }
    ],
    pinned: true,
    favorite: true,
    archived: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'seed-2',
    title: 'Daily Mindfulness Meditation 🧘‍♀️',
    description: 'Take 10 minutes to sit comfortably, breathe, and focus on the present moment. Great for clarity and starting the day right!',
    category: 'Fitness',
    priority: 'medium',
    completed: true,
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '07:30',
    reminder: false,
    recurring: 'daily',
    colorLabel: 'mint',
    emoji: '🌸',
    subtasks: [],
    pinned: false,
    favorite: false,
    archived: false,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    completedAt: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: 'seed-3',
    title: 'Quarterly Design Review 🎨',
    description: 'Prepare materials, review high-fidelity mockups, and outline product specs for the design board sync-up meeting.',
    category: 'Work',
    priority: 'high',
    completed: false,
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    dueTime: '14:00',
    reminder: true,
    recurring: 'none',
    colorLabel: 'orange',
    emoji: '🚀',
    subtasks: [
      { id: 'sub-4', title: 'Review Figma interactive prototype', completed: true },
      { id: 'sub-5', title: 'Draft agenda Google Doc', completed: false },
      { id: 'sub-6', title: 'Invite external stakeholders', completed: false }
    ],
    pinned: false,
    favorite: true,
    archived: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'seed-4',
    title: 'Buy fresh groceries & superfoods',
    description: 'Pick up avocados, fresh spinach, blueberries, almond milk, organic eggs, and whole-wheat sourdough bread.',
    category: 'Shopping',
    priority: 'low',
    completed: false,
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '17:30',
    reminder: false,
    recurring: 'weekly',
    colorLabel: 'mint',
    emoji: '🥑',
    subtasks: [],
    pinned: false,
    favorite: false,
    archived: false,
    createdAt: new Date().toISOString()
  }
];

const SEED_BADGES: Badge[] = [
  { id: 'starter', title: 'First Step', description: 'Complete your first task', icon: 'Award', requirement: '1 task completed', unlocked: false },
  { id: 'early_bird', title: 'Early Bird', description: 'Complete a task before 8:00 AM', icon: 'Sun', requirement: 'Complete a task < 8 AM', unlocked: false },
  { id: 'prod_master', title: 'Productivity Master', description: 'Complete 10 high-priority tasks', icon: 'Zap', requirement: '10 High priority tasks', unlocked: false },
  { id: 'streak_7', title: '7-Day Streak', description: 'Maintain a 7-day task completion streak', icon: 'Flame', requirement: '7-day streak', unlocked: false },
  { id: 'century', title: '100 Tasks Completed', description: 'Reach 100 total completed tasks', icon: 'CheckSquare', requirement: '100 completed tasks', unlocked: false },
  { id: 'top_performer', title: 'Top Performer', description: 'Complete 5 tasks in a single day', icon: 'TrendingUp', requirement: '5 tasks completed in one day', unlocked: false }
];

const APP_QUOTES: Quote[] = [
  { text: "Your mind is for having ideas, not holding them.", author: "David Allen" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { text: "Make each day your masterpiece.", author: "John Wooden" },
  { text: "Amateurs sit and wait for inspiration, the rest of us just get up and go to work.", author: "Stephen King" }
];

const DEFAULT_CATEGORIES = ['Work', 'Personal', 'Study', 'Fitness', 'Shopping', 'Projects'];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial data
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tf_tasks');
    return saved ? JSON.parse(saved) : SEED_TASKS;
  });

  const [logs, setLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('tf_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('tf_settings');
    return saved ? JSON.parse(saved) : {
      notificationsEnabled: true,
      remindersEnabled: true,
      animationsEnabled: true,
      language: 'en',
      themeColor: 'warm'
    };
  });

  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('tf_progress');
    return saved ? JSON.parse(saved) : {
      xp: 40, // Start with some XP to look interesting
      level: 1,
      streak: 1,
      lastCompletedDate: new Date(Date.now() - 86400000).toISOString().split('T')[0] // Yesterday
    };
  });

  const [badges, setBadges] = useState<Badge[]>(() => {
    const saved = localStorage.getItem('tf_badges');
    if (saved) {
      return JSON.parse(saved);
    }
    // Pre-unlock starter if seed tasks include a completed one
    const initialBadges = [...SEED_BADGES];
    initialBadges[0].unlocked = true;
    initialBadges[0].unlockedAt = new Date().toISOString();
    return initialBadges;
  });

  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('tf_categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [activeTab, setActiveTab] = useState<string>(() => {
    const hash = window.location.hash.replace('#/', '');
    const validTabs = ['landing', 'dashboard', 'tasks', 'calendar', 'analytics', 'settings', 'about'];
    return validTabs.includes(hash) ? hash : 'landing';
  });

  // Track Router hash path
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '');
      const validTabs = ['landing', 'dashboard', 'tasks', 'calendar', 'analytics', 'settings', 'about'];
      if (validTabs.includes(hash)) {
        setActiveTab(hash);
      } else if (!hash) {
        setActiveTab('landing');
      } else {
        setActiveTab('404');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('tf_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('tf_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('tf_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('tf_progress', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem('tf_badges', JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem('tf_categories', JSON.stringify(categories));
  }, [categories]);

  // Trigger confetti effect
  const triggerConfetti = () => {
    if (!settings.animationsEnabled) return;
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.65 },
        colors: ['#FF8A3D', '#FF6B6B', '#67C587', '#FFE7D6', '#FFEFF5']
      });
    } catch (e) {
      console.warn("Confetti ignored on frame", e);
    }
  };

  // Add Log Entry Helper
  const addLog = (type: ActivityLog['type'], taskTitle: string, pointsEarned?: number) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      type,
      taskTitle,
      pointsEarned
    };
    setLogs(prev => [newLog, ...prev].slice(0, 50)); // Keep last 50 logs
  };

  // XP & Leveling Engine
  const addXP = (amount: number) => {
    setProgress(prev => {
      const newXp = prev.xp + amount;
      const xpNeeded = prev.level * 100;
      if (newXp >= xpNeeded) {
        // Level up!
        const leftoverXp = newXp - xpNeeded;
        const newLevel = prev.level + 1;
        
        // Log leveling
        setTimeout(() => {
          triggerConfetti();
          addLog('streak_increase', `Reached Level ${newLevel}! 🎉`, 100);
        }, 100);

        return {
          ...prev,
          level: newLevel,
          xp: leftoverXp
        };
      }
      return {
        ...prev,
        xp: newXp
      };
    });
  };

  // Add Task
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'completed' | 'archived'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      completed: false,
      archived: false,
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [newTask, ...prev]);
    addLog('create', newTask.title, 10);
    addXP(10);
  };

  // Update Task
  const updateTask = (taskId: string, updated: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updated } : t));
    const target = tasks.find(t => t.id === taskId);
    if (target) {
      addLog('edit', target.title);
    }
  };

  // Delete Task
  const deleteTask = (taskId: string) => {
    const target = tasks.find(t => t.id === taskId);
    if (target) {
      addLog('delete', target.title);
      setTasks(prev => prev.filter(t => t.id !== taskId));
    }
  };

  // Duplicate Task
  const duplicateTask = (taskId: string) => {
    const target = tasks.find(t => t.id === taskId);
    if (target) {
      const duplicated: Task = {
        ...target,
        id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        title: `${target.title} (Copy)`,
        createdAt: new Date().toISOString(),
        completed: false,
        subtasks: target.subtasks.map(st => ({ ...st, id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`, completed: false }))
      };
      setTasks(prev => [duplicated, ...prev]);
      addLog('create', duplicated.title, 5);
      addXP(5);
    }
  };

  // Pin Task
  const pinTask = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, pinned: !t.pinned } : t));
  };

  // Favorite Task
  const favoriteTask = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, favorite: !t.favorite } : t));
  };

  // Archive Task
  const archiveTask = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, archived: true } : t));
    const target = tasks.find(t => t.id === taskId);
    if (target) {
      addLog('archive', target.title);
    }
  };

  // Restore Task
  const restoreTask = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, archived: false } : t));
    const target = tasks.find(t => t.id === taskId);
    if (target) {
      addLog('unarchive', target.title);
    }
  };

  // Toggle Task Completion & Streak / Badge Engine
  const toggleTaskComplete = (taskId: string) => {
    const target = tasks.find(t => t.id === taskId);
    if (!target) return;

    const completedState = !target.completed;
    const targetTitle = target.title;
    const targetPriority = target.priority;
    const completedHour = new Date().getHours();

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          completed: completedState,
          completedAt: completedState ? new Date().toISOString() : undefined
        };
      }
      return t;
    }));

    if (completedState) {
      // Award XP
      const xpGained = targetPriority === 'high' ? 30 : targetPriority === 'medium' ? 20 : 10;
      addXP(xpGained);
      addLog('complete', targetTitle, xpGained);
      triggerConfetti();

      // Check Streak & Badges
      checkAchievementsAndStreak(completedHour, targetPriority);
    } else {
      addLog('undo_complete', targetTitle);
      // Subtract XP safely
      setProgress(prev => ({
        ...prev,
        xp: Math.max(0, prev.xp - 10)
      }));
    }
  };

  // Verify and unlock gamified achievements
  const checkAchievementsAndStreak = (completedHour: number, priority: Task['priority']) => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    // Update Streak
    setProgress(prev => {
      const lastDate = prev.lastCompletedDate;
      let newStreak = prev.streak;

      if (!lastDate) {
        newStreak = 1;
      } else {
        const last = new Date(lastDate);
        const today = new Date(todayStr);
        const diffTime = Math.abs(today.getTime() - last.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          // Streak continuous!
          newStreak += 1;
          // Notify of streak growth
          setTimeout(() => {
            addLog('streak_increase', `${newStreak}-Day Activity Streak! 🔥`, 15);
            addXP(15);
          }, 400);
        } else if (diffDays > 1) {
          // Streak broken
          newStreak = 1;
        }
        // If diffDays is 0, it means we completed another task today, streak is unchanged.
      }

      return {
        ...prev,
        streak: newStreak,
        lastCompletedDate: todayStr
      };
    });

    // We do a brief timeout to allow tasks state to complete updating before evaluating badges
    setTimeout(() => {
      setTasks(allTasks => {
        const completedTasks = allTasks.filter(t => t.completed && !t.archived);
        const completedCount = completedTasks.length;
        const highPriorityCompletedCount = completedTasks.filter(t => t.priority === 'high').length;
        
        // Count tasks completed today
        const completedToday = completedTasks.filter(t => {
          if (!t.completedAt) return false;
          return t.completedAt.startsWith(todayStr);
        }).length;

        setBadges(prevBadges => {
          let updated = false;
          const nextBadges = prevBadges.map(badge => {
            if (badge.unlocked) return badge;

            let shouldUnlock = false;

            if (badge.id === 'starter' && completedCount >= 1) {
              shouldUnlock = true;
            } else if (badge.id === 'early_bird' && completedHour < 8) {
              shouldUnlock = true;
            } else if (badge.id === 'century' && completedCount >= 100) {
              shouldUnlock = true;
            } else if (badge.id === 'prod_master' && highPriorityCompletedCount >= 10) {
              shouldUnlock = true;
            } else if (badge.id === 'top_performer' && completedToday >= 5) {
              shouldUnlock = true;
            } else if (badge.id === 'streak_7') {
              // We check from progress streak state
              setProgress(currProgress => {
                if (currProgress.streak >= 7) {
                  // Since we are inside setProgress which can be nested, we can safely unlock
                  badge.unlocked = true;
                  badge.unlockedAt = new Date().toISOString();
                  updated = true;
                }
                return currProgress;
              });
            }

            if (shouldUnlock) {
              badge.unlocked = true;
              badge.unlockedAt = new Date().toISOString();
              updated = true;

              // Dispatch badge reward
              setTimeout(() => {
                addLog('badge_earned', `Unlocked Badge: ${badge.title} 🏆`, 50);
                addXP(50);
                triggerConfetti();
              }, 100);
            }

            return badge;
          });

          return updated ? nextBadges : prevBadges;
        });

        return allTasks;
      });
    }, 50);
  };

  // Reset all data
  const resetAllData = () => {
    localStorage.removeItem('tf_tasks');
    localStorage.removeItem('tf_logs');
    localStorage.removeItem('tf_settings');
    localStorage.removeItem('tf_progress');
    localStorage.removeItem('tf_badges');
    localStorage.removeItem('tf_categories');
    setTasks(SEED_TASKS);
    setLogs([]);
    setSettings({
      notificationsEnabled: true,
      remindersEnabled: true,
      animationsEnabled: true,
      language: 'en',
      themeColor: 'warm'
    });
    setProgress({
      xp: 0,
      level: 1,
      streak: 1,
      lastCompletedDate: undefined
    });
    setBadges(SEED_BADGES);
    setCategories(DEFAULT_CATEGORIES);
    setActiveTab('landing');
    window.location.hash = '#/landing';
  };

  // Import Tasks
  const importTasks = (tasksList: Task[]) => {
    if (Array.isArray(tasksList)) {
      setTasks(prev => [...tasksList, ...prev]);
      addLog('create', `Imported ${tasksList.length} Tasks`, 20);
      addXP(20);
      triggerConfetti();
    }
  };

  // Export Tasks
  const exportTasks = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `TaskFlow-export-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Custom Categories
  const addCategory = (category: string) => {
    const trimmed = category.trim();
    if (trimmed && !categories.includes(trimmed)) {
      setCategories(prev => [...prev, trimmed]);
    }
  };

  const deleteCategory = (category: string) => {
    setCategories(prev => prev.filter(c => c !== category));
  };

  const updateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
  };

  return (
    <AppContext.Provider value={{
      tasks,
      logs,
      settings,
      progress,
      badges,
      activeTab,
      setActiveTab: (tab) => {
        setActiveTab(tab);
        window.location.hash = `#/${tab}`;
      },
      addTask,
      updateTask,
      deleteTask,
      toggleTaskComplete,
      duplicateTask,
      pinTask,
      favoriteTask,
      archiveTask,
      restoreTask,
      resetAllData,
      addXP,
      importTasks,
      exportTasks,
      triggerConfetti,
      updateSettings,
      categories,
      addCategory,
      deleteCategory,
      quotes: APP_QUOTES
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
