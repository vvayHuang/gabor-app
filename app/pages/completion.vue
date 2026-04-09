<template>
    <div class="flex flex-col min-h-safe-content px-4 py-6 text-center">
        <!-- Center Content -->
        <div class="flex-1 flex flex-col items-start justify-center">
            <div class="space-y-6">
                <h1 class="headline-md-emphasis text-inverse-on-surface">晚安，祝你好夢</h1>
            </div>
        </div>

        <!-- Bottom Buttons -->
        <div class="flex space-x-6 w-full max-w-md mx-auto py-4">
            <Buttons variant="outline" size="large" to="/records" label="查看今日紀錄" />
            <Buttons variant="outline" size="large" to="/prepare" label="回首頁" />
        </div>
    </div>
</template>
