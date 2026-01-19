<template>
    <div class="flex flex-col min-h-screen space-y-8 bg-black p-6 pb-24 text-white">
        <h1 class="text-2xl font-bold">紀錄</h1>

        <!-- Summary -->
        <div class="grid grid-cols-2 gap-4">
            <div class="bg-gray-900 rounded-xl p-4 border border-gray-800">
                <div class="text-4xl font-bold font-mono">12</div>
                <div class="text-xs text-gray-500 uppercase mt-1">Total Sessions</div>
            </div>
            <div class="bg-gray-900 rounded-xl p-4 border border-gray-800">
                <div class="text-4xl font-bold font-mono">5</div>
                <div class="text-xs text-gray-500 uppercase mt-1">Current Streak</div>
            </div>
        </div>

        <!-- Bar Chart Placeholder -->
        <div class="space-y-2">
            <h3 class="text-sm font-bold text-gray-400 uppercase">Weekly Activity</h3>
            <div
                class="h-40 flex items-end justify-between space-x-2 bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                <!-- Mock Bars -->
                <div class="w-full bg-gray-700 rounded-t-sm" style="height: 30%"></div>
                <div class="w-full bg-gray-700 rounded-t-sm" style="height: 50%"></div>
                <div class="w-full bg-gray-700 rounded-t-sm" style="height: 40%"></div>
                <div class="w-full bg-gray-700 rounded-t-sm" style="height: 80%"></div>
                <div class="w-full bg-white rounded-t-sm shadow-[0_0_10px_white]" style="height: 90%"></div>
                <div class="w-full bg-gray-800 rounded-t-sm" style="height: 10%"></div>
                <div class="w-full bg-gray-800 rounded-t-sm" style="height: 10%"></div>
            </div>
            <div class="flex justify-between text-xs text-gray-600 px-4">
                <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
            </div>
        </div>

        <!-- Calendar Placeholder -->
        <div class="space-y-4">
            <h3 class="text-sm font-bold text-gray-400 uppercase">History</h3>
            <div class="grid grid-cols-7 gap-2">
                <!-- Mock Calendar Days -->
                <div v-for="i in 30" :key="i"
                    class="aspect-square flex items-center justify-center text-xs rounded-full" :class="[
                        i === 15 ? 'bg-white text-black font-bold' : 'text-gray-600',
                        [3, 4, 5, 6, 7, 10, 11, 12].includes(i) ? 'bg-gray-800 text-gray-300' : ''
                    ]">
                    {{ i }}
                </div>
            </div>
        </div>
    </div>
</template>
