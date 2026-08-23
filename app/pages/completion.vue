<template>
    <div class="flex-1 flex flex-col justify-between px-4">
        <!-- Center Content -->
        <div class="flex-1 flex flex-col items-start md:items-center justify-center w-full max-w-2xl mx-auto px-4">
            <div class="text-left md:text-center w-full">
                <h1 class="headline-md-emphasis text-on-surface">{{ greetingTitle }}</h1>
            </div>
        </div>

        <!-- Bottom Buttons (Consistent Bottom Area) -->
        <div class="w-full max-w-md md:max-w-2xl mx-auto px-0 md:px-6 pb-[calc(16px+env(safe-area-inset-bottom))]">
            <div class="flex space-x-4">
                <Buttons buttonStyle="Bordered" size="Large" to="/records" label="紀錄" class="flex-1" />
                <Buttons buttonStyle="Bordered" size="Large" to="/prepare" label="回首頁" class="flex-1" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const greetingTitle = computed(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
        return '早安，今天也要保持專注';
    } else if (hour >= 12 && hour < 18) {
        return '午安，記得休息一下眼睛';
    } else {
        return '晚安，祝你好夢';
    }
});
</script>
