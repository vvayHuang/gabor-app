<template>
    <div class="flex flex-col min-h-screen px-8 py-8 text-center">
        <!-- Center Content -->
        <div class="flex-1 flex flex-col items-start justify-center">
            <div class="space-y-6">
                <h1 class="headline-md-emphasis text-inverse-on-surface">晚安，祝你好夢</h1>
            </div>
        </div>

        <!-- Bottom Buttons -->
        <div class="flex space-x-4 w-full max-w-md mx-auto py-4">
            <GaborButton variant="outline" to="/records" label="查看今日紀錄" />
            <GaborButton variant="outline" to="/" label="回首頁" />
        </div>
    </div>
</template>
