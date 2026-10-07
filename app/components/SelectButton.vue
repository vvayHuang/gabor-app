<template>
    <button type="button" @click="onClick" class="px-6 py-2 rounded-full border transition-all duration-200 label-lg"
        :class="[
            selected
                ? 'bg-primary border-primary text-on-primary'
                : 'bg-transparent border-gray-300 text-gray-400 hover:border-gray-400'
        ]">
        {{ label }}
    </button>
</template>

<script setup lang="ts">
const props = defineProps<{
    selected: boolean;
    label: string;
}>();

const emit = defineEmits(['click']);

const onClick = () => {
    emit('click');
};
</script>
