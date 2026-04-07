<template>
  <div class="flex items-center justify-between p-4 my-8 w-full bg-transparent pt-[env(safe-area-inset-top)] h-auto">
    <!-- Close Button -->
    <IconButton icon="material-symbols:close" size="x-small" icon-size="20" color-class="text-primary" class="shrink-0"
      @click="$emit('exit')" />

    <!-- Progress Bar -->
    <ProgressIndicators :current="current" :total="total" class="flex-1 ml-4" />
  </div>
</template>

<script setup lang="ts">
/**
 * TaskHeader 元件
 * 用於任務頁面的頂部工具列，包含退出按鈕與進度條。
 */
defineProps({
  current: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
})

defineEmits(['exit'])
</script>
