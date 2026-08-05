"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, Trophy, Star, ArrowLeft, Loader2, RefreshCw, Mic, Zap, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useGameStore } from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";

interface Challenge {
  sentence: string;
  options: string[];
  answer: string;
  explanation: string;
}

export default function GamePage() {
  const router = useRouter();
  const { xp, level, addXP, addWord } = useGameStore();
  const [mounted, setMounted] = useState(false);

  const [loading, setLoading] = useState(true);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [previousSentences, setPreviousSentences] = useState<string[]>([]);
  
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  
  // Session tracking
  const [questionCount, setQuestionCount] = useState(1);
  const [sessionScore, setSessionScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Timer
  const [timeLeft, setTimeLeft] = useState(30);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    fetchNewChallenge();
  }, []);

  useEffect(() => {
    if (challenge && !selected && !loading && !isFinished) {
      setTimeLeft(30);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [challenge, selected, loading, isFinished]);

  const fetchNewChallenge = async () => {
    if (questionCount > 5) {
      setIsFinished(true);
      return;
    }
    
    setLoading(true);
    setSelected(null);
    setIsCorrect(null);
    setShowExplanation(false);
    setTimeLeft(30);
    
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/generate-challenge`, {
        level: level,
        topic: "مزيج إعراب وأخطاء شائعة",
        previous_sentences: previousSentences
      });
      setChallenge(response.data);
      setPreviousSentences(prev => [...prev, response.data.sentence]);
    } catch (e) {
      console.error("Failed to generate challenge", e);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setQuestionCount(prev => prev + 1);
  };

  useEffect(() => {
    if (questionCount > 1 && questionCount <= 6) {
       fetchNewChallenge();
    }
  }, [questionCount]);

  const handleTimeUp = () => {
    if (selected) return;
    setSelected("TIME_UP");
    setIsCorrect(false);
    setShowExplanation(true);
  };

  const handleSelect = (opt: string) => {
    if (selected) return;
    setSelected(opt);
    if (timerRef.current) clearInterval(timerRef.current);
    
    const correct = opt === challenge?.answer;
    setIsCorrect(correct);
    setShowExplanation(true);
    
    if (correct) {
      // Bonus XP for speed
      const speedBonus = Math.floor(timeLeft / 2);
      const points = 50 + speedBonus;
      addXP(points);
      setSessionScore(s => s + points);
      addWord();
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden">
      
      {/* Header */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
        <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")} className="hover:bg-primary/10 text-slate-800 cursor-pointer">
          <ArrowRight size={24} />
        </Button>
        <div className="flex gap-3">
          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-lg font-black gap-2">
            مستوى {level}
          </div>
          <div className="bg-accent/10 text-accent px-3 py-1 rounded-full text-lg font-black gap-2 flex items-center">
            <Star className="text-accent ml-1" size={18} />
            {xp} XP
          </div>
        </div>
      </div>

      <div className="w-full max-w-3xl mt-16 relative z-10">
        <AnimatePresence mode="wait">
          {isFinished ? (
            <motion.div 
              key="finished"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-12 text-center rounded-3xl shadow-xl border border-slate-200"
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Trophy className="mx-auto w-28 h-28 mb-8 text-accent" />
              </motion.div>
              <h1 className="text-5xl font-black mb-4 text-slate-900">أحسنت بطل النحو!</h1>
              <p className="text-xl text-slate-500 mb-8">لقد أنهيت التحدي وربحت <span className="font-black text-primary">{sessionScore} XP</span>.</p>
              <div className="w-full bg-slate-200 rounded-full h-4 mb-8">
                <div className="bg-primary h-4 rounded-full" style={{ width: '100%' }} />
              </div>
              <button onClick={() => router.push("/dashboard")} className="bg-primary hover:bg-primary/90 text-white font-bold shadow-md h-14 px-10 text-lg rounded-xl flex items-center gap-2 mx-auto cursor-pointer">
                العودة إلى لوحة القيادة
                <ArrowLeft size={20} />
              </button>
            </motion.div>
          ) : loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white p-20 flex flex-col items-center justify-center text-center rounded-3xl shadow-xl border border-slate-200"
            >
              <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-8" />
              <h2 className="text-2xl font-bold text-slate-500">
                الذكاء الاصطناعي يجهز لك تحدياً جديداً...
              </h2>
            </motion.div>
          ) : challenge ? (
            <motion.div 
              key="challenge"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white p-10 text-center relative rounded-3xl shadow-xl border border-slate-200"
            >
              <div className="flex justify-between items-center mb-8">
                {/* Timer */}
                <div className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xl transition-colors",
                  timeLeft > 10 ? "bg-slate-100 text-slate-600" : "bg-destructive/10 text-destructive animate-pulse"
                )}>
                  <Clock size={24} />
                  00:{timeLeft.toString().padStart(2, '0')}
                </div>
                {/* Question counter */}
                <div className="flex items-center gap-2">
                  {[1,2,3,4,5].map(n => (
                    <div key={n} className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-all",
                      n < questionCount ? "bg-primary/20 text-primary" :
                      n === questionCount ? "bg-primary text-white scale-110 shadow-md" :
                      "bg-white border border-slate-200 text-slate-400"
                    )}>
                      {n < questionCount ? "✓" : n}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center mb-6 border-b-2 border-slate-100 pb-4">
                <div className="bg-primary/10 text-primary px-4 py-1 rounded-full font-bold flex items-center gap-2">
                  <Zap size={18} />
                  {challenge.sentence.includes("_____") ? "املأ الفراغ" : "صائد الأخطاء: حدد الكلمة الخاطئة"}
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-black mb-10 text-slate-900 leading-relaxed" dir="rtl">
                {challenge.sentence.includes("_____") ? (
                  challenge.sentence.split("_____").map((part, i, arr) => (
                    <span key={i}>
                      {part}
                      {i < arr.length - 1 && (
                        <span className={cn(
                          "inline-block min-w-[100px] border-b-4 mx-2 pb-1 transition-all duration-300 text-center",
                          selected && selected !== "TIME_UP"
                            ? (isCorrect ? "border-secondary text-secondary" : "border-destructive text-destructive") 
                            : "border-slate-300 text-slate-800"
                        )}>
                          {selected === "TIME_UP" ? "" : (selected || "")}
                        </span>
                      )}
                    </span>
                  ))
                ) : (
                  challenge.sentence
                )}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {challenge.options.map((opt, i) => (
                  <motion.button
                    key={opt}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    disabled={!!selected}
                    onClick={() => handleSelect(opt)}
                    className={cn(
                      "h-20 text-xl font-black rounded-2xl border-2 transition-all cursor-pointer",
                      selected === opt 
                        ? (isCorrect 
                          ? "bg-secondary/10 border-secondary text-secondary shadow-md" 
                          : "bg-destructive/10 border-destructive text-destructive")
                        : selected && opt === challenge.answer && !isCorrect
                          ? "bg-secondary/10 border-secondary text-secondary shadow-md" // Highlight correct answer
                        : selected
                          ? "opacity-50 border-slate-200 bg-slate-50 text-slate-400" 
                          : "bg-white border-slate-200 hover:border-primary/50 text-slate-700 hover:shadow-md"
                    )}
                  >
                    {opt}
                  </motion.button>
                ))}
              </div>

              {showExplanation && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 pt-8 border-t border-slate-100"
                >
                  <div className={cn(
                    "p-6 rounded-2xl text-lg font-bold text-right mb-6 shadow-sm",
                    isCorrect 
                      ? "bg-secondary/10 text-secondary border border-secondary/20" 
                      : "bg-destructive/10 text-destructive border border-destructive/20"
                  )}>
                    {isCorrect ? `إجابة رائعة! +${50 + Math.floor(timeLeft / 2)} XP 🌟` : selected === "TIME_UP" ? `انتهى الوقت! الإجابة الصحيحة هي: ${challenge.answer}` : `إجابة خاطئة! الإجابة الصحيحة هي: ${challenge.answer}`}
                    <p className="text-slate-600 mt-3 font-medium text-base">
                      <span className="font-bold text-slate-900">السبب: </span>
                      {challenge.explanation}
                    </p>
                  </div>

                  <button onClick={handleNext} className="bg-primary hover:bg-primary/90 text-white shadow-md font-bold h-14 px-8 text-lg rounded-xl flex items-center gap-2 mx-auto cursor-pointer">
                    {questionCount >= 5 ? "إنهاء التحدي" : "السؤال التالي"} <ArrowLeft size={20} />
                  </button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div key="error" className="text-center bg-white p-8 rounded-3xl">
              <h2 className="text-2xl font-bold text-destructive mb-4">عذراً، حدث خطأ في الاتصال</h2>
              <button onClick={fetchNewChallenge} className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl flex items-center gap-2 mx-auto cursor-pointer">
                <RefreshCw size={18} /> أعد المحاولة
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
