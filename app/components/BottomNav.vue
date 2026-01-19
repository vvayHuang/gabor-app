<template>
    <div class="fixed bottom-0 left-0 w-full bg-gray-900 border-t border-gray-800 pb-safe">
        <div class="flex justify-around items-center h-16">
            <NuxtLink to="/task/grid"
                class="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-gray-300 transition-colors"
                active-class="text-white border-t-2 border-white">
                <!-- SVG Icon: Grid View -->
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span class="text-[10px] up">Task</span>
            </NuxtLink>

            <NuxtLink to="/records"
                class="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-gray-300 transition-colors"
                active-class="text-white border-t-2 border-white">
                <!-- SVG Icon: Chart Bar -->
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span class="text-[10px] up">Records</span>
            </NuxtLink>

            <NuxtLink to="/settings"
                class="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-gray-300 transition-colors"
                active-class="text-white border-t-2 border-white">
                <!-- SVG Icon: Adjustments -->
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                <span class="text-[10px] up">Settings</span>
            </NuxtLink>

            <NuxtLink to="/profile"
                class="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-gray-300 transition-colors"
                active-class="text-white border-t-2 border-white">
                <!-- SVG Icon: User -->
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span class="text-[10px] up">Profile</span>
            </NuxtLink>
        </div>
    </div>
</template>
