import { useAppSettings } from '~/composables/useAppSettings';

export default defineNuxtPlugin(() => {
  const settings = useAppSettings();

  settings.loadSettings();
});
