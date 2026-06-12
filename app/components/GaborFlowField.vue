<template>
    <div ref="p5Container" class="w-full h-full overflow-hidden absolute inset-0 -z-50 pointer-events-none transition-opacity duration-1000"
         :class="[isMobile ? 'opacity-0' : 'opacity-100']"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import type p5 from 'p5';
import { useGameState } from '~/composables/useGameState';

const p5Container = ref<HTMLElement | null>(null);
let p5Instance: p5 | null = null;
const isMobile = ref(true);

const { state } = useGameState();

const sketch = (p: p5) => {
    let gridSpacing = 48; // 網格間距 (8px 網格的 6 倍，確保高效性能)
    let cols = 0;
    let rows = 0;
    let timeOffset = 0;
    const noiseScale = 0.0015; // 雜訊縮放係數，控制流動平滑度
    const mouseRadius = 220;   // 滑鼠互動影響半徑

    p.setup = () => {
        const width = p5Container.value?.clientWidth || window.innerWidth;
        const height = p5Container.value?.clientHeight || window.innerHeight;
        p.createCanvas(width, height);
        p.frameRate(30); // 鎖定 30 FPS，兼顧流暢度與低耗電量

        cols = p.floor(width / gridSpacing) + 2;
        rows = p.floor(height / gridSpacing) + 2;
    };

    p.draw = () => {
        p.clear(0, 0, 0, 0);

        const mouseX = p.mouseX;
        const mouseY = p.mouseY;

        // 流場時間遞增 (速度極緩慢，維持放鬆專注感)
        timeOffset += 0.003;

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const x = i * gridSpacing;
                const y = j * gridSpacing;

                // 1. 基於柏林雜訊計算該節點的基礎角度
                const baseNoise = p.noise(x * noiseScale, y * noiseScale, timeOffset);
                let angle = baseNoise * p.TWO_PI * 1.5;

                // 2. 計算滑鼠位置與節點的物理距離，實作互動漣漪效應
                const dx = mouseX - x;
                const dy = mouseY - y;
                const distance = p.sqrt(dx * dx + dy * dy);

                let rippleIntensity = 0;
                if (distance < mouseRadius) {
                    // 越接近滑鼠，漣漪偏轉強度越強
                    rippleIntensity = p.map(distance, 0, mouseRadius, 1.0, 0);
                    // 游標位置產生的偏轉方向
                    const angleToMouse = p.atan2(dy, dx);
                    // 平滑揉合基礎角度與滑鼠漣漪角度
                    angle = p.lerp(angle, angleToMouse + p.HALF_PI, rippleIntensity * 0.7);
                }

                // 3. 設定微幅波動的基礎透明度，並提高透明度數值（提升明顯度）
                // 基礎透明度調高至 15% ~ 23%，當滑鼠靠近時顯著亮起至最高 38%，強化互動回饋
                const baseOpacity = 0.15 + (p.noise(x * 0.01, y * 0.01, timeOffset) * 0.08);
                const opacity = p.lerp(baseOpacity, 0.38, rippleIntensity);

                // 4. 繪製微型 Gabor 斑塊模擬特徵 (三條平行線組成之 Gaussian 調製光柵)
                p.push();
                p.translate(x, y);
                p.rotate(angle);

                // 設定極淺藍灰背景下的深色條紋 (#181C23 混合對比)，線條寬度加粗 (從 1.6 提升至 2.0)
                p.noFill();
                p.strokeWeight(2.0);

                // A. 中央主條紋 ( Gaussian 峰值，透明度最高 )
                p.drawingContext.strokeStyle = `rgba(24, 28, 35, ${opacity})`;
                p.line(-15, 0, 15, 0);

                // B. 兩側副條紋 ( Gaussian 衰減，長度縮短且透明度減半 )
                p.drawingContext.strokeStyle = `rgba(24, 28, 35, ${opacity * 0.55})`;
                p.line(-11, -5, 11, -5);
                p.line(-11, 5, 11, 5);

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

// 性能關鍵：聯動遊戲狀態暫停背景重繪，將 100% 效能釋放給核心遊戲畫布
watch(() => state.gameState, (newState) => {
    if (!p5Instance) return;
    if (newState === 'PLAYING') {
        p5Instance.noLoop(); // 遊戲中暫停，確保 60 FPS
    } else {
        p5Instance.loop();   // 非遊戲中重啟動態背景
    }
});

onMounted(async () => {
    // 裝置能力判定：僅在支援 hover 的滑鼠指針設備且螢幕大於 1024px 時載入，避免行動端消耗資源
    isMobile.value = !window.matchMedia('(hover: hover)').matches || window.innerWidth < 1024;

    if (!isMobile.value) {
        const p5Lib = await import('p5').then(m => m.default || m);
        if (p5Container.value) {
            p5Instance = new p5Lib(sketch, p5Container.value);
            
            // 初始化時若已處於遊戲狀態，預設不重繪
            if (state.gameState === 'PLAYING') {
                p5Instance.noLoop();
            }
        }
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
