import React from "react";
import { 
  Compass, 
  Layers, 
  Database, 
  Crown, 
  Trophy, 
  Sparkles, 
  ShieldAlert, 
  BookOpenCheck,
  Medal,
  Lock,
  CheckCircle2,
  BookmarkCheck,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface BadgeType {
  id: string;
  title: string;
  description: string;
  requirementText: string;
  icon: React.ComponentType<any>;
  unlockedColor: string;
  borderColor: string;
  bgLightColor: string;
  checkUnlocked: (progress: number, completedCount: number, passedQuizzesCount: number) => boolean;
}

export const ACCOMPANYING_BADGES: BadgeType[] = [
  {
    id: "initiate",
    title: "Next.js Initiate",
    description: "Successfully advanced onto the path of modern full-stack engineering.",
    requirementText: "Reach 10% progress",
    icon: Compass,
    unlockedColor: "text-blue-600 bg-blue-100/50 border-blue-200",
    borderColor: "border-blue-200/60",
    bgLightColor: "from-blue-50/50 to-indigo-50/20",
    checkUnlocked: (progress) => progress >= 10,
  },
  {
    id: "routing_master",
    title: "Layout Explorer",
    description: "Configured modern routes and dynamic App Router layouts.",
    requirementText: "Reach 30% progress",
    icon: Layers,
    unlockedColor: "text-amber-600 bg-amber-100/50 border-amber-200",
    borderColor: "border-amber-200/60",
    bgLightColor: "from-amber-50/50 to-orange-50/20",
    checkUnlocked: (progress) => progress >= 30,
  },
  {
    id: "rendering_conqueror",
    title: "RSC Conqueror",
    description: "Slashed round-trips with advanced React Server Component setups.",
    requirementText: "Reach 50% progress",
    icon: Database,
    unlockedColor: "text-emerald-600 bg-emerald-100/50 border-emerald-200",
    borderColor: "border-emerald-200/60",
    bgLightColor: "from-emerald-50/50 to-teal-50/20",
    checkUnlocked: (progress) => progress >= 50,
  },
  {
    id: "quiz_apprentice",
    title: "Checkpoint Decoded",
    description: "Passed your first comprehensive, security-enforced checkpoint quiz.",
    requirementText: "Pass at least 1 quiz",
    icon: BookOpenCheck,
    unlockedColor: "text-indigo-600 bg-indigo-100/50 border-indigo-200",
    borderColor: "border-indigo-200/60",
    bgLightColor: "from-indigo-50/50 to-violet-50/20",
    checkUnlocked: (_, __, passedCount) => passedCount >= 1,
  },
  {
    id: "interactive_pro",
    title: "Precision Thinker",
    description: "Defeated multiple checkpoints and answered all edge cases correctly.",
    requirementText: "Pass at least 3 quizzes",
    icon: Medal,
    unlockedColor: "text-purple-600 bg-purple-100/50 border-purple-200",
    borderColor: "border-purple-200/60",
    bgLightColor: "from-purple-50/50 to-pink-50/20",
    checkUnlocked: (_, __, passedCount) => passedCount >= 3,
  },
  {
    id: "guru",
    title: "Next.js Guru",
    description: "Completed every single curriculum file inside the interactive dashboard.",
    requirementText: "Reach 100% completion",
    icon: Crown,
    unlockedColor: "text-rose-600 bg-rose-100/60 border-rose-200 animate-pulse",
    borderColor: "border-rose-200/65",
    bgLightColor: "from-rose-50/50 to-red-50/20",
    checkUnlocked: (progress) => progress >= 100,
  }
];

interface BadgesProps {
  progressPercent: number;
  completedCount: number;
  passedQuizzesCount: number;
}

export default function Badges({ progressPercent, completedCount, passedQuizzesCount }: BadgesProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const unlockedBadges = ACCOMPANYING_BADGES.filter(badge => 
    badge.checkUnlocked(progressPercent, completedCount, passedQuizzesCount)
  );
  const unlockedCount = unlockedBadges.length;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 md:p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors" id="achievements-section">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer select-none group transition-all"
      >
        <div className="space-y-1">
          <h3 className="font-extrabold text-slate-900 dark:text-white font-sans text-lg flex items-center gap-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            <Trophy className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Academy Achievements
            <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md ml-1.5">
              {isOpen ? "Collapse" : "Expand"}
            </span>
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs">
            Earn distinct credentials by completing checkpoint curriculum files and passing quiz challenges.
          </p>
        </div>
        <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-start">
          <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 px-3.5 py-1.5 rounded-xl shrink-0 flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-400">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-spin-slow" />
            <span>Unlocked: {unlockedCount} / {ACCOMPANYING_BADGES.length} Badges</span>
          </div>
          <div className="p-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 rounded-xl transition-all border border-slate-200/60 dark:border-slate-700/80 text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800 mt-5 animate-fadeIn">
        {ACCOMPANYING_BADGES.map((badge) => {
          const isUnlocked = badge.checkUnlocked(progressPercent, completedCount, passedQuizzesCount);
          const BadgeIcon = badge.icon;

          return (
            <div
              key={badge.id}
              className={`relative overflow-hidden rounded-xl border p-4 transition-all duration-300 flex flex-col justify-between ${
                isUnlocked 
                  ? `bg-gradient-to-br ${badge.bgLightColor} dark:from-indigo-950/20 dark:to-slate-900/30 ${badge.borderColor} dark:border-indigo-900/60 shadow-sm hover:scale-[1.01]`
                  : "bg-slate-50/60 dark:bg-slate-900/40 border-slate-250 dark:border-slate-800 text-slate-400 dark:text-slate-500 opacity-75"
              }`}
              id={`badge-card-${badge.id}`}
            >
              {isUnlocked && (
                <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-0.5 shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-500" />
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border ${
                    isUnlocked 
                      ? badge.unlockedColor 
                      : "bg-slate-200/50 dark:bg-slate-800/40 border-slate-300 dark:border-slate-700 text-slate-400"
                  }`}>
                    {isUnlocked ? (
                      <BadgeIcon className="w-5 h-5 animate-pulse-slow" />
                    ) : (
                      <Lock className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <h4 className={`text-sm font-extrabold ${isUnlocked ? "text-slate-900 dark:text-slate-100" : "text-slate-500 dark:text-slate-500"}`}>
                      {badge.title}
                    </h4>
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 tracking-wide uppercase">
                      {badge.requirementText}
                    </span>
                  </div>
                </div>

                <p className={`text-xs leading-relaxed ${isUnlocked ? "text-slate-600 dark:text-slate-350" : "text-slate-400 dark:text-slate-500 italic"}`}>
                  {isUnlocked ? badge.description : "Keep learning and practicing checkpoints to unlock this achievement badge!"}
                </p>
              </div>

              {/* Progress Bar inside individual card indicators */}
              <div className="mt-4 pt-2.5 border-t border-slate-100/50 dark:border-slate-800/60 text-[10px] flex justify-between items-center font-semibold">
                <span className={isUnlocked ? "text-indigo-600/80 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"}>
                  Status:
                </span>
                <span className={isUnlocked ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-slate-400 dark:text-slate-500"}>
                  {isUnlocked ? "✓ Accomplished" : "Locked"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}
