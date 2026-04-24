<template>
    <div class="flex-1 flex flex-col px-4 space-y-8 text-on-background overflow-y-auto">
        <!-- New iOS Style Toolbar -->
        <ToolbarTop headline="設定" type="navigation">
            <template #left>
                <NuxtLink to="/profile"
                    class="w-11 h-11 flex items-center justify-center rounded-full bg-white mix-blend-multiply transition-colors hover:bg-surface-variant">
                    <Icon name="material-symbols:arrow-back-ios-new-rounded" size="17" class="mix-blend-plus-darker" />
                </NuxtLink>
            </template>
        </ToolbarTop>

        <div class="flex flex-col space-y-6">
            <!-- Preferences Settings Section -->
            <section class="flex flex-col gap-6">
                <!-- Section Title: 偏好設定 (65px approx) -->
                <h2 class="title-md-emphasis text-on-surface-variant mix-blend-plus-darker">偏好設定</h2>

                <div class="flex flex-col gap-6 px-2">
                    <!-- Item: 聲音 -->
                    <div class="flex items-center justify-between w-full h-7 gap-6">
                        <span class="body-lg text-on-background">聲音</span>
                        <Switch :model-value="isSoundEnabled" @update:model-value="toggleSound" />
                    </div>
                    <!-- Item: 深色模式 -->
                    <div class="flex items-center justify-between w-full h-7 gap-6">
                        <span class="body-lg text-on-background">深色模式</span>
                        <Switch :model-value="isDarkMode" @update:model-value="toggleDarkMode" />
                    </div>

                    <!-- Item: 字體大小 (66px approx) -->
                    <div class="flex items-center justify-between w-full h-[52px]">
                        <span class="body-lg text-on-background flex-shrink-0">字體大小</span>
                        <!-- Slider Area -->
                        <div class="flex items-center gap-3 flex-1 px-4">
                            <span class="body-sm text-on-surface-variant">小</span>
                            <Slider class="flex-1" :min="12" :max="24" :step="3" v-model="params.fontSize" />
                            <span class="body-lg text-on-surface-variant">大</span>
                        </div>
                    </div>

                </div>
            </section>

            <!-- Account Section -->
            <section class="flex flex-col gap-6">
                <!-- Section Title: 客服 (33px approx) -->
                <h2 class="title-md-emphasis text-on-surface-variant mix-blend-plus-darker">客服</h2>

                <div class="flex flex-col gap-6">
                    <!-- Menu Item: 聯絡我們 -->
                    <div
                        class="flex items-center justify-between px-2 h-11 cursor-pointer hover:bg-black/5 transition-colors rounded-lg gap-[4px]">
                        <span class="body-lg text-on-background mix-blend-plus-darker">聯絡我們</span>
                        <Icon name="material-symbols:chevron-right-rounded" size="20"
                            class="text-on-background mix-blend-plus-darker" />
                    </div>

                    <!-- Logout Button -->
                    <Buttons buttonStyle="Bordered" label="登出" :destructive="true" size="Large" labelType="Text"
                        @click="handleLogout" />
                </div>
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useGaborMock } from '~/composables/useGaborMock';
import { useRouter } from 'vue-router';
import { useAppSettings } from '~/composables/useAppSettings';

const { params } = useGaborMock();
const router = useRouter();
const { isSoundEnabled, isDarkMode, toggleSound, toggleDarkMode, loadSettings } = useAppSettings();

onMounted(() => {
    loadSettings();
});

const handleLogout = () => {
    router.push('/');
};
</script>
