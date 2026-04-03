<template>
    <div class="flex flex-col w-full gap-2">
        <label v-if="label" class="body-lg text-on-surface-variant">{{ label }}</label>
        <div class="flex items-center h-10 w-full relative select-none cursor-pointer"
            ref="trackRef" @mousedown="startDrag" @touchstart="startDrag">
            
            <!-- Track Background -->
            <div class="w-full h-1.5 bg-surface-variant rounded-full relative overflow-hidden">
                <!-- Active Fill -->
                <div class="absolute left-0 top-0 h-full bg-primary rounded-full transition-all duration-75"
                    :style="{ width: `${percentage}%` }">
                </div>
            </div>

            <!-- Ticks (Optional dots) -->
            <div class="absolute left-0 right-0 h-full flex justify-between items-center px-[2px] pointer-events-none">
                <div v-for="tick in ticks" :key="tick" 
                    class="w-1 h-1 rounded-full transition-colors"
                    :class="tick <= modelValue ? 'bg-surface/40' : 'bg-on-surface-variant/20'">
                </div>
            </div>

            <!-- Knob (Handle) -->
            <div class="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-surface border-2 border-primary rounded-full shadow-lg transition-all duration-75 ease-out pointer-events-none"
                :style="{ left: `calc(${percentage}% - 12px)` }">
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = withDefaults(defineProps<{
    label?: string;
    min?: number;
    max?: number;
    step?: number;
    modelValue: number;
}>(), {
    min: 0,
    max: 100,
    step: 10
});

const emit = defineEmits(['update:modelValue']);

const trackRef = ref<HTMLElement | null>(null);

const ticks = computed(() => {
    const count = Math.floor((props.max - props.min) / props.step) + 1;
    return Array.from({ length: count }, (_, i) => props.min + (i * props.step));
});

const percentage = computed(() => {
    return ((props.modelValue - props.min) / (props.max - props.min)) * 100;
});

const updateValue = (clientX: number) => {
    if (!trackRef.value) return;

    const rect = trackRef.value.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = x / rect.width;

    let rawValue = props.min + (percent * (props.max - props.min));

    // Snap to step
    const remainder = rawValue % props.step;
    if (remainder >= props.step / 2) {
        rawValue += props.step - remainder;
    } else {
        rawValue -= remainder;
    }

    // Clamp
    const newValue = Math.max(props.min, Math.min(props.max, rawValue));

    if (newValue !== props.modelValue) {
        emit('update:modelValue', newValue);
    }
};

const startDrag = (event: MouseEvent | TouchEvent) => {
    event.preventDefault();

    let clientX: number;
    if ('touches' in event) {
        clientX = event.touches[0].clientX;
    } else {
        clientX = event.clientX;
    }
    updateValue(clientX);

    const onMove = (e: MouseEvent | TouchEvent) => {
        let moveX: number;
        if ('touches' in e) {
            moveX = e.touches[0].clientX;
        } else {
            moveX = (e as MouseEvent).clientX;
        }
        updateValue(moveX);
    };

    const onEnd = () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('touchmove', onMove);
        window.removeEventListener('mouseup', onEnd);
        window.removeEventListener('touchend', onEnd);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchend', onEnd);
};
</script>
