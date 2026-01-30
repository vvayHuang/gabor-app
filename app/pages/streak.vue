<template>
    <div class="flex flex-col min-h-screen px-4 py-8 text-center">
        <!-- Center Content -->
        <div class="flex-1 flex flex-col items-center justify-center space-y-12">
            <div class="space-y-2">
                <h2 class="headline-sm text-inverse-on-surface">今天，1月8日</h2>
                <h1 class="headline-lg text-inverse-on-surface">你已連續達成五天</h1>
            </div>

            <!-- Streak Dots -->
            <div class="flex items-center space-x-6">
                <div v-for="(day, index) in days" :key="day" class="relative flex flex-col items-center space-y-2">
                    <!-- Arrow -->
                    <Icon v-if="index === 3" name="material-symbols:arrow-drop-down-rounded" size="32"
                        class="absolute -top-7 text-inverse-on-surface" />
                    <!-- Label -->
                    <span class="body-lg text-inverse-on-surface">{{ day }}</span>
                    <!-- Dot -->
                    <div class="w-8 h-8 rounded-full transition-all duration-300" :class="[
                        index <= 3 ? 'bg-inverse-on-surface shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'bg-inverse-on-surface/5',
                        index === 3 ? 'scale-110' : ''
                    ]"></div>
                </div>
            </div>
        </div>

        <!-- Bottom Button -->
        <div class="w-full max-w-md mx-auto transition-opacity duration-1000"
            :class="showButton ? 'opacity-100' : 'opacity-0 pointer-events-none'">
            <Buttons variant="primary" to="/timer" label="下一步" />
        </div>
    </div>
</template>

<script setup lang="ts">
const days = ['一', '二', '三', '四', '五', '六', '日'];
const showButton = ref(false);

onMounted(() => {
    setTimeout(() => {
        showButton.value = true;
    }, 3000);
});
</script>
