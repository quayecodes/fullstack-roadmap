import React, { useState } from "react";
import { CodeFile } from "../types";
import { Folder, File, ChevronRight, ChevronDown, Laptop, Terminal, Layers, ArrowLeft, RefreshCw, Radio } from "lucide-react";

interface FileExplorerProps {
  files: CodeFile[];
}

export default function FileExplorer({ files }: FileExplorerProps) {
  const [selectedFileId, setSelectedFileId] = useState<string>("app-page");
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    "root-app": true,
    "about-folder": true,
    "blog-folder": false,
    "blog-slug-folder": false,
    "dashboard-folder": true,
    "dashboard-analytics-folder": false,
    "api-folder": false,
    "api-subfolder": false,
  });

  // Dynamic Browser Mock state
  const [simulatedUrl, setSimulatedUrl] = useState<string>("/");
  const [typedUrl, setTypedUrl] = useState<string>("/");

  const selectedFile = files.find((f) => f.id === selectedFileId);

  const toggleFolder = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedFolders((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleFileClick = (file: CodeFile) => {
    setSelectedFileId(file.id);
    if (file.associatedRoute) {
      setSimulatedUrl(file.associatedRoute);
      setTypedUrl(file.associatedRoute);
    }
  };

  const handleUrlNavigate = (url: string) => {
    setSimulatedUrl(url);
    setTypedUrl(url);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let target = typedUrl.trim();
    if (!target.startsWith("/")) {
      target = "/" + target;
    }
    setSimulatedUrl(target);
    setTypedUrl(target);
  };

  // Directory Renderer Helper
  const renderTree = (parentId: string | undefined, depth = 0) => {
    const nodes = files.filter((f) => f.parentId === parentId);
    return nodes.map((node) => {
      const isFolder = node.isFolder;
      const isExpanded = expandedFolders[node.id];
      const isSelected = selectedFileId === node.id;

      return (
        <div key={node.id} className="select-none font-mono text-xs">
          <div
            onClick={() => isFolder ? null : handleFileClick(node)}
            className={`flex items-center gap-1.5 py-1.5 px-2 rounded-lg cursor-pointer transition-colors ${
              isSelected && !isFolder
                ? "bg-indigo-50 text-indigo-700 font-semibold border-l-2 border-indigo-600 pl-[6px]"
                : "hover:bg-slate-100 text-slate-700"
            }`}
            style={{ paddingLeft: `${depth * 14 + 8}px` }}
          >
            {isFolder ? (
              <div 
                onClick={(e) => toggleFolder(node.id, e)}
                className="flex items-center gap-1 w-full"
              >
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                )}
                <Folder className="w-3.5 h-3.5 text-teal-500 fill-teal-100 shrink-0" />
                <span className="text-slate-800 font-medium font-sans">{node.name}</span>
              </div>
            ) : (
              <>
                <File className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>{node.name}</span>
              </>
            )}
          </div>
          {isFolder && isExpanded && (
            <div className="animate-fadeIn">
              {renderTree(node.id, depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  // Dynamic Browser Viewport Resolution
  const renderSimulatedBrowser = () => {
    // 1. Resolve Route handlers inside app/api/*
    if (simulatedUrl.startsWith("/api/hello") || simulatedUrl === "/api") {
      return (
        <div className="bg-slate-900 font-mono text-emerald-400 p-6 rounded-b-xl border-t border-slate-800 text-xs min-h-[250px] overflow-auto">
          <p className="text-slate-500 mb-2">// Server-Side HTTP Response GET /api/hello</p>
          <pre className="leading-relaxed">
{JSON.stringify({
  status: "success",
  message: "Greetings from Next.js server-side Route Handler!",
  timestamp: new Date().toISOString().substring(0, 10) + "T20:50:00Z",
  data: {
    framework: "Next.js 15.0",
    nodeVersion: "v22.14.0",
    purpose: "Provide lightweight backend services natively"
  }
}, null, 2)}
          </pre>
        </div>
      );
    }

    // 2. Mocking UI with Nested Layout Structures
    const isDashboardSubroute = simulatedUrl.startsWith("/dashboard");

    const renderPageContent = () => {
      if (simulatedUrl === "/") {
        return (
          <div className="space-y-4 text-center py-6 animate-fadeIn">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Welcome to Next.js 15 App Router!
            </h1>
            <p className="text-slate-600 text-xs max-w-md mx-auto leading-relaxed">
              You are viewing index homepage pre-rendered on the server side. Click links to swap client routes in real-time.
            </p>
            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={() => handleUrlNavigate("/about")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-1.5 text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              >
                Go to About
              </button>
              <button
                onClick={() => handleUrlNavigate("/dashboard")}
                className="border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-lg px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer"
              >
                Open Dashboard Workspace
              </button>
            </div>
            
            <div className="bg-slate-50 border p-4 rounded-xl text-left text-[11px] space-y-1.5 max-w-sm mx-auto">
              <span className="font-bold text-slate-800">✨ Fast compilation details:</span>
              <p className="text-slate-500 leading-normal">
                Nextjs uses layout files to wrap page files. You can see how clicking buttons changes view segments instantly while conserving persistent menu headers.
              </p>
            </div>
          </div>
        );
      }

      if (simulatedUrl === "/about") {
        return (
          <div className="space-y-4 py-4 max-w-md mx-auto animate-fadeIn">
            <h2 className="text-lg font-bold text-slate-900 border-b pb-2">About App Pages</h2>
            <p className="text-slate-600 text-xs leading-relaxed">
              In App Router, making folder names like <code className="bg-slate-100 px-1 rounded text-indigo-600 font-mono">about/</code> tells the framework where to hook directories. Inside of this folder, putting a file bernama <code className="bg-slate-100 px-1 rounded text-slate-900 font-mono">page.tsx</code> tells it to map segment definitions.
            </p>
            <div className="mt-4 p-3 bg-amber-50 text-amber-800 border border-amber-100 rounded-xl text-xs space-y-1 leading-normal">
              <strong>⭐ Static Rendering Fact:</strong> This page holds static contents. Next.js builds HTML at compile-time, shipping it globally without database calls.
            </div>
            <button
              onClick={() => handleUrlNavigate("/")}
              className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1 pt-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back Home Route
            </button>
          </div>
        );
      }

      // Dynamic subroute regex: matches /blog/xxx
      if (simulatedUrl.startsWith("/blog/")) {
        const slug = simulatedUrl.replace("/blog/", "");
        return (
          <div className="space-y-4 py-4 max-w-md mx-auto animate-fadeIn">
            <div className="flex justify-between items-center bg-indigo-50 px-3 py-1 rounded text-indigo-700 text-[10px] font-bold uppercase tracking-wider">
              <span>Dynamic Segment Match</span>
              <span>[id]</span>
            </div>
            <h2 className="text-lg font-black text-slate-900">
              Post: "{decodeURIComponent(slug).replace(/-/g, " ")}"
            </h2>
            <p className="text-slate-600 text-xs leading-relaxed">
              Because this route path segment file resides inside brackets <code className="bg-indigo-100 text-indigo-800 px-1 py-0.5 rounded font-mono">[id]/page.tsx</code>, Next.js interprets this segment as a variable parameter container!
            </p>
            
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-700 space-y-1">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Extracted incoming parameters:</p>
              <code>params: {"{"} id: "{slug}" {"}"}</code>
            </div>

            <button
              onClick={() => handleUrlNavigate("/")}
              className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1 pt-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back Home
            </button>
          </div>
        );
      }

      // Dashboard Viewport
      if (isDashboardSubroute) {
        const stats = [
          { label: "Active Learners", val: "12,401" },
          { label: "Checkpoints Run", val: "84.3%" },
          { label: "Edge Latency", val: "48ms" }
        ];

        return (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase">📊 core controls</h3>
              <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold uppercase">
                Active Session
              </span>
            </div>

            {simulatedUrl === "/dashboard/analytics" ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-500 leading-normal">
                  You navigated to <code className="bg-slate-100 px-1 text-slate-900 rounded font-mono">dashboard/analytics</code>. Note how the sidebar persists exactly, but this analytics tab transitions!
                </p>
                {/* Simulated Graph bar */}
                <div className="bg-white p-3 rounded-xl border h-24 flex gap-1 items-end justify-between">
                  <div className="w-[12%] bg-indigo-200 h-10 rounded"></div>
                  <div className="w-[12%] bg-indigo-200 h-14 rounded"></div>
                  <div className="w-[12%] bg-indigo-300 h-8 rounded"></div>
                  <div className="w-[12%] bg-indigo-400 h-18 rounded"></div>
                  <div className="w-[12%] bg-indigo-500 h-22 rounded"></div>
                </div>
                <button
                  onClick={() => handleUrlNavigate("/dashboard")}
                  className="text-[10px] font-bold text-indigo-600 hover:underline cursor-pointer"
                >
                  ← Back to Core Stats
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-500 leading-normal">
                  Nested Route segment. Layout properties handle the sidebar dashboard, while the child pages show unique stats.
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {stats.map((s, i) => (
                    <div key={i} className="bg-white p-2.5 rounded-lg border text-center space-y-0.5">
                      <p className="text-[9px] text-slate-400 uppercase font-sans tracking-tight">{s.label}</p>
                      <p className="text-xs font-black text-slate-800">{s.val}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => handleUrlNavigate("/dashboard/analytics")}
                  className="text-xs bg-slate-900 hover:bg-slate-800 text-white rounded-lg p-2 font-bold w-full text-center block transition-colors cursor-pointer"
                >
                  🚀 Open Analytics Sub-Graph
                </button>
              </div>
            )}
          </div>
        );
      }

      // Default 404 router fallback
      return (
        <div className="text-center py-12 space-y-3 animate-fadeIn">
          <div className="text-4xl">🔎</div>
          <h3 className="font-bold text-slate-900 text-sm">Dynamic 404 - Segement Not Registered</h3>
          <p className="text-slate-500 text-xs max-w-xs mx-auto">
            Vite simulator could not locate static handlers for <code className="bg-slate-100 p-0.5 rounded font-mono">{simulatedUrl}</code>. Type routes like <code className="bg-slate-100 p-0.5 rounded font-mono">/about</code>, <code className="bg-slate-100 p-0.5 rounded font-mono">/dashboard</code>, <code className="bg-slate-100 p-0.5 rounded font-mono">/api/hello</code>, or <code className="bg-slate-100 p-0.5 rounded font-mono">/blog/my-slug</code>!
          </p>
          <button
            onClick={() => handleUrlNavigate("/")}
            className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-3 py-1 font-semibold cursor-pointer"
          >
            Reset to Home (/)
          </button>
        </div>
      );
    };

    return (
      <div className="bg-slate-50 rounded-b-xl border-t p-4 md:p-6 min-h-[250px] text-slate-800">
        {/* Render wrapping parent header layout if it's not a pure api route */}
        <div className="bg-white rounded-xl border shadow-sm p-4 space-y-4">
          <header className="bg-slate-900 text-white py-3 px-4 rounded-lg flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-[10px] sm:text-xs">NextJS Learner Workspace</span>
            <nav className="flex gap-2 sm:gap-4 font-sans text-[11px]">
              <button 
                onClick={() => handleUrlNavigate("/")} 
                className={`hover:underline cursor-pointer ${simulatedUrl === "/" ? "font-bold text-indigo-400" : ""}`}
              >
                Home
              </button>
              <button 
                onClick={() => handleUrlNavigate("/about")} 
                className={`hover:underline cursor-pointer ${simulatedUrl === "/about" ? "font-bold text-indigo-400" : ""}`}
              >
                About
              </button>
              <button 
                onClick={() => handleUrlNavigate("/dashboard")} 
                className={`hover:underline cursor-pointer ${isDashboardSubroute ? "font-bold text-indigo-400" : ""}`}
              >
                Dashboard
              </button>
            </nav>
          </header>

          <main className="min-h-[160px]">
            {isDashboardSubroute ? (
              // Shared sidebar dashboard wrapper layout UI
              <div className="border border-slate-200 rounded-lg overflow-hidden flex text-xs">
                <div className="w-28 sm:w-36 bg-slate-800 text-slate-300 p-3 shrink-0 space-y-3">
                  <p className="text-[9px] font-bold text-indigo-300 tracking-wider">WORKSPACE RAIL</p>
                  <nav className="flex flex-col gap-1 font-sans">
                    <button
                      onClick={() => handleUrlNavigate("/dashboard")}
                      className={`text-left text-[11px] p-1.5 rounded hover:bg-slate-700 hover:text-white cursor-pointer ${
                        simulatedUrl === "/dashboard" ? "bg-slate-700 text-white font-semibold" : ""
                      }`}
                    >
                      📊 Core Stats
                    </button>
                    <button
                      onClick={() => handleUrlNavigate("/dashboard/analytics")}
                      className={`text-left text-[11px] p-1.5 rounded hover:bg-slate-700 hover:text-white cursor-pointer ${
                        simulatedUrl === "/dashboard/analytics" ? "bg-slate-700 text-white font-semibold" : ""
                      }`}
                    >
                      📈 Analytics
                    </button>
                  </nav>
                </div>
                <div className="flex-1 bg-slate-50 p-4">
                  {renderPageContent()}
                </div>
              </div>
            ) : (
              // Simple page components
              renderPageContent()
            )}
          </main>

          <footer className="border-t pt-2 text-center text-[10px] text-slate-400 font-mono">
            © 2026 NextJS Learning Playground
          </footer>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6" id="explorer-root">
      
      {/* Tilted Intro Title Header */}
      <div className="space-y-1.5">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight font-sans flex items-center gap-1.5">
          <Terminal className="w-5 h-5 text-indigo-600" />
          Interactive App Router File Hub
        </h2>
        <p className="text-slate-600 text-xs">
          Select files on the explorer diagram to review raw templates, read compilation guidelines, or type paths inside the live mock Web Explorer on the right!
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        
        {/* Explorer Left directory column */}
        <div className="xl:col-span-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between shrink-0 h-full min-h-[350px]">
          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 font-sans">
              Repository Workspace
            </h3>
            
            <div className="space-y-0.5 max-h-[300px] overflow-y-auto pr-1">
              {renderTree(undefined)}
            </div>
          </div>

          <div className="border-t pt-3 mt-4 space-y-1.5">
            <span className="text-[10px] font-bold text-indigo-700 font-mono uppercase tracking-widest flex items-center gap-1">
              <Radio className="w-3 h-3 text-indigo-500 animate-pulse" /> Live Connector
            </span>
            <p className="text-[10px] leading-relaxed text-slate-500">
              Double-click folders to expand. Nested pages will render dynamically in the sandbox viewport.
            </p>
          </div>
        </div>

        {/* Code/Explanation center column */}
        <div className="xl:col-span-4 flex flex-col justify-between bg-slate-950 text-slate-300 rounded-2xl p-4 md:p-5 border border-slate-800 shadow-sm font-mono text-[11px] h-full min-h-[350px]">
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
              <span className="text-indigo-400 font-bold overflow-hidden select-all pr-2">
                {selectedFile?.path || "No Selection"}
              </span>
              <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-900 text-indigo-300">
                {selectedFile?.language || "ts"}
              </span>
            </div>

            {selectedFile?.code ? (
              <pre className="overflow-x-auto leading-normal whitespace-pre pr-1 max-h-[190px] overflow-y-auto text-emerald-400 bg-slate-900/40 p-2.5 rounded-lg border border-slate-900 select-all font-semibold font-mono">
                {selectedFile.code}
              </pre>
            ) : (
              <div className="text-center py-10 text-slate-500 italic text-xs font-sans">
                Select a code file in the explorer tree to view templates.
              </div>
            )}
          </div>

          <div className="border-t border-slate-800/80 pt-3 mt-4 text-slate-400 text-xs font-sans space-y-2">
            <span className="font-bold text-indigo-300 text-[10px] tracking-wider uppercase font-sans flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" strokeWidth={2.5} /> Component purpose:
            </span>
            <p className="text-[11px] leading-relaxed italic bg-indigo-950/20 p-2.5 rounded border border-indigo-900/20 text-slate-300 font-normal">
              {selectedFile?.explanation || "No instruction matched for this node."}
            </p>
          </div>
        </div>

        {/* Browser Sandbox viewport on the right column */}
        <div className="xl:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between min-h-[350px]">
          
          {/* Header Browser Bar */}
          <div className="bg-slate-100 p-2 border-b flex items-center gap-2 select-none relative z-10">
            {/* Window control details */}
            <div className="flex gap-1 items-center shrink-0">
              <span className="w-2.5 h-2.5 bg-red-400 rounded-full"></span>
              <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full"></span>
              <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full"></span>
            </div>

            {/* Address Bar form */}
            <form onSubmit={handleUrlSubmit} className="flex-1 flex gap-1 bg-white border rounded-lg px-2 py-1 text-xs text-slate-500 font-mono focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600">
              <span className="text-slate-300 select-none shrink-0">http://localhost:3000</span>
              <input
                type="text"
                value={typedUrl}
                onChange={(e) => setTypedUrl(e.target.value)}
                className="flex-1 focus:outline-none bg-transparent text-slate-700 font-bold"
              />
              <button type="submit" className="text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer">
                <RefreshCw className="w-3 h-3" />
              </button>
            </form>

            <Laptop className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
          </div>

          {/* Browser Inner body */}
          <div className="flex-1 overflow-y-auto">
            {renderSimulatedBrowser()}
          </div>

          {/* Foot segment tracker */}
          <div className="bg-slate-50 border-t p-2 px-4 flex justify-between items-center text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1 select-none">
              <Layers className="w-3 h-3" /> Hierarchy resolved:
            </span>
            <div className="flex items-center gap-1 font-bold text-slate-600">
              <span className="text-[9px] px-1 py-0.5 rounded bg-slate-200">RootLayout</span>
              {simulatedUrl.startsWith("/dashboard") && (
                <>
                  <span className="text-slate-300">→</span>
                  <span className="text-[9px] px-1 py-0.5 rounded bg-slate-200 text-indigo-700">DashboardLayout</span>
                </>
              )}
              <span className="text-slate-300">→</span>
              <span className="text-[9px] px-1 py-0.5 rounded bg-indigo-100 text-indigo-700">
                {simulatedUrl === "/" ? "HomePage" : simulatedUrl === "/about" ? "AboutPage" : simulatedUrl.startsWith("/blog") ? "Blog[id]" : simulatedUrl.startsWith("/api") ? "ApiRoute" : "DashboardIndex"}
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
