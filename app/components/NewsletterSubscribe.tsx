'use client';

import { useState } from 'react';
import { Mail, Check } from 'lucide-react';

export default function NewsletterSubscribe() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setStatus('error');
      setMessage('Please enter your email address');
      return;
    }

    setStatus('loading');
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage(data.message);
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.message);
      }
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl p-8 sm:p-12 shadow-xl shadow-emerald-500/25">
      <div className="max-w-md mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
        </div>
        
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          Get the Best AI Tools Weekly
        </h3>
        
        <p className="text-white/80 mb-8">
          Join 1,000+ subscribers. No spam, just curated picks delivered to your inbox every week.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-3">
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
              placeholder="your@email.com"
              aria-label="Email address for newsletter subscription"
              aria-required="true"
              className="flex-1 px-5 py-4 rounded-xl bg-white/90 backdrop-blur-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
              disabled={status === 'loading'}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-6 py-4 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Subscribe'
              )}
            </button>
          </div>

          {message && (
            <div className={`flex items-center justify-center gap-2 text-sm font-medium ${
              status === 'success' ? 'text-white' : 'text-white/90'
            }`}>
              {status === 'success' && <Check className="w-4 h-4" />}
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}