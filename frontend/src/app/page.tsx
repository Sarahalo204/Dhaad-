"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mic, Sparkles, Gamepad2, Network, BarChart3, BookOpenCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const [sentence, setSentence] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const router = useRouter();

  const handleAnalyze = () => {
    if (sentence.trim()) {
      router.push(`/analyze?q=${encodeURIComponent(sentence)}`);
    }
  };

  const features = [
    {
      icon: <BookOpenCheck size={28} />,
      title: "تحليل الجملة بالذكاء الاصطناعي",
      desc: "إعراب فوري وتفصيلي مع شجرة نحوية تفاعلية",
      href: "/analyze",
      color: "#C9A96A",
    },
    {
      icon: <Network size={28} />,
      title: "شبكة علاقات الكلمات",
      desc: "اكتشف المرادفات والأضداد والجذور",
      href: "/relationships",
      color: "#2A9D8F",
    },
    {
      icon: <Gamepad2 size={28} />,
      title: "تحديات نحوية ذكية",
      desc: "أسئلة متجددة تتكيف مع مستواك",
      href: "/game",
      color: "#E76F51",
    },
    {
      icon: <BarChart3 size={28} />,
      title: "لوحة التقدم الشخصية",
      desc: "تابع نقاطك ومستواك وإنجازاتك",
      href: "/dashboard",
      color: "#C9A96A",
    },
  ];

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden geo-pattern">

      {/* Background Orbs */}
      <div className="orb orb-gold w-[500px] h-[500px] top-[-15%] left-[-10%]" />
      <div className="orb orb-teal w-[400px] h-[400px] bottom-[-10%] right-[-5%]" />

      {/* Geometric decoration */}
      <div className="geo-star top-20 right-20 animate-geo-spin" />
      <div className="geo-star bottom-20 left-20 animate-geo-spin" style={{animationDirection: 'reverse', width: 80, height: 80}} />

      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-8 py-5"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Sparkles size={20} className="text-primary" />
          </div>
          <span className="text-xl font-black text-gold">ضاد</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <button className="badge-gold text-sm cursor-pointer hover:bg-primary/20 transition-colors">لوحة التقدم</button>
          </Link>
        </div>
      </motion.nav>

      {/* Hero Content */}
      <div className="z-10 w-full max-w-5xl px-6 flex flex-col items-center text-center space-y-10">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6"
        >
          <div className="badge-teal mx-auto">
            <span className="flex h-2 w-2 rounded-full bg-secondary ml-2 animate-pulse" />
            مدعوم بالذكاء الاصطناعي
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[1.1]">
            <span className="text-foreground">اكتشف جمال</span>
            <br />
            <span className="text-shimmer">النحو العربي</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            ضاد يحوّل القواعد النحوية المعقدة إلى أشجار تفاعلية وشروحات ذكية.
            <br />
            <span className="text-primary font-bold">اكتب أي جملة</span> وشاهد السحر يحدث.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={`w-full max-w-2xl p-1.5 rounded-2xl flex flex-col sm:flex-row gap-2 transition-all duration-500 ${
            inputFocused 
              ? "bg-primary/10 shadow-[0_0_40px_rgba(201,169,106,0.15)]" 
              : "bg-card/80 border border-border"
          }`}
        >
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="اكتب جملة عربية هنا (مثال: أكل الولد التفاحة)..."
              className="input-dhaad h-14 w-full rounded-xl text-lg pr-4 pl-12 outline-none"
              value={sentence}
              onChange={(e) => setSentence(e.target.value)}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
            />
            <button className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
              <Mic size={22} />
            </button>
          </div>
          <button 
            onClick={handleAnalyze}
            className="btn-gold h-14 px-8 rounded-xl text-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            حلّل الجملة
            <ArrowLeft size={20} />
          </button>
        </motion.div>

        {/* Feature Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4"
        >
          {features.map((f, i) => (
            <Link key={i} href={f.href}>
              <motion.div
                whileHover={{ y: -6 }}
                className="card-dhaad p-6 text-right cursor-pointer group h-full"
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ background: `${f.color}15`, color: f.color }}
                >
                  {f.icon}
                </div>
                <h3 className="font-bold text-foreground text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>

      {/* Floating Arabic calligraphy elements */}
      <motion.div 
        animate={{ y: [0, -15, 0] }} 
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        className="absolute top-1/4 right-[12%] hidden lg:flex items-center justify-center text-5xl font-black text-primary/10 select-none"
      >
        فِعْل
      </motion.div>
      <motion.div 
        animate={{ y: [0, 18, 0] }} 
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 left-[12%] hidden lg:flex items-center justify-center text-4xl font-black text-secondary/10 select-none"
      >
        اِسْم
      </motion.div>
      <motion.div 
        animate={{ y: [0, -12, 0] }} 
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 2 }}
        className="absolute top-[60%] right-[8%] hidden lg:flex items-center justify-center text-3xl font-black text-accent/10 select-none"
      >
        حَرْف
      </motion.div>
    </main>
  );
}
