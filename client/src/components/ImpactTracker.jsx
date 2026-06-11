import React from 'react';
import { 
  TrendingUp, 
  Award, 
  Activity, 
  Globe, 
  Leaf, 
  Smartphone, 
  Clock, 
  Heart 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import { useAuth } from '../context/AuthContext';

export default function ImpactTracker() {
  const { user } = useAuth();

  // Personal, Community, and Global comparative data
  const comparisonData = [
    { name: 'Trees Planted', Personal: 3, Community: 45, Global: 345 },
    { name: 'Plastic Recycled (kg)', Personal: 8, Community: 120, Global: 1240 },
    { name: 'Volunteer Hours', Personal: 6, Community: 88, Global: 820 },
    { name: 'Detox Days', Personal: 5, Community: 62, Global: 645 }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold flex items-center gap-2"><Activity className="w-6 h-6 text-emerald-500" /> Real-world Impact Ledger</h2>
        <p className="text-xs text-slate-400 font-sans">Visualizing your contribution alongside the community to drive measurable global change.</p>
      </div>

      {/* Grid of Cumulative Totals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="p-6 glass-card rounded-3xl flex items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl"></div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/20 text-emerald-500 flex items-center justify-center">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Trees Planted</span>
            <h4 className="text-2xl font-bold mt-1 text-slate-800 dark:text-slate-100">3 Saplings</h4>
            <p className="text-[10px] text-slate-400">Personal contribution</p>
          </div>
        </div>

        <div className="p-6 glass-card rounded-3xl flex items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/10 rounded-full blur-xl"></div>
          <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950/20 text-sky-500 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Detox Reductions</span>
            <h4 className="text-2xl font-bold mt-1 text-slate-800 dark:text-slate-100">125 minutes</h4>
            <p className="text-[10px] text-slate-400">Eye-strain credit logged</p>
          </div>
        </div>

        <div className="p-6 glass-card rounded-3xl flex items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl"></div>
          <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/20 text-purple-500 flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Community Hours</span>
            <h4 className="text-2xl font-bold mt-1 text-slate-800 dark:text-slate-100">6 Hours</h4>
            <p className="text-[10px] text-slate-400">Active volunteer check-ins</p>
          </div>
        </div>

      </div>

      {/* Recharts Comparative Analysis */}
      <div className="p-6 glass-card rounded-3xl space-y-6">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-1.5"><Globe className="w-5 h-5 text-emerald-500" /> Platform Impact Metrics</h3>
          <p className="text-xs text-slate-400">Comparative chart showing personal vs community vs global metrics</p>
        </div>

        <div className="h-80 w-full font-sans text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.1} />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, color: '#f8fafc' }} />
              <Legend />
              <Bar dataKey="Personal" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Community" fill="#0284c7" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Global" fill="#475569" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Impact conversion statement */}
      <div className="p-6 rounded-3xl bg-emerald-600/10 border border-emerald-500/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h5 className="font-bold text-sm text-emerald-600 dark:text-emerald-400">Awareness-to-Action conversion rate: 84%</h5>
          <p className="text-xs text-slate-400 max-w-xl leading-normal">
            Unlike traditional educational portals, AwareSphere focuses on real-world actions. 84% of our citizens who read an awareness guide complete a corresponding challenge or join a local campaign within 7 days.
          </p>
        </div>
        <span className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 self-start md:self-auto shrink-0 shadow-lg shadow-emerald-500/15">
          <TrendingUp className="w-4 h-4" /> Increasing Daily
        </span>
      </div>

    </div>
  );
}
