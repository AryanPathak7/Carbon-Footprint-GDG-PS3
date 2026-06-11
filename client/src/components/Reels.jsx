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
  const [videoUrl, setVideoUrl] = useState('https://assets.mixkit.co/videos/preview/mixkit-holding-a-smartphone-showing-a-text-message-40017-large.mp4');
  const [question, setQuestion] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');
  const [answer, setAnswer] = useState(0);
  const [explanation, setExplanation] = useState('');

  const API_URL = 'http://localhost:5000/api';

  const videoPresets = [
    { label: 'Cyber Texting Loop', url: 'https://assets.mixkit.co/videos/preview/mixkit-holding-a-smartphone-showing-a-text-message-40017-large.mp4' },
    { label: 'Plastic Recycling Bin', url: 'https://assets.mixkit.co/videos/preview/mixkit-putting-plastic-bottles-into-a-recycling-bin-34139-large.mp4' },
    { label: 'Late Night Screen Glow', url: 'https://assets.mixkit.co/videos/preview/mixkit-man-working-late-in-front-of-his-computer-screen-34283-large.mp4' },
    { label: 'Forest Meditating', url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-meditating-in-nature-31952-large.mp4' },
    { label: 'Cyclist Safe Commute', url: 'https://assets.mixkit.co/videos/preview/mixkit-cyclist-riding-on-a-road-34483-large.mp4' }
  ];

  // Fetch reels from database on mount
  useEffect(() => {
    const fetchReels = async () => {
      try {
        const res = await fetch(`${API_URL}/reels`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setReels(data);
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
    if (!title || !question || !opt1 || !opt2 || !opt3) return;

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
      mockDb.setReels(updatedLocal);
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

    setToastMsg('New Reels created successfully!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
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
              onClick={() => setActiveIndex(idx)}
              className={`relative h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 transition-all duration-300 ${
                isActive 
                  ? 'border-emerald-500 scale-[1.02]' 
                  : 'border-slate-800 opacity-60 scale-95 cursor-pointer'
              }`}
            >
              {/* HTML Video player */}
              {isActive ? (
                <video
                  src={reel.url}
                  autoPlay
                  loop
                  muted={muted}
                  playsInline
                  className="w-full h-full object-cover"
                />
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

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-900 border-none outline-none text-xs rounded-xl p-2.5 focus:ring-1 focus:ring-sky-500"
                >
                  <option value="Cyber Fraud Prevention">Cyber Safety</option>
                  <option value="Climate Change">Climate Change</option>
                  <option value="Digital Detox">Digital Detox</option>
                  <option value="Mental Health">Mental Health</option>
                  <option value="Health Awareness">Health Awareness</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Video Loop Preset</label>
                <select
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-900 border-none outline-none text-xs rounded-xl p-2.5 focus:ring-1 focus:ring-sky-500"
                >
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
