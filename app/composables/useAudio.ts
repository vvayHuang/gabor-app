import { ref } from 'vue';
import { useAppSettings } from './useAppSettings';

// Singleton Audio State
const isSoundEnabled = ref(true);
const ambientSource = ref<AudioBufferSourceNode | null>(null);
const ambientFoamSource = ref<AudioBufferSourceNode | null>(null);
const ambientGain = ref<GainNode | null>(null);
const ambientFoamGain = ref<GainNode | null>(null);
const ambientTimeout = ref<ReturnType<typeof setTimeout> | null>(null);
const audioCtx = ref<AudioContext | null>(null);

export const useAudio = () => {
  const { isSoundEnabled: settingsSoundEnabled, noiseVolume } = useAppSettings();

  const initCtx = () => {
    if (!audioCtx.value && process.client) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) audioCtx.value = new AudioContext();
    }
    if (audioCtx.value?.state === 'suspended') {
      audioCtx.value.resume();
    }
    return audioCtx.value;
  };

  const playTone = (
    ctx: AudioContext,
    options: {
      type?: OscillatorType;
      start: number;
      end?: number;
      time?: number;
      duration: number;
      volume?: number;
      delay?: number;
      attack?: number;
      filterFrequency?: number;
    }
  ) => {
    const now = ctx.currentTime + (options.delay ?? 0);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = options.type ?? 'sine';
    osc.frequency.setValueAtTime(options.start, now);
    if (options.end) {
      osc.frequency.exponentialRampToValueAtTime(options.end, now + options.duration);
    }

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(options.filterFrequency ?? 2400, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(options.volume ?? 0.08, now + (options.attack ?? 0.015));
    gain.gain.exponentialRampToValueAtTime(0.0001, now + options.duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + options.duration + 0.02);
  };

  const playNoiseBurst = (ctx: AudioContext, duration: number, volume: number, frequency: number) => {
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = frequency;

    const gain = ctx.createGain();
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start(now);
    source.stop(now + duration);
  };

  const playSound = (type: 'success' | 'error' | 'click' | 'complete') => {
    if (!process.client || !settingsSoundEnabled.value) return;
    const ctx = initCtx();
    if (!ctx) return;

    if (type === 'success') {
      playTone(ctx, { type: 'sine', start: 493.88, end: 659.25, duration: 0.42, volume: 0.052, attack: 0.045, filterFrequency: 1400 });
      playTone(ctx, { type: 'triangle', start: 659.25, end: 880, duration: 0.5, volume: 0.034, delay: 0.08, attack: 0.06, filterFrequency: 1200 });
    } else if (type === 'error') {
      playTone(ctx, { type: 'triangle', start: 220, end: 146.83, duration: 0.22, volume: 0.075 });
      playNoiseBurst(ctx, 0.12, 0.025, 900);
    } else if (type === 'complete') {
      playTone(ctx, { type: 'sine', start: 587.33, end: 783.99, duration: 0.5, volume: 0.058, attack: 0.05, filterFrequency: 1500 });
      playTone(ctx, { type: 'triangle', start: 783.99, end: 987.77, duration: 0.58, volume: 0.04, delay: 0.18, attack: 0.07, filterFrequency: 1300 });
    } else if (type === 'click') {
      playTone(ctx, { type: 'sine', start: 660, end: 880, duration: 0.08, volume: 0.035 });
    }
  };

  const createPinkNoiseBuffer = (ctx: AudioContext, seconds: number, volume: number) => {
    const bufferSize = ctx.sampleRate * seconds;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let b0, b1, b2, b3, b4, b5, b6;
    b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3102241;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * volume;
      b6 = white * 0.115926;
    }

    return buffer;
  };

  // 合成海浪聲：低頻浪體 + 高頻泡沫層 + 週期性浪湧起伏
  const startSeaWaves = () => {
    if (!process.client || !settingsSoundEnabled.value) return;
    const ctx = initCtx();
    if (!ctx) return;

    stopAmbient();

    const volMultiplier = noiseVolume.value / 100;
    const bodyBuffer = createPinkNoiseBuffer(ctx, 8, 0.12);
    const foamBuffer = createPinkNoiseBuffer(ctx, 8, 0.04);

    const source = ctx.createBufferSource();
    source.buffer = bodyBuffer;
    source.loop = true;
    const foamSource = ctx.createBufferSource();
    foamSource.buffer = foamBuffer;
    foamSource.loop = true;

    const bodyFilter = ctx.createBiquadFilter();
    bodyFilter.type = 'lowpass';
    bodyFilter.frequency.value = 260;

    const foamFilter = ctx.createBiquadFilter();
    foamFilter.type = 'bandpass';
    foamFilter.frequency.value = 1200;
    foamFilter.Q.value = 0.7;

    const gain = ctx.createGain();
    gain.gain.value = 0;
    const foamGain = ctx.createGain();
    foamGain.gain.value = 0;

    source.connect(bodyFilter);
    bodyFilter.connect(gain);
    gain.connect(ctx.destination);
    foamSource.connect(foamFilter);
    foamFilter.connect(foamGain);
    foamGain.connect(ctx.destination);

    const now = ctx.currentTime;
    const bodyPeak = 0.42 * volMultiplier;
    const bodyBase = 0.055 * volMultiplier;
    const foamPeak = 0.15 * volMultiplier;
    const foamBase = 0.007 * volMultiplier;

    gain.gain.linearRampToValueAtTime(bodyBase, now + 0.8);
    foamGain.gain.linearRampToValueAtTime(foamBase, now + 0.8);
    
    const swell = () => {
      if (!ambientSource.value || !ambientGain.value || !ambientFoamGain.value) return;
      const t = ctx.currentTime;
      bodyFilter.frequency.cancelScheduledValues(t);
      foamFilter.frequency.cancelScheduledValues(t);
      gain.gain.cancelScheduledValues(t);
      foamGain.gain.cancelScheduledValues(t);

      gain.gain.setValueAtTime(Math.max(gain.gain.value, 0.0001), t);
      foamGain.gain.setValueAtTime(Math.max(foamGain.gain.value, 0.0001), t);
      bodyFilter.frequency.setValueAtTime(bodyFilter.frequency.value, t);
      foamFilter.frequency.setValueAtTime(foamFilter.frequency.value, t);

      gain.gain.exponentialRampToValueAtTime(bodyPeak, t + 2.2);
      bodyFilter.frequency.exponentialRampToValueAtTime(620, t + 2.2);
      foamGain.gain.exponentialRampToValueAtTime(foamPeak, t + 2.9);
      foamFilter.frequency.exponentialRampToValueAtTime(2200, t + 2.9);

      gain.gain.exponentialRampToValueAtTime(bodyBase, t + 6.2);
      bodyFilter.frequency.exponentialRampToValueAtTime(220, t + 6.2);
      foamGain.gain.exponentialRampToValueAtTime(foamBase, t + 5.4);
      foamFilter.frequency.exponentialRampToValueAtTime(900, t + 5.4);

      ambientTimeout.value = setTimeout(swell, 6200);
    };

    source.start();
    foamSource.start();
    ambientSource.value = source;
    ambientFoamSource.value = foamSource;
    ambientGain.value = gain;
    ambientFoamGain.value = foamGain;
    swell();
  };

  const stopAmbient = () => {
    if (ambientTimeout.value) {
      clearTimeout(ambientTimeout.value);
      ambientTimeout.value = null;
    }

    if (ambientGain.value && audioCtx.value) {
      const source = ambientSource.value;
      const foamSource = ambientFoamSource.value;
      const gain = ambientGain.value;
      const foamGain = ambientFoamGain.value;
      const now = audioCtx.value.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.linearRampToValueAtTime(0, now + 1);
      foamGain?.gain.cancelScheduledValues(now);
      foamGain?.gain.linearRampToValueAtTime(0, now + 0.8);

      ambientSource.value = null;
      ambientFoamSource.value = null;
      ambientGain.value = null;
      ambientFoamGain.value = null;

      setTimeout(() => {
        source?.stop();
        foamSource?.stop();
      }, 1000);
    }
  };

  return { playSound, startSeaWaves, stopAmbient };
};
