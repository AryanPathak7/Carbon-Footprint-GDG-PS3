import React, { useState } from 'react';
import { 
  Trophy, 
  School, 
  MapPin, 
  Users, 
  Star 
} from 'lucide-react';
import { mockDb } from '../utils/mockDb';

export default function Leaderboards() {
  const [activeTab, setActiveTab] = useState('school'); // 'school', 'college', 'city', 'national'
  
  const leaderboard = mockDb.getLeaderboard();

  // Simulated datasets for tabs
  const dataMap = {
    school: leaderboard.filter(item => item.name.toLowerCase().includes('school') || item.name.toLowerCase().includes('institute')),
    college: leaderboard.filter(item => item.name.toLowerCase().includes('college') || item.name.toLowerCase().includes('institute')),
    city: [
      { rank: 1, name: 'South Delhi Zone', points: 12450, membersCount: 180, volunteerHours: 540 },
      { rank: 2, name: 'Dwarka Zone', points: 9800, membersCount: 142, volunteerHours: 410 },
      { rank: 3, name: 'Noida Central', points: 8400, membersCount: 110, volunteerHours: 320 }
    ],
    national: [
      { rank: 1, name: 'Delhi NCR Region', points: 34500, membersCount: 680, volunteerHours: 1820 },
      { rank: 2, name: 'Maharashtra State', points: 28400, membersCount: 540, volunteerHours: 1450 },
      { rank: 3, name: 'Karnataka State', points: 21900, membersCount: 420, volunteerHours: 1120 }
    ]
  };

  const activeData = dataMap[activeTab] || dataMap['school'];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12 text-slate-800 dark:text-slate-100">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold flex items-center gap-2"><Trophy className="w-6 h-6 text-yellow-500" /> Awareness Leaderboards</h2>
        <p className="text-xs text-slate-400 font-sans">Compete with other institutions and cities. Earn rankings based on aggregate awareness scores and volunteer contributions.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {['school', 'college', 'city', 'national'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all capitalize ${
              activeTab === tab 
                ? 'bg-emerald-600 text-white shadow-md' 
                : 'bg-slate-100 dark:bg-slate-900 text-slate-400 hover:bg-slate-200'
            }`}
          >
            {tab} Level
          </button>
        ))}
      </div>

      {/* Leaderboard Table Grid */}
      <div className="p-6 glass-card rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
        
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 text-xs font-bold text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="col-span-1 text-center">Rank</div>
          <div className="col-span-6">Institution / Zone</div>
          <div className="col-span-2 text-center">Members</div>
          <div className="col-span-3 text-right">Awareness Score</div>
        </div>

        {/* Rows */}
        <div className="space-y-3">
          {activeData.map((item, idx) => {
            const isTop3 = idx < 3;
            const rankColors = ['text-yellow-500 bg-yellow-500/10', 'text-slate-300 bg-slate-300/10', 'text-amber-600 bg-amber-600/10'];
            
            return (
              <div 
                key={idx} 
                className="grid grid-cols-12 gap-4 items-center p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-900/40 hover:scale-[1.01] transition-transform"
              >
                <div className="col-span-1 flex justify-center">
                  {isTop3 ? (
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center font-extrabold text-xs border ${rankColors[idx]}`}>
                      {idx + 1}
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-slate-500">{idx + 1}</span>
                  )}
                </div>

                <div className="col-span-6 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950/20 text-sky-500 flex items-center justify-center shrink-0">
                    <School className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm leading-snug">{item.name}</h5>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" /> New Delhi, IN</p>
                  </div>
                </div>

                <div className="col-span-2 text-center font-semibold text-xs flex items-center justify-center gap-1 text-slate-600 dark:text-slate-400">
                  <Users className="w-3.5 h-3.5" /> {item.membersCount}
                </div>

                <div className="col-span-3 text-right font-extrabold text-sm text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  {item.points.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
