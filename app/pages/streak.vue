<template>
    <div class="flex flex-col min-h-screen px-6 py-8 text-center">
        <!-- Center Content -->
        <div class="flex-1 flex flex-col items-center justify-center space-y-12">
            <div class="space-y-2">
                <h2 class="headline-sm text-inverse-on-surface">今天，1月8日</h2>
                <h1 class="headline-lg text-inverse-on-surface">你已連續達成五天</h1>
            </div>

            <!-- Streak Dots -->
            <div class="flex items-center space-x-4">
                <div v-for="(day, index) in days" :key="day" class="flex flex-col items-center space-y-2">
                    <!-- Dot -->
                    <div class="w-4 h-4 rounded-full transition-all duration-300" :class="[
                        index <= 4 ? 'bg-inverse-on-surface shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'bg-[#d9d9d9]/5',
                        index === 4 ? 'scale-125' : ''
                    ]"></div>
                    <!-- Label -->
                    <span class="text-xs text-gray-600">{{ day }}</span>
                </div>
            </div>
        </div>

        <!-- Bottom Button -->
        <div class="w-full max-w-md mx-auto pb-[92px]">
            <NuxtLink to="/timer"
                class="w-full py-2 bg-primary text-on-primary rounded-full hover:bg-primary-container transition block font-bold">
                Next Step
            </NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">
const days = ['一', '二', '三', '四', '五', '六', '日'];
</script>
