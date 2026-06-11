import React, { useState } from 'react';
import { 
  Heart, 
  Share2, 
  Bookmark, 
  BookOpen, 
  HelpCircle, 
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  Share
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Feed() {
  const { user, recordAction } = useAuth();
  const [likes, setLikes] = useState({});
  const [saves, setSaves] = useState({});
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showShareNotification, setShowShareNotification] = useState(false);

  const feedItems = [
    {
      id: 'feed_1',
      type: 'article',
      category: 'Cyber Safety',
      title: 'Spotting SMS phishing scams (Smishing)',
      content: 'Have you received text messages claiming your utility bill is overdue or a courier parcel is stuck at customs? Smishing attacks create false urgency to steal card credentials. Never click shortened links. Verify card status on your official banking app independently.',
      author: 'Cyber Defense Alliance',
      readTime: '2 min read',
      ageLimit: ['adult', 'senior', 'teen']
    },
    {
      id: 'feed_2',
      type: 'infographic',
      category: 'Environmental',
      title: 'How to Segregate Domestic Waste',
      content: '🌳 Green Bin: Organic items, food waste, vegetable peelings. 🗑️ Blue Bin: Cardboard, paper, clean glass, metal cans. ⚠️ Red Bin: Batteries, lightbulbs, electronic parts, masks.',
      image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
      ageLimit: ['child', 'teen', 'adult', 'senior']
    },
    {
      id: 'feed_3',
      type: 'quiz',
      category: 'Digital Wellbeing',
      title: 'Quick Test: Are you Screen Dependent?',
      question: 'What is the 20-20-20 rule used for?',
      options: [
        'Looking away every 20 minutes to reduce eye strain',
        'Sleeping 20 minutes after 20 hours of coding',
        'Locking your phone 20 times a day'
      ],
      answer: 0,
      explanation: 'The 20-20-20 rule helps alleviate digital eye strain: Every 20 minutes, look at an object 20 feet away for 20 seconds.',
      ageLimit: ['teen', 'adult', 'senior']
    },
    {
      id: 'feed_4',
      type: 'article',
      category: 'Mental Health',
      title: 'Box Breathing: A 4-Second De-stress Technique',
      content: '1. Inhale slowly through your nose for 4 seconds. 2. Hold your breath for 4 seconds. 3. Exhale fully through your mouth for 4 seconds. 4. Hold your lungs empty for 4 seconds. Repeat 4 times to drop high heart rates and clear cortisol.',
      author: 'Mindfulness Foundation',
      readTime: '1 min read',
      ageLimit: ['teen', 'adult', 'senior', 'child']
    }
  ];

  // Personalize based on age group
  const personalizedFeed = feedItems.filter(item => item.ageLimit.includes(user?.ageGroup || 'adult'));

  const handleLike = (id) => {
    setLikes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = (id) => {
    setSaves(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleShare = (title, category) => {
    // Record action in Awareness Engine
    recordAction({
      actionType: 'feed_share',
      category,
      description: `Shared feed post: ${title}`,
      pointsEarned: 5,
      socialImpactMetrics: { treesPlanted: 0, plasticRecycledKg: 0, volunteerHours: 0, screenTimeReducedMins: 0 }
    });

    setShowShareNotification(true);
    setTimeout(() => setShowShareNotification(false), 3000);
  };

  const handleQuizAnswer = (itemId, selectedIndex, correctIndex, category, title) => {
    if (quizAnswers[itemId] !== undefined) return; // already answered

    setQuizAnswers(prev => ({ ...prev, [itemId]: selectedIndex }));

    if (selectedIndex === correctIndex) {
      // Award points
      recordAction({
        actionType: 'quiz',
        category,
        description: `Passed mini feed quiz: ${title}`,
        pointsEarned: 15,
        socialImpactMetrics: { treesPlanted: 0, plasticRecycledKg: 0, volunteerHours: 0, screenTimeReducedMins: 0 }
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in pb-12">
      
      {/* Toast Notification */}
      {showShareNotification && (
        <div className="fixed top-20 right-6 px-5 py-3 bg-emerald-600 text-white rounded-xl shadow-xl flex items-center gap-2 z-50 animate-bounce-slow font-bold text-sm">
          <CheckCircle className="w-5 h-5" /> Link copied! +5 Points rewarded.
        </div>
      )}

      {/* Feed Title */}
      <div>
        <h2 className="text-2xl font-extrabold">Your Awareness Feed</h2>
        <p className="text-xs text-slate-400">Personalized content based on your interests and age group: <span className="font-bold text-emerald-500 capitalize">{user?.ageGroup}</span></p>
      </div>

      {/* Feed items list */}
      {personalizedFeed.map((item) => (
        <div key={item.id} className="glass-card rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md">
          
          {/* Card Header */}
          <div className="p-5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-500/5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {item.category}
            </span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px] uppercase font-bold text-slate-400">
                {item.type}
              </span>
              {item.readTime && (
                <span className="text-[10px] text-slate-400">{item.readTime}</span>
              )}
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6 space-y-4">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-snug">
              {item.title}
            </h3>
            
            {item.type === 'infographic' && item.image && (
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-48 object-cover rounded-2xl border border-slate-200 dark:border-slate-800"
              />
            )}

            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed whitespace-pre-line">
              {item.content}
            </p>

            {/* Quiz Body */}
            {item.type === 'quiz' && (
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
                <p className="font-bold text-sm flex items-center gap-2"><HelpCircle className="w-4 h-4 text-emerald-500" /> {item.question}</p>
                <div className="space-y-2">
                  {item.options.map((opt, oIdx) => {
                    const isAnswered = quizAnswers[item.id] !== undefined;
                    const isSelected = quizAnswers[item.id] === oIdx;
                    const isCorrect = oIdx === item.answer;

                    let btnClass = 'bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200';
                    if (isAnswered) {
                      if (isCorrect) {
                        btnClass = 'bg-emerald-100 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-400';
                      } else if (isSelected) {
                        btnClass = 'bg-red-100 dark:bg-red-950/40 border-red-500 text-red-700 dark:text-red-400';
                      } else {
                        btnClass = 'opacity-50 border-slate-200 dark:border-slate-800';
                      }
                    }

                    return (
                      <button
                        key={oIdx}
                        disabled={isAnswered}
                        onClick={() => handleQuizAnswer(item.id, oIdx, item.answer, item.category, item.title)}
                        className={`w-full text-left p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${btnClass}`}
                      >
                        <span>{opt}</span>
                        {isAnswered && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                        {isAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-500" />}
                      </button>
                    );
                  })}
                </div>
                {quizAnswers[item.id] !== undefined && (
                  <p className="text-[11px] text-slate-400 leading-normal pt-2 border-t border-slate-200 dark:border-slate-800/60 font-semibold italic">
                    Explanation: {item.explanation}
                  </p>
                )}
              </div>
            )}

            {item.author && (
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                By {item.author}
              </p>
            )}
          </div>

          {/* Card Actions Footer */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-500/5 flex items-center justify-between text-slate-400 text-sm">
            <button 
              onClick={() => handleLike(item.id)}
              className={`flex items-center gap-1.5 font-bold hover:text-red-500 transition-colors ${likes[item.id] ? 'text-red-500' : ''}`}
            >
              <Heart className="w-4 h-4" fill={likes[item.id] ? 'currentColor' : 'none'} /> 
              <span>{likes[item.id] ? 'Liked' : 'Like'}</span>
            </button>
            <button 
              onClick={() => handleShare(item.title, item.category)}
              className="flex items-center gap-1.5 font-bold hover:text-emerald-500 transition-colors"
            >
              <Share className="w-4 h-4" /> Share
            </button>
            <button 
              onClick={() => handleSave(item.id)}
              className={`flex items-center gap-1.5 font-bold hover:text-sky-500 transition-colors ${saves[item.id] ? 'text-sky-500' : ''}`}
            >
              <Bookmark className="w-4 h-4" fill={saves[item.id] ? 'currentColor' : 'none'} /> Save
            </button>
          </div>

        </div>
      ))}
    </div>
  );
}
