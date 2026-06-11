import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  AlertTriangle, 
  ChevronRight, 
  Award, 
  Eye,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Detox() {
  const { user, setUser, recordAction } = useAuth();
  const [logMins, setLogMins] = useState('');
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [focusActive, setFocusActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 mins
  const [alertExercise, setAlertExercise] = useState(false);
  const [logSuccess, setLogSuccess] = useState(false);
  const timerRef = useRef(null);

  // Focus session timer logic
  useEffect(() => {
    if (focusActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setFocusActive(false);
      setAlertExercise(true);
      setTimeLeft(15 * 60);
      
      // Reward points for completion
      recordAction({
        actionType: 'detox_goal',
        category: 'Digital Wellbeing',
        description: 'Completed 15-minute Digital Detox Focus Session!',
        pointsEarned: 30,
        socialImpactMetrics: { treesPlanted: 0, plasticRecycledKg: 0, volunteerHours: 0, screenTimeReducedMins: 15 }
      });
      
      clearInterval(timerRef.current);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [focusActive, timeLeft]);

  const toggleFocus = () => {
    setFocusActive(!focusActive);
  };

  const resetFocus = () => {
    setFocusActive(false);
    setTimeLeft(15 * 60);
  };

  const handleLogScreenTime = (e) => {
    e.preventDefault();
    if (!logMins || isNaN(logMins)) return;

    const mins = Number(logMins);
    const goal = user.digitalDetox?.screenTimeGoal || 120;
    
    // Update locally in context
    const updatedLogs = [...(user.digitalDetox?.screenTimeLogs || [])];
    const existingIdx = updatedLogs.findIndex(l => l.date === logDate);
    
    let reducedMins = 0;
    if (existingIdx > -1) {
      updatedLogs[existingIdx].duration = mins;
    } else {
      updatedLogs.push({ date: logDate, duration: mins });
    }

    if (mins < goal) {
      reducedMins = goal - mins;
    }

    const updatedUser = {
      ...user,
      digitalDetox: {
        ...user.digitalDetox,
        screenTimeLogs: updatedLogs
      }
    };

    // Update context user state
    setUser(updatedUser);
    localStorage.setItem('awaresphere_current_user', JSON.stringify(updatedUser));
    
    // Save users mock table
    const users = JSON.parse(localStorage.getItem('awaresphere_users') || '[]');
    const userIdx = users.findIndex(u => u._id === user._id);
    if (userIdx > -1) {
      users[userIdx].digitalDetox.screenTimeLogs = updatedLogs;
      if (mins < goal) {
        users[userIdx].points += 20;
      }
      localStorage.setItem('awaresphere_users', JSON.stringify(users));
    }

    if (mins < goal) {
      recordAction({
        actionType: 'detox_goal',
        category: 'Digital Wellbeing',
        description: `Logged screen time of ${mins} mins (Limit: ${goal} mins). Goal met!`,
        pointsEarned: 20,
        socialImpactMetrics: { treesPlanted: 0, plasticRecycledKg: 0, volunteerHours: 0, screenTimeReducedMins: reducedMins }
      });
    } else {
      recordAction({
        actionType: 'detox_goal',
        category: 'Digital Wellbeing',
        description: `Logged screen time of ${mins} mins (Limit: ${goal} mins). Goal exceeded.`,
        pointsEarned: 0,
        socialImpactMetrics: { treesPlanted: 0, plasticRecycledKg: 0, volunteerHours: 0, screenTimeReducedMins: 0 }
      });
    }

    setLogMins('');
    setLogSuccess(true);
    setTimeout(() => setLogSuccess(false), 3000);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto animate-fade-in pb-12">
      
      {/* Toast */}
      {logSuccess && (
        <div className="fixed top-20 right-6 px-5 py-3 bg-emerald-600 text-white rounded-xl shadow-xl flex items-center gap-2 z-50 animate-bounce-slow font-bold text-sm">
          <CheckCircle className="w-5 h-5" /> Screen time logged! Impact updated.
        </div>
      )}

      {/* Focus Timer Card */}
      <div className="p-8 glass-card rounded-3xl flex flex-col items-center justify-between text-center relative overflow-hidden">
        {/* Absolute glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl"></div>
        
        <div>
          <h3 className="text-xl font-bold flex items-center justify-center gap-2 mb-1">
            <Clock className="w-5 h-5 text-sky-500" /> Focus Session
          </h3>
          <p className="text-xs text-slate-400">Lock yourself away from screens. Relax your eyes.</p>
        </div>

        {/* Timer Ring */}
        <div className="my-10 relative flex items-center justify-center">
          <div className="w-56 h-56 rounded-full border-8 border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center shadow-lg">
            <span className="text-4xl font-extrabold font-mono tracking-wider">
              {formatTime(timeLeft)}
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
              {focusActive ? 'Running' : 'Paused'}
            </span>
          </div>
        </div>

        {/* Timer actions */}
        <div className="flex gap-4 w-full justify-center">
          <button
            onClick={toggleFocus}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
              focusActive 
                ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {focusActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {focusActive ? 'Pause' : 'Start Focus'}
          </button>
          <button
            onClick={resetFocus}
            className="px-5 py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-xl font-bold text-slate-500 dark:text-slate-400 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Break Eye exercises popup */}
        {alertExercise && (
          <div className="absolute inset-0 bg-slate-900/95 flex flex-col items-center justify-center p-6 text-white space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center text-4xl animate-bounce">
              👁️
            </div>
            <h4 className="text-lg font-bold">Focus Complete! 20-20-20 alert</h4>
            <p className="text-xs text-slate-400 max-w-xs">
              Excellent! You completed your 15m focus session and earned +30 Points. Let's rest your eye muscles now:
            </p>
            <div className="text-left bg-slate-800 p-4 rounded-xl text-xs space-y-2 max-w-xs">
              <p className="font-semibold text-emerald-400">Eye Gym Guide:</p>
              <p>1. Look at an object 20 feet away for 20 seconds.</p>
              <p>2. Blink rapidly 10 times to hydrate your corneas.</p>
              <p>3. Roll your eyes in a slow figure-8 motion.</p>
            </div>
            <button
              onClick={() => setAlertExercise(false)}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 font-bold rounded-xl text-xs transition-colors"
            >
              Done: Exercises Completed
            </button>
          </div>
        )}
      </div>

      {/* Screen Time Logger Card */}
      <div className="p-8 glass-card rounded-3xl space-y-6 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold mb-1">Log Daily Screen Time</h3>
          <p className="text-xs text-slate-400">Log minutes of phone/tablet usage. Track goal reductions.</p>
        </div>

        <form onSubmit={handleLogScreenTime} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase">Select Date</label>
            <input
              type="date"
              value={logDate}
              onChange={(e) => setLogDate(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-900 text-sm border-none outline-none rounded-xl px-4 py-3 text-slate-600 dark:text-slate-300 focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase">Duration (in minutes)</label>
            <input
              type="number"
              value={logMins}
              onChange={(e) => setLogMins(e.target.value)}
              placeholder="e.g. 95"
              className="w-full bg-slate-100 dark:bg-slate-900 text-sm border-none outline-none rounded-xl px-4 py-3 text-slate-600 dark:text-slate-300 focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all"
          >
            Submit Log
          </button>
        </form>

        <div className="p-4 rounded-2xl bg-sky-50 dark:bg-slate-900/40 border border-sky-100 dark:border-slate-800 space-y-2.5">
          <h5 className="text-xs font-bold uppercase text-sky-600 flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" /> Goal Alert</h5>
          <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            Your daily target screen time is set to <span className="font-bold text-sky-500">{user.digitalDetox?.screenTimeGoal || 120} minutes</span>. 
            Logging duration below this limit automatically rewards <span className="font-bold text-emerald-500">+20 points</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
