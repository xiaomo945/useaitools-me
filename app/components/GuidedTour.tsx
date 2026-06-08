'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';

const tourSteps = [
  {
    target: 'search',
    selector: 'input[type="text"][placeholder*="Search" i]',
    title: '🔍 Search for Tools',
    description: 'Start by searching for a tool you need. Just type and hit Enter!',
  },
  {
    target: 'categories',
    selector: '[data-tour="categories"]',
    title: '📂 Browse by Category',
    description: 'Or explore tools by category — Writing, Image, Video, and more.',
  },
  {
    target: 'toolcard',
    selector: '[data-tour="toolcard"]',
    title: '❤️ Save Your Favorites',
    description: 'Click the heart icon on any tool card to save it for later.',
  },
];

const STORAGE_KEY = 'useaitools_tour_completed';

export default function GuidedTour() {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, placement: 'bottom' as 'top' | 'bottom' });
  const [targetRect, setTargetRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  // 初始化：检查是否需要展示
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('replay-tour') === '1') {
        localStorage.removeItem(STORAGE_KEY);
        window.history.replaceState({}, '', '/');
      }
      const completed = localStorage.getItem(STORAGE_KEY);
      // 延迟展示：等首屏渲染完成
      if (!completed) {
        const timer = setTimeout(() => setVisible(true), 2000);
        return () => clearTimeout(timer);
      }
    } catch {
      // localStorage 不可用时直接跳过引导
    }
  }, []);

  const closeTour = useCallback(() => {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // 静默失败
    }
  }, []);

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
      lastScrollY.current = window.scrollY;

      // 高亮区域
      setTargetRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });

      // 智能选择 tooltip 位置：优先在目标元素下方，空间不够则放上方
      const tooltipHeight = 200;
      const spaceBelow = window.innerHeight - rect.bottom;
      const placement: 'top' | 'bottom' = spaceBelow > tooltipHeight + 40 ? 'bottom' : 'top';

      const top = placement === 'bottom'
        ? rect.bottom + window.scrollY + 12
        : rect.top + window.scrollY - tooltipHeight - 12;

      // tooltip 居中于目标，约束在视口内
      const tooltipWidth = 288;
      let left = rect.left + rect.width / 2 - tooltipWidth / 2;
      left = Math.max(16, Math.min(left, window.innerWidth - tooltipWidth - 16));

      setPosition({ top, left, placement });
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

  // 点击目标元素时不关闭引导（让用户实际操作）
  const handleTargetClick = (e: MouseEvent) => {
    // 允许用户点击目标区域；不阻止事件传播
  };

  useEffect(() => {
    if (!visible || !targetRect) return;
    const currentStep = tourSteps[step];
    if (!currentStep) return;
    const el = document.querySelector(currentStep.selector);
    if (!el) return;
    el.addEventListener('click', handleTargetClick as any);
    return () => el.removeEventListener('click', handleTargetClick as any);
  }, [step, visible, targetRect]);

  if (!visible) return null;

  const currentStep = tourSteps[step];
  if (!currentStep) return null;

  return (
    <>
      {/* 高亮框（不拦截事件）—— 装饰性提示，不阻挡用户操作 */}
      {targetRect && (
        <div
          className="fixed z-40 pointer-events-none rounded-2xl ring-4 ring-emerald-400/60 transition-all duration-300 animate-fade-in"
          style={{
            top: targetRect.top - 8,
            left: targetRect.left - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.15)',
          }}
        />
      )}

      {/* Tooltip 浮层 —— 可交互，但不阻挡其他 UI */}
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
        {/* 关闭按钮 —— 永远可见，救命稻草 */}
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
          Press Esc anytime to close
        </p>
      </div>
    </>
  );
}
