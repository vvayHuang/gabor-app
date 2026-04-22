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
// Use type-only import to avoid SSR issues
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

// Shared p5 loader promise
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
        // Set willReadFrequently to true for the 2D context to optimize pixels operations
        const ctx = (canvas.elt as HTMLCanvasElement).getContext('2d', { willReadFrequently: true });
        
        p.noLoop();
        p.pixelDensity(1);
        // Don't draw automatically, wait for parent to call it
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

    // Sigma defines the "spread" of the patch
    const s = sigma || props.size / 6.5;
    const twoSqSigma = 2 * s * s;

    // Parse colors
    const c1 = p.color(props.primaryColor);
    const c2 = p.color(props.secondaryColor);

    p.clear();
    p.loadPixels();

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const xx = x - cx;
            const yy = y - cy;

            // Rotate coordinates
            const rx = xx * cosTheta + yy * sinTheta;

            // Gaussian envelope calculation
            const distSq = xx * xx + yy * yy;
            const envelope = p.exp(-(distSq) / twoSqSigma);

            // Sinusoidal carrier
            const carrier = p.cos(p.TWO_PI * frequency * rx + phase);

            // Real Gabor: Modulate carrier by contrast AND envelope
            // This ensures the contrast fades towards the edges
            const modulation = carrier * contrast * envelope;

            // Map modulation [-1, 1] to t [0, 1] for color interpolation
            // 0.5 is the neutral mid-point (gray if c1=white, c2=black)
            const t = (modulation + 1) / 2;

            const index = (x + y * w) * 4;
            const finalColor = p.lerpColor(c1, c2, t);
            
            p.pixels[index] = p.red(finalColor);
            p.pixels[index + 1] = p.green(finalColor);
            p.pixels[index + 2] = p.blue(finalColor);

            // Use the envelope for alpha to blend with background
            // Higher power makes the edges cleaner
            const alpha = p.constrain(envelope * 255, 0, 255);
            p.pixels[index + 3] = alpha;
        }
    }

    p.updatePixels();
};

// Visual Feedback: Invert effect
const triggerInvert = () => {
    isInverted.value = true;
    setTimeout(() => {
        isInverted.value = false;
    }, 150);
};

// Visual Feedback: Shake effect
const triggerShake = () => {
    isShaking.value = true;
    setTimeout(() => {
        isShaking.value = false;
    }, 300);
};

// Expose methods to parent
defineExpose({
    triggerInvert,
    triggerShake,
    drawGabor
});

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
    if (p5Instance) {
        drawGabor();
    }
}, { deep: true });

watch([() => props.primaryColor, () => props.secondaryColor], () => {
    if (p5Instance) {
        drawGabor();
    }
});

</script>

<style scoped>
@keyframes shake {

    0%,
    100% {
        transform: translateX(0);
    }

    25% {
        transform: translateX(-2px);
    }

    75% {
        transform: translateX(2px);
    }
}

.animate-shake {
    animation: shake 0.3s ease-in-out;
}

.invert {
    filter: invert(1);
}
</style>
