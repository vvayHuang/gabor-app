<template>
  <div class="flex items-center w-full h-14 bg-background px-4 relative transition-all duration-300"
    :class="{ 'fixed top-0 z-50': sticky }">
    <!-- Left Slot (僅在 center 模式顯示) -->
    <div v-if="variant === 'center'" class="z-10 flex items-center min-w-[48px]">
      <slot name="left"></slot>
    </div>

    <!-- Unified Headline -->
    <div :class="[
      variant === 'center'
        ? 'absolute inset-0 flex items-center justify-center pointer-events-none'
        : 'flex items-center h-full'
    ]">
      <h1 class="headline-lg-emphasis select-none text-on-background pointer-events-auto">
        {{ headline }}
      </h1>
    </div>

    <!-- Right Slot (在 center 與 left-action 模式顯示) -->
    <div v-if="variant !== 'left'" class="z-10 flex items-center justify-end min-w-[48px] ml-auto">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  headline: string
  variant?: 'center' | 'left' | 'left-action'
  sticky?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'center',
  sticky: false
})
</script>
