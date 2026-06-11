import React, { useState, useRef } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Bot, 
  User, 
  Sparkles,
  HelpCircle
} from 'lucide-react';

export default function ChatBot({ user }) {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hello! I am your AwareSphere AI assistant. How can I help you today? You can select an explanation age group below.", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [inputText, setInputText] = useState('');
  const [agePersona, setAgePersona] = useState(user?.ageGroup || 'adult');
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synthRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);

  const personaDetails = {
    child: { label: '🧒 Child Mode', desc: 'Cartoon voice, simple stories, emoji guidance' },
    teen: { label: '🧑 Teen Mode', desc: 'Trendy advice, digital wellbeing, direct tips' },
    adult: { label: '🧑‍💼 Adult Mode', desc: 'Scientific facts, actionable tasks, professional tone' },
    senior: { label: '🧓 Senior Mode', desc: 'Warm guidelines, large spacing, zero jargon, scam shields' }
  };

  const handleSend = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    // Add user message
    const userMsg = {
      role: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Add loading message
    const loadingId = 'loading-' + Math.random();
    setMessages(prev => [...prev, { id: loadingId, role: 'ai', text: 'Typing...', time: '' }]);

    try {
      const token = localStorage.getItem('awaresphere_token');
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ prompt: text, ageGroup: agePersona })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => prev.filter(m => m.id !== loadingId).concat({
          role: 'ai',
          text: data.response,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
      } else {
        throw new Error('Server error');
      }
    } catch (err) {
      // Offline fallback NLP matching
      setTimeout(() => {
        let reply = '';
        const lower = text.toLowerCase();
        
        if (agePersona === 'child') {
          if (lower.includes('cyber') || lower.includes('safety') || lower.includes('internet')) {
            reply = "Hey buddy! 💻 The internet is like a magical amusement park! But remember, never tell strangers your secret password or where you live. If you see something weird, call a grown-up helper immediately! 🛡️";
          } else if (lower.includes('detox') || lower.includes('screen') || lower.includes('phone')) {
            reply = "Toby the Turtle spent all day on his tablet and his eyes got super tired! 🐢 Try the 20-20-20 game: every 20 minutes, look at a tree outside 20 feet away for 20 seconds! 🌳";
          } else {
            reply = "Wow! That sounds super cool! 🚀 Remember, little changes make a huge difference. Plant a seed, throw trash in the green bin, and stay safe online! 🌟";
          }
        } else if (agePersona === 'senior') {
          if (lower.includes('cyber') || lower.includes('safety') || lower.includes('scam') || lower.includes('bank')) {
            reply = "Hello. Cyber safety means lock details. 👴👵 Be very cautious of callers asking for bank pins or saying you won a lottery. A real bank will never ask for your passwords. If in doubt, always verify with a family member first.";
          } else if (lower.includes('detox') || lower.includes('screen') || lower.includes('tablet')) {
            reply = "It is lovely to check messages from grandchildren, but taking short walks and resting your eyes prevents strain. Roll your eyes in a slow circle every hour to relieve tension. 🌸";
          } else {
            reply = "We must take care of our health and look after our neighborhood so our children inherit a green environment. Doing light exercises and gardening is wonderful.";
          }
        } else if (agePersona === 'teen') {
          if (lower.includes('cyber') || lower.includes('scam')) {
            reply = "Look, phishing is everywhere now. 🎣 Don't click unverified links in DMs or emails. Enable 2FA on your accounts and don't share passwords. What goes online stays forever. Be smart! 🔒";
          } else if (lower.includes('detox') || lower.includes('screen') || lower.includes('doom')) {
            reply = "Doomscrolling at 2 AM is wrecking your attention span. 📱 Try turning off notifications after 9 PM. Go cold turkey for a few hours. Your brain deserves a break.";
          } else {
            reply = "Let's take real actions. Use your social media platforms to spread awareness, compost trash, shop thrift, and make a real impact! 🌍";
          }
        } else { // adult
          if (lower.includes('cyber') || lower.includes('safety')) {
            reply = "To secure your digital footprint: install a password manager, run multi-factor authentication, and verify sender emails before clicking links. Restricting unnecessary third-party cookies increases personal privacy.";
          } else if (lower.includes('detox') || lower.includes('screen') || lower.includes('work')) {
            reply = "High screen times correlate with stress and eye fatigue. Implement calendar blocks for screen-free focus, stand up every 45 minutes, and log device usages to analyze weekly digital habits.";
          } else {
            reply = "Social change requires active volunteer participation. Support local NGOs, track carbon footprints, and complete community challenges to motivate peers.";
          }
        }

        setMessages(prev => prev.filter(m => m.id !== loadingId).concat({
          role: 'ai',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
      }, 1000);
    }
  };

  // Text-To-Speech function
  const speakText = (text) => {
    if (!synthRef.current) return;

    if (isSpeaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      return;
    }

    // Remove emojis for clean TTS reading
    const cleanText = text.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD00-\uDFFF]/g, "");
    
    utteranceRef.current = new SpeechSynthesisUtterance(cleanText);
    
    // Custom voice speed adjusting based on senior persona
    if (agePersona === 'senior') {
      utteranceRef.current.rate = 0.8; // slower speaking rate
    } else {
      utteranceRef.current.rate = 1.0;
    }

    utteranceRef.current.onend = () => {
      setIsSpeaking(false);
    };

    setIsSpeaking(true);
    synthRef.current.speak(utteranceRef.current);
  };

  // Simulate Mic voice recognition
  const simulateVoiceInput = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    setIsRecording(true);
    
    // Simulate speech detection
    setTimeout(() => {
      const speechMocks = [
        "Explain cyber safety",
        "How do I reduce my daily screen usage?",
        "Tell me about climate change actions",
        "Why is digital detox important?"
      ];
      const randomSpeech = speechMocks[Math.floor(Math.random() * speechMocks.length)];
      setInputText(randomSpeech);
      setIsRecording(false);
    }, 2500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-4xl mx-auto glass-card rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-fade-in">
      
      {/* Bot Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-500/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-600 dark:bg-emerald-400/20 text-white dark:text-emerald-400 flex items-center justify-center">
            <Bot className="w-5 h-5 animate-pulse-slow" />
          </div>
          <div>
            <h3 className="font-bold flex items-center gap-1.5 text-sm md:text-base">
              AwareSphere Assistant <Sparkles className="w-4 h-4 text-emerald-500" />
            </h3>
            <span className="text-xs text-emerald-500 font-bold">Online</span>
          </div>
        </div>

        {/* Persona Selectors */}
        <div className="flex gap-2">
          {Object.keys(personaDetails).map((persona) => (
            <button
              key={persona}
              onClick={() => {
                setAgePersona(persona);
                if (synthRef.current) synthRef.current.cancel();
                setIsSpeaking(false);
              }}
              title={personaDetails[persona].desc}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                agePersona === persona 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {persona.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Messages list */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((msg, index) => {
          const isAI = msg.role === 'ai';
          return (
            <div key={index} className={`flex gap-3 max-w-[80%] ${isAI ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                isAI ? 'bg-emerald-600 text-white' : 'bg-sky-600 text-white'
              }`}>
                {isAI ? <Bot className="w-4.5 h-4.5" /> : <User className="w-4.5 h-4.5" />}
              </div>
              <div className="space-y-1">
                <div className={`p-4 rounded-2xl relative ${
                  isAI 
                    ? 'bg-slate-100 dark:bg-slate-900/60 rounded-tl-none text-slate-800 dark:text-slate-200' 
                    : 'bg-emerald-600 text-white rounded-tr-none'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  
                  {/* Speaker Button for AI response */}
                  {isAI && msg.text !== 'Typing...' && (
                    <button
                      onClick={() => speakText(msg.text)}
                      className="absolute bottom-2 right-2 p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-emerald-500 transition-colors"
                      title="Speak Text"
                    >
                      {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
                {msg.time && (
                  <span className={`text-[10px] text-slate-400 block ${isAI ? 'text-left' : 'text-right'}`}>
                    {msg.time}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mic Recording Wave Indicator */}
      {isRecording && (
        <div className="px-6 py-2 bg-sky-50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800 flex items-center justify-center gap-3">
          <span className="text-xs text-sky-500 font-bold">Listening to voice input...</span>
          <div className="flex gap-1 items-center">
            <span className="wave-bar"></span>
            <span className="wave-bar"></span>
            <span className="wave-bar"></span>
            <span className="wave-bar"></span>
            <span className="wave-bar"></span>
          </div>
        </div>
      )}

      {/* Input controls */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-500/5 flex items-center gap-3">
        <button
          onClick={simulateVoiceInput}
          className={`p-3 rounded-full transition-all shrink-0 ${
            isRecording 
              ? 'bg-red-500 text-white animate-pulse' 
              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 hover:text-slate-800 dark:hover:text-slate-100'
          }`}
          title="Simulate Voice Input"
        >
          {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`Ask anything (${personaDetails[agePersona].label} active)...`}
          className="flex-1 bg-slate-200 dark:bg-slate-800 border-none outline-none rounded-full px-5 py-3 text-sm focus:ring-2 focus:ring-emerald-500"
        />

        <button
          onClick={() => handleSend()}
          className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg shadow-emerald-500/10 hover:scale-105 transition-all shrink-0"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
