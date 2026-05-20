import { onMounted, onUnmounted, type Ref } from 'vue';
import { gsap } from 'gsap';

interface TiltOptions {
    maxRotation?: number;    // 最大傾斜角度 (預設 8 度)
    perspective?: number;    // 透視距離 (預設 1000px)
    scale?: number;          // 懸浮時縮放比例 (預設 1.0)
    durationEnter?: number;  // 進入/移動時的過渡時長 (秒，預設 0.4)
    durationExit?: number;   // 移出還原時的過渡時長 (秒，預設 0.6)
}

/**
 * 桌面端專用卡片 3D 懸浮傾斜 Composable
 * @param targetRef Vue 的 HTMLElement Ref
 * @param options 配置項
 */
export function use3DTilt(targetRef: Ref<HTMLElement | null>, options: TiltOptions = {}) {
    const {
        maxRotation = 8,
        perspective = 1000,
        scale = 1.0,
        durationEnter = 0.4,
        durationExit = 0.6
    } = options;

    let isMobile = true;

    const handleMouseMove = (e: MouseEvent) => {
        if (isMobile || !targetRef.value) return;

        const el = targetRef.value;
        const rect = el.getBoundingClientRect();

        // 計算滑鼠在元件內部的相對坐標
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // 轉換為 [-1, 1] 比例區間
        const percentX = (x / rect.width) * 2 - 1;
        const percentY = (y / rect.height) * 2 - 1;

        // 計算 3D 旋轉角度 (X 軸對應垂直位移的相反數，Y 軸對應水平位移)
        const rotateX = -percentY * maxRotation;
        const rotateY = percentX * maxRotation;

        // 透過 GSAP 進行流暢物理平滑插值
        gsap.to(el, {
            rotateX,
            rotateY,
            scale,
            transformPerspective: perspective,
            duration: durationEnter,
            ease: 'power2.out',
            overwrite: 'auto'
        });
    };

    const handleMouseLeave = () => {
        if (isMobile || !targetRef.value) return;

        const el = targetRef.value;

        // 平滑還原至初始狀態
        gsap.to(el, {
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            transformPerspective: perspective,
            duration: durationExit,
            ease: 'power2.out',
            overwrite: 'auto'
        });
    };

    onMounted(() => {
        // 性能與裝置保護：使用媒體查詢判斷是否為支援 hover 的指針裝置 (如滑鼠)
        // 排除行動端 Touch 裝置，防範觸控延遲與效能耗損
        isMobile = !window.matchMedia('(hover: hover)').matches;

        if (!isMobile && targetRef.value) {
            const el = targetRef.value;
            // 啟用 GPU 硬體加速，防止 3D 旋轉鋸齒與閃爍
            gsap.set(el, {
                force3D: true,
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden'
            });

            el.addEventListener('mousemove', handleMouseMove);
            el.addEventListener('mouseleave', handleMouseLeave);
        }
    });

    onUnmounted(() => {
        if (!isMobile && targetRef.value) {
            const el = targetRef.value;
            el.removeEventListener('mousemove', handleMouseMove);
            el.removeEventListener('mouseleave', handleMouseLeave);
        }
    });
}
