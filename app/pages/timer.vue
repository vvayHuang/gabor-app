<template>
    <div class="flex flex-col items-center justify-center min-h-screen space-y-12 bg-black text-center px-8">

        <!-- Timer Display -->
        <div class="relative">
            <div class="text-8xl font-black font-mono tracking-tighter text-white">
                00<span class="text-gray-600">:</span>30
            </div>
            <div class="absolute -bottom-6 left-0 w-full text-center text-xs tracking-widest text-gray-500 uppercase">
                Seconds Remaining
            </div>
        </div>

        <div class="max-w-xs space-y-4">
            <h2 class="text-xl font-bold text-white">做得好，現在、閉上眼睛</h2>
            <p class="text-gray-400 text-sm leading-relaxed">
                讓視覺皮層休息片刻。<br>
                深呼吸，直到倒數結束。
            </p>
        </div>

        <NuxtLink to="/completion"
            class="px-8 py-3 bg-transparent border border-gray-700 text-gray-300 rounded-full hover:bg-gray-900 transition text-sm">
            Skip Timer
        </NuxtLink>
    </div>
</template>
