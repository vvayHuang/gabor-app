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
              :model-value="isMounted && isSoundEnabled"
              @update:model-value="toggleSound"
            />
          </div>
          <!-- Item: 深色模式 -->
          <div class="flex items-center justify-between w-full h-7 gap-6">
            <span class="body-lg text-on-background">深色模式</span>
            <Switch
              :model-value="isMounted && isDarkMode"
              @update:model-value="toggleDarkMode"
            />
          </div>
        </div>
      </section>

      <!-- Account Section -->
      <section class="flex flex-col gap-6">
        <h2 class="title-md-emphasis text-on-surface-variant">客服</h2>

        <div class="flex flex-col gap-6">
          <!-- Menu Items: 支援網頁、隱私權政策、服務條款（R06，開啟外部網頁） -->
          <a
            v-for="link in supportLinks"
            :key="link.href"
            :href="link.href"
            target="_blank"
            rel="noopener"
            class="flex items-center justify-between px-2 h-11 rounded-lg gap-1"
          >
            <span class="body-lg text-on-background">{{ link.label }}</span>
            <Icon
              name="material-symbols:chevron-right-rounded"
              size="20"
              class="text-on-background"
            />
          </a>

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

          <!-- Delete Account（只有登入的使用者才有帳號可刪） -->
          <div v-if="user" class="w-full lg:w-fit">
            <Buttons
              buttonStyle="Borderless"
              label="刪除帳號"
              :destructive="true"
              size="Large"
              labelType="Text"
              @click="showDeleteConfirmation = true"
            />
          </div>
        </div>
      </section>
    </div>

    <!-- Delete Account Confirmation Dialog -->
    <div
      v-if="showDeleteConfirmation"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm mb-0"
    >
      <div
        class="bg-surface-container-high p-6 rounded-2xl shadow-xl max-w-sm w-full mx-4 border border-outline-variant"
      >
        <h3 class="text-xl font-bold text-on-surface mb-2">確定要刪除帳號嗎？</h3>
        <p class="text-on-surface-variant mb-6">
          你的帳號、等級、訓練紀錄與徽章都會永久刪除，無法復原。
        </p>
        <p v-if="deleteError" class="text-error mb-4">{{ deleteError }}</p>
        <div class="flex justify-end space-x-3">
          <button
            class="px-4 py-2 text-on-surface-variant hover:text-on-surface hover:bg-on-surface/10 rounded-full transition"
            :disabled="isDeleting"
            @click="cancelDelete"
          >
            取消
          </button>
          <button
            class="px-4 py-2 bg-error text-on-error hover:bg-error-container hover:text-on-error-container rounded-full transition font-medium disabled:opacity-60"
            :disabled="isDeleting"
            @click="handleDeleteAccount"
          >
            {{ isDeleting ? "刪除中…" : "刪除" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAppSettings } from "~/composables/useAppSettings";
import { onMounted, ref } from "vue";

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

const supportLinks = [
  { label: "聯絡我們", href: SUPPORT_URL },
  { label: "隱私權政策", href: PRIVACY_URL },
  { label: "服務條款", href: TERMS_URL },
];

// The page is prerendered with default settings; show the saved values only after mount,
// otherwise hydration keeps the prerendered switch state (Vue does not patch class mismatches).
const isMounted = ref(false);

const showDeleteConfirmation = ref(false);
const isDeleting = ref(false);
const deleteError = ref("");

onMounted(() => {
  loadSettings();
  isMounted.value = true;
});

const cancelDelete = () => {
  showDeleteConfirmation.value = false;
  deleteError.value = "";
};

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

// R05：刪除帳號。伺服器端的 delete_my_account 只會刪除呼叫者自己的資料與帳號
const handleDeleteAccount = async () => {
  const userId = user.value?.sub;
  isDeleting.value = true;
  deleteError.value = "";
  try {
    const { error } = await supabase.rpc("delete_my_account");
    if (error) throw error;
    // 帳號已不存在，只清本機的 session，不再呼叫伺服器登出
    await supabase.auth.signOut({ scope: "local" });
    if (userId) persistence.clearPendingSessions(userId);
    await persistence.resetStats();
    setGuestMode(false);
    showDeleteConfirmation.value = false;
    router.push("/");
  } catch (e) {
    console.error("Delete account failed:", e);
    deleteError.value = "刪除失敗，請確認網路連線後再試一次。";
  } finally {
    isDeleting.value = false;
  }
};
</script>
