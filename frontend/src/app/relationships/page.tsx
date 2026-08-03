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
    <div className="min-h-screen p-6 md:p-12 geo-pattern">
      <div className="orb orb-teal w-[400px] h-[400px] top-[-10%] right-[-10%]" />
      
      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="hover:bg-primary/10 text-foreground">
            <ArrowRight size={20} />
          </Button>
          <div>
            <h1 className="text-3xl font-black text-gold flex items-center gap-3">
              <Network className="text-secondary" />
              شبكة علاقات الكلمات
            </h1>
            <p className="text-muted-foreground mt-1">اكتشف أسرار الكلمة العربية: مرادفاتها، أضدادها، وجذورها.</p>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-dhaad p-2 flex gap-2"
        >
          <input 
            value={word}
            onChange={(e) => setWord(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="اكتب كلمة واحدة (مثال: سعادة)..."
            className="input-dhaad h-14 flex-1 rounded-xl text-lg px-6 outline-none"
          />
          <button onClick={handleSearch} disabled={loading} className="btn-gold h-14 px-8 text-lg rounded-xl flex items-center gap-2 cursor-pointer disabled:opacity-50">
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
              <div className="flex-1 card-dhaad p-8 flex flex-col items-center justify-center text-center">
                <h2 className="text-6xl font-black text-shimmer mb-6">{data.word}</h2>
                <div className="flex gap-4 flex-wrap justify-center">
                  <div className="badge-gold flex items-center gap-2 text-base px-5 py-2">
                    <Hash size={16} /> جذر: {data.root}
                  </div>
                  <div className="badge-teal flex items-center gap-2 text-base px-5 py-2">
                    <LinkIcon size={16} /> وزن: {data.pattern}
                  </div>
                </div>
              </div>

              {/* Synonyms & Antonyms */}
              <div className="flex-1 flex flex-col gap-6">
                <div className="card-dhaad p-6">
                  <h3 className="text-secondary font-black flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-secondary" /> المرادفات
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {data.synonyms.map((s: string, i: number) => (
                      <span key={i} className="badge-teal">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="card-dhaad p-6">
                  <h3 className="text-destructive font-black flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-destructive" /> الأضداد
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {data.antonyms.map((a: string, i: number) => (
                      <span key={i} className="px-3 py-1.5 rounded-full bg-destructive/10 text-destructive font-bold text-sm border border-destructive/20">{a}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Related & Usages */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card-dhaad p-6">
                <h3 className="text-accent font-black mb-4">كلمات ذات صلة (شجرة العائلة)</h3>
                <ul className="space-y-3">
                  {data.related.map((r: string, i: number) => (
                    <li key={i} className="flex items-center gap-3 text-foreground font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent" /> {r}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card-dhaad p-6">
                <h3 className="text-primary font-black mb-4">أمثلة واستخدامات</h3>
                <ul className="space-y-3">
                  {data.examples.map((e: string, i: number) => (
                    <li key={i} className="p-4 rounded-xl bg-background/50 border border-border text-foreground leading-relaxed text-sm font-medium">
                      &quot;{e}&quot;
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
