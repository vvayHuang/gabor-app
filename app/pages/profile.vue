<template>
    <div class="flex-1 flex flex-col px-4 space-y-8 text-on-background">
        <ToolbarTop headline="個人資料" type="header" class="pt-4">
            <template #right>
                <NuxtLink to="/settings" class="p-2">
                    <Icon name="material-symbols:settings-outline" size="24" class="text-on-background" />
                </NuxtLink>
            </template>
        </ToolbarTop>

        <!-- User Info Section -->
        <div class="flex flex-row items-center gap-6">
            <!-- Avatar -->
            <div
                class="w-[120px] h-[120px] bg-surface-variant rounded-full overflow-hidden flex-shrink-0 border border-outline-variant">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky" alt="Avatar"
                    class="w-full h-full object-cover">
            </div>

            <!-- User Text Info -->
            <div class="flex flex-col items-start gap-2">
                <h2 class="title-lg-emphasis text-on-background">User Name</h2>
                <div class="flex flex-col items-start">
                    <span class="title-sm text-on-surface-variant">@username</span>
                    <span class="title-sm text-on-surface-variant">2026年1月加入</span>
                </div>
            </div>
        </div>

        <div class="space-y-6">
            <h3 class="title-md-emphasis text-on-surface-variant">視覺專注力等級</h3>
            <p class="title-lg-emphasis text-on-background">模糊初學者</p>
        </div>
        <div class="space-y-4">
            <h3 class="title-md-emphasis text-on-surface-variant">光榮時刻</h3>
            <!-- Shapes Container -->
            <div class="flex flex-row flex-wrap items-start content-start gap-4 max-w-[361px]">
                <HonorShape v-for="i in 5" :key="i" :index="i" />
            </div>
        </div>
    </div>
</template>
