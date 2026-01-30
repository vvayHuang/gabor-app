<template>
    <div
        class="min-h-screen bg-inverse-surface text-on-inverse-surface antialiased overflow-x-hidden selection:bg-gray-700 selection:text-white relative">
        <!-- Global Background Noise -->
        <div class="fixed inset-0 pointer-events-none z-0">
            <svg class="w-full h-full opacity-[0.03] grayscale">
                <filter id="noiseFilter">
                    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
                </filter>
                <filter id="waveNoise">
                    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
                    <feColorMatrix type="saturate" values="0" />
                    <feComposite operator="in" in2="SourceGraphic" result="compositeNoise" />
                    <feBlend mode="overlay" in="compositeNoise" in2="SourceGraphic" />
                </filter>
                <rect width="100%" height="100%" filter="url(#noiseFilter)" />
            </svg>
        </div>
        <!-- Main Content Area with safe area padding -->
        <!-- Added pb-20 to ensure content isn't hidden behind bottom nav -->
        <main class="w-full min-h-screen transition-all duration-300">
            <slot />
        </main>

        <!-- Bottom Navigation -->
        <transition enter-active-class="transition ease-out duration-300"
            enter-from-class="transform translate-y-full opacity-0" enter-to-class="transform translate-y-0 opacity-100"
            leave-active-class="transition ease-in duration-200" leave-from-class="transform translate-y-0 opacity-100"
            leave-to-class="transform translate-y-full opacity-0">
            <NavigationBar v-if="showNavigationBar" />
        </transition>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const showNavigationBar = computed(() => {
    // Immersive pages:
    const immersivePages = [
        'index',
        'login',
        'task-grid',
        'timer',
        'completion',
        'progress',
        'streak',
        'records',
        'profile',
        'settings',
        'daily-goal'
    ];

    return !immersivePages.includes(route.name as string);
});
</script>
