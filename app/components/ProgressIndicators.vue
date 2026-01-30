<template>
    <div class="flex items-center space-x-2">
        <!-- Progress Track -->
        <div class="relative h-2 bg-on-surface-variant/30 rounded-full overflow-hidden" :style="{ width: width }">
            <!-- Progress Fill -->
            <div class="absolute top-0 left-0 h-full bg-primary transition-all duration-300 ease-out"
                :style="{ width: `${percentage}%` }">
            </div>
        </div>
        <!-- Optional Text Label (if needed later, but design shows just bar usually or implied) -->
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
        default: 5 // Default based on wireframe "SESSION 1/5"
    },
    width: {
        type: String,
        default: '120px'
    }
});

const percentage = computed(() => {
    if (props.total <= 0) return 0;
    return Math.min(100, Math.max(0, (props.current / props.total) * 100));
});
</script>
