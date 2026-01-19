<template>
    <div class="flex flex-col items-center justify-center min-h-screen px-4 space-y-12">
        <div class="flex flex-col items-center space-y-2">
            <h1 class="headline-lg-emphasis text-inverse-on-surface">登入</h1>
            <p class="title-large-emphasis text-inverse-on-surface">很高興再次見到你！</p>
        </div>
        <div class="w-full max-w-sm space-y-6">
            <button @click="handleLogin"
                class="w-full py-4 border border-inverse-on-surface rounded-full flex items-center justify-center space-x-3 hover:bg-gray-800 transition group">
                <Icon name="simple-icons:google" size="24" mode="svg" class="text-inverse-on-surface" />
                <span class="text-inverse-on-surface group-hover:text-white">Sign in with Google</span>
            </button>

            <button @click="handleLogin"
                class="w-full py-4 border border-inverse-on-surface rounded-full flex items-center justify-center space-x-3 hover:bg-gray-800 transition group">
                <Icon name="simple-icons:apple" size="24" mode="svg" class="text-inverse-on-surface" />
                <span class="text-inverse-on-surface group-hover:text-white">Sign in with Apple</span>
            </button>

            <button @click="handleLogin"
                class="w-full py-4 bg-transparent border border-transparent rounded-2xl flex items-center justify-center text-gray-500 text-sm hover:text-gray-300">
                Skip for now
            </button>
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
