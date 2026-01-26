<template>
    <div class="flex flex-col items-center justify-center min-h-screen p-8 text-center relative overflow-hidden">
        <!-- Timer Display -->
        <div class="mb-12 space-y-4 font-light relative z-10">
            <h2 class="text-3xl text-inverse-on-surface">休息時間</h2>
            <div class="text-8xl text-primary font-mono tabular-nums leading-none tracking-tight">
                00:{{ remainingSeconds.toString().padStart(2, '0') }}
            </div>
            <p class="text-on-surface-variant text-lg">
                聽著浪聲，感受眼部肌肉的鬆弛。<br>倒數結束後，我們夢裡見
            </p>
        </div>

        <!-- Skip Button -->
        <div class="relative z-10">
            <GaborButton variant="ghost" to="/completion" label="略過"
                class="text-on-surface-variant hover:text-on-surface hover:bg-white/5" />
        </div>

        <!-- Wave Animation Background -->
        <div class="fixed inset-0 -z-10 opacity-30 pointer-events-none">
            <div ref="waveContainer" class="w-full h-full blur-2xl"></div>
        </div>

        <!-- Background Noise -->
        <div class="fixed inset-0 -z-20 opacity-[0.03] pointer-events-none">
            <svg width="100%" height="100%">
                <filter id="noise">
                    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" />
                </filter>
                <rect width="100%" height="100%" filter="url(#noise)" />
            </svg>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import GaborButton from '~/components/GaborButton.vue';

const router = useRouter();
const waveContainer = ref<HTMLElement | null>(null);
const remainingSeconds = ref(30);

// Countdown timer
let countdownInterval: NodeJS.Timeout | null = null;

onMounted(() => {
    // Start countdown
    countdownInterval = setInterval(() => {
        if (remainingSeconds.value > 0) {
            remainingSeconds.value--;
        } else {
            if (countdownInterval) clearInterval(countdownInterval);
            router.push('/completion');
        }
    }, 1000);

    // Simple wave animation using CSS
    if (waveContainer.value) {
        waveContainer.value.innerHTML = `
            <div class="absolute bottom-0 left-0 w-full h-[40vh] bg-gradient-to-t from-primary/40 to-transparent animate-wave"></div>
            <div class="absolute bottom-0 left-0 w-full h-[35vh] bg-gradient-to-t from-primary/30 to-transparent animate-wave-delayed"></div>
            <div class="absolute bottom-0 left-0 w-full h-[30vh] bg-gradient-to-t from-primary/20 to-transparent animate-wave-slow"></div>
        `;
    }
});

onUnmounted(() => {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
});
</script>

<style scoped>
@keyframes wave {

    0%,
    100% {
        transform: translateY(0) scaleY(1);
    }

    50% {
        transform: translateY(-30px) scaleY(1.1);
    }
}

@keyframes wave-delayed {

    0%,
    100% {
        transform: translateY(0) scaleY(1);
    }

    50% {
        transform: translateY(-25px) scaleY(1.05);
    }
}

@keyframes wave-slow {

    0%,
    100% {
        transform: translateY(0) scaleY(1);
    }

    50% {
        transform: translateY(-15px) scaleY(1.02);
    }
}

.animate-wave {
    animation: wave 5s ease-in-out infinite;
}

.animate-wave-delayed {
    animation: wave-delayed 6s ease-in-out infinite;
    animation-delay: 1s;
}

.animate-wave-slow {
    animation: wave-slow 8s ease-in-out infinite;
    animation-delay: 2s;
}
</style>
