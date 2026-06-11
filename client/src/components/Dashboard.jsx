import React from 'react';
import { 
  Award, 
  Flame, 
  Clock, 
  Heart, 
  Compass, 
  CheckCircle, 
  TrendingDown, 
  Hourglass 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';

export default function Dashboard({ user, actions, onNavigate }) {
  // Filter actions for current user
  const userActions = actions.filter(act => act.userId === user._id) || [];
  
  // Sum up impact metrics
  const impact = userActions.reduce((acc, act) => {
    acc.trees += act.socialImpactMetrics.treesPlanted || 0;
    acc.plastic += act.socialImpactMetrics.plasticRecycledKg || 0;
    acc.hours += act.socialImpactMetrics.volunteerHours || 0;
    acc.detox += act.socialImpactMetrics.screenTimeReducedMins || 0;
    return acc;
  }, { trees: 2, plastic: 5, hours: 3, detox: 125 }); // Seed defaults so dashboard is populated

  // Chart data from screen time logs
  const chartData = user.digitalDetox?.screenTimeLogs?.map(log => ({
    name: log.date,
    mins: log.duration,
    limit: user.digitalDetox?.screenTimeGoal || 120
  })) || [];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-emerald-600 to-sky-600 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <h2 className="text-3xl font-extrabold mb-2 font-sans">
          Welcome back, {user.name}!
        </h2>
        <p className="text-white/80 max-w-xl text-sm md:text-base">
          You are currently ranked as an <span className="font-bold underline text-yellow-300">{user.level}</span>. 
          Complete quizzes or attend campaigns today to boost your streak!
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 glass-card rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Awareness Score</p>
            <h4 className="text-2xl font-bold">{user.points} pts</h4>
          </div>
        </div>

        <div className="p-6 glass-card rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-950/30 text-orange-500 flex items-center justify-center">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Daily Streak</p>
            <h4 className="text-2xl font-bold">{user.streak} Days</h4>
          </div>
        </div>

        <div className="p-6 glass-card rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-950/30 text-sky-500 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Screen Reduced</p>
            <h4 className="text-2xl font-bold">{impact.detox} mins</h4>
          </div>
        </div>

        <div className="p-6 glass-card rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-950/30 text-red-500 flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Volunteer Hours</p>
            <h4 className="text-2xl font-bold">{impact.hours} Hours</h4>
          </div>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Screen Time Reduction Chart */}
        <div className="lg:col-span-2 p-6 glass-card rounded-3xl space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold">Screen Time Tracking</h3>
              <p className="text-xs text-slate-400">Daily usage statistics vs goal limits</p>
            </div>
            <span className="flex items-center gap-1 text-xs text-emerald-500 font-bold bg-emerald-100 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full">
              <TrendingDown className="w-3.5 h-3.5" /> Goal met {user.streak > 3 ? '80%' : '50%'}
            </span>
          </div>

          <div className="h-64">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorMins" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.1} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, color: '#f8fafc', fontSize: 12 }} />
                  <Area type="monotone" dataKey="mins" stroke="#0284c7" strokeWidth={3} fillOpacity={1} fill="url(#colorMins)" name="Daily screen usage" />
                  <Area type="monotone" dataKey="limit" stroke="#10b981" strokeWidth={1} strokeDasharray="4 4" fill="none" name="Active Limit" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">
                No screen time data logged yet. Click "Digital Detox" to start.
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Badges & Rewards */}
        <div className="p-6 glass-card rounded-3xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold mb-4">Badges & Certificates</h3>
            <div className="grid grid-cols-3 gap-4">
              {user.badges && user.badges.length > 0 ? (
                user.badges.map((badge, idx) => (
                  <div key={idx} className="flex flex-col items-center p-3 rounded-xl bg-slate-100 dark:bg-slate-900/60 text-center hover:scale-105 transition-all">
                    <span className="text-3xl mb-1.5">{badge.icon || '🎖️'}</span>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate w-full">{badge.name}</span>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-6 text-slate-400 text-sm">
                  Complete challenges to earn your first badge!
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Daily Quests</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs p-2 rounded bg-slate-100 dark:bg-slate-900/40">
                <span className="flex items-center gap-2"><Hourglass className="w-3.5 h-3.5 text-sky-500" /> Focus Session (15m)</span>
                <button onClick={() => onNavigate('detox')} className="text-emerald-500 hover:underline">Start</button>
              </div>
              <div className="flex items-center justify-between text-xs p-2 rounded bg-slate-100 dark:bg-slate-900/40">
                <span className="flex items-center gap-2"><Compass className="w-3.5 h-3.5 text-emerald-500" /> Climate Quiz</span>
                <button onClick={() => onNavigate('quiz')} className="text-emerald-500 hover:underline">Play</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real World Impact Cards */}
      <div className="p-6 glass-card rounded-3xl">
        <h3 className="text-lg font-bold mb-4">Your Ecological & Social Ledger</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
            <span className="text-3xl">🌳</span>
            <h5 className="text-2xl font-bold mt-2 text-emerald-600 dark:text-emerald-400">{impact.trees}</h5>
            <p className="text-xs text-slate-400">Trees Planted</p>
          </div>
          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
            <span className="text-3xl">♻️</span>
            <h5 className="text-2xl font-bold mt-2 text-blue-500">{impact.plastic} kg</h5>
            <p className="text-xs text-slate-400">Plastic Recycled</p>
          </div>
          <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30">
            <span className="text-3xl">📱</span>
            <h5 className="text-2xl font-bold mt-2 text-orange-500">{impact.detox} m</h5>
            <p className="text-xs text-slate-400">Digital Detox Time</p>
          </div>
          <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30">
            <span className="text-3xl">✊</span>
            <h5 className="text-2xl font-bold mt-2 text-purple-500">{impact.hours} hrs</h5>
            <p className="text-xs text-slate-400">Community Service</p>
          </div>
        </div>
      </div>
    </div>
  );
}
