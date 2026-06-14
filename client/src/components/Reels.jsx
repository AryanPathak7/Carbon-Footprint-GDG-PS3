import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Share2, 
  Bookmark, 
  Play, 
  Volume2, 
  VolumeX, 
  HelpCircle,
  X,
  CheckCircle2,
  Plus,
  Video
} from 'lucide-react';
import { mockDb } from '../utils/mockDb';
import { useAuth } from '../context/AuthContext';

export default function Reels() {
  const { recordAction } = useAuth();
  
  const [reels, setReels] = useState(mockDb.getReels());
  const [activeIndex, setActiveIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [liked, setLiked] = useState({});
  const [saved, setSaved] = useState({});
  const [activeQuiz, setActiveQuiz] = useState(null); 
  const [quizSelected, setQuizSelected] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  
  // Toast and Modal states
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Reel Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Digital Detox');
  const [videoUrl, setVideoUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4');
  const [question, setQuestion] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');
  const [answer, setAnswer] = useState(0);
  const [explanation, setExplanation] = useState('');

  // File upload and video validation states
  const [uploadProgress, setUploadProgress] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [videoError, setVideoError] = useState({});

  const API_URL = '/api';

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFileName(file.name);
    setUploadProgress('Processing...');

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > 15) {
      setToastMsg('Notice: Large files (>15MB) may load slowly.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setVideoUrl(event.target.result);
      setUploadProgress('Ready');
      setVideoError({});
    };
    reader.onerror = (error) => {
      console.error('FileReader error:', error);
      setUploadProgress('Error loading file');
    };
    reader.readAsDataURL(file);
  };

  const handleVideoError = (reelId) => {
    setVideoError(prev => ({ ...prev, [reelId]: true }));
  };

  const videoPresets = [
    { label: 'Spotting SMS Fraud', url: '/videos/AQObZPBHkLPRHoQyQiNRSig4VBW2ZavOU0khOlKnhF0WzIMdg9Hj4DGOJl3bIIESP3J6nWqYCELhtcX1xZ9dmxvOmGDKsSm4h1bzBxI.mp4' },
    { label: 'Plastic Audit', url: '/videos/AQNMxtBY6x6Uk1i1ofEM8PXLL5d-l3_PAiXyZhn4UtDZ8hdkzNMF0xCMNqP3JM-pb8IjueY43zyV4XhivXBhm1sUlD9d5E8sweuBNCU.mp4' },
    { label: 'Digital Detox 20-20-20', url: '/videos/AQN4z94MPubxPHXRSiCaa5PM9nbRZ6UrdwU4qF_O9VBkNl13C2c_FmkQEDE4cxFLzC7ihGeH_saQv4xdkyN05FQoCgjOfJDX2fr5Cgk.mp4' },
    { label: 'Box Breathing', url: '/videos/AQMc1gRGzsVL4lI19Fuy6LjY5Wi1A5oZD0yJxnwQP729n7ozaCj0tQ2N9rkq4lq2waeS14s2_DqPPb1hrNj4P1kpIB6i5XWKRJGYk5U.mp4' },
    { label: 'Cycle Safety', url: '/videos/AQMYMfRoBD3g7hZ-2_a4QIXl0v_T43Y2ethU_OlFaltN-WXjCiOgl-qz9dBoTlMe4Gof_agqQTb05nx9FOfweK3-.mp4' }
  ];

  // Fetch reels from database on mount
  useEffect(() => {
    const fetchReels = async () => {
      try {
        const res = await fetch(`${API_URL}/reels`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            // Sanitize returned reels to migrate legacy external URLs to local self-hosted assets
            const sanitized = data.map(reel => {
              if (reel.url && (reel.url.includes('commondatastorage.googleapis.com') || reel.url.includes('mixkit.co'))) {
                const defaults = mockDb.getReels();
                const match = defaults.find(d => d.id === reel.id || d._id === reel._id || d.title === reel.title);
                if (match) {
                  return { ...reel, url: match.url };
                }
              }
              return reel;
            });
            setReels(sanitized);
          }
        }
      } catch (err) {
        console.warn('API disconnected, utilizing local storage reels.');
      }
    };
    fetchReels();
  }, []);

  // Auto scroll reels every 60 seconds
  useEffect(() => {
    const autoScrollTimer = setTimeout(() => {
      if (reels.length > 0) {
        setActiveIndex(prev => (prev + 1) % reels.length);
      }
    }, 60000); 

    return () => clearTimeout(autoScrollTimer);
  }, [activeIndex, reels.length]);

  const handleLike = (id) => {
    setLiked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = (id) => {
    setSaved(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleShare = (title) => {
    setToastMsg('Share link copied!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleQuizSubmit = (reel) => {
    if (quizSelected === null) return;
    setQuizSubmitted(true);

    const isCorrect = quizSelected === reel.quiz.answer;
    if (isCorrect) {
      recordAction({
        actionType: 'quiz',
        category: reel.category,
        description: `Passed Reels Quiz: ${reel.title}`,
        pointsEarned: 20,
        socialImpactMetrics: { treesPlanted: 0, plasticRecycledKg: 0, volunteerHours: 0, screenTimeReducedMins: 0 }
      });
      setToastMsg('Correct Answer! +20 Points added.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    }
  };

  const handleCreateReel = async (e) => {
    e.preventDefault();
    if (!title || !videoUrl || !question || !opt1 || !opt2 || !opt3) {
      setToastMsg('Please fill out all required fields and upload or specify a video.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
      return;
    }

    const newReelData = {
      title,
      category,
      url: videoUrl,
      quiz: {
        question,
        options: [opt1, opt2, opt3],
        answer: Number(answer),
        explanation
      }
    };

    const token = localStorage.getItem('awaresphere_token');
    let savedReel = null;

    if (token && token !== 'mock_token_abc') {
      try {
        const res = await fetch(`${API_URL}/reels`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(newReelData)
        });
        if (res.ok) {
          savedReel = await res.json();
        }
      } catch (err) {
        console.warn('API creation failed, running local storage fallback');
      }
    }

    if (!savedReel) {
      // Local sync fallback
      savedReel = {
        _id: 'reel_' + Math.random().toString(36).substr(2, 9),
        likes: 0,
        saves: 0,
        ...newReelData
      };
      const currentReels = mockDb.getReels();
      const updatedLocal = [savedReel, ...currentReels];
      try {
        mockDb.setReels(updatedLocal);
      } catch (quotaErr) {
        console.warn('LocalStorage quota exceeded! Storing in memory for this session.', quotaErr.message);
        setToastMsg('Warning: Storage limit reached. Video won\'t persist after refreshing.');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4500);
      }
    }

    setReels(prev => [savedReel, ...prev]);
    setShowCreateModal(false);
    
    // Reset form
    setTitle('');
    setQuestion('');
    setOpt1('');
    setOpt2('');
    setOpt3('');
    setExplanation('');
    setSelectedFileName('');
    setUploadProgress('');

    // If it was local, and toast was not set by warning
    const hasWarning = toastMsg && toastMsg.includes('Storage limit');
    if (!hasWarning) {
      setToastMsg('New Reel created successfully!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
    setActiveIndex(0); // Scroll to the top and play new reel
  };

  return (
    <div className="max-w-md mx-auto space-y-6 animate-fade-in relative pb-12">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 right-6 px-5 py-3 bg-emerald-600 text-white rounded-xl shadow-xl flex items-center gap-2 z-50 animate-bounce-slow font-bold text-sm">
          <CheckCircle2 className="w-5 h-5" /> {toastMsg}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extrabold">60-Second Reels</h2>
          <p className="text-xs text-slate-400">Swipe or click to learn micro-concepts quickly.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-1 text-xs shadow-md shadow-emerald-500/10"
        >
          <Plus className="w-4 h-4" /> Create Reel
        </button>
      </div>

      {/* Reel Stack Container */}
      <div className="space-y-6">
        {reels.map((reel, idx) => {
          const isActive = activeIndex === idx;
          const isL = liked[reel._id || reel.id];
          const isS = saved[reel._id || reel.id];

          return (
            <div 
              key={reel._id || reel.id}
              onClick={() => {
                if (isActive) {
                  const videoEl = document.getElementById(`video-${reel._id || reel.id}`);
                  if (videoEl) {
                    if (videoEl.paused) {
                      videoEl.play().catch(err => console.log('Autoplay error:', err.message));
                    } else {
                      videoEl.pause();
                    }
                  }
                } else {
                  setActiveIndex(idx);
                }
              }}
              className={`relative h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 transition-all duration-300 ${
                isActive 
                  ? 'border-emerald-500 scale-[1.02]' 
                  : 'border-slate-800 opacity-60 scale-95 cursor-pointer'
              }`}
            >
              {/* HTML Video player */}
              {isActive ? (
                videoError[reel._id || reel.id] ? (
                  <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center p-6 text-center space-y-3">
                    <Video className="w-12 h-12 text-rose-500 animate-pulse" />
                    <p className="text-sm font-bold text-slate-200">Playback Blocked</p>
                    <p className="text-xs text-slate-400 leading-normal">
                      Browser security blocks local paths. Please use "Create Reel" Option 1 to upload the file, or enter a valid web URL.
                    </p>
                  </div>
                ) : (
                  <video
                    id={`video-${reel._id || reel.id}`}
                    key={reel._id || reel.id}
                    src={reel.url}
                    autoPlay
                    loop
                    muted={muted}
                    playsInline
                    onError={() => handleVideoError(reel._id || reel.id)}
                    className="w-full h-full object-cover"
                  />
                )
              ) : (
                <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                  <Play className="w-16 h-16 text-slate-400" />
                </div>
              )}

              {/* Mute button overlay */}
              {isActive && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMuted(!muted);
                  }}
                  className="absolute top-4 left-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                >
                  {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              )}

              {/* Reel info overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white space-y-2">
                <span className="px-2 py-0.5 rounded bg-emerald-600 text-[10px] font-bold uppercase tracking-wider">
                  {reel.category}
                </span>
                <h3 className="text-lg font-bold leading-snug">{reel.title}</h3>
                
                {/* Take Quiz CTA */}
                {isActive && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveQuiz(reel);
                      setQuizSelected(null);
                      setQuizSubmitted(false);
                    }}
                    className="mt-2 w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-xs transition-colors"
                  >
                    <HelpCircle className="w-4 h-4" /> Double Points: Take 5s Quiz
                  </button>
                )}
              </div>

              {/* Right Side Action column overlays */}
              {isActive && (
                <div className="absolute right-4 bottom-24 flex flex-col gap-4 text-white z-10">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleLike(reel._id || reel.id); }}
                    className="flex flex-col items-center p-2 rounded-full bg-black/50 hover:bg-black/75 transition-colors"
                  >
                    <Heart className={`w-5 h-5 ${isL ? 'text-red-500 fill-red-500' : ''}`} />
                    <span className="text-[10px] font-bold mt-1">{(reel.likes || 0) + (isL ? 1 : 0)}</span>
                  </button>

                  <button 
                    onClick={(e) => { e.stopPropagation(); handleShare(reel.title); }}
                    className="flex flex-col items-center p-2 rounded-full bg-black/50 hover:bg-black/75 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                    <span className="text-[10px] font-bold mt-1">Share</span>
                  </button>

                  <button 
                    onClick={(e) => { e.stopPropagation(); handleSave(reel._id || reel.id); }}
                    className="flex flex-col items-center p-2 rounded-full bg-black/50 hover:bg-black/75 transition-colors"
                  >
                    <Bookmark className={`w-5 h-5 ${isS ? 'text-sky-400 fill-sky-400' : ''}`} />
                    <span className="text-[10px] font-bold mt-1">Save</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create Reel Modal Form */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleCreateReel} className="glass-card max-w-sm w-full rounded-3xl p-6 border border-slate-700/50 space-y-4 text-slate-800 dark:text-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold flex items-center gap-1.5"><Video className="w-5 h-5 text-emerald-500" /> Create Awareness Reel</h3>
              <button type="button" onClick={() => setShowCreateModal(false)} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase">Reel Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Spotting scam calls in 60s"
                className="w-full bg-slate-100 dark:bg-slate-900 border-none outline-none text-xs rounded-xl p-3 focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div className="space-y-3 p-3 bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 text-slate-800 dark:text-slate-100">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-emerald-500 uppercase flex items-center gap-1">
                  <Video className="w-3.5 h-3.5" /> Option 1: Upload Video File
                </label>
                <input
                  id="reel-file-input"
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 dark:file:bg-slate-800 dark:file:text-slate-200 cursor-pointer"
                />
                {selectedFileName && (
                  <div className="text-[10px] font-medium text-slate-500 flex items-center justify-between mt-1">
                    <span className="truncate max-w-[200px]">Selected: {selectedFileName}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{uploadProgress}</span>
                  </div>
                )}
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                <span className="flex-shrink mx-2 text-[9px] text-slate-400 font-bold uppercase">Or</span>
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Option 2: Video URL or Path</label>
                <input
                  type="text"
                  value={selectedFileName ? '' : videoUrl}
                  onChange={(e) => {
                    setVideoUrl(e.target.value);
                    setSelectedFileName('');
                    setUploadProgress('');
                    const fileInput = document.getElementById('reel-file-input');
                    if (fileInput) fileInput.value = '';
                  }}
                  placeholder="e.g. https://commondatastorage.googleapis.com/...mp4"
                  className="w-full bg-white dark:bg-slate-900 border-none outline-none text-xs rounded-xl p-3 focus:ring-1 focus:ring-sky-500 text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-900 border-none outline-none text-xs rounded-xl p-2.5 focus:ring-1 focus:ring-sky-500 text-slate-800 dark:text-slate-100"
                >
                  <option value="Cyber Fraud Prevention">Cyber Safety</option>
                  <option value="Climate Change">Climate Change</option>
                  <option value="Digital Detox">Digital Detox</option>
                  <option value="Mental Health">Mental Health</option>
                  <option value="Health Awareness">Health Awareness</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Preset Auto-Fill</label>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      setVideoUrl(e.target.value);
                      setSelectedFileName('');
                      setUploadProgress('');
                      const fileInput = document.getElementById('reel-file-input');
                      if (fileInput) fileInput.value = '';
                    }
                  }}
                  className="w-full bg-slate-100 dark:bg-slate-900 border-none outline-none text-xs rounded-xl p-2.5 focus:ring-1 focus:ring-sky-500 text-slate-800 dark:text-slate-100"
                >
                  <option value="">-- Choose Preset --</option>
                  {videoPresets.map((preset, pIdx) => (
                    <option key={pIdx} value={preset.url}>{preset.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-3 space-y-3">
              <h4 className="text-xs font-bold uppercase text-emerald-500">Interactive End-Quiz Setup</h4>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">MCQ Question</label>
                <input
                  type="text"
                  required
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g. Should you share OTP credentials?"
                  className="w-full bg-slate-100 dark:bg-slate-900 border-none outline-none text-xs rounded-xl p-2.5 focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 gap-2">
                <input
                  type="text"
                  required
                  value={opt1}
                  onChange={(e) => setOpt1(e.target.value)}
                  placeholder="Option 1"
                  className="w-full bg-slate-100 dark:bg-slate-900 border-none outline-none text-xs rounded-xl p-2.5 focus:ring-1 focus:ring-sky-500"
                />
                <input
                  type="text"
                  required
                  value={opt2}
                  onChange={(e) => setOpt2(e.target.value)}
                  placeholder="Option 2"
                  className="w-full bg-slate-100 dark:bg-slate-900 border-none outline-none text-xs rounded-xl p-2.5 focus:ring-1 focus:ring-sky-500"
                />
                <input
                  type="text"
                  required
                  value={opt3}
                  onChange={(e) => setOpt3(e.target.value)}
                  placeholder="Option 3"
                  className="w-full bg-slate-100 dark:bg-slate-900 border-none outline-none text-xs rounded-xl p-2.5 focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Correct Answer</label>
                  <select
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-900 border-none outline-none text-xs rounded-xl p-2.5 focus:ring-1 focus:ring-sky-500"
                  >
                    <option value={0}>Option 1</option>
                    <option value={1}>Option 2</option>
                    <option value={2}>Option 3</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Brief Explanation</label>
                  <input
                    type="text"
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    placeholder="Why is this correct?"
                    className="w-full bg-slate-100 dark:bg-slate-900 border-none outline-none text-xs rounded-xl p-2.5 focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-2 bg-slate-200 dark:bg-slate-800 text-slate-400 rounded-xl font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md"
              >
                Publish Reel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reel Quiz Modal */}
      {activeQuiz && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="glass-card max-w-sm w-full rounded-3xl p-6 border border-slate-700/50 space-y-4 text-slate-800 dark:text-slate-100">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold flex items-center gap-1.5"><HelpCircle className="w-5 h-5 text-emerald-500" /> Reel Quiz</h3>
              <button onClick={() => setActiveQuiz(null)} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm font-semibold">{activeQuiz.quiz.question}</p>

            <div className="space-y-2">
              {activeQuiz.quiz.options.map((opt, oIdx) => {
                const isSelected = quizSelected === oIdx;
                const isCorrect = oIdx === activeQuiz.quiz.answer;
                
                let btnStyle = 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800';
                if (isSelected) {
                  btnStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-500';
                }
                if (quizSubmitted) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-600 text-white border-emerald-600';
                  } else if (isSelected) {
                    btnStyle = 'bg-red-600 text-white border-red-600';
                  } else {
                    btnStyle = 'opacity-50';
                  }
                }

                return (
                  <button
                    key={oIdx}
                    disabled={quizSubmitted}
                    onClick={() => setQuizSelected(oIdx)}
                    className={`w-full text-left p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-colors ${btnStyle}`}
                  >
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {!quizSubmitted ? (
              <button
                onClick={() => handleQuizSubmit(activeQuiz)}
                disabled={quizSelected === null}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all"
              >
                Submit Answer
              </button>
            ) : (
              <div className="space-y-3 pt-2">
                <p className="text-xs text-slate-400 leading-normal italic bg-slate-100 dark:bg-slate-900/40 p-3 rounded-xl">
                  <span className="font-bold block text-slate-500 dark:text-slate-400">Explanation:</span>
                  {activeQuiz.quiz.explanation}
                </p>
                <button
                  onClick={() => setActiveQuiz(null)}
                  className="w-full py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs hover:bg-slate-300 dark:hover:bg-slate-700 transition-all"
                >
                  Close Quiz
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
