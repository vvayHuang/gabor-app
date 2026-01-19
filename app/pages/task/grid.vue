<template>
    <div class="flex flex-col items-center justify-center min-h-screen p-4 space-y-8 bg-black">
        <!-- Header/Instruction -->
        <div
            class="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-10 bg-gradient-to-b from-black to-transparent">
            <button class="text-gray-500 hover:text-white" @click="router.push('/prepare')">
                <Icon name="material-symbols:close" class="text-2xl" />
            </button>
            <span class="text-gray-500 text-sm tracking-widest">SESSION 1/5</span>
            <div class="w-6"></div> <!-- Spacer -->
        </div>

        <!-- Grid -->
        <div class="grid grid-cols-2 gap-4 w-full max-w-sm aspect-square">
            <div v-for="i in 4" :key="i"
                class="relative group border border-gray-800 rounded-2xl p-2 flex items-center justify-center bg-gray-900/50 cursor-pointer overflow-hidden"
                @click="handleInteraction">
                <!-- Active state style on hover/active handled mainly by JS logic in real app, but CSS hover here -->
                <div
                    class="absolute inset-0 border-2 border-transparent group-hover:border-gray-600 rounded-2xl transition-colors pointer-events-none z-10">
                </div>

                <GaborCanvas :size="120" :params="getParams(i)" />
            </div>
        </div>

        <div class="text-center text-gray-600 text-xs tracking-wider uppercase mt-8">
            Tap the target
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useGaborMock } from '~/composables/useGaborMock';

const router = useRouter();
const { params } = useGaborMock();

const getParams = (index: number) => {
    return {
        ...params,
        orientation: params.orientation + (index * 45),
        // Vary frequency slightly
        frequency: params.frequency + (index % 2),
    }
}

const handleInteraction = () => {
    // In a real app, logic would check if correct target.
    // For wireframe, just navigate to variation after interaction
    router.push('/task/variation');
}
</script>
