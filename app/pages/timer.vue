<template>
    <div class="flex flex-col items-center min-h-safe-content py-6 px-4 text-center relative overflow-hidden isolate">
        <!-- Timer Display (Centered) -->
        <div class="flex-1 flex flex-col items-center justify-center w-full z-10">
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

        <!-- Skip Button (Bottom) -->
        <div class="relative z-10 mt-auto">
            <Buttons buttonStyle="Borderless" size="Medium" to="/completion" label="略過" />
        </div>

        <!-- Wave Animation (Horizontal) -->
        <div class="absolute bottom-0 inset-0 -z-10 pointer-events-none overflow-hidden">
            <img ref="wave1" src="~/assets/wav-1.svg" class="absolute w-[200%] bottom-0" />
            <img ref="wave2" src="~/assets/wav-2.svg" class="absolute w-[200%] bottom-0" />
            <img ref="wave3" src="~/assets/wav-3.svg" class="absolute w-[200%] bottom-0" />
            <img ref="wave4" src="~/assets/wav-4.svg" class="absolute w-[200%] bottom-0" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import gsap from 'gsap';


const router = useRouter();
const remainingSeconds = ref(30);
const wave1 = ref(null);
const wave2 = ref(null);
const wave3 = ref(null);
const wave4 = ref(null);

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

    // GSAP Wave Animation (Horizontal)
    // Randomize duration and delay for organic feel
    if (wave1.value) {
        gsap.to(wave1.value, {
            x: 100, // Move right
            duration: 60,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1
        });
    }
    if (wave2.value) {
        gsap.to(wave2.value, {
            x: -80, // Move left
            duration: 100,
            delay: 1,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1
        });
    }
    if (wave3.value) {
        gsap.to(wave3.value, {
            x: 120, // Move right
            duration: 200,
            delay: 2,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1
        });
    }
    if (wave4.value) {
        gsap.to(wave4.value, {
            x: -100, // Move left
            duration: 2000,
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
});
</script>
