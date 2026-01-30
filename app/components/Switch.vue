<template>
    <div class="flex items-center justify-between">
        <label v-if="label" class="label-md text-inverse-on-surface">{{ label }}</label>
        <button type="button" role="switch" :aria-checked="modelValue" @click="toggle"
            class="relative inline-flex h-8 w-[52px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
            :class="modelValue ? 'bg-[#695D40]' : 'bg-[#575858]'">
            <span class="sr-only">Use setting</span>
            <span aria-hidden="true"
                class="pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out mt-[0px]"
                :class="modelValue ? 'translate-x-5' : 'translate-x-0'" />
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
