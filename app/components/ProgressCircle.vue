<template>
    <div class="relative flex items-center justify-center w-60 h-60 rounded-full bg-gray-900 shadow-2xl">
        <!-- Background Circle -->
        <svg class="absolute top-0 left-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="6" class="text-gray-800" />
            <!-- Progress Circle -->
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="6"
                class="text-gray-200 transition-all duration-1000 ease-out" :stroke-dasharray="dashArray"
                :stroke-dashoffset="dashOffset" stroke-linecap="round" />
        </svg>

        <!-- Content -->
        <div class="flex flex-col items-center z-10">
            <span class="text-5xl font-bold font-mono text-white tracking-widest">{{ value }}%</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    value: number;
}>();

const radius = 45;
const circumference = 2 * Math.PI * radius;
const dashArray = circumference;
const dashOffset = computed(() => {
    return circumference - (Math.max(0, Math.min(100, props.value)) / 100) * circumference;
});
</script>
