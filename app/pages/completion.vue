<template>
    <div class="flex flex-col min-h-screen px-8 py-8 text-center">
        <!-- Center Content -->
        <div class="flex-1 flex flex-col items-start justify-center">
            <div class="space-y-6">
                <h1 class="headline-md-emphasis text-inverse-on-surface">晚安，祝你好夢</h1>
            </div>
        </div>

        <!-- Bottom Buttons -->
        <div class="flex space-x-4 w-full max-w-md mx-auto py-4">
            <NuxtLink to="/records"
                class="w-full py-2 text-inverse-on-surface border border-inverse-on-surface rounded-full hover:bg-gray-800 transition font-bold">
                查看今日紀錄
            </NuxtLink>
            <NuxtLink to="/"
                class="w-full py-2 text-inverse-on-surface border border-inverse-on-surface rounded-full hover:bg-gray-800 transition font-bold">
                回首頁
            </NuxtLink>
        </div>
    </div>
</template>
