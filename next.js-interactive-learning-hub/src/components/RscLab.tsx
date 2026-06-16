import React, { useState } from "react";
import { Hammer, Terminal, CheckCircle2, AlertCircle, Sparkles, HelpCircle } from "lucide-react";

interface CodeSnippet {
  id: string;
  title: string;
  type: "Server" | "Client" | "Mixed (Optimal)" | "Invalid";
  code: string;
  explanation: string;
  hasError: boolean;
  errorMessage?: string;
  correctSetupHint?: string;
}

const snippets: CodeSnippet[] = [
  {
    id: "snippet-error-state",
    title: "1. useState Counter (Default RSC)",
    type: "Invalid",
    hasError: true,
    code: `// app/counter.tsx
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicks: {count}
    </button>
  );
}`,
    errorMessage: `Unhandled Runtime Error:
Error: useState is not a function. It looks like you're importing a Hook (useState) in a component that is not marked with 'use client'.

Source file: app/counter.tsx (4:12)`,
    correctSetupHint: "In App Router, all files default to React Server Components executing on the server. Because the server does not hold browser status or triggers, browser hooks like useState and onClick listeners are disallowed. Add the 'use client' directive at the very top line of this file to convert the segment into a Client Component!",
    explanation: "Default Server Components cannot mount state hooks. You must define a client barrier."
  },
  {
    id: "snippet-error-fs",
    title: "2. Secure Database Read (Client File)",
    type: "Invalid",
    hasError: true,
    code: `"use client";

// Client-side file reading database
import { db } from "@/lib/secure-db"; 

export default function UserList() {
  // Disallowed! Database credentials would get exposed to the client browser!
  const users = db.query("SELECT * FROM users");
  
  return (
    <ul>
      {users.map(u => <li key={u.id}>{u.name}</li>)}
    </ul>
  );
}`,
    errorMessage: `Module Not Found:
Error: Can't resolve DB driver 'pg/sqlite' in browser bundle.

Security Warning: You are importing server-only secrets into a Client Component!`,
    correctSetupHint: "By placing \"use client\" at the top, you instructed the bundler to compile this file for the web browser. The browser cannot run direct sql queries securely because credentials would leak. The correction: Remove \"use client\" to convert this back into a secure Server Component (RSC), or fetch from an external Proxied API.",
    explanation: "Database access drivers are Node-only. Shifting them to the client causes compiler crash."
  },
  {
    id: "snippet-success-optimal",
    title: "3. Server-First Shared Hybrid (Perfect)",
    type: "Mixed (Optimal)",
    hasError: false,
    code: `// app/page.tsx - SERVER COMPONENT (Runs securely on host)
import { fetchArticles } from "@/lib/db";
import ArticleLikeButton from "./LikeButton"; // "use client" file

export default async function NewsFeed() {
  const articles = await fetchArticles(); // DB run is secure, zero client bundle weight!
  
  return (
    <div className="space-y-4">
      {articles.map(art => (
        <div key={art.id} className="border p-4 rounded bg-white">
          <h3 className="font-bold">{art.title}</h3>
          
          {/* Delegate interactive actions to local client nodes */}
          <ArticleLikeButton articleId={art.id} /> 
        </div>
      ))}
    </div>
  );
}`,
    correctSetupHint: `✓ Compiled successfully inside 32ms.
✓ Hybrid Bundle optimized perfectly.
💡 RSC payload: NewsFeed renders statically on the server (0 kB browser JS).
💡 ArticleLikeButton is bundled for the browser (1.2 kB browser JS).`,
    explanation: "This is the gold standard of Next.js architecture. Fetch core structures on the server securely, then insert lightweight interactive buttons at leaf slots."
  }
];

export default function RscLab() {
  const [selectedSnippetId, setSelectedSnippetId] = useState<string>("snippet-error-state");
  const [compileState, setCompileState] = useState<"idle" | "compiling" | "ready" | "failed">("idle");

  const currentSnippet = snippets.find((s) => s.id === selectedSnippetId)!;

  const runCompileCheck = () => {
    setCompileState("compiling");
    setTimeout(() => {
      if (currentSnippet.hasError) {
        setCompileState("failed");
      } else {
        setCompileState("ready");
      }
    }, 1200);
  };

  return (
    <div className="space-y-6" id="rsc-root">
      
      {/* Visual Title */}
      <div className="space-y-1.5 animate-fadeIn">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
          <Hammer className="w-5 h-5 text-indigo-600 animate-pulse" />
          Boundary Compiler Simulator (RSC vs. Client)
        </h2>
        <p className="text-slate-600 text-xs">
          Learn execution paradigms by debugging templates. Select a React scenario, run the compilation check, and review the Next.js CLI reports.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left selector menu pane */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 font-sans">
            Architecture Scenarios
          </h3>

          <div className="space-y-3">
            {snippets.map((snip) => (
              <button
                key={snip.id}
                onClick={() => {
                  setSelectedSnippetId(snip.id);
                  setCompileState("idle");
                }}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedSnippetId === snip.id
                    ? "bg-white border-indigo-600 shadow-sm ring-1 ring-indigo-600/30"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex justify-between items-center mb-1.5">
                  <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    snip.type === "Mixed (Optimal)"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-indigo-50 text-indigo-700"
                  }`}>
                    {snip.type}
                  </span>
                </div>
                <h4 className="font-extrabold text-slate-800 text-sm leading-tight heading-tight">
                  {snip.title}
                </h4>
                <p className="text-slate-500 text-xs mt-1 truncate">
                  {snip.explanation}
                </p>
              </button>
            ))}
          </div>

          {/* Core Reference board */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2.5">
            <span className="font-bold text-slate-800 flex items-center gap-1">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              Which goes where? Quick Guide:
            </span>
            <ul className="space-y-1 text-slate-600 pl-4 list-disc text-[11px] leading-relaxed">
              <li>Fetch database contents? → <strong>Server (Default)</strong></li>
              <li>Read hidden credentials? → <strong>Server (Default)</strong></li>
              <li>Bind onClick, onChange hooks? → <strong>Client (use client)</strong></li>
              <li>Call useState, useEffect? → <strong>Client (use client)</strong></li>
            </ul>
          </div>
        </div>

        {/* Right compilation playground pane */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col min-h-[400px]">
            
            {/* Console Toolbar Header */}
            <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex justify-between items-center text-slate-400 font-mono text-[10px]">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                Next.js Compiler Simulator v15.0
              </span>
              <button
                onClick={runCompileCheck}
                disabled={compileState === "compiling"}
                className="bg-indigo-600 shrink-0 hover:bg-indigo-700 text-white rounded px-3 py-1 font-bold disabled:opacity-40 flex items-center gap-1 cursor-pointer"
              >
                {compileState === "compiling" ? (
                  <>
                    <span className="w-2 h-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Compiling...
                  </>
                ) : (
                  "Run Compile Check"
                )}
              </button>
            </div>

            {/* Snippet Code visual window */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 overflow-x-auto">
              <pre className="font-mono text-xs text-indigo-300 leading-normal">
                {currentSnippet.code}
              </pre>
            </div>

            {/* Simulated compilation terminal reports */}
            <div className="flex-1 p-5 font-mono text-xs leading-relaxed overflow-y-auto">
              {compileState === "idle" && (
                <div className="text-slate-500 italic text-center py-10">
                  ⚡ Code editor is ready. Click <strong className="text-indigo-400 font-semibold text-xs">"Run Compile Check"</strong> above to trigger Next.js compilation.
                </div>
              )}

              {compileState === "compiling" && (
                <div className="space-y-2 text-indigo-300 animate-pulse">
                  <p>&gt; next build</p>
                  <p>⚗️ Parsing React Components tree...</p>
                  <p>🔍 Auditing client-side import constraints...</p>
                  <p>🏗️ Compiling dynamic routing slices...</p>
                </div>
              )}

              {compileState === "failed" && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="bg-rose-950/30 text-rose-400 p-4 rounded-xl border border-rose-900/40 flex gap-3 text-[11px] leading-relaxed">
                    <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                    <pre className="whitespace-pre-wrap select-all font-mono font-bold">
                      {currentSnippet.errorMessage}
                    </pre>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      💡 Diagnostic Recovery Plan:
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {currentSnippet.correctSetupHint}
                    </p>
                  </div>
                </div>
              )}

              {compileState === "ready" && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="bg-emerald-950/30 text-emerald-400 p-4 rounded-xl border border-emerald-900/40 flex gap-3 text-[11px] leading-relaxed">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <div>
                      <p className="font-bold mb-1">SUCCESS: BUILD COMPLETE</p>
                      <pre className="whitespace-pre-wrap font-mono uppercase">
                        {currentSnippet.correctSetupHint}
                      </pre>
                    </div>
                  </div>

                  <div className="bg-indigo-950/20 text-indigo-200 border border-indigo-900/30 p-4 rounded-xl space-y-2 font-sans text-xs">
                    <p className="font-bold flex items-center gap-1 text-slate-100">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      Why this compiled flawlessly:
                    </p>
                    <p className="leading-relaxed">
                      This represents the ideal Next.js routing approach. You pre-fetch core database rows securely inside of server folders. For client clicks, we nest a clean client toggler. This limits loaded Javascript bundles on the user's browser, maximizing core load speeds!
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
