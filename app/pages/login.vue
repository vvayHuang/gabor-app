<template>
    <div class="flex flex-col items-center justify-center min-h-screen px-4 space-y-12">
        <div class="flex flex-col items-center space-y-2">
            <h1 class="headline-lg-emphasis text-inverse-on-surface">登入</h1>
            <p class="title-large-emphasis text-inverse-on-surface">很高興再次見到你！</p>
        </div>
        <div class="w-full max-w-sm space-y-6">
            <GaborButton variant="outline" icon="simple-icons:google" label="Sign in with Google"
                @click="handleLogin" />

            <GaborButton variant="outline" icon="simple-icons:apple" label="Sign in with Apple" @click="handleLogin" />

            <GaborButton variant="ghost" label="Skip for now" @click="handleLogin" class="text-sm" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();

const handleLogin = () => {
    router.push('/prepare');
};
</script>
