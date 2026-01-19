<template>
    <div class="flex flex-col items-center justify-center min-h-screen px-8 space-y-12 text-center">
        <div class="space-y-6 max-w-md">
            <h2 class="text-2xl font-bold text-white">準備好放鬆了嗎？</h2>
            <div class="h-px w-12 bg-gray-700 mx-auto"></div>
            <p class="text-gray-400 leading-relaxed text-lg">
                請找一個安靜的環境。<br>
                調整螢幕亮度至舒適。<br>
                保持與螢幕適當的距離。
            </p>
        </div>

        <NuxtLink to="/task/grid"
            class="w-full max-w-xs py-4 bg-gray-800/50 border border-yellow-700 text-yellow-500 font-bold rounded-full hover:bg-yellow-900/20 transition tracking-wider">
            開始任務
        </NuxtLink>
    </div>
</template>
