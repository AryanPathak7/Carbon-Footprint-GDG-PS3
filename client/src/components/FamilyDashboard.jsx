import React, { useState } from 'react';
import { 
  Users, 
  Award, 
  TrendingUp, 
  Smartphone, 
  Trophy,
  CheckCircle,
  Link2
} from 'lucide-react';
import { mockDb } from '../utils/mockDb';

export default function FamilyDashboard() {
  const users = mockDb.getUsers();
  
  // Get members belonging to 'fam_123'
  const familyMembers = users.filter(u => u.familyId === 'fam_123');

  // Compute family metrics
  const totalScore = familyMembers.reduce((sum, member) => sum + member.points, 0);
  
  const familyChallenges = [
    { id: 'f_ch_1', title: 'No Screens Dinner', description: 'Ensure all family members lock screens in another room during dinner.', points: 100, completed: false },
    { id: 'f_ch_2', title: 'Family Garbage Segregation', description: 'Set up separate Dry, Wet, and Hazardous bins in the house.', points: 150, completed: true }
  ];

  const [challenges, setChallenges] = useState(familyChallenges);
  const [showToast, setShowToast] = useState(false);

  const completeChallenge = (id, points) => {
    setChallenges(prev => prev.map(ch => ch.id === id ? { ...ch, completed: true } : ch));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Toast */}
      {showToast && (
        <div className="fixed top-20 right-6 px-5 py-3 bg-emerald-600 text-white rounded-xl shadow-xl flex items-center gap-2 z-50 animate-bounce-slow font-bold text-sm">
          <CheckCircle className="w-5 h-5" /> Family challenge completed! +100 Points added to family ledger.
        </div>
      )}

      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
        <div>
          <h2 className="text-2xl font-extrabold flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-400" /> Family Awareness Center
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Linked Family Hub ID: <span className="font-mono text-emerald-400 font-bold">FAM-7729-DELHI</span>
          </p>
        </div>
        <div className="bg-slate-800 p-4 rounded-2xl text-center border border-slate-700/60 min-w-[150px]">
          <span className="text-xs text-slate-400 uppercase font-bold">Family Score</span>
          <h4 className="text-3xl font-extrabold text-emerald-400 mt-1">{totalScore}</h4>
        </div>
      </div>

      {/* Member Rank list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Member cards */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold">Synced Members</h3>
          <div className="space-y-4">
            {familyMembers.map((member, idx) => (
              <div 
                key={member._id} 
                className="p-5 glass-card rounded-2xl flex items-center justify-between hover:scale-[1.01] transition-transform"
              >
                <div className="flex items-center gap-4">
                  <img 
                    src={member.avatar} 
                    alt={member.name} 
                    className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-800"
                  />
                  <div>
                    <h4 className="font-bold flex items-center gap-2">
                      {member.name} 
                      <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full capitalize">
                        {member.ageGroup}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-400">{member.level}</p>
                  </div>
                </div>

                <div className="flex gap-6 items-center">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Points</span>
                    <p className="font-bold text-sm text-slate-800 dark:text-slate-100">{member.points} pts</p>
                  </div>
                  <div className="text-right border-l border-slate-200 dark:border-slate-800 pl-4">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Streak</span>
                    <p className="font-bold text-sm text-orange-500">{member.streak} Days</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Family challenges */}
        <div className="p-6 glass-card rounded-3xl space-y-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" /> Family Challenges
          </h3>

          <div className="space-y-4">
            {challenges.map((ch) => (
              <div key={ch.id} className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-sm leading-snug">{ch.title}</h4>
                  <span className="text-[10px] font-bold text-emerald-500">+{ch.points} pts</span>
                </div>
                <p className="text-xs text-slate-400 leading-normal">{ch.description}</p>
                {ch.completed ? (
                  <span className="text-[10px] text-emerald-500 bg-emerald-100 dark:bg-emerald-950/40 px-2 py-1 rounded-full font-bold inline-block">
                    Completed
                  </span>
                ) : (
                  <button
                    onClick={() => completeChallenge(ch.id, ch.points)}
                    className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-[10px] transition-colors"
                  >
                    Mark Family Completed
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Link account helper */}
      <div className="p-6 glass-card rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h4 className="font-bold text-sm">Add Family Member Account</h4>
          <p className="text-xs text-slate-400">Sync grandparents, children, or partners by entering their email address.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <input
            type="email"
            placeholder="member@email.com"
            className="bg-slate-100 dark:bg-slate-900 border-none outline-none rounded-xl px-4 py-2 text-xs text-slate-300 w-full md:w-56 focus:ring-1 focus:ring-emerald-500"
          />
          <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold rounded-xl text-xs flex items-center gap-1">
            <Link2 className="w-3.5 h-3.5" /> Link
          </button>
        </div>
      </div>

    </div>
  );
}
