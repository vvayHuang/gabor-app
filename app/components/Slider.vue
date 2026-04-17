<template>
    <div class="flex flex-col w-full gap-2">
        <label v-if="label" class="body-lg text-on-surface-variant">{{ label }}</label>
        <div class="flex flex-col justify-center h-12 w-full relative select-none cursor-pointer" ref="trackRef"
            @mousedown="startDrag" @touchstart="startDrag">

            <div class="relative w-full">
                <!-- Track Background -->
                <div class="w-full h-1.5 bg-surface-variant rounded-full relative overflow-hidden">
                    <!-- Active Fill -->
                    <div class="absolute left-0 top-0 h-full bg-primary rounded-full transition-all duration-75"
                        :style="{ width: `${percentage}%` }">
                    </div>
                </div>

                <!-- Ticks (Dots) - Positioned below the track, aligned with knob centers -->
                <div
                    class="absolute top-[12px] left-[19px] right-[19px] flex justify-between items-center pointer-events-none -translate-y-1/2">
                    <div v-for="tick in ticks" :key="tick" class="w-1 h-1 rounded-full transition-colors"
                        :class="tick <= modelValue ? 'bg-on-surface-variant/40' : 'bg-on-surface-variant/20'">
                    </div>
                </div>

                <!-- Knob (Handle) - Align edges at 0% and 100% -->
                <div class="absolute top-1/2 w-[38px] h-6 bg-white rounded-full shadow-[0px_0.5px_4px_0px_rgba(0,0,0,0.12),0px_6px_13px_0px_rgba(0,0,0,0.12)] border border-black/5 transition-all duration-75 ease-out pointer-events-none"
                    :style="{
                        left: `${percentage}%`,
                        transform: `translate(-${percentage}%, -50%)`
                    }">
                </div>
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
    const p = ((props.modelValue - props.min) / (props.max - props.min)) * 100;
    return Math.max(0, Math.min(100, p));
});

const updateValue = (clientX: number) => {
    if (!trackRef.value) return;

    const rect = trackRef.value.getBoundingClientRect();
    // Use full width for percentage mapping so knob edges align with container edges
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = x / rect.width;

    let rawValue = props.min + (percent * (props.max - props.min));

    // Snap to step
    const remainder = (rawValue - props.min) % props.step;
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
