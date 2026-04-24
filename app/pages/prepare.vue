<template>
    <div class="flex-1 flex flex-col px-4 bg-background overflow-hidden relative">
        <!-- Top Calibration Tip (Minimal Style) -->
        <div class="pt-4 flex items-center justify-center">
            <div class="flex items-center space-x-2 bg-on-surface/[0.03] px-4 py-2 rounded-full border border-on-surface/[0.05]">
                <Icon name="material-symbols:wb-sunny-outline" size="16" class="text-on-surface/40" />
                <span class="text-[11px] font-medium text-on-surface/50 tracking-wide uppercase">
                    建議亮度 80% • 距離 30cm
                </span>
            </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1 flex flex-col items-center justify-center space-y-12">
            <!-- Text Content -->
            <div class="space-y-4 w-full">
                <h2 class="headline-lg-emphasis text-on-surface-variant">準備好放鬆了嗎？</h2>
                <p class="headline-sm text-on-surface-variant">
                    請盡量在微光環境中使用
                </p>
            </div>

            <!-- Action Button -->
            <div class="w-full max-w-md mx-auto">
                <Buttons buttonStyle="Bordered - Prominent" size="Large" label="開始" @click="startGame" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const startGame = () => {
    router.push('/task/game-grid');
};
</script>
