import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Smartphone, 
  Brain, 
  Leaf, 
  DollarSign, 
  HeartHandshake, 
  Navigation, 
  Activity, 
  ArrowRight,
  TrendingUp,
  Award,
  Users,
  X,
  Lock,
  Mail,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LandingPage({ onEnterApp }) {
  const { login, register, error: authError } = useAuth();
  const [stats, setStats] = useState({ users: 0, actions: 0, co2: 0 });

  // Auth modal states
  const [authMode, setAuthMode] = useState(null); // 'login', 'signup', or null
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('citizen');
  const [ageGroup, setAgeGroup] = useState('adult');
  const [schoolId, setSchoolId] = useState('');
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    // Stat counter simulation
    const interval = setInterval(() => {
      setStats(prev => {
        const nextUsers = prev.users < 12450 ? prev.users + 150 : 12450;
        const nextActions = prev.actions < 48200 ? prev.actions + 580 : 48200;
        const nextCo2 = prev.co2 < 8430 ? prev.co2 + 95 : 8430;
        
        if (nextUsers === 12450 && nextActions === 48200 && nextCo2 === 8430) {
          clearInterval(interval);
        }
        return { users: nextUsers, actions: nextActions, co2: nextCo2 };
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const categories = [
    { title: 'Digital Wellbeing', desc: 'Break device addiction, log screen time, and regain focus.', icon: Smartphone, color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30', target: 'detox' },
    { title: 'Cyber Safety', desc: 'Secure passwords, identify phishing attempts, protect senior citizens.', icon: Shield, color: 'text-red-500 bg-red-100 dark:bg-red-900/30', target: 'chatbot' },
    { title: 'Mental Health', desc: 'Guided mindfulness breaks, stress trackers, and supportive resources.', icon: Brain, color: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30', target: 'chatbot' },
    { title: 'Environmental', desc: 'Plant trees, log plastic recycling counts, audit household waste.', icon: Leaf, color: 'text-green-500 bg-green-100 dark:bg-green-900/30', target: 'campaigns' },
    { title: 'Financial Literacy', desc: 'Master budgets, avoid loans traps, learn compounding returns.', icon: DollarSign, color: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30', target: 'quiz' },
    { title: 'Road Safety', desc: 'Understand traffic signals, helmet rules, safety checklist cards.', icon: Navigation, color: 'text-orange-500 bg-orange-100 dark:bg-orange-900/30', target: 'quiz' },
    { title: 'Social Responsibility', desc: 'Help neighbors, participate in cleanups, donate blood.', icon: HeartHandshake, color: 'text-teal-500 bg-teal-100 dark:bg-teal-900/30', target: 'challenges' },
    { title: 'Health & Fitness', desc: 'Log daily walking step goals, stay fit, track family nutrition.', icon: Activity, color: 'text-pink-500 bg-pink-100 dark:bg-pink-900/30', target: 'detox' },
  ];

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setLoading(true);

    if (authMode === 'login') {
      const success = await login(email, password);
      setLoading(false);
      if (success) {
        setAuthMode(null);
        onEnterApp('dashboard');
      } else {
        setLocalError('Invalid email or password');
      }
    } else {
      // Signup
      if (!name) {
        setLocalError('Name is required');
        setLoading(false);
        return;
      }
      const success = await register(name, email, password, role, ageGroup, schoolId, interests);
      setLoading(false);
      if (success) {
        setAuthMode(null);
        // Redirect based on target profile type
        if (role === 'ngo') onEnterApp('ngo');
        else if (ageGroup === 'child') onEnterApp('child');
        else if (ageGroup === 'senior') onEnterApp('senior');
        else onEnterApp('dashboard');
      } else {
        setLocalError(authError || 'Registration failed');
      }
    }
  };

  const toggleInterest = (interestName) => {
    setInterests(prev => 
      prev.includes(interestName) 
        ? prev.filter(i => i !== interestName) 
        : [...prev, interestName]
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      
      {/* Header */}
      <nav className="glass-navbar sticky top-0 z-50 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <Leaf className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          <span className="text-2xl font-bold tracking-wider font-sans bg-gradient-to-r from-emerald-600 to-sky-500 bg-clip-text text-transparent">
            AwareSphere
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setAuthMode('login')}
            className="text-xs font-bold text-slate-400 hover:text-emerald-500 transition-colors"
          >
            Sign In
          </button>
          <button 
            onClick={() => setAuthMode('signup')}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all text-xs"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative px-6 py-20 lg:py-32 max-w-7xl mx-auto flex flex-col items-center text-center overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl animate-pulse-slow"></div>

        <span className="px-4 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider rounded-full mb-6">
          Gamified Impact Platform
        </span>
        
        <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
          Turn Awareness Into <br />
          <span className="bg-gradient-to-r from-emerald-500 to-sky-400 bg-clip-text text-transparent">
            Measurable Action
          </span>
        </h1>

        <p className="text-lg lg:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mb-10 leading-relaxed">
          Educate yourself. Engage with your family. Join local volunteering drives. 
          Log digital wellness milestones. Track real-world societal impact dynamically.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <button 
            onClick={() => setAuthMode('signup')}
            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xl shadow-emerald-600/20 hover:-translate-y-0.5 transition-all text-base"
          >
            Start Your Journey
          </button>
          <a 
            href="#features"
            className="px-8 py-4 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-bold rounded-xl hover:-translate-y-0.5 transition-all text-base"
          >
            Explore Categories
          </a>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl p-8 glass-card rounded-2xl">
          <div className="flex flex-col items-center p-4 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800">
            <Users className="w-8 h-8 text-emerald-500 mb-2" />
            <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
              {stats.users.toLocaleString()}+
            </span>
            <span className="text-sm text-slate-400 uppercase tracking-wider mt-1">Active Citizens</span>
          </div>
          <div className="flex flex-col items-center p-4 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800">
            <TrendingUp className="w-8 h-8 text-sky-500 mb-2" />
            <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
              {stats.actions.toLocaleString()}+
            </span>
            <span className="text-sm text-slate-400 uppercase tracking-wider mt-1">Actions Recorded</span>
          </div>
          <div className="flex flex-col items-center p-4">
            <Award className="w-8 h-8 text-yellow-500 mb-2" />
            <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
              {stats.co2.toLocaleString()} kg
            </span>
            <span className="text-sm text-slate-400 uppercase tracking-wider mt-1">Plastic Recycled</span>
          </div>
        </div>
      </header>

      {/* Categories Grid Section */}
      <section id="features" className="py-20 bg-slate-100 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-extrabold mb-4">
              Explore Our Core Pillars
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Every category comes with curated guides, daily challenges, local NGO actions, and quiz engines to test your awareness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div 
                  key={idx} 
                  className="p-6 glass-card rounded-2xl hover:scale-[1.03] transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${cat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{cat.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                      {cat.desc}
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      setAuthMode('login');
                    }}
                    className="flex items-center gap-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:gap-2 transition-all"
                  >
                    Get Involved <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Impact Engine Callout */}
      <section className="py-20 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="px-3 py-1 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 text-xs font-bold uppercase tracking-wider rounded-full">
            Awareness-to-Action Engine
          </span>
          <h2 className="text-3xl lg:text-5xl font-extrabold leading-tight">
            Not Just Reading.<br />Real-world Impact.
          </h2>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            Our AI engine maps your quiz responses, local interests, and age group to generate custom Action items. Plant trees, clean up beaches, perform eye-exercises, or assist senior neighbors. Document your completion via photo/video uploads, get verified, and earn badges.
          </p>
          <div className="grid grid-cols-2 gap-6 pt-4">
            <div className="flex gap-3 items-start">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-2"></div>
              <div>
                <h4 className="font-bold">Family Center</h4>
                <p className="text-xs text-slate-400">Sync accounts across parents, child, and seniors.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-2.5 h-2.5 rounded-full bg-sky-500 mt-2"></div>
              <div>
                <h4 className="font-bold">Offline Sync Mode</h4>
                <p className="text-xs text-slate-400">PWA installs on devices to sync updates offline.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="p-8 glass-card rounded-3xl relative overflow-hidden border border-slate-200/50 dark:border-slate-800">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl"></div>
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="text-xs text-slate-400 font-mono ml-auto">impact_ledger.json</span>
            </div>
            
            <div className="space-y-3 font-mono text-xs text-slate-400">
              <p className="text-emerald-400">{"{"}</p>
              <p className="pl-4">"citizen": "Aravind Sharma",</p>
              <p className="pl-4">"action": "Central Park Cleanup Volunteer",</p>
              <p className="pl-4 text-sky-400">"status": "Verified",</p>
              <p className="pl-4">"rewards": {"{ points: 100, badge: 'Eco Warrior' }"},</p>
              <p className="pl-4">"verified_metrics": {"{"}</p>
              <p className="pl-8 text-amber-400">"plastic_collected_kg": 4.5,</p>
              <p className="pl-8 text-amber-400">"volunteer_hours": 3.0</p>
              <p className="pl-4">{"}"}</p>
              <p className="text-emerald-400">{"}"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Auth Modal Overlay */}
      {authMode && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="glass-card max-w-md w-full rounded-3xl p-6 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold flex items-center gap-1.5">
                <Lock className="w-5 h-5 text-emerald-500" />
                {authMode === 'login' ? 'Sign In to AwareSphere' : 'Join AwareSphere'}
              </h3>
              <button 
                type="button" 
                onClick={() => setAuthMode(null)} 
                className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {localError && (
              <p className="text-xs text-red-500 font-bold bg-red-100 dark:bg-red-950/20 p-2.5 rounded-xl border border-red-200/50">
                {localError}
              </p>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              
              {authMode === 'signup' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aravind Sharma"
                    className="w-full bg-slate-100 dark:bg-slate-900 border-none outline-none text-xs rounded-xl p-3 focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-100 dark:bg-slate-900 border-none outline-none text-xs rounded-xl p-3 focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-100 dark:bg-slate-900 border-none outline-none text-xs rounded-xl p-3 focus:ring-1 focus:ring-sky-500"
                />
              </div>

              {authMode === 'signup' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase">Role</label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full bg-slate-100 dark:bg-slate-900 border-none outline-none text-xs rounded-xl p-2.5 focus:ring-1 focus:ring-sky-500"
                      >
                        <option value="citizen">Citizen/User</option>
                        <option value="ngo">NGO/Organization</option>
                      </select>
                    </div>

                    {role === 'citizen' && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase">Age Group</label>
                        <select
                          value={ageGroup}
                          onChange={(e) => setAgeGroup(e.target.value)}
                          className="w-full bg-slate-100 dark:bg-slate-900 border-none outline-none text-xs rounded-xl p-2.5 focus:ring-1 focus:ring-sky-500"
                        >
                          <option value="child">Child (Under 12)</option>
                          <option value="teen">Teen (13-19)</option>
                          <option value="adult">Adult (20-64)</option>
                          <option value="senior">Senior Citizen (65+)</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase">Institution / School (Optional)</label>
                    <input
                      type="text"
                      value={schoolId}
                      onChange={(e) => setSchoolId(e.target.value)}
                      placeholder="e.g. Greenwood High School"
                      className="w-full bg-slate-100 dark:bg-slate-900 border-none outline-none text-xs rounded-xl p-3 focus:ring-1 focus:ring-sky-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase block">Interests</label>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {['Environmental', 'Digital Wellbeing', 'Cyber Safety', 'Road Safety', 'Mental Health'].map(interest => (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => toggleInterest(interest)}
                          className={`px-3 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                            interests.includes(interest) 
                              ? 'bg-emerald-600 text-white border-emerald-600' 
                              : 'bg-slate-100 dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          {interest}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-transform hover:scale-[1.01] flex items-center justify-center gap-1.5 text-xs disabled:opacity-50"
              >
                {loading ? 'Processing...' : authMode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="text-center pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                {authMode === 'login' ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-emerald-400" />
            <span className="text-lg font-bold text-white tracking-wide">AwareSphere</span>
          </div>
          <p className="text-xs text-slate-500">
            &copy; 2026 AwareSphere Platform. Designed for Global Hackathon Impact. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
