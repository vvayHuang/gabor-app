import { computed } from 'vue';
import { useAppSettings } from '~/composables/useAppSettings';

// Gabor 斑塊的外觀（墨色與輪廓 gamma），遊戲畫面與教學頁共用同一份。
export const useGaborAppearance = () => {
  const { isDarkMode } = useAppSettings();

  // Canvas 本身保持透明（底色由頁面的 surface 提供），墨色取自設計系統的 on-surface：
  // 深色 #E1E2EC，淺色 #181C23。
  const inkColor = computed(() => isDarkMode.value ? '#E1E2EC' : '#181C23');
  // on-surface 的墨色比純黑／純白弱，可見度改由 gamma < 1 抬升輪廓中低強度區補回，
  // 而不是把墨色調到色票以外。深色底缺少「白紙吸墨」的餘裕，需要抬得比淺色多。
  const profileGamma = computed(() => isDarkMode.value ? 0.68 : 0.9);

  return { inkColor, profileGamma };
};
