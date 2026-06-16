import React, { useState } from "react";
import { Edit3, CheckCircle, Database, Server, RefreshCw, Layers, ArrowRight, CornerDownRight } from "lucide-react";

interface GuestEntry {
  name: string;
  comment: string;
  date: string;
}

export default function ServerActionsLab() {
  const [guestName, setGuestName] = useState("");
  const [guestComment, setGuestComment] = useState("");
  const [guestList, setGuestList] = useState<GuestEntry[]>([
    { name: "John Doe", comment: "This zero-fetch form binding is magnificent! ✨", date: "Just now" },
    { name: "Emma Watson", comment: "Next.js 15 Server Actions are extremely slick to write.", date: "10m ago" },
    { name: "Isaac Newton", comment: "Progressive enhancement means this form submits even without JS!", date: "1h ago" }
  ]);

  const [simulationStep, setSimulationStep] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const triggerServerAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestComment.trim()) return;

    setIsSubmitting(true);
    setSimulationStep(1);

    // Timeline Animation
    setTimeout(() => {
      setSimulationStep(2); // Serializing FormData & routing across POST
    }, 1200);

    setTimeout(() => {
      setSimulationStep(3); // running secure "use server" action on NodeJS
    }, 2400);

    setTimeout(() => {
      setSimulationStep(4); // Database insertion & revalidatePath('/') purge
    }, 3600);

    setTimeout(() => {
      // Complete state mutation
      const newEntry: GuestEntry = {
        name: guestName,
        comment: guestComment,
        date: "Just now"
      };
      setGuestList([newEntry, ...guestList]);
      setGuestName("");
      setGuestComment("");
      setSimulationStep(5); // UI DOM inject success
      setIsSubmitting(false);
    }, 4800);
  };

  return (
    <div className="space-y-6" id="server-actions-root">
      
      {/* Intro Description */}
      <div className="space-y-1.5">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
          <Edit3 className="w-5 h-5 text-indigo-600" />
          Server Actions & Mutations Lab
        </h2>
        <p className="text-slate-600 text-xs">
          Explore progressive enhancement. Submit comments via a simulated guestbook form to inspect the step-by-step Server Action pipeline.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Guest Form panel */}
        <div className="lg:col-span-5 bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-extrabold text-sm uppercase text-slate-400 tracking-wider font-sans">
              Guestbook Client Form
            </h3>

            <form onSubmit={triggerServerAction} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                  Your Signature Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Master Coder"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 font-sans"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                  Your Comment / Feedback
                </label>
                <textarea
                  placeholder="e.g. Server Actions avoid massive REST boilerplate!"
                  rows={2}
                  value={guestComment}
                  onChange={(e) => setGuestComment(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 font-sans"
                  required
                />
              </div>

              {/* Form submit button represent Form Action */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-2.5 px-4 text-xs rounded-lg transition-colors cursor-pointer"
              >
                {isSubmitting ? "Running Server Action..." : "Sign Guestbook"}
              </button>
            </form>
          </div>

          {/* Render List under form */}
          <div className="border-t pt-4 mt-6 space-y-3">
            <h4 className="font-bold text-xs text-slate-800">
              Live guestbook entries ({guestList.length})
            </h4>
            
            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
              {guestList.map((g, i) => (
                <div key={i} className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[11px] space-y-0.5 animate-fadeIn">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className="font-black text-slate-900">{g.name}</span>
                    <span className="text-[9px] text-slate-400">{g.date}</span>
                  </div>
                  <p className="text-slate-600 leading-normal">{g.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Animated Pipeline Simulator pane */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl p-5 md:p-6 border border-slate-800 flex flex-col justify-between text-slate-300 min-h-[380px]">
          
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                <Server className="w-4 h-4 text-indigo-500" />
                Action Pipeline Trace
              </span>
              <span className="text-[10px] bg-slate-850 px-2 py-0.5 rounded text-indigo-300 font-mono">
                "use server" directive
              </span>
            </div>

            {/* Simulated execution timeline */}
            <div className="space-y-3.5 text-xs font-mono">
              
              {/* Step 1: Serialize client data */}
              <div className={`p-3 rounded-lg border transition-all flex items-start gap-2.5 ${
                simulationStep === 1 
                  ? "bg-indigo-950/40 border-indigo-500 text-indigo-300 scale-[1.01] shadow"
                  : simulationStep > 1 
                  ? "bg-slate-900/60 border-slate-800/60 text-slate-500"
                  : "bg-slate-950/20 border-slate-800 text-slate-600"
              }`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  simulationStep >= 1 ? "bg-indigo-600 text-white" : "bg-slate-800"
                }`}>
                  1
                </div>
                <div className="space-y-0.5">
                  <p className="font-bold">Serialize client FormData payload</p>
                  <p className="text-[10px] leading-normal font-sans text-slate-400">
                    The browser intercepts standard action event and bundles name & comment fields securely.
                  </p>
                </div>
              </div>

              {/* Step 2: Route request securely */}
              <div className={`p-3 rounded-lg border transition-all flex items-start gap-2.5 ${
                simulationStep === 2
                  ? "bg-indigo-950/40 border-indigo-500 text-indigo-300 scale-[1.01] shadow"
                  : simulationStep > 2
                  ? "bg-slate-900/60 border-slate-800/60 text-slate-500"
                  : "bg-slate-950/20 border-slate-800 text-slate-600"
              }`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  simulationStep >= 2 ? "bg-indigo-600 text-white" : "bg-slate-800"
                }`}>
                  2
                </div>
                <div className="space-y-0.5">
                  <p className="font-bold">Post RPC across HTTP channel</p>
                  <p className="text-[10px] leading-normal font-sans text-slate-400">
                    Transfers data package directly to the backend endpoint mimicking an internal action identifier.
                  </p>
                </div>
              </div>

              {/* Step 3: Run secure NodeJS server task */}
              <div className={`p-3 rounded-lg border transition-all flex items-start gap-2.5 ${
                simulationStep === 3
                  ? "bg-indigo-950/40 border-indigo-500 text-indigo-300 scale-[1.01] shadow"
                  : simulationStep > 3
                  ? "bg-slate-900/60 border-slate-800/60 text-slate-500"
                  : "bg-slate-950/20 border-slate-800 text-slate-600"
              }`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  simulationStep >= 3 ? "bg-indigo-600 text-white" : "bg-slate-800"
                }`}>
                  3
                </div>
                <div className="space-y-0.5">
                  <p className="font-bold">Execute submitComment() on NodeJS</p>
                  <p className="text-[10px] leading-normal font-sans text-slate-400">
                    Executes pure backend functions securely. Client headers are cross-checked, database entries updated.
                  </p>
                </div>
              </div>

              {/* Step 4: Revalidate cached segments */}
              <div className={`p-3 rounded-lg border transition-all flex items-start gap-2.5 ${
                simulationStep === 4
                  ? "bg-indigo-950/40 border-indigo-500 text-indigo-300 scale-[1.01] shadow"
                  : simulationStep > 4
                  ? "bg-slate-900/60 border-slate-800/60 text-slate-500"
                  : "bg-slate-950/20 border-slate-800 text-slate-600"
              }`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  simulationStep >= 4 ? "bg-indigo-600 text-white" : "bg-slate-800"
                }`}>
                  4
                </div>
                <div className="space-y-0.5">
                  <p className="font-bold">revalidatePath('/') Cache purge</p>
                  <p className="text-[10px] leading-normal font-sans text-slate-400">
                    Instructs Next.js compilation engine to dynamically clear server cached slices and compile updated templates.
                  </p>
                </div>
              </div>

            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-3 mt-4 text-[10px] opacity-80 font-sans leading-relaxed text-slate-400">
            {simulationStep === 5 ? (
              <div className="bg-emerald-950/20 text-emerald-400 border border-emerald-900/40 rounded-xl p-3 flex gap-2 font-mono items-center animate-fadeIn">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                <span><strong>Pipeline completed:</strong> guest book updated successfully and cache purges synced! This form achieves progressive enhancement securely!</span>
              </div>
            ) : (
              <p className="italic">
                ⚡ Submit the guestbook form on the left to activate the trace timeline. Notice how zero client-side fetch REST models are required to perform mutations!
              </p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
