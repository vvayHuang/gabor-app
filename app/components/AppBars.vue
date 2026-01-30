<template>
    <div class="relative flex items-center justify-between w-full h-14 px-1 py-2 text-inverse-on-surface">
        <!-- Left Slot -->
        <div class="z-10 flex items-center h-full min-w-10">
            <slot name="left" v-if="showLeft">
                <!-- Default Left Content (optional, or empty) -->
            </slot>
        </div>

        <!-- Centered Headline -->
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
            <h1 class="title-lg pointer-events-auto">{{ headline }}</h1>
        </div>

        <!-- Right Slot -->
        <div class="z-10 flex items-center justify-end h-full min-w-10">
            <slot name="right" v-if="showRight">
                <!-- Default Right Content (optional, or empty) -->
            </slot>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps({
    headline: {
        type: String,
        required: true
    },
    showLeft: {
        type: Boolean,
        default: true
    },
    showRight: {
        type: Boolean,
        default: false
    }
})
</script>
