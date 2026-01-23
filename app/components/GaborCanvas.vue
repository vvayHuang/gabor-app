<template>
    <div ref="canvasContainer" class="relative flex items-center justify-center [&>canvas]:rounded-full"
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
}>(), {
    size: 200,
    params: () => ({
        orientation: 0,
        frequency: 0.05,
        contrast: 1,
        sigma: 40,
        phase: 0
    })
});

const canvasContainer = ref<HTMLElement | null>(null);
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
    
    // Clear background to ensure transparency works
    p.clear();
    p.loadPixels();

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const xx = x - cx;
            const yy = y - cy;

            // Rotate coordinates
            const rx = xx * cosTheta + yy * sinTheta;

            // Gaussian envelope - controls contrast falloff and alpha
            const distSq = xx * xx + yy * yy;
            const envelope = p.exp(-(distSq) / (2 * sigma * sigma));

            // Sinusoidal carrier
            // Formula: sin(rotX * frequency * TWO_PI)
            const carrier = p.sin(p.TWO_PI * frequency * rx + phase);

            // Calculate final grayscale value
            // Formula: 127 + (127 * sineVal * gaussVal * contrast)
            const gray = 127 + (127 * carrier * envelope * contrast);
            
            const index = (x + y * w) * 4;
            p.pixels[index]     = gray;
            p.pixels[index + 1] = gray;
            p.pixels[index + 2] = gray;
            // Alpha controlled by envelope for smooth circular fade
            p.pixels[index + 3] = p.map(envelope, 0, 1, 0, 255);
        }
    }

    p.updatePixels();
};

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

</script>
