import React, { useState, useEffect } from "react";
import { Lesson, Quiz } from "../types";
import { initialRoadmapLessons, quizzes } from "../data";
import { CheckCircle2, Circle, ArrowRight, Award, HelpCircle, AlertCircle, RefreshCw, BookmarkCheck, Lock, Search, X } from "lucide-react";
import Badges from "./Badges";
import Markdown from "react-markdown";

interface RoadmapProps {
  lessons: Lesson[];
  onToggleComplete: (id: string) => void;
  searchTerm?: string;
  setSearchTerm?: (val: string) => void;
}

export default function Roadmap({ lessons, onToggleComplete, searchTerm: propSearchTerm, setSearchTerm: propSetSearchTerm }: RoadmapProps) {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(lessons[0] || null);
  const [passedQuizzes, setPassedQuizzes] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem("nextjs_passed_quizzes");
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error("Could not parse passed quizzes:", e);
      return {};
    }
  });

  const [quizScores, setQuizScores] = useState<Record<string, { correct: number; total: number }>>(() => {
    try {
      const saved = localStorage.getItem("nextjs_quiz_scores");
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error("Could not parse quiz scores:", e);
      return {};
    }
  });

  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [blockedLessonId, setBlockedLessonId] = useState<string | null>(null);
  
  const [localSearchTerm, setLocalSearchTerm] = useState<string>("");
  const currentSearchTerm = propSearchTerm !== undefined ? propSearchTerm : localSearchTerm;
  const currentSetSearchTerm = propSetSearchTerm !== undefined ? propSetSearchTerm : setLocalSearchTerm;

  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setTimeout(() => {
      const portalEl = document.getElementById("active-study-portal");
      if (portalEl) {
        portalEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const completedCount = lessons.filter((l) => l.completed).length;
  const progressPercent = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  const categories = ["All", "Fundamentals", "Routing", "Data Fetching"];
  const filteredLessons = lessons.filter((l) => {
    const matchesCategory = categoryFilter === "All" || l.category === categoryFilter;
    
    const normalizedQuery = currentSearchTerm.toLowerCase().trim();
    if (!normalizedQuery) {
      return matchesCategory;
    }
    
    return matchesCategory && (
      l.title.toLowerCase().includes(normalizedQuery) ||
      l.category.toLowerCase().includes(normalizedQuery) ||
      l.difficulty.toLowerCase().includes(normalizedQuery) ||
      l.shortDescription.toLowerCase().includes(normalizedQuery) ||
      l.fullContent.toLowerCase().includes(normalizedQuery)
    );
  });

  // Synchronize state when changing selected lessons
  useEffect(() => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizFeedback(null);
    setBlockedLessonId(null);
  }, [selectedLesson?.id]);

  const startQuiz = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setBlockedLessonId(null);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizFeedback(null);

    setTimeout(() => {
      const quizEl = document.getElementById("quiz-section-container");
      if (quizEl) {
        quizEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 150);
  };

  const handleToggleCompleteWithQuizCheck = (lessonId: string) => {
    const lesson = lessons.find((l) => l.id === lessonId);
    if (!lesson) return;

    // Allowing toggling incomplete at any time
    if (lesson.completed) {
      onToggleComplete(lessonId);
      return;
    }

    // Checking if quiz exists and is passed
    const quizId = lesson.quizId;
    const isPassed = quizId ? !!passedQuizzes[quizId] : true;

    if (!isPassed) {
      setBlockedLessonId(lessonId);
      setSelectedLesson(lesson);
      // Automatically scroll down to the comprehension test inside active study window
      setTimeout(() => {
        const quizEl = document.getElementById("quiz-section-container");
        if (quizEl) {
          quizEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 150);
      return;
    }

    onToggleComplete(lessonId);
    setBlockedLessonId(null);
  };

  const submitQuiz = (quiz: Quiz) => {
    let score = 0;
    quiz.questions.forEach((q) => {
      if (quizAnswers[q.id] === q.correctAnswerIndex) {
        score++;
      }
    });

    const passed = score === quiz.questions.length;
    setQuizSubmitted(true);
    
    // Track/update score for this quiz
    const updatedScores = {
      ...quizScores,
      [quiz.id]: { correct: score, total: quiz.questions.length }
    };
    setQuizScores(updatedScores);
    try {
      localStorage.setItem("nextjs_quiz_scores", JSON.stringify(updatedScores));
    } catch (e) {
      console.error("Failed to save quiz scores:", e);
    }
    
    if (passed) {
      setQuizFeedback(`Perfect! 🎉 ${score}/${quiz.questions.length} correct. You have fully unlocked this checkpoint!`);
      
      const updatedPassed = { ...passedQuizzes, [quiz.id]: true };
      setPassedQuizzes(updatedPassed);
      try {
        localStorage.setItem("nextjs_passed_quizzes", JSON.stringify(updatedPassed));
      } catch (e) {
        console.error("Failed to save passed quizzes:", e);
      }

      // Automatically mark the lesson complete
      const relatedLesson = lessons.find((l) => l.quizId === quiz.id);
      if (relatedLesson && !relatedLesson.completed) {
        onToggleComplete(relatedLesson.id);
      }
      setBlockedLessonId(null);
    } else {
      setQuizFeedback(`Review required: You got ${score}/${quiz.questions.length} correct. Review correct setups below and try again!`);
    }
  };

  // Safe fetch corresponding quiz
  const currentLessonQuiz = selectedLesson?.quizId 
    ? quizzes.find((q) => q.id === selectedLesson.quizId) 
    : null;

  const currentQuizPassed = selectedLesson?.quizId 
    ? !!passedQuizzes[selectedLesson.quizId] 
    : false;

  return (
    <div className="space-y-8" id="roadmap-root">
      {/* Tracker Hero Board */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-lg border border-indigo-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -ml-20 -mb-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              <Award className="w-3.5 h-3.5 text-indigo-400" />
              NextJS 15 Mastery Roadmap
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight font-sans">
              Track Your Next.js Learning Journey
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Complete each checkpoint to build production-grade habits. Learn Routing, React Server Components (RSC), and data synchronization loops hands-on.
            </p>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shrink-0 w-full md:w-64 space-y-3 flex flex-col align-middle text-center md:text-left">
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-semibold text-slate-400">Total Progress</span>
              <span className="text-3xl font-black font-mono text-emerald-400">{progressPercent}%</span>
            </div>
            
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            <p className="text-[11px] text-slate-500">
              {completedCount} of {lessons.length} checkpoints unlocked
            </p>
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <Badges 
        progressPercent={progressPercent} 
        completedCount={completedCount} 
        passedQuizzesCount={Object.values(passedQuizzes).filter(Boolean).length} 
      />

      {/* Main Roadmap Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Columns - Checkpoint list */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-4 border-b border-slate-100 pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="font-bold text-slate-900 font-sans text-lg">Curriculum Checkpoints</h3>
              
              {/* Category filtering */}
              <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-lg">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                      categoryFilter === cat 
                        ? "bg-white text-indigo-600 shadow-sm" 
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Luxurious Search Bar */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search checkpoints by title, keywords or concepts..."
                value={currentSearchTerm}
                onChange={(e) => currentSetSearchTerm(e.target.value)}
                className="w-full pl-10 pr-9 py-2 text-xs bg-slate-100/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 dark:text-slate-300 transition-all font-medium"
              />
              {currentSearchTerm && (
                <button
                  onClick={() => currentSetSearchTerm("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* List of lesson nodes */}
          <div className="space-y-4">
            {filteredLessons.length > 0 ? (
              filteredLessons.map((lesson) => {
                const hasQuiz = !!lesson.quizId;
                const isQuizPassed = hasQuiz ? !!passedQuizzes[lesson.quizId!] : true;
                const scoreInfo = lesson.quizId ? quizScores[lesson.quizId] : null;
                const accuracyPercent = scoreInfo ? Math.round((scoreInfo.correct / scoreInfo.total) * 100) : 0;

                return (
                  <div
                    key={lesson.id}
                    className={`relative overflow-hidden group bg-white rounded-2xl p-5 border transition-all hover:shadow-md ${
                      selectedLesson?.id === lesson.id
                        ? "border-indigo-600 shadow-sm ring-1 ring-indigo-600/30"
                        : "border-slate-100 hover:border-slate-200"
                    } ${lesson.completed ? "bg-emerald-50/10 dark:bg-emerald-950/5 border-emerald-500/20" : ""}`}
                    id={`roadmap-lesson-card-${lesson.id}`}
                  >
                    {/* Visual Completed Status Badge Overlay */}
                    {lesson.completed && (
                      <div 
                        className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-emerald-600 text-white text-[9px] uppercase tracking-wider font-extrabold px-2.5 py-1.5 rounded-full shadow-md shadow-emerald-600/15 border border-emerald-500 animate-fadeIn"
                        id={`completed-badge-${lesson.id}`}
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-100 fill-emerald-600 shrink-0" />
                        <span>Completed</span>
                      </div>
                    )}

                    <div className="flex items-start gap-4">
                      {/* Checkbox state tracker */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleCompleteWithQuizCheck(lesson.id);
                        }}
                        className="mt-0.5 text-slate-400 hover:text-indigo-600 transition-colors shrink-0 cursor-pointer"
                      >
                        {lesson.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-300 group-hover:text-slate-400" />
                        )}
                      </button>

                      {/* Checkpoint text info */}
                      <div className="flex-1 space-y-1">
                        <div className={`flex flex-wrap items-center gap-2 ${lesson.completed ? "pr-24" : ""}`}>
                          <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                            {lesson.category}
                          </span>
                          <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full ${
                            lesson.difficulty === "Beginner" 
                              ? "bg-emerald-50 text-emerald-700" 
                              : lesson.difficulty === "Intermediate"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-rose-50 text-rose-700"
                          }`}>
                            {lesson.difficulty}
                          </span>

                          {/* Quiz Accomplished Badge status */}
                          {hasQuiz && (
                            <span className={`text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full flex items-center gap-1 border ${
                              isQuizPassed
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}>
                              {isQuizPassed ? "✓ Quiz Decoded" : "⚠️ Quiz Pending"}
                            </span>
                          )}
                        </div>

                        <h4 
                          onClick={() => handleSelectLesson(lesson)}
                          className={`font-bold text-slate-800 text-base leading-tight group-hover:text-indigo-600 cursor-pointer transition-colors pt-1 ${lesson.completed ? "pr-24" : ""}`}
                        >
                          {lesson.title}
                        </h4>
                        <p className="text-slate-500 text-sm">{lesson.shortDescription}</p>
                        
                        {/* Interaction Actions bar */}
                        <div className="flex flex-wrap gap-3 pt-3">
                          <button
                            onClick={() => handleSelectLesson(lesson)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                          >
                            Read Study Lesson & Quiz <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                          
                          {hasQuiz && (
                            <button
                              onClick={() => startQuiz(lesson)}
                              className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                                isQuizPassed 
                                  ? "text-emerald-700 border-emerald-100 bg-emerald-50 hover:bg-emerald-100"
                                  : "text-slate-600 border-slate-200 bg-slate-50 hover:bg-slate-100"
                              }`}
                            >
                              <BookmarkCheck className="w-3 text-emerald-500" />
                              {isQuizPassed ? "Review / Retake Quiz" : "Take Section Quiz"}
                            </button>
                          )}
                        </div>

                        {/* Quiz accuracy visual progress bar */}
                        {hasQuiz && (
                          <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="text-slate-500 font-medium">Quiz Accuracy:</span>
                              {scoreInfo ? (
                                <span className={`font-bold ${
                                  accuracyPercent === 100 ? "text-emerald-600 font-extrabold" :
                                  accuracyPercent >= 80 ? "text-indigo-600" :
                                  accuracyPercent >= 50 ? "text-amber-600" : "text-rose-600"
                                }`}>
                                  {accuracyPercent}% ({scoreInfo.correct}/{scoreInfo.total} correct)
                                </span>
                              ) : (
                                <span className="text-slate-400 font-semibold italic">Not attempted yet</span>
                              )}
                            </div>
                            <div className="relative w-full bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner">
                              <div 
                                className={`h-full rounded-full transition-all duration-700 ease-out ${
                                  scoreInfo 
                                    ? accuracyPercent === 100 ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]" :
                                      accuracyPercent >= 80 ? "bg-indigo-500" :
                                      accuracyPercent >= 50 ? "bg-amber-500" : "bg-rose-500"
                                    : "bg-slate-200"
                                }`}
                                style={{ width: `${scoreInfo ? accuracyPercent : 0}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 px-4 bg-slate-50/60 border border-dashed border-slate-200 rounded-2xl space-y-3">
                <div className="inline-flex items-center justify-center p-3 bg-slate-100 rounded-full text-slate-400">
                  <Search className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 dark:text-white text-sm">No checkpoints found</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                    We couldn't find any lessons matching "{currentSearchTerm}". Try checking your spelling or adjusting filters.
                  </p>
                </div>
                <div>
                  <button
                    onClick={() => {
                      currentSetSearchTerm("");
                      setCategoryFilter("All");
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-indigo-600 rounded-lg shadow-sm transition-all cursor-pointer"
                  >
                    Clear Search & Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Study Drawer & Quiz active board */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Study Drawer Display Card & Integrated Quiz */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors" id="active-study-portal">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex justify-between items-center">
              <h4 className="font-black text-slate-900 dark:text-white tracking-tight text-sm uppercase">
                Active Study Portal
              </h4>
              {selectedLesson && (
                <button
                  onClick={() => handleToggleCompleteWithQuizCheck(selectedLesson.id)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    selectedLesson.completed 
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:hover:bg-emerald-900/30 dark:border dark:border-emerald-900/50" 
                      : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 dark:hover:bg-indigo-900/30 dark:border dark:border-indigo-900/50"
                  }`}
                >
                  {selectedLesson.completed ? "Mark Incomplete" : "Mark Chapter Complete"}
                </button>
              )}
            </div>

            {selectedLesson ? (
              <div className="space-y-4 animate-fadeIn">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-indigo-600 font-bold tracking-wider uppercase">
                      {selectedLesson.category}
                    </span>
                    {selectedLesson.completed && (
                      <span className="text-[9px] font-extrabold uppercase bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 rounded-full px-2 py-0.5 border border-emerald-200 dark:border-emerald-900/60 tracking-wider">
                        ✓ Chapter Completed
                      </span>
                    )}
                  </div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-lg leading-snug">
                    {selectedLesson.title}
                  </h3>
                </div>

                {/* Body formatting for dynamic lessons */}
                <div className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed max-h-[380px] overflow-y-auto pr-1">
                  <Markdown
                    components={{
                      h1: ({ children }) => <h3 className="font-extrabold text-slate-900 dark:text-white text-base font-sans pt-4 pb-1 tracking-tight">{children}</h3>,
                      h2: ({ children }) => <h4 className="font-extrabold text-slate-900 dark:text-white text-sm font-sans pt-3.5 pb-1 tracking-tight">{children}</h4>,
                      h3: ({ children }) => <h5 className="font-bold text-slate-950 dark:text-white font-sans text-xs pt-3 pb-0.5 tracking-tight">{children}</h5>,
                      h4: ({ children }) => <h5 className="font-bold text-slate-950 dark:text-white font-sans text-xs pt-2.5 pb-0.5">{children}</h5>,
                      p: ({ children }) => <p className="mb-3 leading-relaxed text-slate-600 dark:text-slate-300 text-xs">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc pl-5 space-y-1.5 my-3 text-xs text-slate-600 dark:text-slate-300">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1.5 my-3 text-xs text-slate-600 dark:text-slate-300">{children}</ol>,
                      li: ({ children }) => <li className="pl-0.5 leading-relaxed">{children}</li>,
                      code: ({ node, className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || '');
                        const isInline = !match;
                        if (isInline) {
                          return (
                            <code className="bg-slate-100 dark:bg-slate-800 text-rose-600 dark:text-rose-400 px-1 py-0.5 rounded text-[10.5px] font-mono font-medium" {...props}>
                              {children}
                            </code>
                          );
                        }
                        return (
                          <pre className="bg-slate-900 text-emerald-400 font-mono text-[10px] p-3 rounded-lg overflow-x-auto my-3 border border-slate-800 leading-normal">
                            <code>{children}</code>
                          </pre>
                        );
                      },
                      strong: ({ children }) => <strong className="font-black text-slate-900 dark:text-white select-all">{children}</strong>,
                      blockquote: ({ children }) => <blockquote className="border-l-3 border-indigo-500 pl-3.5 py-1 my-3 bg-slate-50 dark:bg-slate-950 text-slate-500 italic rounded-r-lg">{children}</blockquote>,
                    }}
                  >
                    {selectedLesson.fullContent}
                  </Markdown>
                </div>

                {/* Integrated Quiz Portion at the footer of Study Portal */}
                {currentLessonQuiz && (
                  <div id="quiz-section-container" className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-6 space-y-4">
                    <div id="quiz-card-anchor" className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5 font-sans uppercase tracking-wider">
                        <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-pulse" />
                        Checkpoint Quiz
                      </h4>
                      {currentQuizPassed ? (
                        <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-extrabold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900/60 uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-50 dark:fill-emerald-950/20" />
                          Passed (100%)
                        </span>
                      ) : (
                        <span className="text-[9px] bg-amber-50 dark:bg-amber-950/45 text-amber-700 dark:text-amber-400 font-extrabold px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-900/60 uppercase tracking-wider flex items-center gap-1">
                          <Lock className="w-3 h-3 text-amber-500 dark:text-amber-400" />
                          Quiz Required
                        </span>
                      )}
                    </div>

                    {/* Blocked and locked indicators */}
                    {blockedLessonId === selectedLesson.id && (
                      <div className="bg-rose-50 text-rose-800 p-3 rounded-xl border border-rose-200 text-xs flex gap-2 animate-pulse font-sans">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5 font-bold" />
                        <div>
                          <strong>Check Your Understanding:</strong> Next.js compiles security segments recursively! Please pass this lesson's quick checkpoint quiz first to verify understanding before completion layout unlocks.
                        </div>
                      </div>
                    )}

                    {/* Quiz Questions */}
                    <div className="space-y-4">
                      {currentLessonQuiz.questions.map((q, qIndex) => (
                        <div key={q.id} className="space-y-2.5 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-150 dark:border-slate-800/80">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-normal">
                            Q{qIndex + 1}. {q.text}
                          </p>
                          <div className="space-y-1.5 pt-0.5">
                            {q.options.map((opt, optIndex) => {
                              const isSelected = quizAnswers[q.id] === optIndex;
                              const isCorrect = optIndex === q.correctAnswerIndex;
                              const isSubmitted = quizSubmitted || currentQuizPassed;
                              const showAsSelected = currentQuizPassed ? isCorrect : isSelected;

                              return (
                                <button
                                  key={optIndex}
                                  disabled={currentQuizPassed || quizSubmitted}
                                  onClick={() => {
                                    setQuizAnswers({
                                      ...quizAnswers,
                                      [q.id]: optIndex,
                                    });
                                  }}
                                  className={`w-full text-left text-[11px] p-2.5 rounded-lg border transition-all leading-snug cursor-pointer ${
                                    showAsSelected
                                      ? isSubmitted
                                        ? isCorrect
                                          ? "bg-emerald-50/10 dark:bg-emerald-950/20 border-emerald-400 text-emerald-800 dark:text-emerald-400 font-bold"
                                          : "bg-rose-50/15 dark:bg-rose-950/20 border-rose-350 text-rose-800 dark:text-rose-400"
                                        : "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-400 text-indigo-900 dark:text-indigo-400 font-bold shadow-sm"
                                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                                  } ${
                                    isSubmitted && isCorrect && !showAsSelected
                                      ? "bg-emerald-50/50 border-emerald-300"
                                      : ""
                                  }`}
                                >
                                  <div className="flex justify-between items-center">
                                    <span>{opt}</span>
                                    {isSubmitted && isCorrect && (
                                      <span className="text-[8px] font-black uppercase text-emerald-600 bg-emerald-100/60 px-1 py-0.5 rounded leading-none">Correct</span>
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                          {(quizSubmitted || currentQuizPassed) && (
                            <div className="bg-indigo-50/40 dark:bg-indigo-950/20 p-2.5 text-[10px] leading-relaxed text-indigo-800 dark:text-indigo-300 border-l-2 border-indigo-500 rounded font-sans">
                              <strong>Key Insight:</strong> {q.explanation}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Quiz Feedback Alerts */}
                    {quizFeedback && (
                      <div className={`p-3 rounded-xl text-xs flex gap-2 border ${
                        quizFeedback.includes("Perfect") 
                          ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60" 
                          : "bg-rose-50 dark:bg-rose-950/25 text-rose-800 dark:text-rose-400 border-rose-200 dark:border-rose-950"
                      }`}>
                        {quizFeedback.includes("Perfect") ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        )}
                        <p className="font-semibold leading-normal">{quizFeedback}</p>
                      </div>
                    )}

                    {/* Dynamic Action Buttons inside embedded quiz */}
                    <div className="flex gap-2.5">
                      {!currentQuizPassed && !quizSubmitted ? (
                        <button
                          onClick={() => submitQuiz(currentLessonQuiz)}
                          disabled={Object.keys(quizAnswers).length < currentLessonQuiz.questions.length}
                          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-2 px-4 text-xs font-bold shadow transition-all disabled:opacity-40 cursor-pointer"
                        >
                          Verify My Understanding
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            if (currentQuizPassed) {
                              const updatedPassed = { ...passedQuizzes };
                              delete updatedPassed[currentLessonQuiz.id];
                              setPassedQuizzes(updatedPassed);
                              try {
                                localStorage.setItem("nextjs_passed_quizzes", JSON.stringify(updatedPassed));
                              } catch (e) {
                                console.error(e);
                              }
                              // Mark lesson incomplete in state so they earn the unlocked state again
                              onToggleComplete(selectedLesson.id);
                            }
                            // Also clear the stored accuracy score for this quiz so the accuracy bar resets
                            const updatedScores = { ...quizScores };
                            delete updatedScores[currentLessonQuiz.id];
                            setQuizScores(updatedScores);
                            try {
                              localStorage.setItem("nextjs_quiz_scores", JSON.stringify(updatedScores));
                            } catch (e2) {
                              console.error(e2);
                            }

                            setQuizAnswers({});
                            setQuizSubmitted(false);
                            setQuizFeedback(null);
                          }}
                          className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl py-2 px-3 text-xs font-bold transition-all flex justify-center items-center gap-1.5 cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          Retake Checkpoint Quiz
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 px-4 space-y-3">
                <div className="inline-flex p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-full">
                  <ArrowRight className="w-6 h-6 rotate-45" />
                </div>
                <h5 className="font-bold text-slate-800 dark:text-white text-sm">No Checkpoint Selected</h5>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                  Click <strong>"Read Study Lesson"</strong> on any checkpoint to unlock code recipes, core descriptions, and interactive sandbox guidelines.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
