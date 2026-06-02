// Sound feedback utility for UI interactions
// Uses Web Audio API for lightweight, zero-dependency sound effects

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioContext;
  } catch {
    return null;
  }
}

export function isSoundEnabled(): boolean {
  try {
    return localStorage.getItem('useaitools_sound') !== 'disabled';
  } catch {
    return true;
  }
}

function playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.1) {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    // Resume context if suspended (required by browser autoplay policy)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch {
    // Silently fail - sound is non-essential
  }
}

export function playSaveSound() {
  playTone(880, 0.15, 'sine', 0.08);
  setTimeout(() => playTone(1100, 0.12, 'sine', 0.06), 80);
}

export function playUnsaveSound() {
  playTone(660, 0.12, 'sine', 0.06);
  setTimeout(() => playTone(440, 0.15, 'sine', 0.05), 80);
}

export function playCompareSound() {
  playTone(523, 0.1, 'triangle', 0.07);
  setTimeout(() => playTone(659, 0.1, 'triangle', 0.06), 60);
  setTimeout(() => playTone(784, 0.12, 'triangle', 0.05), 120);
}

export function playSearchSound() {
  playTone(600, 0.08, 'sine', 0.05);
  setTimeout(() => playTone(800, 0.1, 'sine', 0.04), 50);
}
