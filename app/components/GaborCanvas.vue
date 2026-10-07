<template>
    <canvas 
        ref="canvasRef"
        :width="pixelSize"
        :height="pixelSize"
        :style="{ width: `${size}px`, height: `${size}px` }"
        class="transition-transform duration-150"
        :class="{ 'animate-shake': isShaking, 'invert': isInverted }"
    ></canvas>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';

const props = withDefaults(defineProps<{
    size?: number;
    params?: any;
    primaryColor?: string;
    secondaryColor?: string;
    /**
     * 空間輪廓（Gaussian 包絡 × 條紋）的 gamma。
     * 1 = 線性（淺色模式）；< 1 會抬升中低強度區域，讓墨暈在深色底上不至於糊進背景。
     * 峰值強度不受影響，因此難度引擎的 contrast 語意保持不變。
     */
    profileGamma?: number;
}>(), {
    size: 200,
    primaryColor: '#FFFFFF',
    secondaryColor: '#000000',
    profileGamma: 1,
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

// 畫布像素尺寸 = CSS 尺寸 × devicePixelRatio，Retina 螢幕才不會被放大而模糊。
// 上限 3，避免高密度螢幕上大網格的像素量失控。
const MAX_PIXEL_RATIO = 3;
const pixelRatio = typeof window === 'undefined' ? 1 : Math.min(MAX_PIXEL_RATIO, window.devicePixelRatio || 1);
const pixelSize = computed(() => Math.max(1, Math.round(props.size * pixelRatio)));

// 解析 Hex 顏色
const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
};

const smoothstep = (edge0: number, edge1: number, value: number) => {
    const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
};

const drawGabor = () => {
    const canvas = canvasRef.value;
    if (!canvas) return;

    // 使用 willReadFrequently: true 雖然我們主要使用 putImageData，
    // 但這能確保瀏覽器優化記憶體配置。
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const { orientation, frequency, contrast, sigma, phase } = props.params;
    // w 是 CSS 尺寸，所有長度參數（frequency、sigma、邊緣淡出）都以 CSS px 計；
    // 迴圈內把畫布像素座標除以 scale 換回 CSS px，斑塊外觀因此不隨 dpr 改變。
    const w = props.size;
    const px = pixelSize.value;
    const scale = px / w;
    const cx = px / 2;
    const cy = px / 2;

    const s = Math.min(sigma || w / 3.8, w * 0.32);
    const sigmaAcross = s * 0.62;
    const sigmaAlong = s * 0.82;
    const twoSqSigmaAcross = 2 * sigmaAcross * sigmaAcross;
    const twoSqSigmaAlong = 2 * sigmaAlong * sigmaAlong;
    const theta = (orientation * Math.PI) / 180;
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);

    // 直接建立新的 ImageData，避免 readback
    const imageData = ctx.createImageData(px, px);
    const data = imageData.data;
    const stripeColor = hexToRgb(props.secondaryColor);
    const gamma = props.profileGamma;
    const isLinearProfile = gamma === 1;

    const TWO_PI = Math.PI * 2;
    const fadeStart = w * 0.28;
    const fadeEnd = w * 0.4;
    const fadeEndSq = fadeEnd * fadeEnd;

    for (let y = 0; y < px; y++) {
        const yy = (y - cy) / scale;
        const rowOffset = y * px;
        for (let x = 0; x < px; x++) {
            const xx = (x - cx) / scale;

            // 淡出半徑以外 alpha 必為 0，ImageData 預設就是全透明，直接跳過。
            const distSq = xx * xx + yy * yy;
            if (distSq >= fadeEndSq) continue;

            // 旋轉與座標計算：rx 控制條紋明暗，ry 控制符號沿條紋方向的柔邊延展。
            const rx = xx * cosTheta + yy * sinTheta;
            const ry = -xx * sinTheta + yy * cosTheta;
            
            // 墨暈式 Gabor：透明底上疊黑色條紋，外緣用橢圓 Gaussian 柔化。
            const distNormalized = (rx * rx / twoSqSigmaAcross) + (ry * ry / twoSqSigmaAlong);
            const envelope = Math.exp(-distNormalized);
            const edgeFade = 1 - smoothstep(fadeStart, fadeEnd, Math.sqrt(distSq));
            const carrier = Math.cos(TWO_PI * frequency * rx + phase);
            const profile = envelope * edgeFade * ((carrier + 1) * 0.5);
            const shaped = isLinearProfile ? profile : Math.pow(profile, gamma);
            const dark = Math.min(1, shaped * contrast);

            const index = (rowOffset + x) * 4;

            data[index] = stripeColor.r;
            data[index + 1] = stripeColor.g;
            data[index + 2] = stripeColor.b;
            data[index + 3] = Math.round(255 * dark);
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

// 元件自行負責重繪：任何影響畫面的 prop 變動都只觸發一次 drawGabor。
// flush: 'post' 確保在 <canvas> 的 width/height 屬性更新（會清空畫布）之後才繪製，
// 因此尺寸變化不需要外部再補一次繪製。
watch(
    [() => props.params, () => props.size, () => props.primaryColor, () => props.secondaryColor, () => props.profileGamma],
    drawGabor,
    { deep: true, flush: 'post' }
);
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
