<template>
    <div class="flex flex-col min-h-screen space-y-8 px-4 pb-24 text-inverse-on-surface">
        <AppBars headline="個人資料" class="mt-[62px]">
            <template #left>
                <NuxtLink to="/prepare" class="p-2">
                    <Icon name="material-symbols:arrow-back-rounded" size="24" class="text-inverse-on-surface" />
                </NuxtLink>
            </template>
        </AppBars>

        <div class="flex flex-col items-center space-y-2">
            <div class="w-30 h-30 bg-gray-800 rounded-full border-2 border-outline"></div>
            <div>
                <h2 class="title-lg-emphasis text-inverse-on-surface">User Name</h2>
                <div class="body-medium text-inverse-on-surface">Vision Explorer</div>
            </div>
        </div>
        <div class="space-y-4 py-4">
            <h3 class="title-lg-emphasis text-on-surface-variant">視覺專注力等級</h3>
            <p class="title-lg-emphasis text-inverse-on-surface">初學者</p>
        </div>
        <div class="space-y-4 py-4">
            <h3 class="title-lg-emphasis text-on-surface-variant">光榮時刻</h3>
            <div class="grid grid-cols-4 gap-4">
                <div v-for="i in 6" :key="i"
                    class="aspect-square rounded-xl flex items-center justify-center border border-outline">
                    <Icon name="material-symbols:emoji-events" class="text-2xl text-primary" />
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
