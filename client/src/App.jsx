import React, { useState } from 'react';
import { 
  Leaf, 
  Smartphone, 
  Shield, 
  Brain, 
  LayoutDashboard, 
  Bot, 
  Newspaper, 
  Flame, 
  Clock, 
  Users, 
  Smile, 
  Accessibility, 
  MapPin, 
  Activity, 
  Camera, 
  Trophy, 
  HelpCircle, 
  Briefcase, 
  ShieldAlert, 
  LogOut,
  Sun,
  Moon,
  ChevronDown
} from 'lucide-react';

import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { mockDb } from './utils/mockDb';

// Subcomponents import using React.lazy for Code-Splitting/Efficiency
const LandingPage = React.lazy(() => import('./components/LandingPage'));
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const ChatBot = React.lazy(() => import('./components/ChatBot'));
const Feed = React.lazy(() => import('./components/Feed'));
const Reels = React.lazy(() => import('./components/Reels'));
const Detox = React.lazy(() => import('./components/Detox'));
const FamilyDashboard = React.lazy(() => import('./components/FamilyDashboard'));
const ChildZone = React.lazy(() => import('./components/ChildZone'));
const SeniorMode = React.lazy(() => import('./components/SeniorMode'));
const Challenges = React.lazy(() => import('./components/Challenges'));
const CampaignMap = React.lazy(() => import('./components/CampaignMap'));
const ImpactTracker = React.lazy(() => import('./components/ImpactTracker'));
const WebAR = React.lazy(() => import('./components/WebAR'));
const Leaderboards = React.lazy(() => import('./components/Leaderboards'));
const QuizEngine = React.lazy(() => import('./components/QuizEngine'));
const NGOManagement = React.lazy(() => import('./components/NGOManagement'));
const AdminPanel = React.lazy(() => import('./components/AdminPanel'));

function AppContent() {
  const { user, logout, selectDemoUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [inApp, setInApp] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [showDemoUsers, setShowDemoUsers] = useState(false);

  const actions = mockDb.getActions();
  const allDemoUsers = mockDb.getUsers();

  const handleDemoUserChange = (userId) => {
    selectDemoUser(userId);
    setShowDemoUsers(false);
    
    // Auto-redirect to appropriate zones based on new user role
    const selected = allDemoUsers.find(u => u._id === userId);
    if (selected) {
      if (selected.role === 'admin') setCurrentView('admin');
      else if (selected.role === 'ngo') setCurrentView('ngo');
      else if (selected.ageGroup === 'child') setCurrentView('child');
      else if (selected.ageGroup === 'senior') setCurrentView('senior');
      else setCurrentView('dashboard');
    }
  };

  const handleEnterApp = (targetView = 'dashboard') => {
    setInApp(true);
    setCurrentView(targetView);
    if (!user && allDemoUsers.length > 0) {
      selectDemoUser(allDemoUsers[0]._id);
    }
  };

  const handleLogout = () => {
    logout();
    setInApp(false);
  };

  if (!inApp) {
    return (
      <React.Suspense fallback={
        <div className="flex items-center justify-center min-h-screen bg-slate-950">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <LandingPage onEnterApp={handleEnterApp} />
      </React.Suspense>
    );
  }

  // Active view renderer
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard user={user} actions={actions} onNavigate={setCurrentView} />;
      case 'chatbot':
        return <ChatBot user={user} />;
      case 'feed':
        return <Feed />;
      case 'reels':
        return <Reels />;
      case 'detox':
        return <Detox />;
      case 'family':
        return <FamilyDashboard />;
      case 'child':
        return <ChildZone />;
      case 'senior':
        return <SeniorMode />;
      case 'challenges':
        return <Challenges />;
      case 'campaigns':
        return <CampaignMap />;
      case 'impact':
        return <ImpactTracker />;
      case 'webar':
        return <WebAR />;
      case 'leaderboard':
        return <Leaderboards />;
      case 'quiz':
        return <QuizEngine />;
      case 'ngo':
        return <NGOManagement />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <Dashboard user={user} actions={actions} onNavigate={setCurrentView} />;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['citizen', 'ngo', 'admin'] },
    { id: 'chatbot', label: 'AI Assistant', icon: Bot, roles: ['citizen', 'ngo', 'admin'] },
    { id: 'feed', label: 'Awareness Feed', icon: Newspaper, roles: ['citizen', 'ngo', 'admin'] },
    { id: 'reels', label: 'Reels', icon: Flame, roles: ['citizen', 'ngo', 'admin'] },
    { id: 'detox', label: 'Digital Detox', icon: Clock, roles: ['citizen', 'ngo', 'admin'] },
    { id: 'family', label: 'Family Sync', icon: Users, roles: ['citizen'] },
    { id: 'child', label: 'Child Zone', icon: Smile, roles: ['citizen'] },
    { id: 'senior', label: 'Senior Mode', icon: Accessibility, roles: ['citizen'] },
    { id: 'challenges', label: 'Challenges', icon: Trophy, roles: ['citizen', 'ngo', 'admin'] },
    { id: 'campaigns', label: 'Campaign Map', icon: MapPin, roles: ['citizen', 'ngo', 'admin'] },
    { id: 'impact', label: 'Impact Tracker', icon: Activity, roles: ['citizen', 'ngo', 'admin'] },
    { id: 'webar', label: 'WebAR Scanner', icon: Camera, roles: ['citizen', 'ngo', 'admin'] },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, roles: ['citizen', 'ngo', 'admin'] },
    { id: 'quiz', label: 'Quizzes', icon: HelpCircle, roles: ['citizen', 'ngo', 'admin'] },
    { id: 'ngo', label: 'NGO Portal', icon: Briefcase, roles: ['ngo', 'admin'] },
    { id: 'admin', label: 'Admin Console', icon: ShieldAlert, roles: ['admin'] },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col">
      
      {/* Top Navbar */}
      <header className="glass-navbar sticky top-0 z-40 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('dashboard')}>
          <Leaf className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xl font-bold font-sans bg-gradient-to-r from-emerald-600 to-sky-500 bg-clip-text text-transparent">
            AwareSphere
          </span>
        </div>

        {/* Top controls */}
        <div className="flex items-center gap-4">
          
          {/* Hackathon Demo Account Switcher Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowDemoUsers(!showDemoUsers)}
              className="flex items-center gap-1 text-xs bg-slate-200 dark:bg-slate-800 px-3.5 py-2 rounded-xl font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-100 transition-colors"
            >
              Demo Switcher <ChevronDown className="w-3 h-3" />
            </button>

            {showDemoUsers && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 z-50 space-y-1">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block px-2.5 py-1">Swap Role/Account</span>
                {allDemoUsers.map(u => (
                  <button
                    key={u._id}
                    onClick={() => handleDemoUserChange(u._id)}
                    className="w-full text-left p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold flex items-center justify-between"
                  >
                    <span>{u.name} ({u.role === 'citizen' ? u.ageGroup : u.role})</span>
                    {user?._id === u._id && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme toggler */}
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Profile details */}
          {user && (
            <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-800 pl-4">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800"
              />
              <div className="hidden md:block">
                <p className="text-xs font-bold leading-none">{user.name}</p>
                <span className="text-[10px] text-emerald-500 font-bold uppercase mt-0.5 block">{user.points} pts</span>
              </div>
              <button 
                onClick={handleLogout} 
                title="Log Out"
                className="p-1 rounded text-slate-400 hover:text-red-500 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main split: Sidebar & Content Panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Nav */}
        <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800/80 p-4 space-y-2 overflow-y-auto hidden md:block">
          {navItems
            .filter(item => item.roles.includes(user?.role || 'citizen'))
            .map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full text-left p-3 rounded-xl text-xs font-bold flex items-center gap-3 transition-all ${
                    isActive 
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10' 
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  {item.label}
                </button>
              );
            })}
        </aside>

        {/* Mobile Navigation bar at the bottom */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-around py-2 z-40 md:hidden">
          {navItems
            .filter(item => ['dashboard', 'chatbot', 'feed', 'webar'].includes(item.id))
            .map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex flex-col items-center gap-1 text-[9px] font-bold ${
                    isActive ? 'text-emerald-500' : 'text-slate-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50 dark:bg-slate-950 pb-20 md:pb-8">
          <React.Suspense fallback={
            <div className="flex items-center justify-center h-full min-h-[300px]">
              <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          }>
            {renderView()}
          </React.Suspense>
        </main>
      </div>

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
