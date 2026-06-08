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

          <!-- Item: 訓練提醒 -->
          <div class="flex flex-col gap-4">
            <div class="flex items-center justify-between w-full h-7">
              <span class="body-lg text-on-background">訓練提醒</span>
              <Switch v-model="isReminderEnabled" />
            </div>

            <!-- Expandable Reminder Details -->
            <transition name="expand">
              <div v-if="isReminderEnabled" class="overflow-hidden">
                <div
                  class="bg-surface-dim rounded-2xl p-4 flex flex-col gap-[9px] w-full"
                >
                  <!-- Menu Item: Frequency -->
                  <div
                    class="flex flex-row items-center justify-between px-2 h-11 cursor-pointer hover:bg-on-surface/5 transition-colors rounded-lg"
                  >
                    <span class="text-base text-on-surface">每天</span>
                    <Icon
                      name="material-symbols:chevron-right-rounded"
                      size="20"
                      class="text-on-surface"
                    />
                  </div>

                  <!-- Menu Item: Time -->
                  <div
                    class="flex flex-row items-center justify-between px-2 h-11 cursor-pointer hover:bg-on-surface/5 transition-colors rounded-lg"
                  >
                    <span class="text-base text-on-surface">下午 5:00</span>
                    <Icon
                      name="material-symbols:chevron-right-rounded"
                      size="20"
                      class="text-on-surface"
                    />
                  </div>
                </div>
              </div>
            </transition>
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

          <!-- Logout Button -->
          <div class="w-full lg:w-fit">
            <Buttons
              buttonStyle="Bordered"
              label="登出"
              :destructive="true"
              size="Large"
              labelType="Text"
              @click="handleLogout"
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
import { onMounted, ref } from "vue";

const router = useRouter();
const supabase = useSupabaseClient();
const persistence = useGamePersistence();
const {
  isSoundEnabled,
  isDarkMode,
  toggleSound,
  toggleDarkMode,
  loadSettings,
} = useAppSettings();

const isReminderEnabled = ref(false);

onMounted(() => {
  loadSettings();
});

const handleLogout = async () => {
  try {
    await supabase.auth.signOut();
    persistence.resetStats();
    router.push("/");
  } catch (e) {
    console.error("Logout failed:", e);
  }
};
</script>

<style scoped>
/* 展開/收合動畫 */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease-out;
  max-height: 200px;
  opacity: 1;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}
</style>
