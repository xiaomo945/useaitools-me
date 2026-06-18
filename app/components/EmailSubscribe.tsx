'use client';

import { useState, type FormEvent } from 'react';
import { Mail, Check, AlertCircle } from 'lucide-react';

interface EmailSubscribeProps {
  title?: string;
  description?: string;
  source?: string;
  showName?: boolean;
}

export default function EmailSubscribe({
  title = '订阅 AI 工具周报',
  description = '每周精选最新、最实用的 AI 工具与深度评测，直达您的邮箱。',
  source = 'blog',
  showName = true,
}: EmailSubscribeProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    if (!trimmedEmail) {
      setStatus('error');
      setMessage('请输入邮箱地址。');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(trimmedEmail)) {
      setStatus('error');
      setMessage('请提供有效的邮箱地址。');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmedEmail,
          name: trimmedName || undefined,
          source,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        setStatus('success');
        setMessage(
          data.status === 'existing'
            ? '您已经在订阅列表中，感谢关注！'
            : data.message || '订阅成功！欢迎加入我们的读者社群。'
        );
        setEmail('');
        setName('');
      } else {
        setStatus('error');
        setMessage(data.message || '订阅失败，请稍后再试。');
      }
    } catch {
      setStatus('error');
      setMessage('网络错误，请检查连接后重试。');
    }
  };

  return (
    <section className="w-full max-w-2xl mx-auto my-8 sm:my-12 px-4 sm:px-6">
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl shadow-emerald-500/10">
        <div
          aria-hidden="true"
          className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-gradient-to-br from-emerald-400/30 to-teal-400/20 blur-3xl pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-gradient-to-br from-teal-400/20 to-cyan-400/10 blur-3xl pointer-events-none"
        />

        <div className="relative">
          <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/25 mb-4">
              <Mail className="w-7 h-7 sm:w-8 sm:h-8 text-white" strokeWidth={2} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {title}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md">
              {description}
            </p>
          </div>

          {status === 'success' ? (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5 sm:p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white mb-3 shadow-lg shadow-emerald-500/25">
                <Check className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <p className="text-base font-semibold text-emerald-700 dark:text-emerald-300 mb-1">
                订阅成功！
              </p>
              <p className="text-sm text-emerald-700/80 dark:text-emerald-300/80">
                {message}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3" noValidate>
              {showName && (
                <div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (status !== 'idle') {
                        setStatus('idle');
                        setMessage('');
                      }
                    }}
                    aria-label="Your name"
                    placeholder="您的称呼（可选）"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 disabled:opacity-60"
                    disabled={status === 'loading'}
                    autoComplete="name"
                  />
                </div>
              )}
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status !== 'idle') {
                      setStatus('idle');
                      setMessage('');
                    }
                  }}
                  aria-label="Email address"
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 disabled:opacity-60"
                  disabled={status === 'loading'}
                  autoComplete="email"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {status === 'loading' ? (
                  <>
                    <svg
                      className="w-4 h-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v0C7.373 4 2 9.373 2 16h2z"
                      />
                    </svg>
                    提交中...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    立即订阅
                  </>
                )}
              </button>

              {status === 'error' && message && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{message}</span>
                </div>
              )}
            </form>
          )}

          <p className="text-xs text-center text-slate-500 dark:text-slate-500 mt-5">
            无垃圾邮件。随时可通过邮件底部链接或 <a
              href="/api/unsubscribe?email=your@email.com"
              className="text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              取消订阅
            </a> 退出。
          </p>
        </div>
      </div>
    </section>
  );
}
