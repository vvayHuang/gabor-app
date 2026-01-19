<template>
    <div class="flex flex-col items-center justify-center min-h-screen space-y-12 bg-black">
        <h2 class="text-xl font-medium tracking-widest text-gray-400 uppercase">Daily Goal</h2>

        <ProgressCircle :value="100" />

        <div class="text-center space-y-2">
            <h3 class="text-2xl font-bold text-white">今日目標達成</h3>
            <p class="text-gray-500">Excellent work.</p>
        </div>

        <NuxtLink to="/streak"
            class="px-8 py-3 bg-gray-800 text-white border border-gray-600 rounded-full hover:bg-gray-700 transition">
            Continue
        </NuxtLink>
    </div>
</template>
