export type Priority = 'high' | 'medium' | 'low';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string; // Work, Personal, Study, Fitness, Shopping, Projects, Custom
  priority: Priority;
  completed: boolean;
  dueDate: string; // YYYY-MM-DD
  dueTime: string; // HH:MM
  reminder: boolean;
  recurring: 'none' | 'daily' | 'weekly' | 'monthly';
  colorLabel: string; // Tailwind color name (orange, coral, mint, etc.)
  emoji: string; // Emoji character
  subtasks: Subtask[];
  pinned: boolean;
  favorite: boolean;
  archived: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: 'create' | 'complete' | 'undo_complete' | 'edit' | 'delete' | 'archive' | 'unarchive' | 'badge_earned' | 'streak_increase';
  taskTitle: string;
  pointsEarned?: number;
}

export interface UserSettings {
  notificationsEnabled: boolean;
  remindersEnabled: boolean;
  animationsEnabled: boolean;
  language: 'en' | 'es' | 'fr' | 'de';
  themeColor: 'warm' | 'peach' | 'pink' | 'mint';
}

export interface UserProgress {
  xp: number;
  level: number;
  streak: number;
  lastCompletedDate?: string;
  badges: string[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string; // lucide icon name
  requirement: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Quote {
  text: string;
  author: string;
}
