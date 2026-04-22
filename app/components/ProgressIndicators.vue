<template>
    <div class="flex items-center">
        <!-- Progress Track -->
        <div class="relative h-[6px] bg-surface-dim rounded-full overflow-hidden w-full">
            <!-- Progress Fill -->
            <div ref="progressFill" class="absolute top-0 left-0 h-full bg-primary rounded-full"
                :style="{ width: `${initialPercentage}%` }">
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { gsap } from 'gsap';

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

const progressFill = ref<HTMLElement | null>(null);

// Calculate percentage for initial mount or state resets
const getPercentage = () => {
    if (props.total <= 0) return 0;
    return Math.min(100, Math.max(0, (props.current / props.total) * 100));
};

const initialPercentage = getPercentage();

// Use GSAP to animate the width when current changes
watch(() => props.current, (newVal) => {
    if (progressFill.value) {
        const targetPercent = (newVal / props.total) * 100;
        gsap.to(progressFill.value, {
            width: `${targetPercent}%`,
            duration: 0.6,
            ease: 'power2.out',
            overwrite: true
        });
    }
});

onMounted(() => {
    // Ensure initial sync
    if (progressFill.value) {
        gsap.set(progressFill.value, {
            width: `${getPercentage()}%`
        });
    }
});
</script>
