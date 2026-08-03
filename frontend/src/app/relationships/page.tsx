"use client";

import { useState } from "react";
import { ArrowRight, Search, Loader2, Network, Link as LinkIcon, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";

export default function RelationshipsPage() {
  const router = useRouter();
  const [word, setWord] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const handleSearch = async () => {
    if (!word.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/word-relationships`, {
        word: word.trim()
      });
      setData(response.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-12 bg-slate-50 relative overflow-hidden">
      
      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="hover:bg-primary/10 text-slate-800 cursor-pointer">
            <ArrowRight size={20} />
          </Button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
              <Network className="text-primary" />
              شبكة علاقات الكلمات
            </h1>
            <p className="text-slate-500 mt-1">اكتشف أسرار الكلمة العربية: مرادفاتها، أضدادها، وجذورها.</p>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass p-2 flex gap-2 rounded-2xl shadow-lg"
        >
          <input 
            value={word}
            onChange={(e) => setWord(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="اكتب كلمة واحدة (مثال: سعادة)..."
            className="h-14 flex-1 rounded-xl text-lg px-6 outline-none bg-transparent text-slate-800 placeholder:text-slate-400"
          />
          <button onClick={handleSearch} disabled={loading} className="bg-primary hover:bg-primary/90 text-white font-bold h-14 px-8 text-lg rounded-xl flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-all shadow-md">
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
            ابحث
          </button>
        </motion.div>

        {/* Results */}
        {data && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            
            <div className="flex flex-col md:flex-row gap-6">
              {/* Primary Info */}
              <div className="flex-1 glass shadow-sm rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                <h2 className="text-6xl font-black text-slate-900 mb-6">{data.word}</h2>
                <div className="flex gap-4 flex-wrap justify-center">
                  <div className="bg-primary/10 text-primary font-bold flex items-center gap-2 text-base px-5 py-2 rounded-xl">
                    <Hash size={16} /> جذر: {data.root}
                  </div>
                  <div className="bg-secondary/10 text-secondary font-bold flex items-center gap-2 text-base px-5 py-2 rounded-xl">
                    <LinkIcon size={16} /> وزن: {data.pattern}
                  </div>
                </div>
              </div>

              {/* Synonyms & Antonyms */}
              <div className="flex-1 flex flex-col gap-6">
                <div className="glass shadow-sm rounded-2xl p-6">
                  <h3 className="text-secondary font-black flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-secondary" /> المرادفات
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {data.synonyms.map((s: string, i: number) => (
                      <span key={i} className="bg-secondary/10 text-secondary font-bold px-3 py-1.5 rounded-full text-sm">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="glass shadow-sm rounded-2xl p-6">
                  <h3 className="text-destructive font-black flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-destructive" /> الأضداد
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {data.antonyms.map((a: string, i: number) => (
                      <span key={i} className="px-3 py-1.5 rounded-full bg-destructive/10 text-destructive font-bold text-sm">{a}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Related & Usages */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass shadow-sm rounded-2xl p-6">
                <h3 className="text-accent font-black mb-4">كلمات ذات صلة (شجرة العائلة)</h3>
                <ul className="space-y-3">
                  {data.related.map((r: string, i: number) => (
                    <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent" /> {r}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass shadow-sm rounded-2xl p-6">
                <h3 className="text-primary font-black mb-4">أمثلة واستخدامات</h3>
                <ul className="space-y-3">
                  {data.examples.map((e: string, i: number) => (
                    <li key={i} className="p-4 rounded-xl bg-white/50 border border-slate-100 text-slate-700 leading-relaxed text-sm font-medium">
                      "{e}"
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </motion.div>
        )}

      </div>
    </div>
  );
}
