<template>
    <button type="button" :class="[
        'flex items-center justify-center rounded-full transition-colors',
        sizeClasses,
        colorClass || 'text-inverse-on-surface'
    ]" v-bind="$attrs">
        <Icon :name="icon" :size="iconSize" :class="[hoverClass]" />
    </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
    icon: {
        type: String,
        required: true
    },
    // base size of the button container
    size: {
        type: String,
        default: 'medium', // x-small, small, medium, large
        validator: (val: string) => ['x-small', 'small', 'medium', 'large'].includes(val)
    },
    // icon size string (pixel value usually)
    iconSize: {
        type: String,
        default: '24'
    },
    colorClass: {
        type: String,
        default: 'text-inverse-on-surface'
    },
    hoverClass: {
        type: String,
        default: 'group-hover:text-white'
    }
});

const sizeClasses = computed(() => {
    switch (props.size) {
        case 'x-small': return 'w-7 h-7 p-1';
        case 'small': return 'w-8 h-8 p-1';
        case 'large': return 'w-14 h-14 p-3';
        default: return 'w-12 h-12 p-2'; // medium
    }
});
</script>
