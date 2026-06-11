import React, { useState } from 'react';
import { 
  MapPin, 
  Users, 
  Calendar, 
  Filter, 
  QrCode, 
  CheckCircle, 
  ShieldAlert, 
  Search 
} from 'lucide-react';
import { mockDb } from '../utils/mockDb';
import { useAuth } from '../context/AuthContext';

export default function CampaignMap() {
  const { user, recordAction } = useAuth();
  const [campaigns, setCampaigns] = useState(mockDb.getCampaigns());
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCampaign, setActiveCampaign] = useState(campaigns[0]);
  const [showScanner, setShowScanner] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const categories = ['All', 'Environmental', 'Cyber Safety', 'Health & Fitness'];

  const filtered = campaigns.filter(c => {
    const matchesCat = filterCategory === 'All' || c.category === filterCategory;
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleJoin = (campId, title, category, reward) => {
    // Join logic
    const updated = campaigns.map(c => {
      if (c._id === campId) {
        return { ...c, volunteers: [...c.volunteers, user._id] };
      }
      return c;
    });
    setCampaigns(updated);
    mockDb.setCampaigns(updated);
    
    // Log action
    recordAction({
      actionType: 'campaign_join',
      category,
      description: `Registered as volunteer for campaign: ${title}`,
      pointsEarned: 10,
      socialImpactMetrics: { treesPlanted: 0, plasticRecycledKg: 0, volunteerHours: 0, screenTimeReducedMins: 0 }
    });

    setToastMsg('Registered as volunteer! +10 Points');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleCheckin = (camp) => {
    setShowScanner(true);
    setScanSuccess(false);

    // Simulate scanning
    setTimeout(() => {
      setScanSuccess(true);
      setTimeout(() => {
        setShowScanner(false);
        
        // Update attendance
        const updated = campaigns.map(c => {
          if (c._id === camp._id) {
            return {
              ...c,
              attendance: [...c.attendance, { userId: user._id, checkedInAt: new Date().toISOString() }],
              volunteers: c.volunteers.includes(user._id) ? c.volunteers : [...c.volunteers, user._id]
            };
          }
          return c;
        });
        setCampaigns(updated);
        mockDb.setCampaigns(updated);

        // Record rewards
        recordAction({
          actionType: 'campaign_attend',
          category: camp.category,
          description: `Attended campaign and validated attendance QR: ${camp.title}`,
          pointsEarned: camp.pointsReward,
          socialImpactMetrics: {
            treesPlanted: camp.category === 'Environmental' ? 1 : 0,
            plasticRecycledKg: camp.category === 'Environmental' ? 3 : 0,
            volunteerHours: 3,
            screenTimeReducedMins: 180
          }
        });

        setToastMsg(`QR Verified! Checked in successfully. +${camp.pointsReward} Points!`);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }, 1500);
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto animate-fade-in pb-12">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 right-6 px-5 py-3 bg-emerald-600 text-white rounded-xl shadow-xl flex items-center gap-2 z-50 animate-bounce-slow font-bold text-sm">
          <CheckCircle className="w-5 h-5" /> {toastMsg}
        </div>
      )}

      {/* Left 1 Col: Filters and List */}
      <div className="space-y-6 lg:col-span-1 flex flex-col h-[calc(100vh-12rem)]">
        <div>
          <h2 className="text-2xl font-extrabold">Local Campaigns</h2>
          <p className="text-xs text-slate-400">Join nearby environmental or safety drives.</p>
        </div>

        {/* Filter controls */}
        <div className="space-y-3">
          <div className="bg-slate-200 dark:bg-slate-800 rounded-xl px-4 py-2.5 flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search drives..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-xs w-full text-slate-700 dark:text-slate-200"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  filterCategory === cat
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Cards List container scrollable */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {filtered.map(camp => {
            const isSelected = activeCampaign?._id === camp._id;
            return (
              <div
                key={camp._id}
                onClick={() => setActiveCampaign(camp)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500'
                    : 'glass-card border-slate-200 dark:border-slate-800/80 hover:scale-[1.01]'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">{camp.category}</span>
                  <span className="text-[10px] text-slate-400 font-bold">+{camp.pointsReward} pts</span>
                </div>
                <h4 className="font-bold text-sm leading-snug">{camp.title}</h4>
                <div className="flex items-center gap-1 mt-3 text-[10px] text-slate-400">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[200px]">{camp.location.address}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right 2 Cols: Details & Simulated Map */}
      <div className="lg:col-span-2 space-y-6">
        {activeCampaign ? (
          <div className="space-y-6">
            
            {/* Map Heatmap Canvas (Delhi layout grid) */}
            <div className="relative h-64 w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col justify-end p-6">
              
              {/* Map Heatmap coordinate points drawing */}
              <div className="absolute inset-0 opacity-40">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  {/* Grid Lines */}
                  <line x1="0" y1="50" x2="600" y2="50" stroke="#334155" strokeWidth="1" />
                  <line x1="0" y1="100" x2="600" y2="100" stroke="#334155" strokeWidth="1" />
                  <line x1="0" y1="150" x2="600" y2="150" stroke="#334155" strokeWidth="1" />
                  <line x1="0" y1="200" x2="600" y2="200" stroke="#334155" strokeWidth="1" />
                  
                  <line x1="100" y1="0" x2="100" y2="300" stroke="#334155" strokeWidth="1" />
                  <line x1="200" y1="0" x2="200" y2="300" stroke="#334155" strokeWidth="1" />
                  <line x1="300" y1="0" x2="300" y2="300" stroke="#334155" strokeWidth="1" />
                  <line x1="400" y1="0" x2="400" y2="300" stroke="#334155" strokeWidth="1" />

                  {/* Heatmap Density gradients */}
                  <circle cx="200" cy="120" r="45" fill="rgba(16, 185, 129, 0.2)" />
                  <circle cx="200" cy="120" r="15" fill="rgba(16, 185, 129, 0.4)" />
                  
                  <circle cx="340" cy="80" r="35" fill="rgba(2, 132, 199, 0.15)" />
                  
                  <circle cx="150" cy="200" r="50" fill="rgba(244, 63, 94, 0.1)" />

                  {/*Delhi Landmarks Mock */}
                  <text x="210" y="115" fill="#94a3b8" fontSize="10" fontWeight="bold">Connaught Place</text>
                  <text x="350" y="75" fill="#94a3b8" fontSize="10" fontWeight="bold">India Gate</text>
                  <text x="160" y="195" fill="#94a3b8" fontSize="10" fontWeight="bold">Sector 15 Park</text>

                  {/* Coordinate Pin matching selected campaign */}
                  {activeCampaign._id === 'camp_1' && (
                    <circle cx="150" cy="200" r="8" fill="#10b981" className="animate-ping" />
                  )}
                  {activeCampaign._id === 'camp_1' && (
                    <circle cx="150" cy="200" r="6" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                  )}
                  
                  {activeCampaign._id === 'camp_2' && (
                    <circle cx="200" cy="120" r="8" fill="#10b981" className="animate-ping" />
                  )}
                  {activeCampaign._id === 'camp_2' && (
                    <circle cx="200" cy="120" r="6" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                  )}

                  {activeCampaign._id === 'camp_3' && (
                    <circle cx="340" cy="80" r="8" fill="#10b981" className="animate-ping" />
                  )}
                  {activeCampaign._id === 'camp_3' && (
                    <circle cx="340" cy="80" r="6" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                  )}
                </svg>
              </div>

              {/* Map Info overlay */}
              <div className="z-10 bg-black/60 backdrop-blur-md p-4 rounded-2xl flex items-center justify-between text-white w-full border border-white/10">
                <div className="flex gap-2.5 items-center">
                  <MapPin className="w-5 h-5 text-emerald-500" />
                  <div>
                    <h5 className="font-bold text-xs">Delhi Awareness Heatmap</h5>
                    <p className="text-[10px] text-slate-400">Green represents active campaign density.</p>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                  GPS Active
                </span>
              </div>
            </div>

            {/* Campaign details card */}
            <div className="p-6 glass-card rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
              
              <div className="flex justify-between items-start pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">{activeCampaign.category}</span>
                  <h3 className="text-xl font-bold mt-1">{activeCampaign.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">Hosted by {activeCampaign.ngoName}</p>
                </div>
                <span className="text-2xl font-extrabold text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1.5 rounded-2xl">
                  +{activeCampaign.pointsReward}
                </span>
              </div>

              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {activeCampaign.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <Calendar className="w-4 h-4 text-emerald-500" />
                  <div>
                    <span className="font-bold block text-slate-700 dark:text-slate-300">Date & Time</span>
                    {new Date(activeCampaign.startDate).toLocaleDateString()} at {new Date(activeCampaign.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <Users className="w-4 h-4 text-sky-500" />
                  <div>
                    <span className="font-bold block text-slate-700 dark:text-slate-300">Volunteers Joined</span>
                    {activeCampaign.volunteers.length} active citizens
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {activeCampaign.volunteers.includes(user._id) ? (
                  <span className="flex-1 py-3 border border-emerald-500/30 text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 font-bold rounded-xl text-center text-xs flex items-center justify-center gap-1.5">
                    <CheckCircle className="w-4 h-4" /> Registered as Volunteer
                  </span>
                ) : (
                  <button
                    onClick={() => handleJoin(activeCampaign._id, activeCampaign.title, activeCampaign.category, activeCampaign.pointsReward)}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors"
                  >
                    Volunteer for Event
                  </button>
                )}

                <button
                  onClick={() => handleCheckin(activeCampaign)}
                  className="py-3 px-6 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2"
                >
                  <QrCode className="w-4 h-4" /> QR Check-In
                </button>
              </div>

            </div>

          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm">
            Select a campaign to view directions, heatmap coordinates, and check-in options.
          </div>
        )}
      </div>

      {/* QR Code Scanner Dialog Overlay */}
      {showScanner && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4">
          <div className="glass-card max-w-sm w-full rounded-3xl p-6 border-2 border-emerald-500 text-center space-y-6 text-slate-800 dark:text-slate-100">
            <h3 className="font-bold text-lg flex items-center justify-center gap-2"><QrCode className="w-5 h-5 text-emerald-500" /> QR Check-In Scanner</h3>
            <p className="text-xs text-slate-400">Aiming camera at campaign organizer QR code...</p>

            <div className="relative w-48 h-48 mx-auto border-4 border-emerald-500 rounded-3xl overflow-hidden bg-black flex items-center justify-center">
              {/* Animated Scan Line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-500 shadow-md shadow-emerald-500/50 animate-bounce"></div>
              
              {scanSuccess ? (
                <CheckCircle className="w-16 h-16 text-emerald-400 animate-pulse" />
              ) : (
                <div className="w-32 h-32 border-2 border-dashed border-emerald-500/40 rounded-xl flex items-center justify-center">
                  <span className="text-[10px] text-slate-500 font-mono">Simulating scan...</span>
                </div>
              )}
            </div>

            {scanSuccess ? (
              <p className="text-xs text-emerald-500 font-bold animate-pulse">QR Authenticated successfully!</p>
            ) : (
              <p className="text-xs text-slate-400">Scan processes in 2 seconds.</p>
            )}

            <button
              onClick={() => {
                setShowScanner(false);
                setScanSuccess(false);
              }}
              className="px-6 py-2 bg-slate-200 dark:bg-slate-800 text-slate-400 font-bold rounded-xl text-xs"
            >
              Cancel Scan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
