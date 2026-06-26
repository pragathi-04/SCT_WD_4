import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ThemeWrapper } from './components/ThemeWrapper';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { TasksPage } from './pages/TasksPage';
import { CalendarPage } from './pages/CalendarPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AboutPage } from './pages/AboutPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Inner component to access context state safely
const AppContent: React.FC = () => {
  const { activeTab } = useApp();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage />;
      case 'dashboard':
        return <Dashboard />;
      case 'tasks':
        return <TasksPage />;
      case 'calendar':
        return <CalendarPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'about':
        return <AboutPage />;
      case 'settings':
        return <SettingsPage />;
      case '404':
      default:
        return <NotFoundPage />;
    }
  };

  return (
    <ThemeWrapper>
      {/* Premium Glassmorphic sticky Navbar */}
      <Navbar />

      {/* Main Page Stage Grid */}
      <main className="relative z-10 w-full min-h-[calc(100vh-140px)]">
        {renderActiveTab()}
      </main>
    </ThemeWrapper>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
