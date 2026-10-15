import { ref } from 'vue';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

// 將狀態移至函式外部以達成共享 (Singleton Pattern)
const isSoundEnabled = ref(true);
const isDarkMode = ref(false);
const pxPerMm = ref(6.3);
const noiseVolume = ref(50);
const isLoaded = ref(false);

export const useAppSettings = () => {
  const loadSettings = () => {
    if (!process.client || isLoaded.value) return;
    const saved = localStorage.getItem('gabor_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        isSoundEnabled.value = parsed.isSoundEnabled ?? true;
        isDarkMode.value = parsed.isDarkMode ?? false;
        pxPerMm.value = parsed.pxPerMm ?? 6.3;
        noiseVolume.value = parsed.noiseVolume ?? 50;
      } catch (e) {
        console.error('Failed to parse settings:', e);
      }
    }
    applyTheme();
    isLoaded.value = true;
  };

  const saveSettings = () => {
    if (!process.client) return;
    localStorage.setItem('gabor_settings', JSON.stringify({
      isSoundEnabled: isSoundEnabled.value,
      isDarkMode: isDarkMode.value,
      pxPerMm: pxPerMm.value,
      noiseVolume: noiseVolume.value,
    }));
  };

  const applyTheme = () => {
    if (!process.client) return;
    const root = document.documentElement;
    // 換主題時先暫停所有轉場，否則帶 transition 的元素會慢慢從舊色過渡，看起來像閃一下
    root.classList.add('theme-switching');
    root.classList.toggle('dark', isDarkMode.value);
    // 強制瀏覽器先套用新顏色，再恢復轉場
    void root.offsetHeight;
    root.classList.remove('theme-switching');
    // iOS 狀態列預設跟系統外觀走，需依 app 的主題指定文字顏色（Style.Dark = 深色背景用的淺色文字）
    if (Capacitor.isNativePlatform()) {
      StatusBar.setStyle({ style: isDarkMode.value ? Style.Dark : Style.Light })
        .catch(e => console.error('Failed to set status bar style:', e));
    }
  };

  const toggleSound = () => {
    isSoundEnabled.value = !isSoundEnabled.value;
    saveSettings();
  };

  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value;
    applyTheme();
    saveSettings();
  };

  return {
    isSoundEnabled,
    isDarkMode,
    pxPerMm,
    noiseVolume,
    loadSettings,
    toggleSound,
    toggleDarkMode,
    updateSettings: () => saveSettings(),
    updateCalibration: (val: number) => {
      pxPerMm.value = val;
      saveSettings();
    }
  };
};
