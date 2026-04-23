<template>
    <div class="flex-1 flex flex-col px-4 space-y-8">
        <div class="flex-1 flex flex-col items-center justify-center pt-8 space-y-12">
            <div class="space-y-4 w-full">
                <h2 class="headline-lg-emphasis text-on-surface-variant">準備好放鬆了嗎？</h2>
                <p class="headline-sm text-on-surface-variant">
                    請盡量在微光環境中使用
                </p>
            </div>

            <div class="w-full max-w-md mx-auto pb-[calc(16px+env(safe-area-inset-bottom))]">
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
