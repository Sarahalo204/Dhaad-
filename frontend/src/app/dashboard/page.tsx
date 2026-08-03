"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Flame, Trophy, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">مرحباً بعودتك، طالب العلم 👋</h1>
            <p className="text-slate-500 mt-2">استمر في تقدمك نحو إتقان النحو العربي.</p>
          </div>
          <Button variant="outline" onClick={() => router.push("/")} className="gap-2 bg-white hover:bg-slate-100 cursor-pointer">
            الرئيسية <ArrowRight size={16} />
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 shadow-sm">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-2 shadow-sm">
                <Star size={24} />
              </div>
              <h3 className="text-3xl font-black text-primary">المستوى 5</h3>
              <p className="text-sm font-medium text-slate-600">متعلم نشط</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent mb-2">
                <Trophy size={24} />
              </div>
              <h3 className="text-3xl font-black text-slate-800">1,250</h3>
              <p className="text-sm font-medium text-slate-600">إجمالي النقاط</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary mb-2">
                <BookOpen size={24} />
              </div>
              <h3 className="text-3xl font-black text-slate-800">42</h3>
              <p className="text-sm font-medium text-slate-600">جملة تم إعرابها</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 mb-2">
                <Flame size={24} />
              </div>
              <h3 className="text-3xl font-black text-slate-800">7 أيام</h3>
              <p className="text-sm font-medium text-slate-600">سلسلة التعلم</p>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
