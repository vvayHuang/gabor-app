<template>
  <div 
    class="flex items-center w-full bg-background transition-all duration-300 px-4"
    :class="[
      type === 'navigation' ? 'h-[54px] pt-0 pb-[10px]' : 'h-14',
      { 'fixed top-0 z-50': sticky }
    ]"
  >
    <!-- Type: Navigation (Icon button left + Title next to it) -->
    <div v-if="type === 'navigation'" class="flex items-center gap-[10px] w-full">
      <div class="flex-shrink-0 flex items-center justify-center">
        <slot name="left"></slot>
      </div>
      <h1 class="title-md select-none text-on-background mix-blend-plus-darker">
        {{ headline }}
      </h1>
    </div>

    <!-- Type: Header (Title left + Right Slot) -->
    <div v-else class="flex items-center justify-between w-full h-full">
      <h1 class="title-lg-emphasis select-none text-on-background mix-blend-plus-darker">
        {{ headline }}
      </h1>
      <div class="flex-shrink-0 flex items-center justify-end min-w-[44px]">
        <slot name="right"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * ToolbarTop 元件
 * @param {string} headline - 標題文字
 * @param {'header' | 'navigation'} type - 工具列類型
 * @param {boolean} sticky - 是否固定在頂部
 */
interface Props {
  headline: string
  type?: 'header' | 'navigation'
  sticky?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'header',
  sticky: false
})
</script>
