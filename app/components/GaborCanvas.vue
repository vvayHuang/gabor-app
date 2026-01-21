<template>
    <div class="overflow-hidden rounded-full relative bg-gray-800 flex items-center justify-center border border-white/10"
        :style="{ width: size + 'px', height: size + 'px' }">
        <div class="text-white/20 text-sm">Gabor Preview</div>

        <!-- CSS-only static visualization to look nice without performance cost -->
        <div class="absolute inset-0 opacity-20"
            style="background: repeating-linear-gradient(45deg, transparent, transparent 10px, #ffffff 10px, #ffffff 20px);">
        </div>
    </div>
</template>

<script setup lang="ts">
/* 
 * TEMPORARY: P5.js implementation removed to debug page freeze.
 * Rendering a static placeholder for layout verification.
 */

withDefaults(defineProps<{
    size?: number;
    params?: any;
}>(), {
    size: 200,
    params: () => ({})
});
</script>
