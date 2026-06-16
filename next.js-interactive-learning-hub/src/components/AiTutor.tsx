import React, { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Sparkles, 
  Terminal, 
  ArrowRight, 
  User, 
  RefreshCw, 
  AlertCircle,
  BookOpen,
  FolderTree,
  Hammer,
  Edit3,
  Zap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Brain,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Award,
  Info
} from "lucide-react";
import { ChatMessage } from "../types";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface QuizData {
  topic: string;
  questions: Question[];
}

export default function AiTutor({ lastActiveTab = "roadmap" }: { lastActiveTab?: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hey there! 👋 I am your interactive **Next.js 15 engineering mentor**.\n\nI can help you build dynamic routes, structure nested templates, or trace complex **React Server Components (RSCs)** and **Server Actions** directly.\n\nAsk me any question or try one of the quick learning shortcuts below!",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTick, setLoadingTick] = useState("Awaiting prompt...");
  const [apiError, setApiError] = useState<string | null>(null);

  // Dynamic Knowledge Check States
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizError, setQuizError] = useState<string | null>(null);
  const [isQuizOpen, setIsQuizOpen] = useState(true);

  // Mapping from tab to visible topic description
  const getTopicTitle = (tab: string) => {
    switch (tab) {
      case "roadmap": return "Next.js 15 Foundations & Checkout Roadmap";
      case "explorer": return "Directory Layout & App Router Special Files";
      case "rsc": return "RSC & Client-Side Boundaries";
      case "actions": return "Server Actions, revalidatePath & useActionState";
      case "rendering": return "Caching Pipelines & Partial Prerendering (PPR)";
      default: return "Core Next.js Architecture";
    }
  };

  const getTopicIcon = (tab: string) => {
    switch (tab) {
      case "roadmap": return <BookOpen className="w-4.5 h-4.5 text-emerald-500" />;
      case "explorer": return <FolderTree className="w-4.5 h-4.5 text-amber-500" />;
      case "rsc": return <Hammer className="w-4.5 h-4.5 text-fuchsia-500" />;
      case "actions": return <Edit3 className="w-4.5 h-4.5 text-sky-500" />;
      case "rendering": return <Zap className="w-4.5 h-4.5 text-rose-500" />;
      default: return <Brain className="w-4.5 h-4.5 text-indigo-500" />;
    }
  };

  // Fetch Knowledge Check Questions based on Active Tab
  const fetchKnowledgeCheck = async () => {
    setQuizLoading(true);
    setQuizError(null);
    setQuizData(null);
    setSelectedAnswers({});
    setQuizSubmitted(false);

    try {
      const response = await fetch("/api/knowledge-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicTab: lastActiveTab })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate dynamic knowledge check.");
      }

      setQuizData(data);
    } catch (err: any) {
      console.error("Quiz Fetch Error:", err);
      setQuizError(err.message || "An error occurred while compiling your dynamic checkpoint quiz.");
    } finally {
      setQuizLoading(false);
    }
  };

  // Trigger Quiz reload when lastActiveTab changes
  useEffect(() => {
    fetchKnowledgeCheck();
  }, [lastActiveTab]);

  const discussInChat = (questionText: string, correctOption: string, explanation: string) => {
    const promptText = `I am practicing the knowledge check for "${getTopicTitle(lastActiveTab)}". 
Could you give me a deeper explanation of this question:
Question: "${questionText}"
Correct Answer: "${correctOption}"
Mentor Explanation: "${explanation}"

Why is this answer correct, and what are some common pitfalls regarding this Next.js 15 concept?`;
    setInputValue(promptText);
    sendMessage(promptText);
    
    // Expand chat elements and scroll
    setTimeout(() => {
      document.getElementById("ai-chat-root")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle loading text indicators cycles
  useEffect(() => {
    if (!isLoading) return;
    const ticks = [
      "Contacting assistant core...",
      "Formulating code blueprints...",
      "Evaluating Next.js 15 guidelines...",
      "Optimizing TSX type annotations...",
      "Structuring explanatory breakdown..."
    ];
    let count = 0;
    const interval = setInterval(() => {
      setLoadingTick(ticks[count % ticks.length]);
      count++;
    }, 1500);

    return () => clearInterval(interval);
  }, [isLoading]);

  // Request Handler
  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    setApiError(null);
    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: "user",
      content: text,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Package payload following standard lazy-loaded getGeminiClient requirements
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: messages.slice(-10).map((m) => ({
            role: m.role,
            text: m.content
          })),
          message: text
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to compile AI response.");
      }

      const tutorMsg: ChatMessage = {
        id: Math.random().toString(),
        role: "assistant",
        content: data.reply,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, tutorMsg]);
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || "Could not connect to the Gemini server endpoint.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  // Custom regex markdown parser to render gorgeous structured markdown elements
  const formatMarkdown = (content: string) => {
    const parts = content.split(/(\`\`\`[\s\S]*?\`\`\`)/);
    
    return parts.map((part, index) => {
      // Code Blocks parser
      if (part.startsWith("\`\`\`")) {
        // extract programming language or code
        const lines = part.split("\n");
        const headerLine = lines[0].replace("\`\`\`", "").trim();
        const codeLines = lines.slice(1, -1).join("\n");
        return (
          <div key={index} className="my-3 rounded-xl border border-slate-800 overflow-hidden font-mono text-[11px] bg-slate-950">
            <div className="bg-slate-900 px-4 py-1.5 text-[9px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-800 flex justify-between items-center select-none">
              <span>{headerLine || "typescript"}</span>
              <span className="text-indigo-400">NextJS 15 Code</span>
            </div>
            <pre className="p-4 overflow-x-auto text-emerald-400 font-semibold select-all leading-normal whitespace-pre">
              <code>{codeLines}</code>
            </pre>
          </div>
        );
      }

      // Inline code blocks, links, bold, headings formatting
      const lines = part.split("\n").map((line, lineIdx) => {
        let formatted = line;

        // Header parser
        if (formatted.startsWith("### ")) {
          return <h5 key={lineIdx} className="font-extrabold text-[#0f172a] text-sm pt-3 pb-1 flex items-center gap-1 leading-snug"><Terminal className="w-3.5 h-3.5 text-indigo-600 shrink-0" />{formatted.replace("### ", "")}</h5>;
        }
        if (formatted.startsWith("## ")) {
          return <h4 key={lineIdx} className="font-black text-[#0f172a] text-base pt-4 pb-1.5 border-b border-indigo-50 leading-snug">{formatted.replace("## ", "")}</h4>;
        }

        // Bullet list parser
        if (formatted.trim().startsWith("* ") || formatted.trim().startsWith("- ")) {
          const itemText = formatted.trim().substring(2);
          return <li key={lineIdx} className="list-disc pl-2 ml-4 my-1 text-slate-700 leading-relaxed text-xs">{parseInlineMarkdown(itemText)}</li>;
        }

        // Standard text lines
        return <p key={lineIdx} className="my-1.5 text-slate-700 leading-relaxed text-xs">{parseInlineMarkdown(formatted)}</p>;
      });

      return <React.Fragment key={index}>{lines}</React.Fragment>;
    });
  };

  // Helper parser for nested markdown inline nodes like bold or code highlights
  const parseInlineMarkdown = (text: string) => {
    // 1. Highlight inline blocks `code`
    let parts = text.split(/(\`[^\`]+\`)/g).map((chunk, sliceIdx) => {
      if (chunk.startsWith("`") && chunk.endsWith("`")) {
        return <code key={sliceIdx} className="bg-slate-100 border text-indigo-700 px-1 py-0.5 rounded text-[10px] font-mono font-semibold">{chunk.slice(1, -1)}</code>;
      }

      // 2. Bold text **text**
      let boldParts = chunk.split(/(\*\*[^*]+\*\*)/g).map((bChunk, bIdx) => {
        if (bChunk.startsWith("**") && bChunk.endsWith("**")) {
          return <strong key={bIdx} className="font-extrabold text-slate-900">{bChunk.slice(2, -2)}</strong>;
        }
        return bChunk;
      });

      return <React.Fragment key={sliceIdx}>{boldParts}</React.Fragment>;
    });

    return parts;
  };

  const seedQueries = [
    { label: "PPR caching explained", prompt: "Explain Partial Prerendering (PPR) in NextJS 15 and how to structure Suspense layouts." },
    { label: "RSC vs Client Components", prompt: "Explain when to use Server Components vs Client Components. Provide an optimal combined code example." },
    { label: "How Server Actions work", prompt: "How do Server Actions communicate changes to the database without fetch queries? Give a structured code recipe." }
  ];

  // Calculate quiz score
  const getQuizScore = () => {
    if (!quizData) return 0;
    let computedScore = 0;
    quizData.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        computedScore++;
      }
    });
    return computedScore;
  };

  const score = getQuizScore();
  const allAnswered = quizData && Object.keys(selectedAnswers).length === quizData.questions.length;

  return (
    <div className="space-y-6" id="ai-chat-root">
      
      {/* Intro Description */}
      <div className="space-y-1.5 animate-fadeIn">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
          <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
          Interactive Assistant
        </h2>
        <p className="text-slate-600 text-xs">
          Query an expert Next.js assistant on caching strategies, dynamic route optimization, and secure server actions.
        </p>
      </div>

      {/* Dynamic AI Knowledge Check Block */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300">
        
        {/* Header container */}
        <div 
          onClick={() => setIsQuizOpen(!isQuizOpen)}
          className="bg-slate-50 p-4 px-5 border-b flex justify-between items-center cursor-pointer select-none hover:bg-slate-100/60 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 shadow-sm">
              <Brain className="w-4 h-4 text-indigo-600 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider font-mono">
                  Concept Knowledge Check
                </span>
                <span className="bg-indigo-100 text-indigo-800 text-[8px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-widest font-mono">
                  Auto Generated
                </span>
              </div>
              <h3 className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5 mt-0.5">
                {getTopicIcon(lastActiveTab)}
                {getTopicTitle(lastActiveTab)}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3 animate-fadeIn">
            {!quizSubmitted && quizData && (
              <span className="text-[10px] bg-slate-200 text-slate-600 font-bold px-2 py-1 rounded-lg">
                {Object.keys(selectedAnswers).length}/3 Answered
              </span>
            )}
            {quizSubmitted && quizData && (
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 ${
                score === 3 ? "bg-emerald-100 text-emerald-800" : "bg-indigo-100 text-indigo-800"
              }`}>
                <Award className="w-3.5 h-3.5 animate-bounce" /> Score: {score}/3
              </span>
            )}
            <div className="text-slate-400 hover:text-slate-700">
              {isQuizOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </div>

        {/* Collapsible content block */}
        {isQuizOpen && (
          <div className="p-5 md:p-6 space-y-6">
            
            {/* Loading state spinner */}
            {quizLoading && (
              <div className="py-8 flex flex-col items-center justify-center space-y-3 animate-pulse">
                <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin" />
                <div className="text-center space-y-0.5">
                  <p className="text-xs font-bold text-slate-700">Compiling interactive knowledge check...</p>
                  <p className="text-[10px] text-indigo-500 font-mono font-bold">Querying assistant model for technical scenarios</p>
                </div>
                {/* Simulated blueprint skeleton cards */}
                <div className="w-full max-w-lg space-y-2 pt-2">
                  <div className="h-3.5 bg-slate-100 rounded-full w-4/5 mx-auto"></div>
                  <div className="h-3 bg-slate-100 rounded-full w-2/3 mx-auto"></div>
                </div>
              </div>
            )}

            {/* Error fallback state */}
            {quizError && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl space-y-3 max-w-xl mx-auto">
                <div className="flex gap-2.5 items-start">
                  <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold text-xs">Failed to initialize Knowledge Check</p>
                    <p className="text-[11px] leading-relaxed font-semibold text-rose-700">{quizError}</p>
                  </div>
                </div>
                <div className="pt-1 text-right">
                  <button 
                    onClick={fetchKnowledgeCheck}
                    className="text-[10px] font-bold text-white bg-rose-600 hover:bg-rose-700 px-3.5 py-1.5 rounded-lg flex items-center gap-1 ml-auto cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" /> Retry Generation
                  </button>
                </div>
              </div>
            )}

            {/* Render questions list */}
            {quizData && !quizLoading && !quizError && (
              <div className="space-y-6 animate-fadeIn">
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {quizData.questions.map((q, qIdx) => {
                    const hasSelected = selectedAnswers[qIdx] !== undefined;
                    const isCorrect = selectedAnswers[qIdx] === q.correctIndex;

                    return (
                      <div key={q.id || qIdx} className="space-y-3 bg-slate-50/40 p-4 border border-slate-200/60 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md/5 transition-all">
                        
                        {/* Question title and label */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] font-black tracking-wider text-slate-400 uppercase font-mono">
                              Checkpoint {qIdx + 1}
                            </span>
                            {quizSubmitted && (
                              isCorrect ? (
                                <span className="text-emerald-600 flex items-center gap-0.5 text-[10px] font-bold">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                                </span>
                              ) : (
                                <span className="text-rose-600 flex items-center gap-0.5 text-[10px] font-bold">
                                  <XCircle className="w-3.5 h-3.5" /> incorrect
                                </span>
                              )
                            )}
                          </div>
                          <h4 className="font-bold text-slate-800 text-xs leading-relaxed">
                            {q.question}
                          </h4>
                        </div>

                        {/* Answers selector radio-style buttons */}
                        <div className="space-y-1.5 pt-2">
                          {q.options.map((opt, optIdx) => {
                            const isOptionSelected = selectedAnswers[qIdx] === optIdx;
                            const isCorrectOpt = optIdx === q.correctIndex;

                            let optStyle = "border-slate-200 bg-white hover:bg-slate-50 text-slate-700 mt-1";
                            
                            if (isOptionSelected && !quizSubmitted) {
                              optStyle = "border-indigo-600 bg-indigo-50/60 text-indigo-900 font-extrabold mt-1 shadow-sm ring-1 ring-indigo-500/20";
                            } else if (quizSubmitted) {
                              if (isCorrectOpt) {
                                optStyle = "border-emerald-500 bg-emerald-50 text-emerald-800 font-extrabold mt-1 shadow-sm";
                              } else if (isOptionSelected && !isCorrect) {
                                optStyle = "border-rose-400 bg-rose-50 text-rose-800 font-extrabold mt-1 shadow-sm";
                              } else {
                                optStyle = "border-slate-100 bg-white/40 text-slate-400 opacity-65 mt-1";
                              }
                            }

                            return (
                              <button
                                key={optIdx}
                                disabled={quizSubmitted}
                                onClick={() => {
                                  setSelectedAnswers((prev) => ({
                                    ...prev,
                                    [qIdx]: optIdx
                                  }));
                                }}
                                className={`w-full text-left text-[11px] p-2.5 rounded-xl border transition-all flex items-start gap-2 cursor-pointer ${optStyle}`}
                              >
                                <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[9px] font-sans font-extrabold mt-0.5 ${
                                  isOptionSelected && !quizSubmitted 
                                    ? "bg-indigo-600 text-white" 
                                    : quizSubmitted && isCorrectOpt 
                                    ? "bg-emerald-600 text-white" 
                                    : quizSubmitted && isOptionSelected 
                                    ? "bg-rose-500 text-white" 
                                    : "bg-slate-100 text-slate-500"
                                }`}>
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <span className="leading-tight">{opt}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Explanation block (visible after submission) */}
                        {quizSubmitted && (
                          <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                            <details className="group">
                              <summary className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer select-none">
                                <Info className="w-3.5 h-3.5" /> View Explanation
                              </summary>
                              <div className="mt-2 text-[10px] leading-relaxed text-slate-600 bg-indigo-50/30 p-2.5 rounded-lg border border-indigo-100/50">
                                {q.explanation}
                              </div>
                            </details>

                            {/* discussing prompt trigger */}
                            <button
                              onClick={() => discussInChat(q.question, q.options[q.correctIndex], q.explanation)}
                              className="w-full text-[9px] font-bold text-slate-500 hover:text-indigo-600 border border-slate-200 hover:border-indigo-100 bg-white hover:bg-slate-50 py-1 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer mt-1"
                            >
                              <MessageSquare className="w-3 h-3" /> Discuss in chat
                            </button>
                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>

                {/* Score and actions bottom row */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div>
                    {!quizSubmitted ? (
                      <p className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5 leading-relaxed">
                        <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0" />
                        Please choose answers for all 3 questions to unlock evaluation.
                      </p>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800">
                          {score === 3 ? "🏆 Perfect Score! Stellar Next.js comprehension." : "🚀 Well completed! Continue asking questions to master this."}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2.5">
                    {!quizSubmitted ? (
                      <button
                        onClick={() => setQuizSubmitted(true)}
                        disabled={!allAnswered}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-45 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
                      >
                        Evaluate Knowledge Check
                      </button>
                    ) : (
                      <button
                        onClick={fetchKnowledgeCheck}
                        className="text-xs font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Re-Generate Lesson Check
                      </button>
                    )}
                  </div>
                </div>

              </div>
            )}

          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[520px] overflow-hidden" id="ai-chat-box">
        
        {/* Chat Top header bar */}
        <div className="bg-slate-50 border-b p-4 px-5 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-sm font-sans">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800">
                Next.js Expert Agent
              </h3>
              <p className="text-[10px] text-indigo-600 font-bold font-mono">
                System online • teaching console
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setMessages([
                {
                  id: "welcome",
                  role: "assistant",
                  content: "Reload completed! Let's clear our console slate. Ask me any question or explore details on layouts, routing, or database configurations below.",
                  timestamp: new Date()
                }
              ]);
              setApiError(null);
            }}
            className="text-[10px] font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1 border border-slate-200 bg-white rounded-lg px-2.5 py-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" /> Reset Console
          </button>
        </div>

        {/* Chat messages viewport */}
        <div className="flex-1 p-5 md:p-6 overflow-y-auto space-y-6 bg-slate-50/40">
          {messages.map((m) => {
            const isBot = m.role === "assistant";
            return (
              <div
                key={m.id}
                className={`flex gap-3 max-w-[85%] ${isBot ? "mr-auto text-left" : "ml-auto flex-row-reverse text-right"}`}
              >
                {/* avatar elements */}
                <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold shadow-sm ${
                  isBot ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-800"
                }`}>
                  {isBot ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Bubble details */}
                <div className={`p-4 rounded-2xl text-xs space-y-2 border shadow-sm ${
                  isBot 
                    ? "bg-white border-slate-200 text-slate-800 rounded-tl-none leading-relaxed" 
                    : "bg-indigo-600 border-indigo-700 text-white rounded-tr-none leading-relaxed text-left"
                }`}>
                  {isBot ? (
                    formatMarkdown(m.content)
                  ) : (
                    <p className="font-medium whitespace-pre-wrap">{m.content}</p>
                  )}
                  
                  <span className={`block text-[9px] mt-1 ${isBot ? "text-slate-400 text-right" : "text-indigo-200 text-right"}`}>
                    {m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3 max-w-[80%] mr-auto text-left animate-pulse">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="bg-white border p-4 rounded-2xl rounded-tl-none border-slate-100 flex items-center gap-3 space-y-2">
                <div className="flex flex-col gap-1.5">
                  <div className="h-3 w-48 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-3.5 w-32 bg-slate-200 rounded animate-pulse"></div>
                  <span className="text-[10px] text-indigo-500 font-bold pl-1 font-mono">{loadingTick}</span>
                </div>
              </div>
            </div>
          )}

          {/* Render Api error panel */}
          {apiError && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl max-w-md mx-auto text-xs flex gap-2">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
              <div className="space-y-1">
                <p className="font-bold">AI tutor connection failed</p>
                <p className="leading-relaxed font-semibold">{apiError}</p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Form input and quick seeds board */}
        <div className="border-t bg-white p-4 space-y-3 relative z-10">
          
          {/* Seeds shortcuts row */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase py-1.5 pr-1 self-center select-none font-sans">
              Suggested:
            </span>
            {seedQueries.map((s, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(s.prompt)}
                disabled={isLoading}
                className="text-[10px] font-bold text-slate-600 hover:text-indigo-600 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50 border border-slate-200 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Form input field */}
          <form onSubmit={handleFormSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Ask me: Why does cookies() force dynamic rendering?..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              className="flex-1 text-xs p-3 px-4 border border-slate-200 bg-slate-50/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-45 text-white rounded-xl p-3 px-4 transition-colors font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              Send <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}
