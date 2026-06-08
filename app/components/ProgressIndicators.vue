<template>
    <div class="flex items-center">
        <!-- Progress Track -->
        <div class="relative h-[6px] bg-surface-dim rounded-full overflow-hidden w-full">
            <!-- Progress Fill -->
            <div ref="progressFill" class="absolute top-0 left-0 h-full bg-primary rounded-full w-0">
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

const getPercentage = () => {
    if (props.total <= 0) return 0;
    return Math.min(100, Math.max(0, (props.current / props.total) * 100));
};

watch(() => [props.current, props.total], () => {
    if (progressFill.value) {
        gsap.to(progressFill.value, {
            width: `${getPercentage()}%`,
            duration: 0.6,
            ease: 'power2.out',
            overwrite: true
        });
    }
}, { flush: 'post' });

onMounted(() => {
    if (progressFill.value) {
        gsap.set(progressFill.value, {
            width: `${getPercentage()}%`
        });
    }
});
</script>
