<template>
    <div class="flex flex-col space-y-2">
        <div class="flex justify-between items-center">
            <label class="text-sm font-medium text-gray-300">{{ label }}</label>
            <span class="text-sm font-mono text-gray-400">{{ modelValue }}</span>
        </div>
        <input type="range" :min="min" :max="max" :step="step" :value="modelValue"
            @input="$emit('update:modelValue', Number(($event.target as HTMLInputElement).value))"
            class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-white" />
    </div>
</template>

<script setup lang="ts">
defineProps<{
    label: string;
    min: number;
    max: number;
    step?: number;
    modelValue: number;
}>();

defineEmits(['update:modelValue']);
</script>
