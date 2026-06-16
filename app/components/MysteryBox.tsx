'use client';

type MysteryBoxProps = {
  mysteryCount: number;
  onOpen: () => void;
};

export default function MysteryBox({ mysteryCount, onOpen }: MysteryBoxProps) {
  return (
    <div className="bg-gradient-to-r from-amber-50 via-white to-orange-50 dark:from-amber-950/20 dark:via-gray-900 dark:to-orange-950/20 border border-amber-200/60 dark:border-amber-800/40 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center text-xl sm:text-2xl shrink-0">
          🎁
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm sm:text-lg text-slate-900 dark:text-white">
            Mystery Box
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {mysteryCount >= 3 ? 'Come back tomorrow for more!' : `Discover a random AI tool (${3 - mysteryCount} left today)`}
          </p>
        </div>
        <button
          onClick={onOpen}
          disabled={mysteryCount >= 3}
          className={`shrink-0 inline-flex items-center gap-1 px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 min-h-[44px] ${
            mysteryCount >= 3
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
          }`}
        >
          {mysteryCount >= 3 ? 'Done' : 'Open Box'}
        </button>
      </div>
    </div>
  );
}
