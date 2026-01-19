<template>
    <div class="flex flex-col min-h-screen space-y-8 bg-black p-6 pb-24 text-white">
        <h1 class="text-2xl font-bold">Profile</h1>

        <div class="flex items-center space-x-4">
            <div class="w-20 h-20 bg-gray-800 rounded-full border-2 border-gray-700"></div>
            <div>
                <h2 class="text-xl font-bold">User Name</h2>
                <div class="text-gray-500 text-sm">Vision Explorer</div>
            </div>
        </div>

        <div class="h-px w-full bg-gray-800"></div>

        <div class="space-y-4">
            <h3 class="text-sm font-bold text-gray-400 uppercase">Achievements</h3>
            <div class="grid grid-cols-4 gap-4">
                <div v-for="i in 4" :key="i"
                    class="aspect-square bg-gray-900 rounded-xl flex items-center justify-center border border-gray-800">
                    <Icon name="material-symbols:emoji-events" class="text-2xl text-gray-600" />
                </div>
            </div>
        </div>

        <div class="space-y-2 mt-auto">
            <button class="w-full py-4 text-left px-4 bg-gray-900 rounded-xl hover:bg-gray-800 transition">
                <span class="text-sm">Account Settings</span>
            </button>
            <button class="w-full py-4 text-left px-4 bg-gray-900 rounded-xl hover:bg-gray-800 transition text-red-400">
                <span class="text-sm">Log Out</span>
            </button>
        </div>
    </div>
</template>
