<template>
    <div class="flex flex-col items-center justify-center min-h-screen p-4 space-y-8">
        <!-- Header -->
        <div class="fixed top-[62px] left-0 w-full px-4 flex justify-between items-center z-20 gap-12">
            <!-- Exit Button -->
            <IconButton icon="material-symbols:close" size="medium"
                class="hover:bg-white/10 text-inverse-on-surface hover:text-white" @click="handleExit" />

            <!-- Progress Bar -->
            <TaskProgress :current="1" :total="5" width="100%" class="flex-1" />
        </div>

        <!-- Exit Confirmation Dialog -->
        <div v-if="showExitConfirmation"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div
                class="bg-surface-container-high p-6 rounded-2xl shadow-xl max-w-sm w-full mx-4 border border-outline-variant">
                <h3 class="text-xl font-bold text-on-surface mb-2">Exit Session?</h3>
                <p class="text-on-surface-variant mb-6">Your progress will be lost if you quit now.</p>
                <div class="flex justify-end space-x-3">
                    <button
                        class="px-4 py-2 text-on-surface-variant hover:text-on-surface hover:bg-on-surface/10 rounded-lg transition"
                        @click="cancelExit">
                        Cancel
                    </button>
                    <button
                        class="px-4 py-2 bg-error text-on-error hover:bg-error-container hover:text-on-error-container rounded-lg transition font-medium"
                        @click="confirmExit">
                        Quit
                    </button>
                </div>
            </div>
        </div>

        <!-- Grid -->
        <div class="grid grid-cols-2 gap-4 w-full max-w-sm aspect-square">
            <div v-for="i in 4" :key="i" class="relative group flex items-center justify-center cursor-pointer"
                @click="handleInteraction">
                <!-- Active state style on hover/active handled mainly by JS logic in real app, but CSS hover here -->
                <div
                    class="absolute inset-0 border-2 border-transparent group-hover:border-gray-600 transition-colors pointer-events-none z-10">
                </div>

                <GaborCanvas :size="172" :params="getParams(i)" />
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref } from 'vue';

import { useGaborMock } from '~/composables/useGaborMock';

const router = useRouter();
const { params } = useGaborMock();

const getParams = (index: number) => {
    return {
        ...params,
        orientation: params.orientation + (index * 45),
        // Vary frequency slightly but keep it visible
        frequency: params.frequency + (index * 0.2),
    }
}

const handleInteraction = () => {
    // In a real app, logic would check if correct target.
    // For wireframe, just navigate to variation after interaction
    router.push('/task/variation');
}

// Exit Confirmation Logic
const showExitConfirmation = ref(false);

const handleExit = () => {
    showExitConfirmation.value = true;
};

const cancelExit = () => {
    showExitConfirmation.value = false;
};

const confirmExit = () => {
    router.push('/prepare');
};
</script>
