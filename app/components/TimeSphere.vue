<template>
    <div class="relative flex items-center justify-center w-75 h-75 my-6">
        <!-- SVG Filter for Noise -->
        <svg class="absolute w-0 h-0 pointer-events-none">
            <filter id="sphereNoise">
                <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                <feColorMatrix type="saturate" values="0" />
                <feComponentTransfer>
                    <feFuncA type="linear" slope="0.15" />
                </feComponentTransfer>
            </filter>
        </svg>

        <!-- Sphere with radial gradient -->
        <div class="sphere-container w-full h-full rounded-full shadow-2xl relative overflow-hidden">
            <!-- Noise Overlay -->
            <div class="absolute inset-0 noise-overlay pointer-events-none"></div>

            <!-- Content -->
            <div class="flex flex-col items-center justify-center w-full h-full z-10 relative">
                <span class="display-lg-emphasis text-on-surface">{{ formattedTime }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    elapsedSeconds: number;
}>();

const formattedTime = computed(() => {
    const totalSeconds = Math.floor(props.elapsedSeconds);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});
</script>

<style scoped>
.sphere-container {
    background: radial-gradient(circle at 20% 15%,
            rgba(255, 255, 255, 1) 0%,
            rgba(255, 255, 255, 0.3) 60%,
            rgba(255, 255, 255, 0.05) 100%);
    position: relative;
    box-shadow:
        inset -15px -15px 40px rgba(0, 0, 0, 0.25),
        inset 10px 10px 30px rgba(255, 255, 255, 0.4),
        0 20px 50px rgba(0, 0, 0, 0.3);
}

.noise-overlay {
    background: white;
    filter: url(#sphereNoise);
    mix-blend-mode: overlay;
    opacity: 0.8;
}

.sphere-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    pointer-events: none;
}
</style>
