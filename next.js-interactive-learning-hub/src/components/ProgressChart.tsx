import React from "react";
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip 
} from "recharts";
import { Lesson } from "../types";
import { Award, CheckCircle2 } from "lucide-react";

interface ProgressChartProps {
  lessons: Lesson[];
  isDark: boolean;
}

export default function ProgressChart({ lessons, isDark }: ProgressChartProps) {
  const completed = lessons.filter((l) => l.completed).length;
  const total = lessons.length;
  const remaining = total - completed;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Donut chart configuration
  const pieData = [
    { name: "Completed", value: completed, color: "#10b981" }, // emerald-500
    { name: "Remaining", value: remaining, color: isDark ? "#1e293b" : "#f1f5f9" } // slate-800 vs slate-100
  ];

  // Category progress calculations
  const categories: Lesson["category"][] = ["Fundamentals", "Routing", "Data Fetching", "Advanced"];
  const categoryData = categories.map((cat) => {
    const list = lessons.filter((l) => l.category === cat);
    const comp = list.filter((l) => l.completed).length;
    const catLen = list.length;
    const catPercent = catLen > 0 ? Math.round((comp / catLen) * 100) : 0;
    return {
      name: cat === "Data Fetching" ? "Data Fetch" : cat, // abbrev for tight layouts
      percent: catPercent,
      completed: comp,
      total: catLen,
    };
  });

  return (
    <div 
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-4.5 transition-colors"
      id="workspace-progress-visualizer"
    >
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
        <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-wider uppercase flex items-center gap-1.5 font-sans">
          <Award className="w-3.5 h-3.5 text-indigo-500" />
          Progress Visualization
        </h3>
        <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-extrabold px-2 py-0.5 rounded-full select-none">
          {percent}% Complete
        </span>
      </div>

      {/* Main visualization grid */}
      <div className="grid grid-cols-[85px_1fr] gap-3 items-center">
        {/* Donut Chart Gauge */}
        <div className="relative w-[85px] h-[85px] mx-auto">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={28}
                outerRadius={38}
                paddingAngle={2}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
            <span className="text-xs font-black text-slate-800 dark:text-white leading-none">
              {completed}
            </span>
            <span className="text-[8px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider leading-none mt-0.5">
              /{total}
            </span>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <div>
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide leading-none">
                Completed
              </p>
              <p className="text-xs font-black text-slate-800 dark:text-slate-150 leading-tight">
                {completed} Lessons <span className="text-slate-400 dark:text-slate-600 font-normal">Passed</span>
              </p>
            </div>
          </div>

          <div className="h-0.5 bg-slate-100 dark:bg-slate-800/80 rounded-full" />

          <p className="text-[9.5px] leading-relaxed text-slate-400 dark:text-slate-500 font-medium">
            Explore and pass assessments in interactive checkpoints to advance your standing.
          </p>
        </div>
      </div>

      {/* Category Horizontal Bar Chart */}
      <div className="space-y-1.5">
        <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">
          Checkpoint Coverage By Category
        </p>
        
        <div className="h-[95px] w-full" id="category-recharts-bar">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={categoryData}
              layout="vertical"
              margin={{ top: 0, right: 10, left: -25, bottom: 0 }}
            >
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                tick={{ 
                  fill: isDark ? "#94a3b8" : "#475569", 
                  fontSize: 9, 
                  fontWeight: 600,
                  fontFamily: "Inter, sans-serif"
                }} 
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 border border-slate-800 text-white p-2 rounded-lg text-[10px] font-semibold shadow-lg">
                        <p className="text-indigo-300 font-extrabold uppercase tracking-wider">{data.name}</p>
                        <p className="text-slate-100 mt-0.5">
                          Progress: <span className="text-emerald-400 font-bold">{data.percent}%</span>
                        </p>
                        <p className="text-slate-400">
                          ({data.completed} of {data.total} passed)
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="percent" 
                radius={[0, 4, 4, 0]}
                barSize={7}
              >
                {categoryData.map((entry, index) => {
                  // Premium gradient colors per index
                  const colors = ["#6366f1", "#0ea5e9", "#10b981", "#f59e0b"];
                  return <Cell key={`bar-cell-${index}`} fill={colors[index % colors.length]} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
