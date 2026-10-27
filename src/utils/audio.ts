// Web Audio API & Speech Synthesis Audio System for Polygonia

class AudioSystem {
  private musicEnabled: boolean = true;
  private sfxEnabled: boolean = true;
  private audioCtx: AudioContext | null = null;
  private isMusicPlaying: boolean = false;
  private musicIntervalId: number | null = null;
  private isVideoPlaying: boolean = false;
  private isSpeechActive: boolean = false;

  constructor() {
    // Lazy init AudioContext on first user gesture
  }

  private getAudioContext(): AudioContext | null {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  public isMusicOn(): boolean {
    return this.musicEnabled;
  }

  public isSfxOn(): boolean {
    return this.sfxEnabled;
  }

  public setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    if (enabled && !this.isVideoPlaying) {
      this.startMusic();
    } else {
      this.stopMusic();
    }
  }

  public setSfxEnabled(enabled: boolean) {
    this.sfxEnabled = enabled;
  }

  public notifyVideoPlayState(isPlaying: boolean) {
    this.isVideoPlaying = isPlaying;
    if (isPlaying) {
      this.stopMusic();
    } else if (this.musicEnabled) {
      this.startMusic();
    }
  }

  public startMusic() {
    if (!this.musicEnabled || this.isMusicPlaying || this.isVideoPlaying || this.isSpeechActive) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    this.isMusicPlaying = true;
    let step = 0;
    // Cheerful pentatonic melody in C major
    const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 440.00, 392.00];

    const playMelodyNote = () => {
      if (!this.isMusicPlaying || !this.musicEnabled || this.isVideoPlaying || this.isSpeechActive) return;
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        const freq = notes[step % notes.length];
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Soft, gentle volume
        gain.gain.setValueAtTime(0.025, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.42);

        step++;
      } catch (err) {
        // Fallback
      }
    };

    playMelodyNote();
    this.musicIntervalId = window.setInterval(playMelodyNote, 450);
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicIntervalId !== null) {
      clearInterval(this.musicIntervalId);
      this.musicIntervalId = null;
    }
  }

  public playSfx(type: 'click' | 'select' | 'place' | 'correct' | 'incorrect' | 'complete') {
    if (!this.sfxEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'select') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'place') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'correct') {
        // Happy arpeggio C5 - E5 - G5
        [523.25, 659.25, 783.99].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.08, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.26);
        });
      } else if (type === 'incorrect') {
        // Soft low double tone Eb3 -> Bb2
        [311.13, 233.08].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.12);
          gain.gain.setValueAtTime(0.08, now + idx * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.12);
          osc.stop(now + idx * 0.12 + 0.26);
        });
      } else if (type === 'complete') {
        // Fanfare flourish C5 - E5 - G5 - C6
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.1);
          gain.gain.setValueAtTime(0.1, now + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.1);
          osc.stop(now + idx * 0.1 + 0.42);
        });
      }
    } catch (err) {
      // Ignore audio synthesis errors
    }
  }

  public speakText(text: string, onEnd?: () => void) {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeechActive = true;
      this.stopMusic();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;

      const finishSpeech = () => {
        this.isSpeechActive = false;
        if (this.musicEnabled && !this.isVideoPlaying) {
          this.startMusic();
        }
        if (onEnd) onEnd();
      };

      utterance.onend = finishSpeech;
      utterance.onerror = finishSpeech;

      window.speechSynthesis.speak(utterance);
    } else {
      this.isSpeechActive = false;
      if (onEnd) onEnd();
    }
  }
}

export const audioSystem = new AudioSystem();
