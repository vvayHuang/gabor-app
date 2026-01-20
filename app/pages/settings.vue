<template>
    <div class="flex flex-col min-h-screen space-y-8 px-4 pb-24 text-inverse-on-surface">
        <AppBar headline="設定" class="mt-[62px]">
            <template #left>
                <NuxtLink to="/prepare" class="p-2">
                    <Icon name="material-symbols:arrow-back-rounded" size="24" class="text-inverse-on-surface" />
                </NuxtLink>
            </template>
        </AppBar>
        <h2 class="text-lg font-bold text-white mb-4">偏好設置</h2>
        <div class="space-y-6">
            <!-- Use params from useGaborMock -->

            <!-- Symbol Contrast -->
            <WireSlider label="符號對比" :min="0" :max="100" :step="10" v-model="params.symbolContrast" />

            <!-- Color Temperature -->
            <WireSlider label="色溫調整" :min="0" :max="100" :step="10" v-model="params.colorTemperature" />

            <!-- Font Size -->
            <WireSlider label="字體大小" :min="0" :max="100" :step="10" v-model="params.fontSize" />

            <!-- Screen Brightness -->
            <WireSlider label="螢幕亮度" :min="0" :max="100" :step="10" v-model="params.screenBrightness" />

            <!-- Volume -->
            <WireSlider label="音量" :min="0" :max="100" :step="10" v-model="params.volume" />
        </div>

        <div class="mt-8">
            <h2 class="text-lg font-bold text-white mb-4">預覽</h2>
            <div class="flex justify-center border border-gray-800 rounded-xl p-4 bg-gray-900">
                <GaborCanvas :size="200" :params="params" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useGaborMock } from '~/composables/useGaborMock';

const { params } = useGaborMock();
</script>
