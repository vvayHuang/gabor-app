<template>
  <div class="w-full bg-surface-container-low rounded-3xl p-6 space-y-4 border border-outline-variant/30">
    <div class="flex items-center justify-between">
      <h4 class="title-sm-emphasis text-on-surface-variant uppercase tracking-wider">準確度趨勢</h4>
      <span class="label-medium text-primary font-bold">過去 7 天</span>
    </div>

    <!-- Chart SVG -->
    <div class="relative w-full h-32 mt-4">
      <svg class="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
        <!-- Grid Lines -->
        <line x1="0" y1="0" x2="100" y2="0" stroke="currentColor" stroke-width="0.1" class="text-outline-variant" />
        <line x1="0" y1="20" x2="100" y2="20" stroke="currentColor" stroke-width="0.1" class="text-outline-variant" />
        <line x1="0" y1="40" x2="100" y2="40" stroke="currentColor" stroke-width="0.1" class="text-outline-variant" />

        <!-- Area Under Curve -->
        <path :d="areaPath" fill="url(#chartGradient)" class="opacity-20" />

        <!-- Line Path -->
        <path 
            :d="linePath" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="1.5" 
            stroke-linecap="round" 
            stroke-linejoin="round"
            class="text-primary"
        />

        <!-- Data Points -->
        <circle v-for="(p, i) in points" :key="i" :cx="p.x" :cy="p.y" r="1.2" class="fill-primary" />
        
        <!-- Gradient Definition -->
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--color-primary)" stop-opacity="0.8" />
            <stop offset="100%" stop-color="var(--color-primary)" stop-opacity="0" />
          </linearGradient>
        </defs>
      </svg>
      
      <!-- X-Axis Labels -->
      <div class="flex justify-between mt-2 px-1">
        <span v-for="day in days" :key="day" class="text-[10px] text-on-surface-variant font-medium">{{ day }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  data: number[]; // 預期傳入 7 個數值 (0-100)
}>();

const days = ['一', '二', '三', '四', '五', '六', '日'];

// 將 0-100 的數據映射到 SVG 的 0-40 座標 (y 反轉)
const points = computed(() => {
  return props.data.map((val, i) => ({
    x: (i * (100 / 6)),
    y: 40 - (val * 0.4)
  }));
});

// 建立 SVG 路徑 (使用二次貝茲曲線達到平滑效果)
const linePath = computed(() => {
  if (points.value.length === 0) return '';
  let path = `M ${points.value[0].x} ${points.value[0].y}`;
  
  for (let i = 0; i < points.value.length - 1; i++) {
    const p0 = points.value[i];
    const p1 = points.value[i+1];
    const cpX = (p0.x + p1.x) / 2;
    path += ` Q ${cpX} ${p0.y}, ${p1.x} ${p1.y}`;
  }
  return path;
});

const areaPath = computed(() => {
  if (linePath.value === '') return '';
  return `${linePath.value} L 100 40 L 0 40 Z`;
});
</script>
