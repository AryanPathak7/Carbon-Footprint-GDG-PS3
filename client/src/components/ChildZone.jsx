import React, { useState } from 'react';
import { Sparkles, Trophy, Star, Shield, Leaf, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ChildZone() {
  const { recordAction } = useAuth();
  const [stars, setStars] = useState(12);
  const [unlockedStickers, setUnlockedStickers] = useState(['🐻 Friendly Bear']);
  const [gameActive, setGameActive] = useState(false);
  const [gameObject, setGameObject] = useState({ name: 'Plastic Bottle', category: 'recycling' });
  const [gameScore, setGameScore] = useState(0);

  const stories = [
    {
      title: '🛡️ Safe Circle (Good Touch/Bad Touch)',
      description: 'Your body belongs only to YOU! No one has the right to touch you in a way that makes you feel scared or sad. If anyone tries, remember to: 1. Say NO! 2. Run away! 3. Tell someone in your Safe Circle (Mom, Dad, Teacher). You are never in trouble for speaking up!',
      bg: 'bg-yellow-100'
    },
    {
      title: '🌐 The Internet Playground',
      description: 'The internet is a giant park of videos and games! But just like real parks, we never talk to strangers, never tell them our passwords, and never share our name or photo. If you see a scary message, tell an adult helper immediately!',
      bg: 'bg-blue-100'
    },
    {
      title: '🌳 Earth Castle Guardians',
      description: 'Our planet is a beautiful green castle! Trees are the castle protectors and keep the air clean. When we pick up plastics, plant flowers, or use metal water bottles instead of plastic cups, we are wearing our hero capes to save the castle!',
      bg: 'bg-green-100'
    }
  ];

  const gameItems = [
    { name: 'Apple Peel', category: 'compost' },
    { name: 'Plastic Soda Cup', category: 'recycling' },
    { name: 'Broken Screen Tablet', category: 'hazard' },
    { name: 'Cardboard Toy Box', category: 'recycling' },
    { name: 'Rotten Tomato', category: 'compost' },
    { name: 'Used Battery Cell', category: 'hazard' }
  ];

  const stickers = [
    { name: '🐻 Friendly Bear', cost: 3 },
    { name: '🌱 Green Leaf Hero', cost: 5 },
    { name: '🛡️ Internet Knight', cost: 8 },
    { name: '🚀 Super Explorer', cost: 10 }
  ];

  const startGame = () => {
    setGameActive(true);
    setGameScore(0);
    setGameObject(gameItems[0]);
  };

  const handleSortChoice = (choice) => {
    const isCorrect = choice === gameObject.category;
    let nextScore = gameScore;

    if (isCorrect) {
      nextScore += 1;
      setGameScore(nextScore);
      setStars(prev => prev + 1);
    }

    // Get next item
    const currentIdx = gameItems.findIndex(i => i.name === gameObject.name);
    if (currentIdx + 1 < gameItems.length) {
      setGameObject(gameItems[currentIdx + 1]);
    } else {
      // Game finished
      setGameActive(false);
      
      // Log action in Awareness Engine
      recordAction({
        actionType: 'challenge_complete',
        category: 'Environmental',
        description: `Completed Child Trash Sorting Game (Score: ${nextScore}/6)`,
        pointsEarned: 20,
        socialImpactMetrics: { treesPlanted: 0, plasticRecycledKg: 1, volunteerHours: 0, screenTimeReducedMins: 0 }
      });
    }
  };

  const buySticker = (stickerName, cost) => {
    if (stars >= cost && !unlockedStickers.includes(stickerName)) {
      setStars(prev => prev - cost);
      setUnlockedStickers(prev => [...prev, stickerName]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 font-comic text-slate-800 dark:text-slate-900">
      
      {/* Cartoon Header */}
      <div className="p-6 cartoon-card bg-amber-400 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-wide flex items-center gap-2 text-slate-900">
            🦁 Child Awareness Zone!
          </h2>
          <p className="text-sm text-slate-800 font-bold mt-1">Play games, read stories, and earn shiny stickers!</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 border-3 border-slate-900 rounded-2xl shadow-[4px_4px_0px_#1E293B]">
          <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
          <span className="text-2xl font-black text-slate-950">{stars} Stars</span>
        </div>
      </div>

      {/* Main split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Stories & Games */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Trash Sorting Game */}
          <div className="cartoon-card p-6 bg-emerald-100">
            <h3 className="text-xl font-black mb-2 flex items-center gap-2"><Leaf className="w-5 h-5 text-emerald-600" /> Bin Sorting Hero Game</h3>
            <p className="text-xs text-slate-700 font-bold mb-4">Put waste items in the correct bin to earn Stars!</p>

            {!gameActive ? (
              <div className="text-center py-8">
                <button
                  onClick={startGame}
                  className="cartoon-btn px-8 py-4 text-slate-950 text-lg"
                >
                  🎮 Play Sorting Game!
                </button>
              </div>
            ) : (
              <div className="p-6 bg-white border-4 border-slate-900 rounded-2xl text-center space-y-6">
                <div>
                  <span className="text-xs font-bold text-slate-400">Sort this item:</span>
                  <h4 className="text-2xl font-black text-slate-950 mt-1">{gameObject.name}</h4>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => handleSortChoice('compost')}
                    className="cartoon-btn bg-green-400 px-4 py-3 text-xs md:text-sm text-slate-950"
                  >
                    🥬 Wet Compost
                  </button>
                  <button
                    onClick={() => handleSortChoice('recycling')}
                    className="cartoon-btn bg-blue-400 px-4 py-3 text-xs md:text-sm text-slate-950"
                  >
                    🧴 Blue Recycle
                  </button>
                  <button
                    onClick={() => handleSortChoice('hazard')}
                    className="cartoon-btn bg-red-400 px-4 py-3 text-xs md:text-sm text-slate-950"
                  >
                    🔋 Red Hazard
                  </button>
                </div>

                <p className="text-xs text-slate-400 font-bold">Progress: {gameScore} correct matches</p>
              </div>
            )}
          </div>

          {/* Stories list */}
          <div className="space-y-6">
            <h3 className="text-xl font-black flex items-center gap-2"><Shield className="w-5 h-5 text-red-500" /> Story Learning Castle</h3>
            <div className="grid grid-cols-1 gap-6">
              {stories.map((story, idx) => (
                <div key={idx} className={`p-6 cartoon-card ${story.bg}`}>
                  <h4 className="text-lg font-black mb-3">{story.title}</h4>
                  <p className="text-xs leading-relaxed font-semibold text-slate-700 whitespace-pre-line">
                    {story.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 1 Col: Stickers Locker */}
        <div className="cartoon-card p-6 bg-sky-100 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-black mb-4 flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-500" /> Stickers Shop</h3>
            <div className="space-y-4">
              {stickers.map((st, idx) => {
                const isOwned = unlockedStickers.includes(st.name);
                const canAfford = stars >= st.cost;

                return (
                  <div key={idx} className="p-3 bg-white border-3 border-slate-900 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm">{st.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold">Cost: {st.cost} Stars</p>
                    </div>
                    {isOwned ? (
                      <span className="text-[10px] font-bold text-emerald-500 bg-emerald-100 border-2 border-emerald-500 px-2 py-0.5 rounded-full">
                        Owned
                      </span>
                    ) : (
                      <button
                        onClick={() => buySticker(st.name, st.cost)}
                        disabled={!canAfford}
                        className={`cartoon-btn px-3 py-1.5 text-[10px] ${!canAfford ? 'opacity-40 bg-slate-300' : 'bg-yellow-400'}`}
                      >
                        Buy 🌟
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t-3 border-slate-900/40">
            <h4 className="font-black text-xs mb-3">Your Sticker Locker:</h4>
            <div className="flex flex-wrap gap-2">
              {unlockedStickers.map((st, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-white border-2 border-slate-900 rounded-xl font-bold text-xs shadow-[2px_2px_0px_#1E293B]">
                  {st}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
