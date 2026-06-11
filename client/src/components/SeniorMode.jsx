import React, { useState } from 'react';
import { 
  Phone, 
  Volume2, 
  HelpCircle, 
  AlertTriangle, 
  Play, 
  Pause, 
  ShieldAlert, 
  Accessibility, 
  Check 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function SeniorMode() {
  const { isHighContrast, toggleHighContrast, fontSize, changeFontSize } = useTheme();
  
  const [playingTrack, setPlayingTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [simulatedVoiceLog, setSimulatedVoiceLog] = useState('');

  const audioArticles = [
    { id: 1, title: '🔒 Cyber Safety: SMS Banking Scams', text: 'Protect your savings. Do not share pins or one-time codes with callers. Real banks do not call to demand login keys. Hang up and verify details independently.', duration: '1:30' },
    { id: 2, title: '🌻 Environmental: Nurturing Kitchen Gardens', text: 'Tending home plants reduces stress and keeps clean air circulating. Grow mint, tomatoes, or household flowers in recycled boxes to nurture nature.', duration: '2:15' },
    { id: 3, title: '🧘 Physical: 5-Minute Stretch and Breathe', text: 'Sit straight, roll your shoulders backward slowly three times. Deeply inhale to expand your lungs, and exhale completely. Balance digital time with light walking.', duration: '1:45' }
  ];

  const handlePlayAudio = (track) => {
    if (playingTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
      window.speechSynthesis.cancel();
      return;
    }

    setPlayingTrack(track);
    setIsPlaying(true);
    
    // Play actual Speech Synthesis
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(track.text);
    utterance.rate = 0.75; // Slower pace for seniors
    utterance.onend = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
  };

  const simulateVoiceAssist = () => {
    setSimulatedVoiceLog('Listening for voice command...');
    setTimeout(() => {
      setSimulatedVoiceLog('Detected command: "Play SMS Banking Scams"');
      handlePlayAudio(audioArticles[0]);
    }, 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 text-slate-800 dark:text-slate-100">
      
      {/* Accessibility Controls Panel */}
      <div className="p-6 glass-card rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Accessibility className="w-5 h-5 text-emerald-500" /> Accessibility Adjuster
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Contrast Toggle */}
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/40 flex items-center justify-between">
            <div>
              <p className="font-bold text-sm">High Contrast Theme</p>
              <p className="text-xs text-slate-400">Black backgrounds and yellow highlights for clarity.</p>
            </div>
            <button
              onClick={toggleHighContrast}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition-colors ${
                isHighContrast 
                  ? 'bg-yellow-400 text-slate-900' 
                  : 'bg-slate-300 dark:bg-slate-800 text-slate-500'
              }`}
            >
              {isHighContrast ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {/* Font Resizer */}
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/40 flex items-center justify-between">
            <div>
              <p className="font-bold text-sm">Text Size Booster</p>
              <p className="text-xs text-slate-400">Increase reading font sizes across the platform.</p>
            </div>
            <div className="flex gap-2">
              {['normal', 'large', 'xlarge'].map((size) => (
                <button
                  key={size}
                  onClick={() => changeFontSize(size)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    fontSize === size 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 hover:bg-slate-300'
                  }`}
                >
                  {size.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Audio Awareness Articles */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold">Audio Awareness Books</h3>
          <div className="space-y-4">
            {audioArticles.map((track) => (
              <div 
                key={track.id} 
                className="p-5 glass-card rounded-2xl flex items-center justify-between border border-slate-200 dark:border-slate-800 hover:scale-[1.01] transition-transform"
              >
                <div className="space-y-1 max-w-[75%]">
                  <h4 className="font-bold text-base md:text-lg">{track.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{track.text}</p>
                </div>
                <button
                  onClick={() => handlePlayAudio(track)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    playingTrack?.id === track.id && isPlaying 
                      ? 'bg-amber-500 text-white' 
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {playingTrack?.id === track.id && isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 pl-0.5" />}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Voice Assist & Emergency helpline */}
        <div className="space-y-8">
          
          {/* Voice Guide Helper */}
          <div className="p-6 glass-card rounded-3xl space-y-4 text-center">
            <h4 className="font-bold text-sm">Voice Helper Cues</h4>
            <p className="text-xs text-slate-400">Click below and speak directly into the tablet to find guidelines.</p>
            
            <button
              onClick={simulateVoiceAssist}
              className="w-16 h-16 rounded-full bg-sky-600 text-white flex items-center justify-center mx-auto hover:scale-105 transition-transform shadow-lg shadow-sky-500/20"
            >
              <Volume2 className="w-6 h-6 animate-pulse-slow" />
            </button>
            {simulatedVoiceLog && (
              <p className="text-xs text-emerald-500 font-bold bg-emerald-50 dark:bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                {simulatedVoiceLog}
              </p>
            )}
          </div>

          {/* EMERGENCY CARD RED BUTTON */}
          <div className="p-6 rounded-3xl bg-red-500/10 border-2 border-red-500 text-center space-y-4">
            <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
            <h4 className="font-bold text-slate-800 dark:text-red-400">Emergency & Fraud Assistance</h4>
            <p className="text-xs text-slate-400">Immediately access safety helpline numbers if you suspect cyber fraud or need assistance.</p>
            
            <button
              onClick={() => setShowEmergency(true)}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl shadow-lg transition-transform hover:scale-[1.02]"
            >
              🚨 VIEW HELPLINE DIRECTORY
            </button>
          </div>

        </div>

      </div>

      {/* Emergency Helpline Directory Modal */}
      {showEmergency && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="glass-card max-w-sm w-full rounded-3xl p-6 border-2 border-red-500 space-y-5 text-slate-800 dark:text-slate-100">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-red-500 flex items-center gap-1.5"><Phone className="w-5 h-5" /> Emergency Contacts</h3>
              <button 
                onClick={() => {
                  window.speechSynthesis.cancel();
                  setShowEmergency(false);
                }} 
                className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400"
              >
                Done
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-xl flex items-center justify-between border border-red-100 dark:border-red-900/20">
                <div>
                  <h5 className="font-bold text-sm">National Cyber Crime</h5>
                  <p className="text-xs text-slate-400">Call immediately for banking frauds.</p>
                </div>
                <a href="tel:1930" className="px-3.5 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold">1930</a>
              </div>

              <div className="p-3 bg-slate-100 dark:bg-slate-900/40 rounded-xl flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-sm">Police Assistance</h5>
                  <p className="text-xs text-slate-400">Emergency local support.</p>
                </div>
                <a href="tel:112" className="px-3.5 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-bold">112</a>
              </div>

              <div className="p-3 bg-slate-100 dark:bg-slate-900/40 rounded-xl flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-sm">Elder Line Helpline</h5>
                  <p className="text-xs text-slate-400">Toll-free senior assistance.</p>
                </div>
                <a href="tel:14567" className="px-3.5 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-bold">14567</a>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 leading-normal text-center">
              Helplines are active 24/7. Keep card credentials private.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
