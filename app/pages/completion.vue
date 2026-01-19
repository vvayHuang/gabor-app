<template>
    <div class="flex flex-col items-center justify-center min-h-screen space-y-12 bg-black text-center px-8">
        <div class="space-y-6">
            <GaborCanvas :size="100" />
            <h1 class="text-3xl font-bold text-white">晚安，祝你好夢</h1>
        </div>

        <div class="flex space-x-4">
            <NuxtLink to="/" class="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition">
                回到首頁
            </NuxtLink>
        </div>
    </div>
</template>
