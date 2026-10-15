<template>
    <div class="flex items-center justify-between">
        <label v-if="label" class="body-lg text-on-surface-variant">{{ label }}</label>
        <button type="button" role="switch" :aria-checked="modelValue" @click="toggle"
            class="relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none"
            :class="modelValue ? 'bg-primary border-primary' : 'bg-surface-container-highest border-outline'">
            <span class="sr-only">切換設定</span>
            <span aria-hidden="true"
                class="pointer-events-none inline-block h-6 w-6 transform rounded-full shadow-md ring-0 transition duration-200 ease-in-out"
                :class="modelValue ? 'translate-x-5 bg-surface' : 'translate-x-0 bg-outline'" />
        </button>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    modelValue: boolean;
    label?: string;
}>();

const emit = defineEmits(['update:modelValue']);

const toggle = () => {
    emit('update:modelValue', !props.modelValue);
};
</script>
