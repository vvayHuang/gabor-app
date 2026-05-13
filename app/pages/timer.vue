<template>
    <div class="flex-1 flex flex-col items-center px-4 text-center relative overflow-hidden isolate">
        <!-- Start Overlay (To bypass autoplay restriction) -->
        <div v-if="!isStarted"
            class="absolute inset-0 z-50 flex flex-col items-center justify-center bg-surface/80 backdrop-blur-md transition-opacity duration-500">
            <div class="space-y-6 px-6">
                <h2 class="headline-md text-on-surface">準備好進入放鬆時刻？</h2>
                <p class="body-large text-on-surface-variant">點擊按鈕開啟海浪音效</p>
                <Buttons buttonStyle="Bordered - Secondary" size="Large" label="開始放鬆" @click="handleStart" />
            </div>
        </div>

        <!-- Timer Display (Centered) -->
        <div class="flex-1 flex flex-col items-center justify-center w-full pt-8 z-10 transition-opacity duration-1000"
            :class="isStarted ? 'opacity-100' : 'opacity-0'">
            <div class="mb-12 space-y-4 font-light">
                <div class="display-lg text-primary">
                    {{ remainingSeconds.toString().padStart(2, '0') }}
                </div>
                <h2 class="headline-sm-emphasis text-on-surface">做得好，現在請閉上眼睛</h2>
                <p class="body-lg text-on-surface-variant">
                    聽著浪聲，感受眼部肌肉的鬆弛。倒數結束後，我們夢裡見
                </p>
            </div>
        </div>

        <!-- Skip Button (Bottom Area) -->
        <div class="w-full max-w-md mx-auto z-10 px-4 pb-[calc(16px+env(safe-area-inset-bottom))]">
            <Buttons buttonStyle="Borderless" size="Medium" to="/completion" label="略過" />
        </div>

        <!-- Wave Animation (Generative Tidal Waves) -->
        <div class="absolute inset-0 -z-10 pointer-events-none">
            <TidalWaves />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAudio } from '~/composables/useAudio';


const router = useRouter();
const { startSeaWaves, stopAmbient } = useAudio();

const remainingSeconds = ref(30);
const isStarted = ref(false);

let countdownInterval: NodeJS.Timeout | null = null;

const handleStart = () => {
    isStarted.value = true;
    startSeaWaves();

    countdownInterval = setInterval(() => {
        if (remainingSeconds.value > 0) {
            remainingSeconds.value--;
        } else {
            if (countdownInterval) clearInterval(countdownInterval);
            router.push('/completion');
        }
    }, 1000);
};

onMounted(() => {
    // 移除了自動播放 startSeaWaves，改由 handleStart 觸發
});

onUnmounted(() => {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    stopAmbient();
});
</script>
