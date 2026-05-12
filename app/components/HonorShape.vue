<template>
  <div 
    class="w-[66px] h-[66px] flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
  >
    <img 
      :src="`/shape/shape-${index}.svg`" 
      :alt="`Shape ${index}`"
      class="w-full h-full object-contain"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  index: number | string
}>()
</script>
