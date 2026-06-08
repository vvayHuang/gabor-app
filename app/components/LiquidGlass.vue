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
    <div class="glass-glow absolute -inset-4 opacity-30 pointer-events-none -z-40 blur-xl rounded-[inherit]"></div>

    <!-- 2. Glass Core: Blur + Saturation (Apple-style transparency) -->
    <div 
      class="glass-core absolute inset-0 -z-30 backdrop-blur-3xl backdrop-saturate-[1.8] rounded-[inherit] overflow-hidden"
    >
      <!-- 3. Volume Layer (Subtle Gradient for depth) -->
      <div class="glass-volume absolute inset-0 pointer-events-none"></div>
    </div>

    <!-- 4. Fine Specular Edge -->
    <div 
      v-if="props.border"
      class="glass-border absolute inset-0 -z-10 rounded-[inherit]"
    ></div>

    <!-- Content Slot -->
    <div class="relative z-10 h-full flex items-center justify-center">
      <slot />
    </div>
  </div>
</template>

<style scoped>
/* 使用全域 tokens 讓玻璃材質跟著亮色／深色模式切換 */
.glass-glow {
  background: var(--glass-glow);
}

.glass-core {
  background: var(--glass-fill);
  box-shadow:
    inset 0 1px 1.5px var(--glass-specular),
    inset 0 -0.5px 1px var(--glass-shade),
    0 4px 24px -1px var(--glass-shadow);
}

.glass-volume {
  background: linear-gradient(
    to bottom,
    var(--glass-highlight),
    transparent,
    var(--glass-volume-shade)
  );
}

.glass-border {
  border: 1px solid var(--glass-border);
}
</style>
