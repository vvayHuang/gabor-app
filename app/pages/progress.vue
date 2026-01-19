<template>
    <div class="flex flex-col min-h-screen px-4 py-8 text-center">
        <!-- Center Content -->
        <div class="flex-1 flex flex-col items-center justify-center">
            <div class="flex flex-col items-center space-y-6">
                <ProgressCircle :value="80" />
                <h3 class="headline-lg-emphasis text-inverse-on-surface">今日目標達成</h3>
            </div>
        </div>

        <!-- Bottom Button -->
        <div class="w-full max-w-md mx-auto">
            <NuxtLink to="/streak"
                class="w-full py-4 bg-primary text-on-primary rounded-full hover:bg-primary-container transition block font-bold">
                Continue
            </NuxtLink>
        </div>
    </div>
</template>
