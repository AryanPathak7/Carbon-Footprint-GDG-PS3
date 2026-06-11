import React, { useState } from 'react';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  ShieldAlert, 
  TrendingUp, 
  FileText 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { mockDb } from '../utils/mockDb';

export default function AdminPanel() {
  const [challenges, setChallenges] = useState(mockDb.getChallenges());
  const [users, setUsers] = useState(mockDb.getUsers());
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Extract submitted proofs across challenges
  const submittedItems = [];
  challenges.forEach(ch => {
    ch.participants.forEach(p => {
      if (p.status === 'submitted') {
        const userObj = users.find(u => u._id === p.userId);
        submittedItems.push({
          challengeId: ch._id,
          challengeTitle: ch.title,
          challengeCategory: ch.category,
          pointsReward: ch.pointsReward,
          userId: p.userId,
          userName: userObj ? userObj.name : 'Unknown Citizen',
          proofImage: p.proofImage,
          notes: p.notes,
          submittedAt: p.submittedAt
        });
      }
    });
  });

  const [queue, setQueue] = useState(submittedItems);

  // Fraud detection alerts list
  const fraudLogs = [
    { id: 1, type: 'Duplicate Check-In', details: 'User Savitri Sharma attempted multiple QR check-ins at Blood Donation Camp within 5 mins.', severity: 'Medium', timestamp: '2026-06-11T14:02:10.000Z' },
    { id: 2, type: 'Fake GPS Coordinate Match', details: 'User Leo Sharma submitted proof GPS coordinates outside Delhi campaign radius bounds.', severity: 'High', timestamp: '2026-06-11T13:45:00.000Z' }
  ];

  // Platform analytics data
  const engagementGrowth = [
    { month: 'Jan', Citizens: 200, Actions: 600 },
    { month: 'Feb', Citizens: 800, Actions: 1800 },
    { month: 'Mar', Citizens: 2400, Actions: 5400 },
    { month: 'Apr', Citizens: 6100, Actions: 14200 },
    { month: 'May', Citizens: 12450, Actions: 48200 }
  ];

  const handleModerate = (item, verifyStatus) => {
    // 1. Update in local queue
    setQueue(prev => prev.filter(q => !(q.challengeId === item.challengeId && q.userId === item.userId)));

    // 2. Update status in mock database challenges table
    const updatedChallenges = challenges.map(ch => {
      if (ch._id === item.challengeId) {
        const parts = ch.participants.map(p => {
          if (p.userId === item.userId) {
            return { ...p, status: verifyStatus };
          }
          return p;
        });
        return { ...ch, participants: parts };
      }
      return ch;
    });
    setChallenges(updatedChallenges);
    mockDb.setChallenges(updatedChallenges);

    // 3. Award points if verified
    if (verifyStatus === 'verified') {
      const updatedUsers = users.map(u => {
        if (u._id === item.userId) {
          const newPoints = u.points + item.pointsReward;
          
          // Add ActionLog
          const actions = mockDb.getActions();
          actions.push({
            _id: 'act_' + Math.random().toString(36).substr(2, 9),
            userId: item.userId,
            actionType: 'challenge_complete',
            category: item.challengeCategory,
            description: `Challenge verified by Admin: ${item.challengeTitle}`,
            pointsEarned: item.pointsReward,
            socialImpactMetrics: { treesPlanted: item.challengeCategory === 'Environmental' ? 1 : 0, plasticRecycledKg: 0, volunteerHours: 0, screenTimeReducedMins: 0 },
            timestamp: new Date().toISOString()
          });
          mockDb.setActions(actions);

          return { ...u, points: newPoints };
        }
        return u;
      });
      setUsers(updatedUsers);
      mockDb.setUsers(updatedUsers);
    }

    setToastMsg(verifyStatus === 'verified' ? 'Submission Approved! points issued.' : 'Submission Rejected.');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12 text-slate-800 dark:text-slate-100">
      
      {/* Toast */}
      {showToast && (
        <div className="fixed top-20 right-6 px-5 py-3 bg-emerald-600 text-white rounded-xl shadow-xl flex items-center gap-2 z-50 animate-bounce-slow font-bold text-sm">
          <CheckCircle className="w-5 h-5" /> {toastMsg}
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-red-500" /> Admin Control Console
        </h2>
        <p className="text-xs text-slate-400">Moderate submitted proofs, audit fraud detection logs, and monitor platform engagement analytics.</p>
      </div>

      {/* Platform Analytics Growth Charts */}
      <div className="p-6 glass-card rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-1.5"><TrendingUp className="w-5 h-5 text-emerald-500" /> Platform Growth Index</h3>
          <p className="text-xs text-slate-400">Monthly aggregate citizens onboarding vs logged action points</p>
        </div>

        <div className="h-64 w-full font-sans text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={engagementGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.1} />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, color: '#f8fafc' }} />
              <Line type="monotone" dataKey="Citizens" stroke="#10b981" strokeWidth={3} name="Total Onboarded" />
              <Line type="monotone" dataKey="Actions" stroke="#0284c7" strokeWidth={2} name="Total Impact Actions" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Queue Moderation & Fraud Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Verification Queue (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold">Verification Queue ({queue.length})</h3>
          
          {queue.length > 0 ? (
            <div className="space-y-4">
              {queue.map((item, idx) => (
                <div key={idx} className="p-5 glass-card rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] bg-sky-100 dark:bg-sky-950/20 text-sky-500 px-2 py-0.5 rounded font-bold uppercase">{item.challengeCategory}</span>
                      <h4 className="font-bold text-sm mt-1">{item.challengeTitle}</h4>
                      <p className="text-[10px] text-slate-400">Submitted by: <span className="font-bold text-slate-700 dark:text-slate-300">{item.userName}</span></p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-500">+{item.pointsReward} pts</span>
                  </div>

                  <div className="flex gap-4">
                    <img 
                      src={item.proofImage} 
                      alt="Proof" 
                      className="w-24 h-16 object-cover rounded-xl border border-slate-200 dark:border-slate-800"
                    />
                    <div className="text-xs leading-normal">
                      <span className="font-bold text-slate-400 block uppercase text-[9px] tracking-wider">Citizen Note</span>
                      <p className="italic text-slate-500 dark:text-slate-400 mt-0.5">"{item.notes}"</p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => handleModerate(item, 'verified')}
                      className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-[10px] flex items-center justify-center gap-1 shadow-md shadow-emerald-500/10"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Verify & Award
                    </button>
                    <button
                      onClick={() => handleModerate(item, 'failed')}
                      className="flex-1 py-1.5 bg-slate-200 dark:bg-slate-800 text-red-500 hover:bg-slate-300 rounded-xl font-bold text-[10px] flex items-center justify-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center glass-card rounded-2xl text-slate-400 text-xs py-12">
              🎉 Hurray! The moderation queue is empty.
            </div>
          )}
        </div>

        {/* Fraud Logs (1 col) */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold">Fraud Alerts Audit</h3>
          <div className="space-y-4">
            {fraudLogs.map((log) => (
              <div key={log.id} className="p-4 rounded-2xl bg-red-500/10 border-2 border-red-500/40 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded font-extrabold uppercase">
                    {log.type}
                  </span>
                  <span className="text-[10px] font-bold text-red-500">
                    {log.severity} RISK
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal font-semibold">
                  {log.details}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
