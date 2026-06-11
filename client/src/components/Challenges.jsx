import React, { useState } from 'react';
import { 
  Trophy, 
  Leaf, 
  Clock, 
  Users, 
  Image as ImageIcon,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { mockDb } from '../utils/mockDb';
import { useAuth } from '../context/AuthContext';

export default function Challenges() {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState(mockDb.getChallenges());
  const [submittingId, setSubmittingId] = useState(null);
  const [uploadNote, setUploadNote] = useState('');
  const [uploadImg, setUploadImg] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleJoin = (challId) => {
    const updated = challenges.map(ch => {
      if (ch._id === challId) {
        return {
          ...ch,
          participants: [...ch.participants, { userId: user._id, status: 'active', submittedAt: null }]
        };
      }
      return ch;
    });

    setChallenges(updated);
    mockDb.setChallenges(updated);
  };

  const handleOpenSubmit = (challId) => {
    setSubmittingId(challId);
    setUploadNote('');
    setUploadImg('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=400&q=80'); // preset mock upload image
  };

  const handleSubmitProof = (e) => {
    e.preventDefault();
    
    const updated = challenges.map(ch => {
      if (ch._id === submittingId) {
        const parts = ch.participants.map(p => {
          if (p.userId === user._id) {
            return {
              ...p,
              status: 'submitted',
              proofImage: uploadImg,
              notes: uploadNote,
              submittedAt: new Date().toISOString()
            };
          }
          return p;
        });
        return { ...ch, participants: parts };
      }
      return ch;
    });

    setChallenges(updated);
    mockDb.setChallenges(updated);
    setSubmittingId(null);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Toast */}
      {showToast && (
        <div className="fixed top-20 right-6 px-5 py-3 bg-emerald-600 text-white rounded-xl shadow-xl flex items-center gap-2 z-50 animate-bounce-slow font-bold text-sm">
          <CheckCircle className="w-5 h-5" /> Challenge proof submitted! Awaiting Admin verification.
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold flex items-center gap-2"><Trophy className="w-6 h-6 text-emerald-500" /> Community Challenges</h2>
        <p className="text-xs text-slate-400">Complete tasks in the real world. Upload proof to earn badges and awareness points.</p>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {challenges.map((ch) => {
          const participant = ch.participants.find(p => p.userId === user._id);
          const isJoined = !!participant;
          const status = participant?.status || 'none';

          return (
            <div key={ch._id} className="p-6 glass-card rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:scale-[1.01] transition-transform">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold font-sans">
                    {ch.category}
                  </span>
                  <span className="text-sm font-bold text-yellow-500">+{ch.pointsReward} pts</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold">{ch.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-normal">{ch.description}</p>
                </div>
              </div>

              {/* Status Section */}
              <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{ch.durationDays} Days Duration</span>
                </div>

                {status === 'none' && (
                  <button
                    onClick={() => handleJoin(ch._id)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md"
                  >
                    Accept Challenge
                  </button>
                )}

                {status === 'active' && (
                  <button
                    onClick={() => handleOpenSubmit(ch._id)}
                    className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-xl shadow-md"
                  >
                    Upload Proof
                  </button>
                )}

                {status === 'submitted' && (
                  <span className="text-xs font-bold text-sky-500 bg-sky-100 dark:bg-sky-950/40 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Pending Approval
                  </span>
                )}

                {status === 'verified' && (
                  <span className="text-xs font-bold text-emerald-500 bg-emerald-100 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Completed & Verified
                  </span>
                )}

                {status === 'failed' && (
                  <span className="text-xs font-bold text-red-500 bg-red-100 dark:bg-red-950/40 px-2.5 py-1 rounded-full">
                    Rejected
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload Proof overlay */}
      {submittingId && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSubmitProof} className="glass-card max-w-sm w-full rounded-3xl p-6 border border-slate-700/50 space-y-4 text-slate-800 dark:text-slate-100">
            <h3 className="font-bold text-lg">Upload Challenge Proof</h3>
            <p className="text-xs text-slate-400">Share your completion photo and description.</p>

            <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-center space-y-2">
              <ImageIcon className="w-8 h-8 text-sky-500 mx-auto" />
              <span className="text-[10px] text-emerald-500 font-bold block">Preset: Plant_a_Tree.jpg loaded</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase">Write notes</label>
              <textarea
                required
                value={uploadNote}
                onChange={(e) => setUploadNote(e.target.value)}
                placeholder="Explain what action you performed..."
                rows={3}
                className="w-full bg-slate-100 dark:bg-slate-900 border-none outline-none text-xs rounded-xl p-3 focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSubmittingId(null)}
                className="flex-1 py-2 bg-slate-200 dark:bg-slate-800 text-slate-400 rounded-xl font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md"
              >
                Submit Proof
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
