"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Trophy, Flame, Star, Target, BookOpen, AlertCircle, PlayCircle, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useGameStore } from "@/store/useStore";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { xp, level, streak, wordsLearned } = useGameStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const nextLevelXP = level * 1000;
  const progressPercent = Math.min((xp % 1000) / 10, 100);

  const stats = [
    { icon: <Star size={28} />, label: "المستوى", value: level, color: "#C9A96A", cardClass: "gold" },
    { icon: <Target size={28} />, label: "نقاط الخبرة", value: xp, color: "#2A9D8F", cardClass: "teal" },
    { icon: <Flame size={28} />, label: "سلسلة التعلم", value: `${streak} يوم`, color: "#E76F51", cardClass: "red" },
    { icon: <BookOpen size={28} />, label: "كلمات متعلمة", value: wordsLearned, color: "#2A9D8F", cardClass: "green" },
  ];

  return (
    <div className="min-h-screen p-6 md:p-12 geo-pattern">
      <div className="orb orb-gold w-[400px] h-[400px] top-[-10%] right-[-5%]" />
      <div className="orb orb-teal w-[300px] h-[300px] bottom-[-5%] left-[-5%]" />

      <div className="max-w-5xl mx-auto space-y-10 relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="hover:bg-primary/10 text-foreground">
              <ArrowRight size={20} />
            </Button>
            <div>
              <h1 className="text-3xl font-black text-gold flex items-center gap-3">
                لوحة التقدم
              </h1>
              <p className="text-muted-foreground text-sm mt-1">تابع رحلتك في تعلم النحو العربي</p>
            </div>
          </div>
          <Link href="/game">
            <button className="btn-gold h-12 px-6 rounded-xl text-base flex items-center gap-2 cursor-pointer">
              <PlayCircle size={20} />
              ابدأ التحدي
            </button>
          </Link>
        </motion.div>

        {/* Level Progress */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-dhaad p-6"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(201,169,106,0.15)" }}>
                <TrendingUp size={22} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">التقدم نحو المستوى التالي</p>
                <p className="text-foreground font-bold">المستوى {level} → المستوى {level + 1}</p>
              </div>
            </div>
            <span className="text-primary font-black text-xl">{xp} / {nextLevelXP} XP</span>
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className={`stat-card ${stat.cardClass} flex flex-col items-center justify-center text-center`}
            >
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: `${stat.color}15`, color: stat.color }}
              >
                {stat.icon}
              </div>
              <p className="text-muted-foreground text-sm font-bold mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-foreground">{stat.value}</h3>
            </motion.div>
          ))}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Common Mistakes */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="card-dhaad p-8"
          >
            <h3 className="text-xl font-black flex items-center gap-3 mb-6 text-foreground">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(231,111,81,0.15)" }}>
                <AlertCircle className="text-accent" size={22} />
              </div>
              الأخطاء النحوية المكتشفة
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-border text-sm font-bold">
                <span className="text-foreground">تحديد إعراب المفاعيل</span>
                <span className="badge-gold text-xs">جاري المراجعة</span>
              </li>
            </ul>
          </motion.div>

          {/* Acquired Skills */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="card-dhaad p-8"
          >
            <h3 className="text-xl font-black flex items-center gap-3 mb-6 text-foreground">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(42,157,143,0.15)" }}>
                <Trophy className="text-secondary" size={22} />
              </div>
              المهارات المكتسبة
            </h3>
            <div className="flex flex-wrap gap-3">
              {["الجملة الفعلية", "الفاعل والمفعول"].map(skill => (
                <div key={skill} className="badge-teal">
                  {skill}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
