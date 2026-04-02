<script setup lang="ts">
interface Props {
  rounded?: string;      // 圓角大小，預設為 full
  border?: boolean;      // 是否顯示細邊框
}

const props = withDefaults(defineProps<Props>(), {
  rounded: 'full',
  border: true
});
</script>

<template>
  <!-- 使用 Tailwind 內建圓角體系 -->
  <div class="relative isolate" :class="rounded ? `rounded-${rounded}` : 'rounded-none'">
    
    <!-- 1. External Glow & Soft Shadow -->
    <div class="absolute -inset-4 opacity-30 pointer-events-none -z-40 blur-xl rounded-[inherit] bg-black/5"></div>

    <!-- 2. Glass Core: Blur + Saturation (Apple-style transparency) -->
    <div 
      class="absolute inset-0 -z-30 backdrop-blur-3xl backdrop-saturate-[1.8] bg-white/40 rounded-[inherit] overflow-hidden shadow-glass"
    >
      <!-- 3. Volume Layer (Subtle Gradient for depth) -->
      <div class="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/[0.02] pointer-events-none"></div>
    </div>

    <!-- 4. Fine Specular Edge -->
    <div 
      v-if="props.border"
      class="absolute inset-0 -z-10 rounded-[inherit] border border-white/40"
    ></div>

    <!-- Content Slot -->
    <div class="relative z-10 h-full flex items-center justify-center">
      <slot />
    </div>
  </div>
</template>

<style scoped>
/* 關鍵：模擬光線照在曲面玻璃上的立體感 */
.shadow-glass {
  box-shadow: 
    inset 0 1px 1.5px rgba(255, 255, 255, 0.5), /* 頂部高光細節 */
    inset 0 -0.5px 1px rgba(0, 0, 0, 0.05),    /* 底部遮蔽細節 */
    0 4px 24px -1px rgba(0, 0, 0, 0.1);        /* 外部柔和落影 */
}
</style>
