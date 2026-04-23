<template>
    <div class="flex-1 flex flex-col px-4 space-y-8 text-center">
        <!-- Center Content -->
        <div class="flex-1 flex flex-col items-start justify-center">
            <div class="space-y-6">
                <h1 class="headline-md-emphasis text-inverse-on-surface">晚安，祝你好夢</h1>
            </div>
        </div>

        <!-- Bottom Buttons (Consistent Bottom Area) -->
        <div
            class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-4 pb-[calc(16px+env(safe-area-inset-bottom))]">
            <div class="flex space-x-4">
                <Buttons buttonStyle="Bordered" size="Large" to="/records" label="紀錄" class="flex-1" />
                <Buttons buttonStyle="Bordered" size="Large" to="/prepare" label="回首頁" class="flex-1" />
            </div>
        </div>
    </div>
</template>
