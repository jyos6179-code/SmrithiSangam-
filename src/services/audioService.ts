import { LanguageCode } from '../types';

class AudioService {
  private audioCtx: AudioContext | null = null;
  private isBhashiniEnabled: boolean = true;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private recognition: any = null;
  private isListening: boolean = false;

  private getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // Gentle, uplifting chimes designed for elderly ears (no harsh frequencies)
  playChime() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 major triad

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.18, now + idx * 0.08 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.65);
      });
    } catch {
      // AudioContext fallback
    }
  }

  playSoftThud() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.2);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // AudioContext fallback
    }
  }

  playVictory() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0.001, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.25, now + idx * 0.12 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.9);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.95);
      });
    } catch {
      // AudioContext fallback
    }
  }

  playSosAlarm() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      for (let i = 0; i < 3; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(750, now + i * 0.3);
        osc.frequency.setValueAtTime(950, now + i * 0.3 + 0.15);

        gain.gain.setValueAtTime(0.2, now + i * 0.3);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.3 + 0.28);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.3);
        osc.stop(now + i * 0.3 + 0.3);
      }
    } catch {
      // AudioContext fallback
    }
  }

  // Text-To-Speech with slow, warm delivery (rate 0.85x) for elderly comprehension
  speak(text: string, language: LanguageCode, onEnd?: () => void) {
    if (!('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;

      // Map language code to browser speech code with Indian dialect priority
      const langMap: Record<LanguageCode, string> = {
        as: 'as-IN',
        mni: 'mni-IN',
        kha: 'en-IN', // Browser fallback with regional cadence
        lus: 'en-IN',
        hi: 'hi-IN',
        en: 'en-IN'
      };

      utterance.lang = langMap[language] || 'en-IN';
      utterance.rate = 0.85; // Slower, steady pace for cognitive accessibility
      utterance.pitch = 1.05; // Friendly, warm pitch

      utterance.onend = () => {
        this.currentUtterance = null;
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
        this.currentUtterance = null;
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      if (onEnd) onEnd();
    }
  }

  stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.currentUtterance = null;
  }

  // Voice Command Listener using Web Speech Recognition
  startListening(onResult: (transcript: string) => void, onError?: () => void) {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      if (onError) onError();
      return;
    }

    try {
      if (this.recognition) {
        this.recognition.abort();
      }

      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-IN';

      this.recognition.onstart = () => {
        this.isListening = true;
      };

      this.recognition.onresult = (event: any) => {
        this.isListening = false;
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
      };

      this.recognition.onerror = () => {
        this.isListening = false;
        if (onError) onError();
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      this.recognition.start();
    } catch {
      this.isListening = false;
      if (onError) onError();
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  toggleBhashiniMode(enabled: boolean) {
    this.isBhashiniEnabled = enabled;
  }

  getBhashiniMode(): boolean {
    return this.isBhashiniEnabled;
  }
}

export const audioService = new AudioService();
