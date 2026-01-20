<template>
    <div class="flex flex-col items-center justify-center min-h-screen space-y-12 text-center px-8">

        <!-- Timer Display -->
        <div class="relative">
            <div class="display-lg text-inverse-on-surface">
                00:30
            </div>
        </div>
        <div class="max-w-xs space-y-2">
            <h2 class="headline-sm-emphasis text-inverse-on-surface">做得好，現在、閉上眼睛</h2>
            <p class="body-medium text-inverse-on-surface">
                聽著浪聲，感受眼部肌肉的鬆弛。倒數結束後，我們夢裡見
            </p>
        </div>

        <GaborButton variant="ghost" to="/completion" label="略過" class="text-inverse-on-surface/50" />
    </div>
</template>
