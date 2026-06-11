import React, { useState } from 'react';
import { 
  Plus, 
  Users, 
  Calendar, 
  MapPin, 
  CheckCircle, 
  FileText, 
  Award,
  TrendingUp
} from 'lucide-react';
import { mockDb } from '../utils/mockDb';
import { useAuth } from '../context/AuthContext';

export default function NGOManagement() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState(mockDb.getCampaigns());
  const [showAddForm, setShowAddForm] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Environmental');
  const [address, setAddress] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pointsReward, setPointsReward] = useState('100');

  const myCampaigns = campaigns.filter(c => c.ngoId === 'user_ngo_1'); // Simulated NGO account

  const handleSubmit = (e) => {
    e.preventDefault();

    const newCamp = {
      _id: 'camp_' + Math.random().toString(36).substr(2, 9),
      title,
      description,
      category,
      ngoId: 'user_ngo_1',
      ngoName: user?.name || 'Green Earth Foundation',
      location: {
        lat: 28.6139 + (Math.random() - 0.5) * 0.1, // Delhi bounds
        lng: 77.2090 + (Math.random() - 0.5) * 0.1,
        address
      },
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      volunteers: [],
      attendance: [],
      status: 'active',
      pointsReward: Number(pointsReward),
      createdAt: new Date().toISOString()
    };

    const updated = [newCamp, ...campaigns];
    setCampaigns(updated);
    mockDb.setCampaigns(updated);

    setShowAddForm(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);

    // Reset fields
    setTitle('');
    setDescription('');
    setAddress('');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12 text-slate-800 dark:text-slate-100">
      
      {/* Toast */}
      {showToast && (
        <div className="fixed top-20 right-6 px-5 py-3 bg-emerald-600 text-white rounded-xl shadow-xl flex items-center gap-2 z-50 animate-bounce-slow font-bold text-sm">
          <CheckCircle className="w-5 h-5" /> Campaign launched successfully!
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extrabold">NGO Management Console</h2>
          <p className="text-xs text-slate-400">Launch campaigns, track volunteer registers, and evaluate metrics.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/15"
        >
          <Plus className="w-4 h-4" /> Create Campaign
        </button>
      </div>

      {/* NGO Analytics cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 glass-card rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/20 text-emerald-500 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Total Volunteers</p>
            <h4 className="text-xl font-extrabold">42 Citizens</h4>
          </div>
        </div>

        <div className="p-5 glass-card rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950/20 text-sky-500 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Active Campaigns</p>
            <h4 className="text-xl font-extrabold">{myCampaigns.length} Campaigns</h4>
          </div>
        </div>

        <div className="p-5 glass-card rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-yellow-100 dark:bg-yellow-950/20 text-yellow-500 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Reward Budget</p>
            <h4 className="text-xl font-extrabold">370 Points Issued</h4>
          </div>
        </div>
      </div>

      {/* Form or Campaign List */}
      {showAddForm ? (
        /* Create form */
        <form onSubmit={handleSubmit} className="p-6 glass-card rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-lg font-bold">Launch Awareness Campaign</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase">Campaign Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Tree Plantation Drive Connaught Place"
                className="w-full bg-slate-100 dark:bg-slate-900 border-none outline-none text-xs rounded-xl p-3 focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-900 border-none outline-none text-xs rounded-xl p-3 focus:ring-1 focus:ring-sky-500"
              >
                <option value="Environmental">Environmental</option>
                <option value="Cyber Safety">Cyber Safety</option>
                <option value="Health & Fitness">Health & Fitness</option>
                <option value="Digital Wellbeing">Digital Wellbeing</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase">Campaign Description</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail volunteer duties, goals, and schedule..."
              rows={3}
              className="w-full bg-slate-100 dark:bg-slate-900 border-none outline-none text-xs rounded-xl p-3 focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase">Start Date & Time</label>
              <input
                type="datetime-local"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-900 border-none outline-none text-xs rounded-xl p-3 focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase">End Date & Time</label>
              <input
                type="datetime-local"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-900 border-none outline-none text-xs rounded-xl p-3 focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase">Reward Points</label>
              <input
                type="number"
                value={pointsReward}
                onChange={(e) => setPointsReward(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-900 border-none outline-none text-xs rounded-xl p-3 focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase">Geographical Address</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Community Park Sector 3, Dwarka, New Delhi"
              className="w-full bg-slate-100 dark:bg-slate-900 border-none outline-none text-xs rounded-xl p-3 focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="flex-1 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-400 rounded-xl font-bold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md"
            >
              Publish Campaign
            </button>
          </div>
        </form>
      ) : (
        /* List */
        <div className="space-y-4">
          <h3 className="text-lg font-bold">Your Campaigns</h3>
          <div className="space-y-4">
            {myCampaigns.map(camp => (
              <div key={camp._id} className="p-5 glass-card rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">{camp.category}</span>
                  <h4 className="font-bold text-base mt-1">{camp.title}</h4>
                  <div className="flex gap-4 mt-3 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-sky-500" /> {camp.location.address}</span>
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-purple-500" /> {camp.volunteers.length} registered</span>
                  </div>
                </div>

                <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 border border-emerald-500/20 text-[10px] font-bold rounded">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
