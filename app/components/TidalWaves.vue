<template>
    <div ref="p5Container" class="w-full h-full"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import type p5 from 'p5';

const props = withDefaults(defineProps<{
    waveColor?: string;
    speed?: number;
}>(), {
    waveColor: '#4A90E2',
    speed: 0.005
});

const p5Container = ref<HTMLElement | null>(null);
let p5Instance: p5 | null = null;

const sketch = (p: p5) => {
    let waves: WaveLayer[] = [];

    class WaveLayer {
        yOffset: number;
        speed: number;
        amplitude: number;
        baseY: number;
        color: p5.Color;
        noiseStep: number;

        constructor(baseY: number, amplitude: number, speed: number, color: string, noiseStep: number) {
            this.baseY = baseY;
            this.amplitude = amplitude;
            this.speed = speed;
            this.color = p.color(color);
            this.yOffset = p.random(1000);
            this.noiseStep = noiseStep;
        }

        display() {
            p.fill(this.color);
            p.noStroke();
            p.beginShape();
            
            // 繪製波浪曲線：確保最後一個點精確鎖定在 p.width
            const xStep = 10; 
            for (let x = 0; x <= p.width + xStep; x += xStep) {
                const currentX = x > p.width ? p.width : x;
                let ny = p.noise(currentX * this.noiseStep, this.yOffset) * this.amplitude;
                p.vertex(currentX, this.baseY + ny);
                if (currentX >= p.width) break;
            }

            // 封閉形狀至底部
            p.vertex(p.width, p.height);
            p.vertex(0, p.height);
            p.endShape(p.CLOSE);

            this.yOffset += this.speed;
        }
    }

    p.setup = () => {
        p.createCanvas(p5Container.value?.clientWidth || 400, p5Container.value?.clientHeight || 400);
        
        // 建立 4 層不同深淺與速度的海浪
        const colors = [
            'rgba(74, 144, 226, 0.3)',
            'rgba(58, 120, 190, 0.4)',
            'rgba(42, 96, 154, 0.5)',
            'rgba(26, 72, 118, 0.7)'
        ];

        for (let i = 0; i < 4; i++) {
            waves.push(new WaveLayer(
                p.height * (0.6 + i * 0.08), // baseY
                60 + i * 20,                // amplitude
                props.speed * (1 - i * 0.1), // speed
                colors[i],                   // color
                0.005 + i * 0.002            // noiseStep
            ));
        }
    };

    p.draw = () => {
        p.clear(0, 0, 0, 0);
        for (let wave of waves) {
            wave.display();
        }
    };

    p.windowResized = () => {
        if (p5Container.value) {
            p.resizeCanvas(p5Container.value.clientWidth, p5Container.value.clientHeight);
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
/* 確保 p5 產生的 canvas 完完全全填滿容器，不留任何縫隙 */
:deep(canvas) {
    display: block !important;
    width: 100% !important;
    height: 100% !important;
}
</style>
