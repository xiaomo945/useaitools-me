'use client';

import { useState, useEffect, useRef } from 'react';

const tourSteps = [
  {
    target: 'search',
    title: '🔍 Search for Tools',
    description: 'Start by searching for a tool you need. Just type and hit Enter!',
    icon: '🔍',
  },
  {
    target: 'categories',
    title: '📂 Browse by Category',
    description: 'Or explore tools by category — Writing, Image, Video, and more.',
    icon: '📂',
  },
  {
    target: 'toolcard',
    title: '❤️ Save Your Favorites',
    description: 'Click the heart icon on any tool card to save it for later.',
    icon: '❤️',
  },
];

export default function GuidedTour() {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const isReplay = params.get('replay-tour') === '1';
      if (isReplay) {
        localStorage.removeItem('useaitools_tour_completed');
        // Clean URL
        window.history.replaceState({}, '', '/');
      }
      const completed = localStorage.getItem('useaitools_tour_completed');
      if (!completed) {
        const timer = setTimeout(() => setVisible(true), 1500);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (!visible) return;

    const updatePosition = () => {
      const targetId = tourSteps[step].target;
      let selector = '';
      if (targetId === 'search') selector = 'input[type="text"]';
      else if (targetId === 'categories') selector = '[data-tour="categories"]';
      else if (targetId === 'toolcard') selector = '[data-tour="toolcard"]';

      const el = document.querySelector(selector) as HTMLElement;
      if (el) {
        const rect = el.getBoundingClientRect();
        setPosition({
          top: rect.bottom + window.scrollY + 12,
          left: rect.left + rect.width / 2,
        });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [step, visible]);

  const handleNext = () => {
    if (step < tourSteps.length - 1) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    setVisible(false);
    try {
      localStorage.setItem('useaitools_tour_completed', 'true');
    } catch {}
  };

  if (!visible) return null;

  const currentStep = tourSteps[step];

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-[80] pointer-events-auto" onClick={handleSkip} />
      <div
        ref={tooltipRef}
        className="fixed z-[85] w-72 bg-white dark:bg-gray-900 border border-emerald-200 dark:border-emerald-800 rounded-2xl shadow-2xl p-5 animate-fade-in-up pointer-events-auto"
        style={{
          top: `${position.top}px`,
          left: `${Math.max(16, Math.min(position.left - 144, window.innerWidth - 304))}px`,
        }}
      >
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-gray-900 border-l border-t border-emerald-200 dark:border-emerald-800 rotate-45" />
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">{currentStep.icon}</span>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">{currentStep.title}</h3>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">{currentStep.description}</p>
        <div className="flex items-center justify-between">
          <button
            onClick={handleSkip}
            className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            Skip
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 dark:text-slate-500">{step + 1}/{tourSteps.length}</span>
            <button
              onClick={handleNext}
              className="px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-semibold rounded-lg hover:shadow-md transition-all duration-300"
            >
              {step < tourSteps.length - 1 ? 'Next' : 'Got it!'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
