'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';

const tourSteps = [
  {
    target: 'search',
    selector: 'input[type="text"][placeholder*="Search" i]',
    title: '🔍 Search 1,300+ Tools',
    description: 'Type any tool name, category, or use case. Try "Rytr" or "blog writing".',
  },
  {
    target: 'categories',
    selector: '[data-tour="categories"]',
    title: '📂 Browse by Category',
    description: 'Or filter by category — Writing, Image, Productivity, Code, Audio, Video.',
  },
  {
    target: 'toolcard',
    selector: '[data-tour="toolcard"]',
    title: '❤️ Save Your Favorites',
    description: 'Click the heart icon on any tool card to save it for later.',
  },
];

const STORAGE_KEY = 'useaitools_tour_completed';
const INTERACTION_KEY = 'useaitools_tour_interaction';
// 800ms 内检测到任意交互，认为用户"已经懂了"
const SKIP_CHECK_DELAY = 800;

export default function GuidedTour() {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [targetRect, setTargetRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const interactionDetected = useRef(false);

  const closeTour = useCallback(() => {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {}
  }, []);

  // 启动引导 + 智能检测用户是否已经交互
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('replay-tour') === '1') {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(INTERACTION_KEY);
        window.history.replaceState({}, '', '/');
      }
      const completed = localStorage.getItem(STORAGE_KEY);
      if (completed) return;

      // 监听用户首次交互
      const handleFirstInteraction = () => {
        if (interactionDetected.current) return;
        interactionDetected.current = true;
        try {
          localStorage.setItem(INTERACTION_KEY, 'true');
        } catch {}
        // 800ms 后检查，决定是否跳过引导
        setTimeout(() => {
          if (visible) {
            // 用户已开始操作，关闭引导
            closeTour();
          }
        }, SKIP_CHECK_DELAY);
      };

      // 监听多种交互事件
      const events: Array<keyof DocumentEventMap> = ['click', 'keydown', 'scroll', 'touchstart'];
      events.forEach(ev => document.addEventListener(ev, handleFirstInteraction, { once: true, passive: true }));

      // 500ms 后才显示引导（比之前的 2000ms 快很多）
      const showTimer = setTimeout(() => {
        if (!interactionDetected.current) {
          setVisible(true);
        }
      }, 500);

      return () => {
        clearTimeout(showTimer);
        events.forEach(ev => document.removeEventListener(ev, handleFirstInteraction));
      };
    } catch {
      // localStorage 不可用，静默跳过
    }
  }, [visible, closeTour]);

  // 键盘 Esc 关闭
  useEffect(() => {
    if (!visible) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeTour();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [visible, closeTour]);

  // 定位与高亮目标
  useEffect(() => {
    if (!visible) return;

    const updatePosition = () => {
      const currentStep = tourSteps[step];
      if (!currentStep) return;

      const el = document.querySelector(currentStep.selector) as HTMLElement | null;
      if (!el) {
        // 目标元素未找到：自动跳到下一步，最后一步则关闭
        if (step < tourSteps.length - 1) {
          setStep(s => s + 1);
        } else {
          closeTour();
        }
        return;
      }

      const rect = el.getBoundingClientRect();

      setTargetRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });

      // 智能选择 tooltip 位置
      const tooltipHeight = 200;
      const spaceBelow = window.innerHeight - rect.bottom;
      const top = spaceBelow > tooltipHeight + 40
        ? rect.bottom + window.scrollY + 12
        : rect.top + window.scrollY - tooltipHeight - 12;

      // 居中 + 视口约束
      const tooltipWidth = 288;
      let left = rect.left + rect.width / 2 - tooltipWidth / 2;
      left = Math.max(16, Math.min(left, window.innerWidth - tooltipWidth - 16));

      setPosition({ top, left });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, { passive: true });
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [step, visible, closeTour]);

  const handleNext = () => {
    if (step < tourSteps.length - 1) {
      setStep(s => s + 1);
    } else {
      closeTour();
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(s => s - 1);
  };

  if (!visible) return null;

  const currentStep = tourSteps[step];
  if (!currentStep) return null;

  return (
    <>
      {/* 高亮框（不拦截事件） */}
      {targetRect && (
        <div
          className="fixed z-40 pointer-events-none rounded-2xl ring-4 ring-emerald-400/60 transition-all duration-300 animate-fade-in"
          style={{
            top: targetRect.top - 8,
            left: targetRect.left - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.18)',
          }}
        />
      )}

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        role="dialog"
        aria-live="polite"
        aria-labelledby="tour-title"
        className="fixed z-50 w-72 bg-white dark:bg-gray-900 border-2 border-emerald-400 rounded-2xl shadow-2xl p-4 animate-fade-in-up"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
      >
        {/* 关闭按钮 */}
        <button
          onClick={closeTour}
          aria-label="Close tour"
          className="absolute top-2 right-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 id="tour-title" className="font-bold text-sm text-slate-900 dark:text-white pr-6 mb-1.5">
          {currentStep.title}
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
          {currentStep.description}
        </p>

        {/* 进度条 */}
        <div className="flex items-center gap-1 mb-3">
          {tourSteps.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= step ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={closeTour}
            className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            Skip tour
          </button>
          <div className="flex items-center gap-1.5">
            {step > 0 && (
              <button
                onClick={handleBack}
                aria-label="Previous step"
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-semibold rounded-lg hover:shadow-md transition-all duration-300"
            >
              {step < tourSteps.length - 1 ? 'Next' : 'Got it!'}
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        <p className="mt-3 text-[10px] text-slate-400 dark:text-slate-500 text-center">
          Press Esc anytime · auto-closes when you start exploring
        </p>
      </div>
    </>
  );
}
