"use client";

import { useState } from "react";
import { ArrowRight, Loader2, Scroll, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function PoetryPage() {
  const router = useRouter();
  const [verse, setVerse] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!verse.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/poetry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ verse }),
      });
      
      const data = await res.json();
      setResult(JSON.parse(data));
    } catch (error) {
      console.error("Error analyzing poetry:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center pt-20 px-4">
      <div className="w-full max-w-4xl absolute top-6 left-6 right-6 flex justify-between items-center z-10">
        <Button variant="ghost" onClick={() => router.push("/")} className="gap-2 text-slate-500 hover:text-slate-800 font-bold">
          <ArrowRight size={20} />
          العودة للرئيسية
        </Button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl space-y-8"
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center mx-auto shadow-sm">
            <Scroll size={32} className="text-[#8B5CF6]" />
          </div>
          <h1 className="text-4xl font-black text-slate-800">تحليل الأبيات الشعرية</h1>
          <p className="text-slate-500 text-lg">أدخل بيتًا من الشعر لتحليل بحره وقافيته وتقطيعه العروضي بالذكاء الاصطناعي</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-4">
          <textarea
            value={verse}
            onChange={(e) => setVerse(e.target.value)}
            placeholder="مثال: الخيل والليل والبيداء تعرفني ... والسيف والرمح والقرطاس والقلم"
            className="w-full h-32 p-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#8B5CF6] outline-none text-xl resize-none leading-relaxed transition-all"
            dir="rtl"
          />
          <Button 
            onClick={handleAnalyze} 
            disabled={loading || !verse}
            className="w-full h-14 bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white rounded-2xl text-lg font-bold gap-2 shadow-md transition-all active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : <Sparkles size={24} />}
            استخراج البحر الشعري
          </Button>
        </div>

        {result && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#8B5CF6]/5 border border-[#8B5CF6]/10 text-center space-y-2">
                <p className="text-slate-500 text-sm font-bold">البحر الشعري</p>
                <p className="text-2xl font-black text-[#8B5CF6]">{result.meter}</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#006D77]/5 border border-[#006D77]/10 text-center space-y-2">
                <p className="text-slate-500 text-sm font-bold">القافية</p>
                <p className="text-2xl font-black text-[#006D77]">{result.rhyme}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-bold text-slate-700 text-lg">التحليل والتقطيع العروضي:</h3>
              <div className="p-5 rounded-2xl bg-slate-50 text-slate-800 leading-relaxed border border-slate-100">
                {result.explanation}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
