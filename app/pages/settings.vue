<template>
    <div class="flex flex-col min-h-screen space-y-8 px-4 pb-24 text-inverse-on-surface">
        <ToolbarTop headline="設定" class="mt-[62px]">
            <template #left>
                <NuxtLink to="/prepare" class="p-2">
                    <Icon name="material-symbols:arrow-back-rounded" size="24" class="text-inverse-on-surface" />
                </NuxtLink>
            </template>
        </ToolbarTop>

        <!-- System & Environment -->
        <section>
            <h2 class="headline-sm font-bold text-white mb-6">系統與環境</h2>
            <div class="space-y-6">
                <Switch label="深色模式" v-model="params.isDarkMode" />
                <Switch label="通知" v-model="params.isNotificationsEnabled" />

                <div class="flex flex-wrap items-center gap-3">
                    <label class="label-md text-inverse-on-surface pl-1">白噪音</label>
                    <SelectButton label="海浪" :selected="params.whiteNoiseType === 'waves'"
                        @click="params.whiteNoiseType = 'waves'" />
                    <SelectButton label="森林" :selected="params.whiteNoiseType === 'forest'"
                        @click="params.whiteNoiseType = 'forest'" />
                    <SelectButton label="雨聲" :selected="params.whiteNoiseType === 'rain'"
                        @click="params.whiteNoiseType = 'rain'" />
                </div>
                <Slider label="螢幕亮度" :min="0" :max="100" :step="10" v-model="params.screenBrightness" />
                <Slider label="音量" :min="0" :max="100" :step="10" v-model="params.volume" />            </div>
        </section>

        <div class="h-px bg-white/10 my-4"></div>

        <!-- Visual Comfort -->
        <section>
            <h2 class="headline-sm font-bold text-white mb-6">視覺舒適度</h2>
            <div class="space-y-6">
                <Slider label="色溫調整" :min="0" :max="100" :step="10" v-model="params.colorTemperature" />
                                    <Slider label="字體大小" :min="0" :max="100" :step="10" v-model="params.fontSize" />            </div>
        </section>

        <div class="h-px bg-white/10 my-4"></div>

        <!-- Symbol Configuration -->
        <section>
            <h2 class="headline-sm font-bold text-white mb-6">蓋博符號配置</h2>
            <div class="space-y-6">
                <Slider label="符號對比" :min="0" :max="100" :step="10" v-model="params.symbolContrast" />
                                    <Slider label="符號大小" :min="10" :max="100" :step="5" v-model="params.symbolSize" />
                                    <Slider label="線條密度" :min="1" :max="20" :step="1" v-model="params.stripeDensity" />
                                    <Slider label="漂移速度" :min="0" :max="10" :step="1" v-model="params.driftSpeed" />            </div>
        </section>

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
import { watchEffect } from 'vue';

const { params } = useGaborMock();

// Sync slider values to Gabor params for preview
watchEffect(() => {
    params.contrast = params.symbolContrast / 100;
    params.sigma = params.symbolSize;
    // Map density 1-20 to frequency ~0.01-0.1
    // Density 10 (default) -> 0.05
    params.frequency = params.stripeDensity / 200;
});
</script>
