<template>
    <canvas 
        ref="canvasRef"
        :width="size"
        :height="size"
        class="rounded-full transition-transform duration-150"
        :class="{ 'animate-shake': isShaking, 'invert': isInverted }"
    ></canvas>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

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

const canvasRef = ref<HTMLCanvasElement | null>(null);
const isShaking = ref(false);
const isInverted = ref(false);

// 解析 Hex 顏色
const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
};

const drawGabor = () => {
    const canvas = canvasRef.value;
    if (!canvas) return;

    // 使用 willReadFrequently: true 雖然我們主要使用 putImageData，
    // 但這能確保瀏覽器優化記憶體配置。
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const { orientation, frequency, contrast, sigma, phase } = props.params;
    const w = props.size;
    const h = props.size;
    const cx = w / 2;
    const cy = h / 2;

    const s = sigma || w / 6.5;
    const twoSqSigma = 2 * s * s;
    const theta = (orientation * Math.PI) / 180;
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);

    const bg = hexToRgb(props.primaryColor);
    const fg = hexToRgb(props.secondaryColor);
    const rd = fg.r - bg.r;
    const gd = fg.g - bg.g;
    const bd = fg.b - bg.b;

    // 直接建立新的 ImageData，避免 readback
    const imageData = ctx.createImageData(w, h);
    const data = imageData.data;

    const TWO_PI = Math.PI * 2;

    for (let y = 0; y < h; y++) {
        const yy = y - cy;
        const rowOffset = y * w;
        for (let x = 0; x < w; x++) {
            const xx = x - cx;

            // 旋轉與座標計算
            const rx = xx * cosTheta + yy * sinTheta;
            const distSq = xx * xx + yy * yy;
            
            // 蓋博數學模型
            const distNormalized = distSq / twoSqSigma;
            const envelope = Math.exp(-distNormalized);
            const carrier = Math.cos(TWO_PI * frequency * rx + phase);
            
            // 非線性顏色與透明度處理 (對齊參考圖)
            const t = ((1.0 - carrier) * 0.5) * contrast;
            const finalT = Math.pow(t * envelope, 0.65);

            const index = (rowOffset + x) * 4;

            data[index]     = bg.r + rd * finalT;
            data[index + 1] = bg.g + gd * finalT;
            data[index + 2] = bg.b + bd * finalT;
            data[index + 3] = envelope * 255;
        }
    }

    ctx.putImageData(imageData, 0, 0);
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

onMounted(() => {
    drawGabor();
    emit('ready');
});

watch(() => props.params, drawGabor, { deep: true });
watch([() => props.primaryColor, () => props.secondaryColor], drawGabor);
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
