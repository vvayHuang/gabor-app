<template>
    <div ref="p5Container" class="w-full h-full absolute inset-0 pointer-events-none"></div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import type p5 from 'p5';
import { useAppSettings } from '~/composables/useAppSettings';

const p5Container = ref<HTMLElement | null>(null);
let p5Instance: p5 | null = null;

const settings = useAppSettings();

// 線條取設計系統的 on-surface：深色 #E1E2EC (225,226,236)、淺色 #181C23 (24,28,35)。
// p5 需要逐通道值來搭配逐節點的透明度，因此在這裡拆成 RGB 三元組。
// 這個 sketch 持續 loop，主題切換下一幀就會生效，不需要額外補畫。
const strokeRgb = computed(() => (settings.isDarkMode.value ? '225, 226, 236' : '24, 28, 35'));

// 登入頁專屬的輕量級背景：不綁定遊戲狀態、不限制行動裝置，
// 網格較稀疏以維持行動裝置效能。
const sketch = (p: p5) => {
    const gridSpacing = 56;
    let cols = 0;
    let rows = 0;
    let timeOffset = 0;
    const noiseScale = 0.0018;

    p.setup = () => {
        const width = p5Container.value?.clientWidth || window.innerWidth;
        const height = p5Container.value?.clientHeight || window.innerHeight;
        p.createCanvas(width, height);
        p.frameRate(24);

        cols = p.floor(width / gridSpacing) + 2;
        rows = p.floor(height / gridSpacing) + 2;
    };

    p.draw = () => {
        p.clear(0, 0, 0, 0);
        timeOffset += 0.0025;

        const stroke = strokeRgb.value;

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const x = i * gridSpacing;
                const y = j * gridSpacing;

                const n = p.noise(x * noiseScale, y * noiseScale, timeOffset);
                const angle = n * p.TWO_PI * 1.5;
                const opacity = 0.1 + n * 0.08;

                p.push();
                p.translate(x, y);
                p.rotate(angle);
                p.noFill();
                p.strokeWeight(1.8);

                p.drawingContext.strokeStyle = `rgba(${stroke}, ${opacity})`;
                p.line(-14, 0, 14, 0);

                p.drawingContext.strokeStyle = `rgba(${stroke}, ${opacity * 0.5})`;
                p.line(-10, -4, 10, -4);
                p.line(-10, 4, 10, 4);
                p.pop();
            }
        }
    };

    p.windowResized = () => {
        if (p5Container.value) {
            const width = p5Container.value.clientWidth;
            const height = p5Container.value.clientHeight;
            p.resizeCanvas(width, height);
            cols = p.floor(width / gridSpacing) + 2;
            rows = p.floor(height / gridSpacing) + 2;
        }
    };
};

onMounted(async () => {
    const p5Lib = await import('p5').then(m => m.default || m);
    if (p5Container.value) {
        p5Instance = new p5Lib(sketch, p5Container.value);
    }
});

onUnmounted(() => {
    if (p5Instance) {
        p5Instance.remove();
    }
});
</script>

<style scoped>
:deep(canvas) {
    display: block !important;
    width: 100% !important;
    height: 100% !important;
}
</style>
