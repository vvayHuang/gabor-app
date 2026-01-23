<template>
    <div
        class="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-inverse-surface text-inverse-on-surface">
        <h2 class="display-sm-emphasis mb-4">休息一下</h2>
        <p class="headline-sm text-inverse-on-surface-variant mb-8">準備好進入下一階段了嗎？</p>
        <GaborButton variant="primary" label="繼續" @click="continueGame" />
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import GaborButton from '~/components/GaborButton.vue';

const router = useRouter();

const continueGame = () => {
    router.push('/task/grid?phase=3x3');
};
</script>
