<template>
    <div class="flex flex-col min-h-safe-content px-4 py-6 text-center">
        <!-- Center Content -->
        <div class="flex-1 flex flex-col items-start justify-center">
            <div class="space-y-6">
                <h1 class="headline-md-emphasis text-inverse-on-surface">晚安，祝你好夢</h1>
            </div>
        </div>

        <!-- Bottom Buttons (Consistent Bottom Area) -->
        <div class="fixed bottom-0 left-0 w-full p-6 pb-[calc(24px+env(safe-area-inset-bottom))]">
            <div class="max-w-md mx-auto w-full flex space-x-4">
                <Buttons buttonStyle="Bordered" size="Large" to="/records" label="紀錄" class="flex-1" />
                <Buttons buttonStyle="Bordered" size="Large" to="/prepare" label="回首頁" class="flex-1" />
            </div>
        </div>
    </div>
</template>
