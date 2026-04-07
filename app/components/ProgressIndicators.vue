<template>
    <div class="flex items-center">
        <!-- Progress Track -->
        <div class="relative h-[6px] bg-surface-dim rounded-full overflow-hidden w-full">
            <!-- Progress Fill -->
            <div class="absolute top-0 left-0 h-full bg-primary transition-all duration-300 ease-out rounded-full"
                :style="{ width: `${percentage}%` }">
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
    current: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        default: 5
    }
});

const percentage = computed(() => {
    if (props.total <= 0) return 0;
    return Math.min(100, Math.max(0, (props.current / props.total) * 100));
});
</script>
