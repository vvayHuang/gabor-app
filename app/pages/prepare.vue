<template>
    <div class="flex flex-col min-h-screen px-4 py-6 text-center">
        <!-- Center Content -->
        <div class="flex-1 flex flex-col items-center justify-center">
            <div class="space-y-4 max-w-md">
                <h2 class="display-sm-emphasis text-inverse-on-surface">準備好放鬆了嗎？</h2>
                <p class="headline-sm text-inverse-on-surface">
                    請盡量在微光環境中使用
                </p>
            </div>
        </div>

        <!-- Bottom Button -->
        <div class="w-full max-w-md mx-auto pb-[68px]">
            <Buttons variant="primary" label="進入訓練" @click="startGame" />
            <p class="text-sm text-inverse-on-surface mt-2">上次訓練時間 : 15分</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';


const router = useRouter();

const startGame = () => {
    router.push('/task/grid');
};
</script>
