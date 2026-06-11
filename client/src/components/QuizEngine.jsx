import React, { useState, useEffect, useRef } from 'react';
import { 
  HelpCircle, 
  Clock, 
  Award, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  Download,
  AlertCircle 
} from 'lucide-react';
import { mockDb } from '../utils/mockDb';
import { useAuth } from '../context/AuthContext';
import { downloadCertificate } from '../utils/certificateGenerator';

export default function QuizEngine() {
  const { user, recordAction } = useAuth();
  
  const [selectedCategory, setSelectedCategory] = useState(null); // 'Digital Wellbeing', 'Cyber Safety', 'Environmental'
  const [quizList, setQuizList] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  // Timed quiz state
  const [timeLeft, setTimeLeft] = useState(15);
  const timerRef = useRef(null);

  const categories = ['Digital Wellbeing', 'Cyber Safety', 'Environmental'];

  const startQuiz = (cat) => {
    setSelectedCategory(cat);
    const questions = mockDb.getQuizzesByCategory(cat);
    setQuizList(questions);
    setCurrentIdx(0);
    setSelectedOpt(null);
    setSubmitted(false);
    setScore(0);
    setQuizDone(false);
    setTimeLeft(15);
  };

  // Timer tick effect
  useEffect(() => {
    if (selectedCategory && !quizDone && !submitted && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !submitted) {
      // Auto-fail question when time expires
      handleSubmitAnswer(true);
    }

    return () => clearInterval(timerRef.current);
  }, [selectedCategory, quizDone, submitted, timeLeft]);

  const handleSubmitAnswer = (timeout = false) => {
    clearInterval(timerRef.current);
    setSubmitted(true);
    
    const currentQ = quizList[currentIdx];
    const isCorrect = !timeout && selectedOpt === currentQ.answer;

    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < quizList.length) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOpt(null);
      setSubmitted(false);
      setTimeLeft(15);
    } else {
      setQuizDone(true);
      // Log action and award points
      const pointsAwarded = score * 25;
      
      recordAction({
        actionType: 'quiz',
        category: selectedCategory,
        description: `Completed ${selectedCategory} Quiz. (Score: ${score}/${quizList.length})`,
        pointsEarned: pointsAwarded,
        socialImpactMetrics: { treesPlanted: 0, plasticRecycledKg: 0, volunteerHours: 0, screenTimeReducedMins: 0 }
      });
    }
  };

  const triggerCertificate = () => {
    const milestone = selectedCategory === 'Cyber Safety' ? 'Master of Cyber Security' : 
                      selectedCategory === 'Environmental' ? 'Climate Change Guardian' : 'Digital Detox Champion';
    downloadCertificate(user.name, milestone, selectedCategory);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in pb-12 text-slate-800 dark:text-slate-100">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold flex items-center gap-2"><HelpCircle className="w-6 h-6 text-emerald-500" /> Interactive Quiz Engine</h2>
        <p className="text-xs text-slate-400 font-sans">Test your awareness. Score 100% to unlock a downloadable credential certificate.</p>
      </div>

      {!selectedCategory ? (
        /* Category Selector view */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat}
              onClick={() => startQuiz(cat)}
              className="p-6 glass-card rounded-3xl border border-slate-200 dark:border-slate-800 hover:scale-[1.02] transition-transform cursor-pointer text-center space-y-4"
            >
              <span className="text-4xl">
                {cat === 'Cyber Safety' ? '🔒' : cat === 'Environmental' ? '🌱' : '📱'}
              </span>
              <div>
                <h4 className="font-bold text-sm leading-snug">{cat} Quiz</h4>
                <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">Timed MCQ test</p>
              </div>
            </div>
          ))}
        </div>
      ) : !quizDone ? (
        /* Question screen view */
        <div className="p-6 glass-card rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
          
          {/* Header Info */}
          <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">{selectedCategory}</span>
              <h5 className="text-xs text-slate-400 mt-1">Question {currentIdx + 1} of {quizList.length}</h5>
            </div>
            
            {/* Timer circle badge */}
            <div className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold ${
              timeLeft < 5 ? 'bg-red-500/10 text-red-500 animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
            }`}>
              <Clock className="w-4 h-4" /> {timeLeft}s Left
            </div>
          </div>

          {/* Question Text */}
          <h4 className="text-lg font-bold leading-snug">{quizList[currentIdx]?.question}</h4>

          {/* Options */}
          <div className="space-y-3">
            {quizList[currentIdx]?.options.map((opt, oIdx) => {
              const isSelected = selectedOpt === oIdx;
              const isCorrect = oIdx === quizList[currentIdx].answer;

              let btnStyle = 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800';
              if (isSelected) {
                btnStyle = 'border-sky-500 bg-sky-500/15 text-sky-600 dark:text-sky-400';
              }
              if (submitted) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-600 text-white border-emerald-600';
                } else if (isSelected) {
                  btnStyle = 'bg-red-600 text-white border-red-600';
                } else {
                  btnStyle = 'opacity-40 border-slate-200 dark:border-slate-800';
                }
              }

              return (
                <button
                  key={oIdx}
                  disabled={submitted}
                  onClick={() => setSelectedOpt(oIdx)}
                  className={`w-full text-left p-4 rounded-2xl border text-xs font-semibold flex justify-between items-center transition-all ${btnStyle}`}
                >
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation notes */}
          {submitted && (
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 space-y-2 leading-normal">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Explanation
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                {quizList[currentIdx]?.explanation}
              </p>
            </div>
          )}

          {/* Footer Navigation */}
          <div className="flex gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            {!submitted ? (
              <button
                onClick={() => handleSubmitAnswer(false)}
                disabled={selectedOpt === null}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl disabled:opacity-40 transition-all text-xs"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition-all"
              >
                Next Question <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      ) : (
        /* Summary / Certificate unlock screen */
        <div className="p-8 glass-card rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-6">
          <Award className="w-16 h-16 text-yellow-500 mx-auto animate-bounce-slow" />
          
          <div>
            <h3 className="text-2xl font-black">Quiz Completed!</h3>
            <p className="text-xs text-slate-400 mt-1">Your final score: <span className="font-extrabold text-emerald-500">{score}/{quizList.length}</span></p>
          </div>

          <div className="p-4 bg-emerald-600/10 border border-emerald-500/20 rounded-2xl max-w-sm mx-auto text-xs text-slate-400">
            You earned <span className="font-bold text-emerald-500">+{score * 25} awareness points</span>! Points have been recorded to your global impact metrics.
          </div>

          {score === quizList.length ? (
            <div className="space-y-4 pt-4">
              <p className="text-xs text-emerald-500 font-bold">🎉 Perfect Score! Your certificate credential has been unlocked.</p>
              <button
                onClick={triggerCertificate}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 mx-auto shadow-lg shadow-emerald-500/15"
              >
                <Download className="w-4 h-4" /> Download Credentials Certificate
              </button>
            </div>
          ) : (
            <p className="text-[10px] text-slate-400">Score 100% to qualify for downloadable credential badges.</p>
          )}

          <button
            onClick={() => setSelectedCategory(null)}
            className="w-full py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-400 rounded-xl font-bold text-xs"
          >
            Back to Category Select
          </button>
        </div>
      )}

    </div>
  );
}
