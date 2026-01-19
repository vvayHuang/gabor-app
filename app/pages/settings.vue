<template>
    <div class="flex flex-col min-h-screen space-y-8 bg-black p-6 pb-24">
        <h1 class="text-2xl font-bold text-white">設定</h1>

        <div class="space-y-6">
            <!-- Use params from useGaborMock -->
            <!-- Orientation -->
            <WireSlider label="Orientation" :min="0" :max="180" :step="1" v-model="params.orientation" />

            <!-- Spatial Frequency -->
            <WireSlider label="Spatial Frequency" :min="0.1" :max="20" :step="0.1" v-model="params.frequency" />

            <!-- Contrast -->
            <WireSlider label="Contrast" :min="0" :max="1" :step="0.01" v-model="params.contrast" />

            <!-- Sigma -->
            <WireSlider label="Sigma" :min="1" :max="100" :step="1" v-model="params.sigma" />

            <!-- Phase -->
            <WireSlider label="Phase" :min="0" :max="360" :step="1" v-model="params.phase" />
        </div>

        <div class="mt-8">
            <h2 class="text-lg font-bold text-white mb-4">預覽</h2>
            <div class="flex justify-center border border-gray-800 rounded-xl p-4 bg-gray-900">
                <GaborCanvas :size="200" :params="params" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useGaborMock } from '~/composables/useGaborMock';

const { params } = useGaborMock();
</script>
