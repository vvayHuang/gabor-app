<template>
    <div class="flex flex-col items-center justify-center min-h-screen space-y-16 bg-black px-6">
        <div class="text-center space-y-2">
            <h2 class="text-sm tracking-widest text-gray-400 uppercase">Consistency</h2>
            <h1 class="text-3xl font-bold text-white">本週連續達成五天</h1>
        </div>

        <!-- Streak Dots -->
        <div class="flex items-center space-x-4">
            <div v-for="(day, index) in days" :key="day" class="flex flex-col items-center space-y-2">
                <!-- Dot -->
                <div class="w-4 h-4 rounded-full transition-all duration-300" :class="[
                    index <= 4 ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'bg-gray-800',
                    index === 4 ? 'scale-125' : ''
                ]"></div>
                <!-- Label -->
                <span class="text-xs font-mono text-gray-600">{{ day }}</span>
            </div>
        </div>

        <NuxtLink to="/timer"
            class="px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition">
            Next Step
        </NuxtLink>
    </div>
</template>

<script setup lang="ts">
const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
</script>
