<template>
    <div class="flex flex-col min-h-safe-content px-4 py-12">
        <div class="flex-1 flex flex-col items-center justify-center space-y-4">
            <div class="space-y-4 w-full">
                <h2 class="headline-lg-emphasis text-on-surface-variant">準備好放鬆了嗎？</h2>
                <p class="headline-sm text-on-surface-variant">
                    請盡量在微光環境中使用
                </p>
            </div>
            <div class="w-full flex flex-col items-center space-y-4 pb-8">
                <Buttons buttonStyle="bordered-prominent" size="large" label="開始" @click="startGame" />
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
