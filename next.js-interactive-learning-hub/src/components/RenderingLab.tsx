import React, { useState } from "react";
import { Zap, Clock, Code, Database, Globe, Layers, Server } from "lucide-react";

interface RenderingStrategy {
  id: string;
  name: string;
  shortName: string;
  latency: string;
  caching: string;
  description: string;
  flowSteps: string[];
  codeSample: string;
  pros: string[];
}

const strategies: RenderingStrategy[] = [
  {
    id: "ssg",
    name: "Static Site Generation (SSG)",
    shortName: "SSG",
    latency: "12ms (Ultra Fast)",
    caching: "Cached indefinitely on Edge CDNs",
    description: "Next.js pre-compiles the entire route into static HTML and CSS files during production builds. When a client visits, the server sends complete cached documents immediately.",
    flowSteps: [
      "Client requests URL route",
      "Global CDN catches request on Edge node",
      "Pre-rendered HTML returned instantly (12ms)",
      "Zero server or database tasks are triggered over the request"
    ],
    codeSample: `// app/blog/about-us/page.tsx
// SSG is Next.js's default behavior for standard static pages!

export default function AboutPage() {
  return (
    <div className="p-8">
      <h1>Statically Compiled About Page</h1>
      <p>This layout resolves once during the build production phase!</p>
    </div>
  );
}`,
    pros: ["Fastest loading rate", "Zero stress on hosting backend nodes", "Absolute best-practice for SEO standard landing blocks"]
  },
  {
    id: "isr",
    name: "Incremental Static Regeneration (ISR)",
    shortName: "ISR",
    latency: "12ms (Background Update)",
    caching: "Re-evaluated on a schedule (e.g. 60s)",
    description: "ISR lets you generate static segments, but reconstructs them in the background when requests come in *after* an expiration threshold. Keeps content fresh without rebuilding your entire code suite.",
    flowSteps: [
      "Client requests dynamic cached segment",
      "CDN serves current static page instantly (12ms)",
      "Next.js checks time boundary (e.g. has 60 seconds elapsed?)",
      "If expired: Next.js recompiles this segment in the background for future visitors"
    ],
    codeSample: `// app/weather/page.tsx
// Configure ISR revalidation interval securely using a route constant:
export const revalidate = 60; // 60 seconds

export default async function WeatherFeed() {
  const res = await fetch("https://api.weather-api.com/v1/current.json");
  const data = await res.json();
  
  return (
    <div>
      <h3>Current Weather: {data.condition.temp_c}°C</h3>
      <p>Recalculates in the background at most every minute</p>
    </div>
  );
}`,
    pros: ["Saves database load compared to SSR", "Maintains ultra-fast CDN loading", "Allows updating dynamic databases on static pages gracefully"]
  },
  {
    id: "ssr",
    name: "Server-Side Rendering / Dynamic (SSR)",
    shortName: "SSR",
    latency: "55ms (Slight DB delay)",
    caching: "Bypasses edge caching (Generates on-demand)",
    description: "SSR generates custom HTML on the server *upon every single incoming browser request*. This is absolute requirement to render personalized rows, check authentication details, or read dynamic query slates.",
    flowSteps: [
      "Visitor hits user-dashboard",
      "Next.js intercepts request, reading specific browser headers",
      "Executes server database calls on-demand",
      "Assembles custom HTML tail on the fly and returns to browser (55ms)"
    ],
    codeSample: `// app/dashboard/profile/page.tsx
import { cookies } from 'next/headers';
import { fetchActiveUser } from '@/lib/db';

export default async function ProfileDashboard() {
  const cookieStore = await cookies(); // Triggers dynamic rendering!
  const hasToken = cookieStore.has("auth_token");
  
  const user = await fetchActiveUser(hasToken);
  
  return (
    <div>
      <h2>Welcome Back, {user.username}!</h2>
      <p>Securely calculated uniquely for your browser cookie token</p>
    </div>
  );
}`,
    pros: ["Always 100% up-to-date", "Supports dynamic user sessions & access controls", "Reads incoming requests and client parameters directly"]
  },
  {
    id: "ppr",
    name: "Partial Prerendering (PPR - Next.js 15 Spotlight)",
    shortName: "PPR",
    latency: "0ms shell / Streams dynamic parts over HTTP",
    caching: "Shared: Static margins + Dynamic fragments",
    description: "PPR is a marquee Next.js 15 feature. It allows you to compile static parts of a page (e.g. headers, sidebars) statically inside CDN, while streaming dynamic parts (e.g. user shopping baskets) over HTTP via Suspense.",
    flowSteps: [
      "Visitor requests dynamic dashboard homepage",
      "CDN instantly returns static margins & shell parts in 0ms",
      "Browser renders Layout skeletons immediately to minimize CLS",
      "Server continues database calls in the background",
      "Once data resolves, Next.js streams dynamic elements over the same open connection"
    ],
    codeSample: `// app/dashboard/store/page.tsx
import { Suspense } from 'react';
import ShoppingCart from './Cart'; // Dynamic module
import StaticProductList from './ProductGrid'; // Static module

export default function StoreDashboard() {
  return (
    <div className="space-y-6">
      {/* 1. Static Product list renders instantly from CDN */}
      <StaticProductList /> 
      
      {/* 2. Dynamic client basket is wrapped in React Suspense */}
      <Suspense fallback={<div>Loading your cart items...</div>}>
        <ShoppingCart />
      </Suspense>
    </div>
  );
}`,
    pros: ["Provides instant visual feedback to user", "Optimizes first contentful paint (FCP)", "Minimizes time to interactive (TTI) for heavy data dashboards"]
  }
];

export default function RenderingLab() {
  const [selectedStratId, setSelectedStratId] = useState<string>("ssg");
  const currentStrat = strategies.find((s) => s.id === selectedStratId)!;

  return (
    <div className="space-y-6" id="rendering-root">
      
      {/* Structural Title block */}
      <div className="space-y-1.5">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
          <Zap className="text-indigo-600 w-5 h-5 animate-pulse" />
          Rendering Pipelines Visualizer
        </h2>
        <p className="text-slate-600 text-xs text-xs">
          Compare page-compile architectures. Swipe selector tabs to inspect data flows, edge CDN caching intervals, and Next.js implementation configurations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left selector menu */}
        <div className="lg:col-span-4 space-y-4 shrink-0 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="font-extrabold text-xs uppercase text-slate-400 tracking-wider">
              Rendering Paradigms
            </h3>
            
            <div className="flex flex-col gap-2.5">
              {strategies.map((strat) => (
                <button
                  key={strat.id}
                  onClick={() => setSelectedStratId(strat.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedStratId === strat.id
                      ? "bg-white border-indigo-600 shadow-sm ring-1 ring-indigo-600/30"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-extrabold text-slate-850 text-sm leading-tight">
                      {strat.name}
                    </h4>
                    <span className="text-[10px] font-bold font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                      {strat.shortName}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Core Latency card */}
          <div className="bg-slate-900 text-slate-300 p-4 border border-slate-800 rounded-xl space-y-3">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-indigo-400 uppercase font-mono tracking-widest">Edge Latency benchmark</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span className="text-base font-black font-mono text-white">{currentStrat.latency}</span>
              </div>
            </div>
            
            <div className="space-y-1 text-[11px] leading-normal font-sans border-t border-slate-800 pt-2.5">
              <p className="font-bold text-slate-400 font-sans">Caching Protocol:</p>
              <p>{currentStrat.caching}</p>
            </div>
          </div>

        </div>

        {/* Right Flow Simulator pane */}
        <div className="lg:col-span-8 flex flex-col justify-between bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6">
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest">Execution Path Timeline</span>
              <h3 className="font-black text-slate-900 text-lg">{currentStrat.name}</h3>
              <p className="text-slate-600 text-xs leading-relaxed max-w-2xl">{currentStrat.description}</p>
            </div>

            {/* Render Horizontal/Vertical timeline components */}
            <div className="relative pl-6 py-1 border-l-2 border-indigo-100 space-y-4 text-xs font-mono">
              <div className="absolute top-0 bottom-0 left-[-2px] w-0.5 bg-indigo-600/30"></div>
              {currentStrat.flowSteps.map((step, idx) => (
                <div key={idx} className="relative space-y-1">
                  {/* Timeline point */}
                  <span className="absolute left-[-31px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-600 border-2 border-white"></span>
                  <div className="flex gap-2.5 items-center">
                    <span className="text-[10px] font-bold text-indigo-500 font-sans font-black">STEP {idx + 1}</span>
                    <p className="font-bold text-slate-800">{step}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pros checklist */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 border-t pt-4">
              {currentStrat.pros.map((p, i) => (
                <div key={i} className="bg-slate-50 p-3 rounded-lg text-[11px] border leading-normal border-slate-100">
                  <span className="font-bold text-indigo-700 block mb-1">⭐ PRO ADVICE</span>
                  <p className="text-slate-600">{p}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Toggle code preview pane */}
          <div className="mt-6 border-t pt-4 space-y-2 font-mono">
            <span className="text-[10px] font-sans font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Code className="w-4 h-4 text-indigo-600" />
              IMPLEMENTATION CODE CONTEXT:
            </span>
            <pre className="p-3.5 bg-slate-950 text-emerald-400 text-[10px] sm:text-[11px] rounded-xl border border-slate-900 overflow-x-auto leading-normal whitespace-pre pr-1 max-h-[160px] select-all font-semibold select-all font-mono">
              {currentStrat.codeSample}
            </pre>
          </div>

        </div>

      </div>
    </div>
  );
}
