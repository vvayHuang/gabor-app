import { ref } from 'vue';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

// 將狀態移至函式外部以達成共享 (Singleton Pattern)
const isSoundEnabled = ref(true);
const isDarkMode = ref(false);
// 使用者是否手動選過深淺色；沒選過就跟著系統外觀走
const hasDarkModePreference = ref(false);
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
        if (typeof parsed.isDarkMode === 'boolean') {
          isDarkMode.value = parsed.isDarkMode;
          hasDarkModePreference.value = true;
        }
        pxPerMm.value = parsed.pxPerMm ?? 6.3;
        noiseVolume.value = parsed.noiseVolume ?? 50;
      } catch (e) {
        console.error('Failed to parse settings:', e);
      }
    }
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
    if (!hasDarkModePreference.value) isDarkMode.value = systemDark.matches;
    systemDark.addEventListener('change', (e) => {
      if (hasDarkModePreference.value) return;
      isDarkMode.value = e.matches;
      applyTheme();
    });
    applyTheme();
    isLoaded.value = true;
  };

  const saveSettings = () => {
    if (!process.client) return;
    localStorage.setItem('gabor_settings', JSON.stringify({
      isSoundEnabled: isSoundEnabled.value,
      // 只在使用者手動選過時才存，否則存下系統當下的值會讓之後不再跟著系統
      isDarkMode: hasDarkModePreference.value ? isDarkMode.value : undefined,
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
    hasDarkModePreference.value = true;
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
