import { ref } from 'vue';

// 將狀態移至函式外部以達成共享 (Singleton Pattern)
const isSoundEnabled = ref(true);
const isDarkMode = ref(false);
const brightnessLevel = ref(80);
const isLoaded = ref(false);

export const useAppSettings = () => {
  const loadSettings = () => {
    if (!process.client || isLoaded.value) return;
    const saved = localStorage.getItem('gabor_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      isSoundEnabled.value = parsed.isSoundEnabled ?? true;
      isDarkMode.value = parsed.isDarkMode ?? false;
      brightnessLevel.value = parsed.brightnessLevel ?? 80;
    }
    applyTheme();
    isLoaded.value = true;
  };

  const saveSettings = () => {
    if (!process.client) return;
    localStorage.setItem('gabor_settings', JSON.stringify({
      isSoundEnabled: isSoundEnabled.value,
      isDarkMode: isDarkMode.value,
      brightnessLevel: brightnessLevel.value,
    }));
  };

  const applyTheme = () => {
    if (!process.client) return;
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
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
    brightnessLevel,
    loadSettings,
    toggleSound,
    toggleDarkMode,
  };
};
