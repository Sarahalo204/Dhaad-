"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  MarkerType
} from "reactflow";
import "reactflow/dist/style.css";
import axios from "axios";
import { ArrowRight, BookOpen, Brain, Loader2, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import CustomNode from "@/components/CustomNode";
import { motion } from "framer-motion";

const nodeTypes = {
  custom: CustomNode,
};

function AnalyzeContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const router = useRouter();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWord, setSelectedWord] = useState<any>(null);

  // Teacher state
  const [explainLevel, setExplainLevel] = useState("متوسط");
  const [isExplaining, setIsExplaining] = useState(false);
  const [explanation, setExplanation] = useState("");

  useEffect(() => {
    if (!query) {
      router.push("/");
      return;
    }

    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/analyze`, {
          sentence: query
        });

        const data = response.data;
        
        const newNodes: Node[] = data.words.map((w: any, index: number) => ({
          id: w.id,
          type: "custom",
          position: { x: (data.words.length - index) * 220, y: (index % 2 === 0 ? 100 : 260) },
          data: { 
            label: w.word, 
            pos: w.pos,
            fullData: w
          },
        }));

        const newEdges: Edge[] = data.edges.map((e: any) => ({
          id: e.id,
          source: e.source,
          target: e.target,
          label: e.label,
          animated: true,
          style: { stroke: "#C9A96A", strokeWidth: 2 },
          labelStyle: { fill: "#C9A96A", fontWeight: 700 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "#C9A96A",
          },
        }));

        setNodes(newNodes);
        setEdges(newEdges);
        if (data.words.length > 0) setSelectedWord(data.words[0]);

      } catch (error) {
        console.error("Analysis failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [query, router, setNodes, setEdges]);

  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    setSelectedWord(node.data.fullData);
    setExplanation("");
  };

  const handleExplain = async () => {
    if (!selectedWord) return;
    setIsExplaining(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/explain`, {
        sentence: query,
        word: selectedWord.word,
        irab: selectedWord.irab,
        level: explainLevel
      });
      setExplanation(response.data.explanation);
    } catch (e) {
      console.error(e);
      setExplanation("حدث خطأ أثناء محاولة جلب الشرح، يرجى المحاولة مرة أخرى.");
    } finally {
      setIsExplaining(false);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md flex items-center px-6 justify-between z-10 shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="hover:bg-primary/10 text-foreground">
            <ArrowRight size={20} />
          </Button>
          <h1 className="font-bold text-xl text-primary flex items-center gap-2">
            <BookOpen size={20} />
            تحليل الجملة
          </h1>
        </div>
        <div className="font-medium text-foreground bg-card px-5 py-2 rounded-xl border border-border shadow-sm flex items-center gap-3">
          <span className="text-muted-foreground">الجملة:</span>
          <span className="text-primary font-bold">{query}</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
        {loading ? (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm">
            <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-6" />
            <p className="text-lg font-bold text-muted-foreground">
              المعلم الذكي يحلل جملتك...
            </p>
          </div>
        ) : null}

        {/* Graph Area */}
        <div className="flex-1 h-full w-full relative" dir="ltr">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            className="bg-background"
          >
            <Background gap={20} color="#1E2436" />
            <Controls className="bg-card border border-border shadow-lg rounded-xl overflow-hidden" />
            <MiniMap className="bg-card border border-border shadow-xl rounded-xl" />
          </ReactFlow>
        </div>

        {/* Sidebar */}
        <div className="w-96 border-r border-border bg-card/90 backdrop-blur-lg h-full shrink-0 flex flex-col z-10 shadow-2xl">
          {selectedWord ? (
            <div className="p-6 h-full overflow-y-auto space-y-6">
              
              {/* Word Title & POS Badge */}
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <h2 className="text-5xl font-black text-gold tracking-tight">
                  {selectedWord.word}
                </h2>
                <div className="badge-teal">
                  {selectedWord.pos}
                </div>
              </div>

              {/* Grammar Reason (Irab) */}
              <div className="card-dhaad p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1.5 h-full bg-primary" />
                <h3 className="text-sm text-primary mb-2 flex items-center gap-2 font-bold">
                  <BookOpen size={16} /> الإعراب
                </h3>
                <p className="text-xl font-bold text-foreground leading-snug">
                  {selectedWord.irab}
                </p>
                {selectedWord.case && (
                  <div className="mt-3 badge-gold text-xs">
                    الحالة: {selectedWord.case}
                  </div>
                )}
              </div>

              {/* Word Details Grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "الجذر", value: selectedWord.root },
                  { label: "الوزن", value: selectedWord.pattern },
                  { label: "الزمن", value: selectedWord.tense },
                  { label: "العدد", value: selectedWord.number },
                  { label: "الجنس", value: selectedWord.gender },
                ].map((item, i) => item.value && item.value !== "null" && (
                  <div key={i} className="stat-card gold flex flex-col items-center justify-center text-center p-3">
                    <span className="text-xs text-muted-foreground mb-1">{item.label}</span>
                    <span className="font-bold text-lg text-foreground">{item.value}</span>
                  </div>
                ))}
              </div>

              {/* AI Teacher Section */}
              <div className="mt-6 border-t border-border pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(231,111,81,0.15)" }}>
                    <Brain size={18} className="text-accent" />
                  </div>
                  <h3 className="font-bold text-lg text-foreground">المعلم الذكي</h3>
                </div>
                
                <div className="flex gap-1.5 mb-4 bg-background p-1 rounded-xl border border-border">
                  {['طفل', 'متوسط', 'متقدم', 'متخصص'].map(level => (
                    <button 
                      key={level}
                      onClick={() => setExplainLevel(level)}
                      className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all cursor-pointer ${explainLevel === level ? 'bg-primary/10 text-primary shadow-sm border border-primary/20' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      {level}
                    </button>
                  ))}
                </div>

                {!explanation ? (
                  <button 
                    onClick={handleExplain} 
                    disabled={isExplaining}
                    className="btn-gold w-full gap-2 rounded-xl h-12 flex items-center justify-center cursor-pointer disabled:opacity-50"
                  >
                    {isExplaining ? <Loader2 size={18} className="animate-spin" /> : <PlayCircle size={18} />}
                    اشرح لي الإعراب
                  </button>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl bg-accent/5 border border-accent/20"
                  >
                    <p className="text-foreground leading-relaxed font-medium">
                      {explanation}
                    </p>
                    <button className="mt-3 text-accent hover:underline font-bold text-sm cursor-pointer w-full text-center" onClick={() => setExplanation("")}>
                      إخفاء الشرح
                    </button>
                  </motion.div>
                )}
              </div>

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center space-y-6">
              <div className="w-24 h-24 rounded-full bg-card flex items-center justify-center border border-border">
                <BookOpen size={40} className="text-primary/30" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">الشجرة النحوية التفاعلية</h3>
                <p className="text-sm leading-relaxed">
                  اضغط على أي كلمة لعرض تفاصيلها الصرفية والإعرابية.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AnalyzePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen bg-background text-primary">جاري تحميل مساحة العمل...</div>}>
      <AnalyzeContent />
    </Suspense>
  );
}
