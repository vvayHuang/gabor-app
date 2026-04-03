<template>
  <div 
    class="w-[78.25px] h-[78.25px] flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
  >
    <img 
      :src="imageSrc" 
      :alt="`Shape ${index}`"
      class="w-full h-full object-contain"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  index: number | string
}>()

const imageSrc = computed(() => {
  // 動態引入 assets 中的圖形
  return new URL(`../assets/shape/shape-${props.index}.svg`, import.meta.url).href
})
</script>
