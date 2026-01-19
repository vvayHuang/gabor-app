<template>
    <div ref="canvasContainer" class="overflow-hidden rounded-full relative"
        :style="{ width: size + 'px', height: size + 'px' }"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';

const props = withDefaults(defineProps<{
    size?: number;
    params?: {
        orientation: number;
        frequency: number;
        contrast: number;
        sigma: number;
        phase: number;
    };
}>(), {
    size: 200,
    params: () => ({
        orientation: 45,
        frequency: 1,
        contrast: 0.5,
        sigma: 20,
        phase: 0,
    })
});

const canvasContainer = ref<HTMLElement | null>(null);
let p5Instance: any = null;

const initP5 = async () => {
    if (process.client) {
        const p5 = (await import('p5')).default;

        const sketch = (p: any) => {
            p.setup = () => {
                p.createCanvas(props.size, props.size);
                p.noLoop();
            };

            p.draw = () => {
                p.background(128); // 50% gray

                // Simple wireframe representation of a Gabor patch
                // For actual Gabor, we need pixel manipulation, but for wireframe, 
                // we can draw alternating lines to represent frequency and orientation.

                const cx = p.width / 2;
                const cy = p.height / 2;
                const radius = props.size / 2;

                p.push();
                p.translate(cx, cy);
                p.rotate(p.radians(props.params.orientation));

                p.stroke(255); // White for high contrast parts
                p.strokeWeight(2); // Thicker lines for visibility

                // Frequency determines spacing
                // Map mock frequency 1-10 to pixel spacing 20-2
                const spacing = p.map(props.params.frequency, 0.1, 10, 40, 5);

                for (let x = -radius; x < radius; x += spacing) {
                    // Draw lines across
                    p.line(x, -radius, x, radius);
                }

                // Mocking the Gaussian envelope (sigma) by just masking the outer edges with a vignette or just circle
                // The container is rounded-full so it handles the circular shape.

                p.pop();

                // Overlay a semi-transparent gray to mock contrast if needed, 
                // strictly wireframe: keep it simple high contrast lines.
            };
        };

        if (canvasContainer.value) {
            if (p5Instance) p5Instance.remove();
            p5Instance = new p5(sketch, canvasContainer.value);
        }
    }
};

onMounted(() => {
    initP5();
});

onUnmounted(() => {
    if (p5Instance) {
        p5Instance.remove();
    }
});

watch(() => [props.size, props.params], () => {
    if (p5Instance) {
        // Re-init to handle size changes or just redraw
        // Simplest is to remove and re-init for size changes
        initP5();
    }
}, { deep: true });
</script>
