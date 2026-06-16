import React, { useState, useEffect } from "react";
import { initialRoadmapLessons, initialFiles } from "./data";
import { Lesson, CodeFile } from "./types";
import Roadmap from "./components/Roadmap";
import FileExplorer from "./components/FileExplorer";
import RscLab from "./components/RscLab";
import ServerActionsLab from "./components/ServerActionsLab";
import RenderingLab from "./components/RenderingLab";
import AiTutor from "./components/AiTutor";
import ProgressChart from "./components/ProgressChart";
import { BookOpen, FolderTree, Hammer, Zap, Edit3, Sparkles, Code2, Award, Heart, Sun, Moon, Search, X, Download } from "lucide-react";
import confetti from "canvas-confetti";

export default function App() {
  const [lessons, setLessons] = useState<Lesson[]>(() => {
    try {
      const saved = localStorage.getItem("nextjs_learning_progress");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Map initial structure to maintain sync of descriptions or quizzes, merge completed flags
        return initialRoadmapLessons.map((l) => ({
          ...l,
          completed: !!parsed[l.id],
        }));
      }
    } catch (e) {
      console.error("Could not parse progress state:", e);
    }
    return initialRoadmapLessons;
  });

  const [activeTab, setActiveTab] = useState<"roadmap" | "explorer" | "rsc" | "actions" | "rendering" | "tutor">("roadmap");
  const [lastActiveTab, setLastActiveTab] = useState<string>("roadmap");
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  // Theme state persisted in localStorage
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("nextjs_dark_theme");
      return saved === "true";
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("nextjs_dark_theme", String(isDark));
    } catch (e) {
      console.error("Theme toggle persistence error:", e);
    }
  }, [isDark]);

  useEffect(() => {
    if (activeTab !== "tutor") {
      setLastActiveTab(activeTab);
    }
  }, [activeTab]);

  const handleTabChange = (tab: "roadmap" | "explorer" | "rsc" | "actions" | "rendering" | "tutor") => {
    setActiveTab(tab);
    setTimeout(() => {
      document.getElementById("main-root")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  // Synchronize completed stages to localStorage
  useEffect(() => {
    const progressMap = lessons.reduce((acc, curr) => {
      acc[curr.id] = curr.completed;
      return acc;
    }, {} as Record<string, boolean>);
    localStorage.setItem("nextjs_learning_progress", JSON.stringify(progressMap));
  }, [lessons]);

  const handleToggleComplete = (id: string) => {
    setLessons((prev) => {
      let isNewlyCompleted = false;
      const updated = prev.map((l) => {
        if (l.id === id) {
          const nextVal = !l.completed;
          if (nextVal) {
            isNewlyCompleted = true;
          }
          return { ...l, completed: nextVal };
        }
        return l;
      });

      if (isNewlyCompleted) {
        try {
          // Left side burst
          confetti({
            particleCount: 70,
            angle: 60,
            spread: 60,
            origin: { x: 0, y: 0.85 },
            colors: ["#6366f1", "#a5b4fc", "#10b981", "#34d399", "#f59e0b"]
          });
          // Right side burst
          confetti({
            particleCount: 70,
            angle: 120,
            spread: 60,
            origin: { x: 1, y: 0.85 },
            colors: ["#6366f1", "#a5b4fc", "#10b981", "#34d399", "#f59e0b"]
          });
        } catch (err) {
          console.error("Failed to run confetti animation:", err);
        }
      }

      return updated;
    });
  };

  const completedCount = lessons.filter((l) => l.completed).length;
  const progressPercent = Math.round((completedCount / lessons.length) * 100);

  const handleExportProgress = () => {
    try {
      const completedList = lessons.filter(l => l.completed);
      const exportData = {
        appName: "Next.js Learning Companion",
        exportedAt: new Date().toISOString(),
        stats: {
          totalLessons: lessons.length,
          completedCount: completedCount,
          progressPercent: progressPercent
        },
        completedLessons: completedList.map(l => ({
          id: l.id,
          title: l.title,
          category: l.category,
          difficulty: l.difficulty,
          shortDescription: l.shortDescription
        }))
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `nextjs_learning_progress_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Failed to export progress:", e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-sans grid grid-rows-[auto_1fr_auto] transition-colors duration-350" id="main-root">
      
      {/* Top Navigation Workspace Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-850 py-3.5 px-4 md:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm z-20 sticky top-0 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-800 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-[#0f172a] dark:text-white text-base leading-tight tracking-tight flex items-center gap-1">
              Next.js Learning Companion
            </h1>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider font-mono">
              Interactive Full-Stack Workspace v15.0
            </p>
          </div>
        </div>

        {/* Dynamic header tracker progress counter & Theme controls */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-slate-500 dark:text-slate-400">
            <Award className="w-4 h-4 text-emerald-500 fill-emerald-50 dark:fill-emerald-950/20" />
            <span>Path: <strong>{completedCount}/{lessons.length} Passed</strong></span>
            <span className="text-slate-300 dark:text-slate-800">|</span>
            <span className="text-emerald-600 dark:text-emerald-400">{progressPercent}%</span>
          </div>
          
          <div className="flex items-center gap-2.5">
            {/* Custom High-contrast Dark Mode Toggle Button */}
            <button
              onClick={() => setIsDark((prev) => !prev)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-755 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-705/60 transition-all cursor-pointer shadow-sm active:scale-95"
              id="theme-toggle"
              aria-label="Toggle High-Contrast Dark Mode"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 animate-pulse-slow" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            {/* Custom JSON Export Progress Button */}
            <button
              onClick={handleExportProgress}
              className="text-[10px] sm:text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 cursor-pointer shadow-sm active:scale-95"
              title="Export Completed Roadmap to JSON file"
              id="export-progress"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Progress</span>
            </button>

            <a
              href="https://github.com/quayecodes/nextjs-learning"
              target="_blank"
              rel="noreferrer"
              className="text-[10px] sm:text-xs font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
            >
              Original Repo
            </a>
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <main className="max-w-7xl mx-auto w-full px-4 md:px-8 pt-8 pb-24 lg:pb-8 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 items-start">
        
        {/* Workspace Sidebar Tabs Selector */}
        <aside className="order-2 lg:order-1 space-y-6 lg:sticky lg:top-24">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
            
            {/* Quick Search Input */}
            <div className="px-1 space-y-1.5 border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <label htmlFor="sidebar-search" className="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-wider uppercase px-1 font-sans block">
                Quick Filter Progress
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <Search className="w-3.5 h-3.5" />
                </span>
                <input
                  id="sidebar-search"
                  type="text"
                  placeholder="Type title or keyword..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (activeTab !== "roadmap") {
                      setActiveTab("roadmap");
                    }
                  }}
                  className="w-full pl-8.5 pr-8 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 dark:text-slate-200 transition-all font-medium placeholder-slate-400 dark:placeholder-slate-600"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-350 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <h2 className="hidden lg:block text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-wider uppercase px-2 font-sans">
              WORKSPACE LABS
            </h2>

            <nav className="hidden lg:flex flex-col gap-1 text-xs">
              <button
                onClick={() => setActiveTab("roadmap")}
                className={`w-full text-left font-bold px-3 py-2.5 rounded-xl transition-all flex items-center gap-2.5 cursor-pointer ${
                  activeTab === "roadmap"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                    : "text-slate-600 dark:text-slate-350 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <BookOpen className="w-4 h-4 shrink-0" />
                <span>1. Curriculum Roadmap</span>
              </button>

              <button
                onClick={() => setActiveTab("explorer")}
                className={`w-full text-left font-bold px-3 py-2.5 rounded-xl transition-all flex items-center gap-2.5 cursor-pointer ${
                  activeTab === "explorer"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                    : "text-slate-600 dark:text-slate-350 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <FolderTree className="w-4 h-4 shrink-0" />
                <span>2. Directory Simulator</span>
              </button>

              <button
                onClick={() => setActiveTab("rsc")}
                className={`w-full text-left font-bold px-3 py-2.5 rounded-xl transition-all flex items-center gap-2.5 cursor-pointer ${
                  activeTab === "rsc"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                    : "text-slate-600 dark:text-slate-350 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Hammer className="w-4 h-4 shrink-0" />
                <span>3. RSC Boundary Lab</span>
              </button>

              <button
                onClick={() => setActiveTab("actions")}
                className={`w-full text-left font-bold px-3 py-2.5 rounded-xl transition-all flex items-center gap-2.5 cursor-pointer ${
                  activeTab === "actions"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                    : "text-slate-600 dark:text-slate-350 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Edit3 className="w-4 h-4 shrink-0" />
                <span>4. Server Actions Lab</span>
              </button>

              <button
                onClick={() => setActiveTab("rendering")}
                className={`w-full text-left font-bold px-3 py-2.5 rounded-xl transition-all flex items-center gap-2.5 cursor-pointer ${
                  activeTab === "rendering"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                    : "text-slate-600 dark:text-slate-350 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Zap className="w-4 h-4 shrink-0" />
                <span>5. Caching Pipelines</span>
              </button>

              <button
                onClick={() => setActiveTab("tutor")}
                className={`w-full text-left font-bold px-3 py-2.5 rounded-xl transition-all flex items-center gap-2.5 cursor-pointer ${
                  activeTab === "tutor"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                    : "text-slate-600 dark:text-slate-350 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Sparkles className="w-4 h-4 shrink-0 animate-pulse text-indigo-500 dark:text-indigo-400" />
                <span>6. Interactive Assistant</span>
              </button>
            </nav>
          </div>

          <ProgressChart lessons={lessons} isDark={isDark} />

          {/* Quick instructions widget */}
          <div className="bg-indigo-950 text-indigo-300 p-4 rounded-2xl text-[11px] leading-relaxed border border-indigo-900 relative overflow-hidden select-none">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl"></div>
            <span className="font-mono font-bold uppercase tracking-wider block mb-1 text-white">⭐ QUICK CONTROLS:</span>
            <p>
              Work through the checkpoints, study layouts in the interactive directory, and query the assistant for specific questions to accelerate your full-stack journey.
            </p>
          </div>
        </aside>

        {/* Dynamic Display Board Column */}
        <section className="order-1 lg:order-2 bg-slate-50 dark:bg-slate-950 min-h-[450px]">
          {activeTab === "roadmap" && (
            <Roadmap lessons={lessons} onToggleComplete={handleToggleComplete} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          )}

          {activeTab === "explorer" && (
            <FileExplorer files={initialFiles} />
          )}

          {activeTab === "rsc" && (
            <RscLab />
          )}

          {activeTab === "actions" && (
            <ServerActionsLab />
          )}

          {activeTab === "rendering" && (
            <RenderingLab />
          )}

          {activeTab === "tutor" && (
            <AiTutor lastActiveTab={lastActiveTab} />
          )}
        </section>

      </main>

      {/* Footer credits bar */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-850 py-6 px-4 md:px-8 text-center text-slate-400 dark:text-slate-500 text-xs mt-12 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="font-mono text-[10px] dark:text-slate-500 text-slate-400 font-bold uppercase tracking-wider">
            NEXT.JS INTERACTIVE COMPANION HUB
          </p>
          <p className="flex items-center gap-1 select-none font-bold text-slate-500 dark:text-slate-450 text-[11px]">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> by Michael Quaye
          </p>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-50 px-1 py-2 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] transition-all" id="mobile-bottom-nav">
        <div className="flex w-full items-center justify-between max-w-lg mx-auto">
          {[
            { id: "roadmap", name: "Roadmap", icon: BookOpen },
            { id: "explorer", name: "Files", icon: FolderTree },
            { id: "rsc", name: "RSC Lab", icon: Hammer },
            { id: "actions", name: "Actions", icon: Edit3 },
            { id: "rendering", name: "Caching", icon: Zap },
            { id: "tutor", name: "Assistant", icon: Sparkles, animate: true },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as any)}
                className={`flex flex-col items-center justify-center flex-1 py-1 transition-all relative cursor-pointer ${
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400 scale-102"
                    : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                }`}
                id={`mobile-nav-tab-${tab.id}`}
              >
                <div className="relative">
                  <Icon className={`w-[18px] h-[18px] ${tab.animate && !isActive ? "animate-pulse" : ""} ${isActive && tab.id === "tutor" ? "text-indigo-500 dark:text-indigo-400/80" : ""}`} />
                </div>
                <span className="text-[9px] font-bold mt-1 tracking-tight leading-none text-center">
                  {tab.name}
                </span>
                {isActive && (
                  <div className="w-1 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full mt-0.5 absolute bottom-0" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

    </div>
  );
}
