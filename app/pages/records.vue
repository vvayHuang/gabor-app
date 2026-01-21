<template>
    <div class="flex flex-col min-h-screen space-y-8 px-4 pb-6 text-inverse-on-surface">
        <AppBar headline="紀錄" class="mt-[62px]">
            <template #left>
                <NuxtLink to="/prepare" class="p-2">
                    <Icon name="material-symbols:arrow-back-rounded" size="24" class="text-inverse-on-surface" />
                </NuxtLink>
            </template>
        </AppBar>
        <!-- Bar Chart Placeholder -->
        <div class="space-y-2">
            <div class="flex justify-between items-center">
                <h3 class="title-sm">本週累積訓練時間</h3>
                <p class="body-medium text-inverse-on-surface">2026年1月8日至15日</p>
            </div>
            <div class="flex items-end space-x-4">
                <h3 class="display-md-emphasis">105 <span class="body-lg text-on-surface-variant">分鐘</span></h3>
                <p class="body-lg text-inverse-on-surface">上升 12%</p>
            </div>
            <div class="h-40 flex items-end justify-between space-x-2 rounded-xl p-4">
                <!-- Mock Bars -->
                <div class="w-full bg-surface-container rounded-t-2xl" style="height: 30%"></div>
                <div class="w-full bg-surface-container rounded-t-2xl" style="height: 50%"></div>
                <div class="w-full bg-surface-container rounded-t-2xl" style="height: 40%"></div>
                <div class="w-full bg-surface-container rounded-t-2xl" style="height: 80%"></div>
                <div class="w-full bg-surface-container rounded-t-2xl shadow-[0_0_10px_white]" style="height: 90%">
                </div>
                <div class="w-full bg-surface-container rounded-t-2xl" style="height: 10%"></div>
                <div class="w-full bg-surface-container rounded-t-2xl" style="height: 10%"></div>
            </div>
            <div class="flex justify-between text-xs text-outline px-4">
                <span>週一</span><span>週二</span><span>週三</span><span>週四</span><span>週五</span><span>週六</span><span>週日</span>
            </div>
        </div>
        <div class="space-y-4">
            <h3 class="headline-sm-emphasis text-on-surface-variant">排程</h3>
            <div class="bg-surface-dim rounded-2xl p-4 space-y-2">
                <p class="body-lg-emphasis text-on-surface">每天</p>
                <div class="flex justify-between items-center">
                    <p class="body-lg-emphasis text-on-surface">下午 5:00</p>
                    <Icon name="material-symbols:notifications-outline" size="24" class="text-on-surface-variant" />
                </div>
                <div class="h-[1px] w-full bg-outline-variant"></div>
                <a href="#" class="text-on-surface-variant">編輯</a>
            </div>
        </div>

        <!-- Calendar Placeholder -->
        <div class="space-y-4">
            <h3 class="headline-sm-emphasis text-on-surface-variant">重點</h3>
            <div class="bg-surface-dim rounded-2xl p-4 space-y-6">
                <span class="title-sm-emphasis text-on-surface">這是你過去30天的紀錄情況</span>
                <h4 class="title-lg-emphasis text-on-surface">連續達成天數</h4>
                <div class="flex justify-between text-xs text-outline px-3">
                    <span>週一</span><span>週二</span><span>週三</span><span>週四</span><span>週五</span><span>週六</span><span>週日</span>
                </div>
                <div class="grid grid-cols-7 gap-2 bg-surface-dim p-3">
                    <!-- Mock Calendar Days -->
                    <div v-for="i in 30" :key="i"
                        class="aspect-square flex items-center justify-center text-xs rounded-full" :class="[
                            i === 8 ? 'text-on-surface border border-primary body-lg' : 'text-on-surface-variant',
                            [1, 2, 3, 4, 5, 6, 7].includes(i) ? 'bg-primary' : ''
                        ]">
                        {{ i }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
