import { ref } from 'vue';
import { useAppSettings } from './useAppSettings';

// Singleton Audio State
const isSoundEnabled = ref(true);
const ambientSource = ref<AudioBufferSourceNode | null>(null);
const ambientGain = ref<GainNode | null>(null);
const audioCtx = ref<AudioContext | null>(null);

export const useAudio = () => {
  const { isSoundEnabled: settingsSoundEnabled } = useAppSettings();

  const initCtx = () => {
    if (!audioCtx.value && process.client) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) audioCtx.value = new AudioContext();
    }
    return audioCtx.value;
  };

  const playSound = (type: 'success' | 'error' | 'click') => {
    if (!process.client || !settingsSoundEnabled.value) return;
    const ctx = initCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1318.51, now);
      osc.frequency.exponentialRampToValueAtTime(1760.00, now + 0.1);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.1, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'error') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(246.94, now);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.1, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  };

  // 合成海浪聲：粉紅噪音 + 低通濾波器 + 緩慢振盪
  const startSeaWaves = () => {
    if (!process.client || !settingsSoundEnabled.value) return;
    const ctx = initCtx();
    if (!ctx) return;

    // 建立 5 秒的粉紅噪音 Buffer
    const bufferSize = ctx.sampleRate * 5;
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
      data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      data[i] *= 0.11; // 修正音量
      b6 = white * 0.115926;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;

    const gain = ctx.createGain();
    gain.gain.value = 0;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    // 模擬海浪起伏 (LFO)
    const now = ctx.currentTime;
    gain.gain.linearRampToValueAtTime(0.2, now + 2); // 漸入
    
    // 手動模擬起伏循環
    const breathe = () => {
      if (!gain) return;
      const t = ctx.currentTime;
      gain.gain.exponentialRampToValueAtTime(0.3, t + 4); // 浪湧
      gain.gain.exponentialRampToValueAtTime(0.05, t + 8); // 浪退
      setTimeout(breathe, 8000);
    };
    breathe();

    source.start();
    ambientSource.value = source;
    ambientGain.value = gain;
  };

  const stopAmbient = () => {
    if (ambientGain.value && audioCtx.value) {
      const now = audioCtx.value.currentTime;
      ambientGain.value.gain.linearRampToValueAtTime(0, now + 1); // 漸出
      setTimeout(() => {
        ambientSource.value?.stop();
        ambientSource.value = null;
      }, 1000);
    }
  };

  return { playSound, startSeaWaves, stopAmbient };
};
