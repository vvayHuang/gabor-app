<template>
    <div class="flex justify-between space-y-7">
        <div class="flex justify-between items-center w-[77px]">
            <label class="label-md text-inverse-on-surface pl-1">{{ label }}</label>
        </div>
        <div class="flex justify-between items-center bg-[#5F5B4B] h-4 rounded-full relative select-none cursor-pointer w-full max-w-[267px]"
            ref="trackRef" @mousedown="startDrag" @touchstart="startDrag">
            <!-- Dots -->
            <div class="absolute inset-0 flex justify-between items-center px-[6px]">
                <div v-for="tick in ticks" :key="tick" class="w-1.5 h-1.5 rounded-full"
                    :class="tick <= modelValue ? 'bg-[#EAE1D9]' : 'bg-[#989280]'">
                </div>
            </div>

            <!-- Handle -->
            <div class="absolute top-1/2 -translate-y-1/2 w-1 h-11 bg-[#756F5B] rounded-full shadow-sm transition-all duration-75 ease-out pointer-events-none"
                :style="{ left: `calc(${percentage}% - 3px)` }">
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
    label: string;
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
    event.preventDefault(); // Prevent text selection/scrolling

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
