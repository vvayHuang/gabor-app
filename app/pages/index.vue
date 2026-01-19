<template>
    <div class="flex flex-col items-center justify-center min-h-screen">
        <!-- Logo Placeholder -->
        <div class="w-[300px] h-[300px] flex items-center justify-center"><img src="@/assets/logo.svg" alt=""></div>
        <div class="text-center space-y-2">
            <h1 class="headline-lg-emphasis text-inverse-on-surface">歡迎</h1>
        </div>
        <NuxtLink to="/login"
            class="px-10 py-4 bg-white text-black font-bold rounded-full transition transform hover:scale-105">
            開始
        </NuxtLink>
    </div>
</template>
