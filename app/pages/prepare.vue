<template>
    <div class="flex flex-col min-h-screen px-4 py-8 text-center">
        <!-- Center Content -->
        <div class="flex-1 flex flex-col items-center justify-center">
            <div class="space-y-4 max-w-md">
                <h2 class="display-sm-emphasis text-inverse-on-surface">準備好放鬆了嗎？</h2>
                <p class="headline-sm text-inverse-on-surface">
                    請盡量在微光環境中使用
                </p>
            </div>
        </div>

        <!-- Bottom Button -->
        <div class="w-full max-w-md mx-auto pb-[92px]">
            <NuxtLink to="/task/grid"
                class="w-full py-4 bg-primary text-on-primary rounded-full hover:bg-primary-container transition block font-bold">
                進入訓練
            </NuxtLink>
            <p class="text-sm text-inverse-on-surface mt-2">上次訓練時間 : 15分</p>
        </div>
    </div>
</template>
