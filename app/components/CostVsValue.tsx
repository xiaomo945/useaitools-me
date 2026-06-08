import { TrendingUp, DollarSign, Sparkles } from 'lucide-react';

interface ValueProp {
  savingsMonthly: number;        // 月省金额
  replacesTools: string[];       // 替代的工具列表
  valueProposition: string;      // 核心价值主张
}

interface CostVsValueProps {
  toolName: string;
  monthlyPrice: number;          // 当前工具月费（美元）
  valueProp?: ValueProp;
}

const defaultValueProps: Record<string, ValueProp> = {
  'Rytr': {
    savingsMonthly: 70,
    replacesTools: ['Copy.ai ($49/mo)', 'Jasper ($59/mo)', 'Writesonic ($19/mo)'],
    valueProposition: 'All-in-one writing assistant that replaces 3 separate subscriptions',
  },
  'VEED.io': {
    savingsMonthly: 60,
    replacesTools: ['Adobe Premiere ($23/mo)', 'Descript ($24/mo)', 'Camtasia ($13/mo)'],
    valueProposition: 'Browser-based video editor with AI — no software download, no learning curve',
  },
  'Murf AI': {
    savingsMonthly: 100,
    replacesTools: ['Voice actor ($200+/mo)', 'ElevenLabs ($22/mo)', 'NaturalReader ($10/mo)'],
    valueProposition: 'Studio-quality AI voiceovers in 120+ voices — no mic, no studio, no editing',
  },
  'Pictory': {
    savingsMonthly: 80,
    replacesTools: ['Video editor ($50/mo)', 'Stock footage ($30/mo)', 'Subtitle tool ($15/mo)'],
    valueProposition: 'Turn blog posts into videos in 5 minutes — zero video editing skills required',
  },
  'Grammarly': {
    savingsMonthly: 40,
    replacesTools: ['Hemingway Editor ($20/mo)', 'ProWritingAid ($20/mo)', 'Manual proofreading (5+ hrs/mo)'],
    valueProposition: 'Catches grammar, tone, and clarity issues across all your writing apps',
  },
};

export default function CostVsValue({ toolName, monthlyPrice, valueProp }: CostVsValueProps) {
  const vp = valueProp || defaultValueProps[toolName];
  if (!vp) return null;

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-cyan-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-5 sm:p-6 mb-8">
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">
            Cost vs Value
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            See how {toolName} stacks up against alternatives
          </p>
        </div>
      </div>

      {/* Main value proposition */}
      <div className="mb-5 p-4 bg-white/60 dark:bg-gray-900/40 rounded-xl border border-emerald-200/50 dark:border-emerald-800/30">
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
            {vp.valueProposition}
          </p>
        </div>
      </div>

      {/* Comparison grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Left: Your cost */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-slate-200 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-slate-500" />
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Your Cost
            </p>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
            ${monthlyPrice}
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">/month</span>
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            for {toolName}
          </p>
        </div>

        {/* Right: Your savings */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl p-4 text-white shadow-lg shadow-emerald-500/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4" />
            <p className="text-xs font-semibold uppercase tracking-wide opacity-90">
              You Save
            </p>
          </div>
          <p className="text-2xl font-extrabold">
            ${vp.savingsMonthly}
            <span className="text-sm font-medium opacity-90">/month</span>
          </p>
          <p className="text-xs opacity-90 mt-1">
            vs. using {vp.replacesTools.length} separate tools
          </p>
        </div>
      </div>

      {/* Replaces list */}
      <div className="mt-4 pt-4 border-t border-emerald-200/50 dark:border-emerald-800/30">
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
          Replaces
        </p>
        <div className="flex flex-wrap gap-2">
          {vp.replacesTools.map((tool, i) => (
            <span
              key={i}
              className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/70 dark:bg-gray-900/50 text-slate-700 dark:text-slate-300 border border-emerald-200/60 dark:border-emerald-800/40 line-through opacity-70"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
