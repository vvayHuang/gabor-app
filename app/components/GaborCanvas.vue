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

const canvasContainer = ref<HTMLElement | null>(null);
const isShaking = ref(false);
const isInverted = ref(false);
let p5Instance: p5 | null = null;
// Store the p5 class constructor dynamically
let p5Constructor: typeof p5 | null = null;

const sketch = (p: p5) => {
    p.setup = () => {
        p.createCanvas(props.size, props.size);
        p.noLoop();
        p.pixelDensity(1); // Ensure consistent pixel manipulation
        drawGabor();
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

    // Tighter sigma for "concentrated" look as requested
    // Previously passed as prop (40), now we override or adjust relative to size if needed
    // User wants "line range concentrated", so let's use a smaller dynamic sigma
    const effectiveSigma = props.size ? props.size / 6 : sigma;

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

            const distSq = xx * xx + yy * yy;
            const envelope = p.exp(-(distSq) / (2 * effectiveSigma * effectiveSigma));

            const carrier = p.sin(p.TWO_PI * frequency * rx + phase);

            const t = (carrier * contrast + 1) / 2;
            const interpolatedColor = p.lerpColor(c1, c2, t);

            // Add Noise
            // Random value between -20 and 20 added to RGB channels
            const noise = p.random(-20, 20);

            const index = (x + y * w) * 4;
            p.pixels[index] = p.constrain(p.red(interpolatedColor) + noise, 0, 255);
            p.pixels[index + 1] = p.constrain(p.green(interpolatedColor) + noise, 0, 255);
            p.pixels[index + 2] = p.constrain(p.blue(interpolatedColor) + noise, 0, 255);
            p.pixels[index + 3] = p.map(envelope, 0, 1, 0, 255);
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
    triggerShake
});

onMounted(async () => {
    if (canvasContainer.value) {
        try {
            // Dynamically import p5 to run only on client-side
            const p5Module = await import('p5');
            // Check if default export exists, otherwise use module itself (depends on build)
            p5Constructor = p5Module.default || p5Module;

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
