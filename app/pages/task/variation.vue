<template>
    <div class="flex flex-col items-center justify-center min-h-screen p-4 space-y-8">
        <!-- Header -->
        <div class="fixed top-[62px] left-0 w-full p-6 flex justify-between items-center z-10">
            <button class="text-gray-500 hover:text-white" @click="router.push('/prepare')">
                <Icon name="material-symbols:close" size="24" />
            </button>
            <span class="text-gray-500 text-sm tracking-widest">SESSION 2/5</span>
        </div>

        <!-- Grid 3x3 -->
        <div class="grid grid-cols-3 gap-3 w-full max-w-sm aspect-square">
            <div v-for="i in 9" :key="i" class="relative group flex items-center justify-center cursor-pointer"
                @click="handleInteraction">
                <div
                    class="absolute inset-0 border-2 border-transparent group-hover:border-gray-600 rounded-xl transition-colors pointer-events-none z-10">
                </div>
                <GaborCanvas :size="80" :params="getParams(i)" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useGaborMock } from '~/composables/useGaborMock';

const router = useRouter();
const { params } = useGaborMock();

const getParams = (index: number) => {
    // Make one different
    if (index === 5) {
        return { ...params, orientation: 90, frequency: 0.07, contrast: 1 };
    }
    return { ...params, orientation: 0, frequency: 0.05, contrast: 0.5 };
}

const handleInteraction = () => {
    router.push('/progress');
}
</script>
