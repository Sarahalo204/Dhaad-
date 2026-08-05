"use client";

import { useState } from "react";
import { ArrowLeft, Mic, Sparkles, Gamepad2, Network, BarChart3, Wand2 } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const [sentence, setSentence] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [isTashkeeling, setIsTashkeeling] = useState(false);
  const router = useRouter();

  const handleAnalyze = () => {
    if (sentence.trim()) {
      router.push(`/analyze?q=${encodeURIComponent(sentence)}`);
    }
  };

  const handleTashkeel = async () => {
    if (!sentence.trim()) return;
    setIsTashkeeling(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/tashkeel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sentence: sentence.trim() }),
      });
      const data = await res.json();
      if (data.tashkeel) {
        setSentence(data.tashkeel);
      }
    } catch (error) {
      console.error("Tashkeel error:", error);
    } finally {
      setIsTashkeeling(false);
    }
  };

  const secondaryFeatures = [
    {
      icon: <Network size={20} />,
      title: "شبكة الكلمات",
      href: "/relationships",
      color: "text-[#0EA5E9]",
      bg: "bg-[#0EA5E9]/10"
    },
    {
      icon: <Gamepad2 size={20} />,
      title: "تحديات ذكية",
      href: "/game",
      color: "text-[#F59E0B]",
      bg: "bg-[#F59E0B]/10"
    },
    {
      icon: <BarChart3 size={20} />,
      title: "لوحة التقدم",
      href: "/dashboard",
      color: "text-[#006D77]",
      bg: "bg-[#006D77]/10"
    },
  ];

  return (
    <main className="relative min-h-screen flex flex-col items-center overflow-hidden bg-slate-50">
      {/* Animated Background Tree */}
      <BackgroundTree />

      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-8 py-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#006D77]/10 border border-[#006D77]/20 flex items-center justify-center shadow-sm">
            <Sparkles size={24} className="text-[#006D77]" />
          </div>
          <span className="text-2xl font-black text-slate-800 tracking-tight">ضاد</span>
        </div>

        {/* Secondary Features in Navbar */}
        <div className="hidden md:flex items-center gap-3">
          {secondaryFeatures.map((f, i) => (
            <Link key={i} href={f.href}>
              <motion.div
                whileHover={{ y: -2, scale: 1.05 }}
                className="bg-white/80 backdrop-blur-md border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer hover:shadow-md transition-all shadow-sm"
              >
                <div className={`w-6 h-6 rounded-md flex items-center justify-center ${f.bg} ${f.color}`}>
                  {f.icon}
                </div>
                <span className="font-bold text-sm text-slate-700">{f.title}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.nav>

      {/* Hero Content - Centered */}
      <div className="z-10 w-full max-w-5xl px-6 flex flex-col items-center justify-center flex-1 space-y-12 mt-10">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6 text-center"
        >
          <h1 className="text-6xl md:text-[5.5rem] font-black tracking-tight leading-[1.1] text-slate-900">
            اكتب جملتك،
            <br />
            <span className="text-gradient">ونحن نُعربها.</span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
            حوّل القواعد النحوية المعقدة إلى <strong className="text-slate-800">أشجار تفاعلية</strong> وشروحات ذكية في ثوانٍ معدودة.
          </p>
        </motion.div>

        {/* Massive Search Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={`w-full max-w-3xl p-2.5 rounded-3xl flex flex-col sm:flex-row gap-2 transition-all duration-500 bg-white border-2 ${
            inputFocused ? "shadow-[0_20px_60px_-15px_rgba(0,109,119,0.3)] border-[#006D77]/50 scale-[1.02]" : "shadow-xl shadow-slate-200/50 border-slate-200"
          }`}
        >
          <div className="relative flex-1 flex items-center">
            <input
              type="text"
              placeholder="أدخل جملة للتحليل (مثال: أكل الولد التفاحة)..."
              className="h-16 w-full rounded-2xl text-2xl pr-6 pl-14 outline-none bg-transparent text-slate-900 placeholder:text-slate-300 font-bold"
              value={sentence}
              onChange={(e) => setSentence(e.target.value)}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
            />
            <div className="absolute left-4 flex items-center gap-2">
              <button 
                title="تشكيل ذكي تلقائي"
                onClick={handleTashkeel}
                disabled={isTashkeeling || !sentence}
                className="p-2 rounded-xl text-slate-400 hover:text-[#F59E0B] hover:bg-[#F59E0B]/10 disabled:opacity-50 transition-colors cursor-pointer"
              >
                {isTashkeeling ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                    <Sparkles size={24} />
                  </motion.div>
                ) : (
                  <Wand2 size={24} />
                )}
              </button>
              <button className="p-2 rounded-xl text-slate-400 hover:text-[#006D77] hover:bg-[#006D77]/10 transition-colors cursor-pointer">
                <Mic size={24} />
              </button>
            </div>
          </div>
          <button 
            onClick={handleAnalyze}
            className="h-16 px-10 rounded-2xl text-xl flex items-center justify-center gap-3 cursor-pointer bg-[#006D77] hover:bg-[#006D77]/90 text-white shadow-lg shadow-[#006D77]/30 transition-all font-black hover:scale-105 active:scale-95"
          >
            إعراب الجملة
            <ArrowLeft size={24} strokeWidth={3} />
          </button>
        </motion.div>

      </div>
    </main>
  );
}

// Simple floating background tree animation
function BackgroundTree() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
      <svg className="absolute w-full h-full">
        <motion.path 
          d="M 300 200 C 400 200, 450 300, 500 400"
          stroke="#006D77" strokeWidth="3" fill="transparent" strokeDasharray="5,5"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, ease: "easeOut" }}
        />
        <motion.path 
          d="M 500 400 C 550 500, 600 500, 700 600"
          stroke="#006D77" strokeWidth="3" fill="transparent" strokeDasharray="5,5"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 1, ease: "easeOut" }}
        />
        <motion.path 
          d="M 500 400 C 400 500, 300 500, 200 600"
          stroke="#006D77" strokeWidth="3" fill="transparent" strokeDasharray="5,5"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 1.5, ease: "easeOut" }}
        />
        
        {/* Abstract nodes across the screen */}
        <motion.path 
          d="M 70vw 20vh C 60vw 30vh, 50vw 30vh, 40vw 50vh"
          stroke="#0EA5E9" strokeWidth="2" fill="transparent" strokeDasharray="4,4"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.5, delay: 0.5, ease: "easeOut" }}
        />
      </svg>

      {/* Floating Nodes */}
      <FloatingNode label="جملة فعلية" top="15%" left="20%" color="border-[#006D77] text-[#006D77]" delay={0} />
      <FloatingNode label="فِعْل ماضٍ" top="35%" left="35%" color="border-[#0EA5E9] text-[#0EA5E9]" delay={0.5} />
      <FloatingNode label="فَاعِل مرفوع" top="55%" left="15%" color="border-[#F59E0B] text-[#F59E0B]" delay={1} />
      <FloatingNode label="مفعول به" top="20%" left="65%" color="border-[#EF4444] text-[#EF4444]" delay={1.5} />
      <FloatingNode label="مضاف إليه" top="45%" left="80%" color="border-[#8B5CF6] text-[#8B5CF6]" delay={2} />
      <FloatingNode label="حَرْف جَر" top="70%" left="60%" color="border-[#10B981] text-[#10B981]" delay={2.5} />
    </div>
  );
}

function FloatingNode({ label, top, left, color, delay }: { label: string, top: string, left: string, color: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay, type: "spring" }}
      className={`absolute px-4 py-2 bg-white rounded-xl shadow-lg border-2 ${color} font-bold text-lg`}
      style={{ top, left }}
    >
      <motion.div
        animate={{ y: [-5, 5, -5] }}
        transition={{ repeat: Infinity, duration: 4 + delay, ease: "easeInOut" }}
      >
        {label}
      </motion.div>
    </motion.div>
  );
}
