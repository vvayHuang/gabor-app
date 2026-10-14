<template>
  <div
    class="flex-1 flex flex-col px-4 space-y-8 text-on-background overflow-y-auto pb-32"
  >
    <!-- New iOS Style Toolbar -->
    <ToolbarTop headline="設定" type="navigation">
      <template #left>
        <NuxtLink
          to="/profile"
          class="w-11 h-11 flex items-center justify-center rounded-full bg-surface-container transition-colors hover:bg-surface-variant text-on-surface lg:hidden"
        >
          <Icon name="material-symbols:arrow-back-ios-new-rounded" size="17" />
        </NuxtLink>
      </template>
    </ToolbarTop>

    <div class="flex flex-col space-y-10">
      <!-- Preferences Settings Section -->
      <section class="flex flex-col gap-6">
        <h2 class="title-md-emphasis text-on-surface-variant">偏好設定</h2>

        <div class="flex flex-col gap-6 px-2">
          <!-- Item: 聲音 -->
          <div class="flex items-center justify-between w-full h-7 gap-6">
            <span class="body-lg text-on-background">聲音</span>
            <Switch
              :model-value="isSoundEnabled"
              @update:model-value="toggleSound"
            />
          </div>
          <!-- Item: 深色模式 -->
          <div class="flex items-center justify-between w-full h-7 gap-6">
            <span class="body-lg text-on-background">深色模式</span>
            <Switch
              :model-value="isDarkMode"
              @update:model-value="toggleDarkMode"
            />
          </div>
        </div>
      </section>

      <!-- Account Section -->
      <section class="flex flex-col gap-6">
        <h2 class="title-md-emphasis text-on-surface-variant">客服</h2>

        <div class="flex flex-col gap-6">
          <!-- Menu Item: 聯絡我們 -->
          <div
            class="flex items-center justify-between px-2 h-11 rounded-lg gap-1"
          >
            <span class="body-lg text-on-background">聯絡我們</span>
            <Icon
              name="material-symbols:chevron-right-rounded"
              size="20"
              class="text-on-background"
            />
          </div>

          <!-- Logout Button（訪客改顯示登入） -->
          <div class="w-full lg:w-fit">
            <Buttons
              v-if="user"
              buttonStyle="Bordered"
              label="登出"
              :destructive="true"
              size="Large"
              labelType="Text"
              @click="handleLogout"
            />
            <Buttons
              v-else
              buttonStyle="Bordered"
              label="登入"
              size="Large"
              labelType="Text"
              to="/login"
            />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAppSettings } from "~/composables/useAppSettings";
import { onMounted } from "vue";

const router = useRouter();
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const { setGuestMode } = useGuestMode();
const persistence = useGamePersistence();
const {
  isSoundEnabled,
  isDarkMode,
  toggleSound,
  toggleDarkMode,
  loadSettings,
} = useAppSettings();

onMounted(() => {
  loadSettings();
});

const handleLogout = async () => {
  try {
    await supabase.auth.signOut();
    // 需等待清空完成再離開，否則 router.push 可能搶在本機資料清乾淨之前發生
    await persistence.resetStats();
    // 登出後回到登入頁重新選擇，不沿用之前的訪客身分
    setGuestMode(false);
    router.push("/");
  } catch (e) {
    console.error("Logout failed:", e);
  }
};
</script>
