<template>
    <div class="flex-1 flex flex-col items-center px-4 space-y-8 text-center relative overflow-hidden isolate">
        <!-- Timer Display (Centered) -->
        <div class="flex-1 flex flex-col items-center justify-center w-full pt-8 z-10">
            <div class="mb-12 space-y-4 font-light">
                <div class="display-lg text-inverse-on-surface">
                    {{ remainingSeconds.toString().padStart(2, '0') }}
                </div>
                <h2 class="headline-sm-emphasis text-inverse-on-surface">做得好，現在請閉上眼睛</h2>
                <p class="body-lg">
                    聽著浪聲，感受眼部肌肉的鬆弛。倒數結束後，我們夢裡見
                </p>
            </div>
        </div>

        <!-- Skip Button (Bottom Area) -->
        <div class="w-full max-w-md mx-auto z-10 px-4 pb-[calc(16px+env(safe-area-inset-bottom))]">
            <Buttons buttonStyle="Borderless" size="Medium" to="/completion" label="略過" />
        </div>

        <!-- Wave Animation (Horizontal) -->
        <div class="absolute bottom-0 inset-0 -z-10 pointer-events-none overflow-hidden">
            <!-- 調整：確保圖片寬度足夠且初始置中，並稍微放大以提供緩衝 -->
            <img ref="wave1" src="~/assets/wav-1.svg" class="absolute w-[300%] bottom-0 left-1/2 -translate-x-1/2 scale-110" />
            <img ref="wave2" src="~/assets/wav-2.svg" class="absolute w-[300%] bottom-0 left-1/2 -translate-x-1/2 scale-110" />
            <img ref="wave3" src="~/assets/wav-3.svg" class="absolute w-[300%] bottom-0 left-1/2 -translate-x-1/2 scale-110" />
            <img ref="wave4" src="~/assets/wav-4.svg" class="absolute w-[300%] bottom-0 left-1/2 -translate-x-1/2 scale-110" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import gsap from 'gsap';
import { useAudio } from '~/composables/useAudio';


const router = useRouter();
const { startSeaWaves, stopAmbient } = useAudio();

const remainingSeconds = ref(30);
const wave1 = ref(null);
const wave2 = ref(null);
const wave3 = ref(null);
const wave4 = ref(null);

let countdownInterval: NodeJS.Timeout | null = null;

onMounted(() => {
    startSeaWaves();

    countdownInterval = setInterval(() => {
        if (remainingSeconds.value > 0) {
            remainingSeconds.value--;
        } else {
            if (countdownInterval) clearInterval(countdownInterval);
            router.push('/completion');
        }
    }, 1000);

    // GSAP Wave Animation (使用 xPercent 替代實體 x 以獲得更好的響應式支援)
    if (wave1.value) {
        gsap.to(wave1.value, {
            xPercent: 10, // 向右微移
            duration: 40,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1
        });
    }
    if (wave2.value) {
        gsap.to(wave2.value, {
            xPercent: -12, // 向左微移
            duration: 50,
            delay: 1,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1
        });
    }
    if (wave3.value) {
        gsap.to(wave3.value, {
            xPercent: 8, // 向右微移
            duration: 60,
            delay: 2,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1
        });
    }
    if (wave4.value) {
        gsap.to(wave4.value, {
            xPercent: -15, // 向左微移
            duration: 80,
            delay: 0.5,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1
        });
    }
});

onUnmounted(() => {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    stopAmbient();
});
</script>
