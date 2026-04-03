<script setup lang="ts">
// 模擬成就資料
const mockAchievements = {
    '2026-03-01': 'level-5',
    '2026-03-02': 'level-4',
    '2026-03-03': 'level-3',
    '2026-03-04': 'level-2',
    '2026-03-05': 'level-1',
    '2026-03-06': 'level-5',
    '2026-03-07': 'level-5',
    '2026-03-08': 'level-5',
    '2026-03-09': 'level-4',
    '2026-03-10': 'level-3',
    '2026-03-11': 'level-2',
};
</script>

<template>
    <div class="flex flex-col min-h-screen space-y-8 pb-6 text-on-background bg-background">
        <ToolbarTop headline="紀錄" class="mt-[62px]" variant="left-action">
        </ToolbarTop>

        <div class="space-y-4 px-4">
            <div class="flex items-end space-x-4">
                <h3 class="display-lg-emphasis text-primary">99</h3>
                <span class="title-lg-emphasis text-primary">連續達成天數</span>
            </div>
            <!-- 使用 Calendar 元件 -->
            <Calendar :achievements="mockAchievements" />
        </div>

        <div class="space-y-4 px-4">
            <h3 class="title-md-emphasis text-on-surface-variant">排程</h3>
            <!-- Menu Container -->
            <div class="bg-surface-dim rounded-2xl p-4 flex flex-col gap-[9px] w-full max-w-[370px] mx-auto">
                <!-- Menu Item: Frequency -->
                <div class="flex flex-row items-center justify-between px-2 h-11 cursor-pointer hover:bg-black/5 transition-colors rounded-lg">
                    <div class="flex items-center">
                        <span class="text-base text-on-surface mix-blend-plus-darker">每天</span>
                    </div>
                    <Icon name="material-symbols:chevron-right-rounded" size="20" class="text-on-surface mix-blend-plus-darker" />
                </div>

                <!-- Menu Item: Time -->
                <div class="flex flex-row items-center justify-between px-2 h-11 cursor-pointer hover:bg-black/5 transition-colors rounded-lg">
                    <div class="flex items-center">
                        <span class="text-base text-on-surface mix-blend-plus-darker">下午 5:00</span>
                    </div>
                    <Icon name="material-symbols:chevron-right-rounded" size="20" class="text-on-surface mix-blend-plus-darker" />
                </div>
            </div>
        </div>
    </div>
</template>
