<template>
    <div ref="canvasContainer"
        class="relative flex items-center justify-center [&>canvas]:rounded-full transition-transform duration-150"
        :class="{ 'animate-shake': isShaking, 'invert': isInverted }"
        :style="{ width: size + 'px', height: size + 'px' }">
        <!-- p5 canvas will be injected here -->
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import type p5 from 'p5';

const props = withDefaults(defineProps<{
    size?: number;
    params?: any;
    primaryColor?: string;
    secondaryColor?: string;
}>(), {
    size: 200,
    primaryColor: '#FFFFFF',
    secondaryColor: '#000000',
    params: () => ({
        orientation: 0,
        frequency: 0.025,
        contrast: 1,
        sigma: 40,
        phase: 0
    })
});

const emit = defineEmits(['ready']);

const canvasContainer = ref<HTMLElement | null>(null);
const isShaking = ref(false);
const isInverted = ref(false);
const isReady = ref(false);

let p5Instance: p5 | null = null;
let p5Promise: Promise<any> | null = null;

const loadP5 = () => {
    if (!p5Promise) {
        p5Promise = import('p5').then(m => m.default || m);
    }
    return p5Promise;
};

const sketch = (p: p5) => {
    p.setup = () => {
        const canvas = p.createCanvas(props.size, props.size);
        // 優化：針對 2D context 開啟 willReadFrequently
        (canvas.elt as HTMLCanvasElement).getContext('2d', { willReadFrequently: true });
        
        p.noLoop();
        p.pixelDensity(1);
        isReady.value = true;
        emit('ready');
    };
};

const drawGabor = () => {
    if (!p5Instance) return;
    const p = p5Instance;

    const { orientation, frequency, contrast, sigma, phase } = props.params;
    const theta = p.radians(orientation);
    const cosTheta = p.cos(theta);
    const sinTheta = p.sin(theta);
    const w = p.width;
    const h = p.height;
    const cx = w / 2;
    const cy = h / 2;

    const s = sigma || props.size / 6.5;
    const twoSqSigma = 2 * s * s;

    // 效能優化：預先提取顏色數值，避免在循環中重複建立物件與呼叫函式
    const c1 = p.color(props.primaryColor);
    const c2 = p.color(props.secondaryColor);
    const r1 = p.red(c1), g1 = p.green(c1), b1 = p.blue(c1);
    const r2 = p.red(c2), g2 = p.green(c2), b2 = p.blue(c2);
    const rd = r2 - r1, gd = g2 - g1, bd = b2 - b1;

    const TWO_PI = p.TWO_PI;

    p.clear();
    p.loadPixels();

    // 核心循環優化
    for (let y = 0; y < h; y++) {
        const yy = y - cy;
        const rowOffset = y * w;
        for (let x = 0; x < w; x++) {
            const xx = x - cx;

            // 旋轉與波長計算
            const rx = xx * cosTheta + yy * sinTheta;
            const distSq = xx * xx + yy * yy;
            
            // 高斯包絡與餘弦載波
            const envelope = Math.exp(-(distSq) / twoSqSigma);
            const carrier = Math.cos(TWO_PI * frequency * rx + phase);
            const modulation = carrier * contrast * envelope;

            // 手動顏色插值 (避免使用 lerpColor)
            const t = (modulation + 1) * 0.5;
            const index = (x + rowOffset) * 4;

            p.pixels[index] = r1 + rd * t;
            p.pixels[index + 1] = g1 + gd * t;
            p.pixels[index + 2] = b1 + bd * t;
            p.pixels[index + 3] = Math.min(envelope * 255, 255);
        }
    }

    p.updatePixels();
};

const triggerInvert = () => {
    isInverted.value = true;
    setTimeout(() => { isInverted.value = false; }, 150);
};

const triggerShake = () => {
    isShaking.value = true;
    setTimeout(() => { isShaking.value = false; }, 300);
};

defineExpose({ triggerInvert, triggerShake, drawGabor });

onMounted(async () => {
    if (canvasContainer.value) {
        try {
            const p5Constructor = await loadP5();
            if (p5Constructor) {
                p5Instance = new p5Constructor(sketch, canvasContainer.value);
            }
        } catch (e) {
            console.error('Failed to load p5.js', e);
        }
    }
});

onUnmounted(() => {
    if (p5Instance) {
        p5Instance.remove();
        p5Instance = null;
    }
});

watch(() => props.params, () => {
    if (p5Instance) drawGabor();
}, { deep: true });

watch([() => props.primaryColor, () => props.secondaryColor], () => {
    if (p5Instance) drawGabor();
});
</script>

<style scoped>
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-2px); }
    75% { transform: translateX(2px); }
}
.animate-shake { animation: shake 0.3s ease-in-out; }
.invert { filter: invert(1); }
</style>
