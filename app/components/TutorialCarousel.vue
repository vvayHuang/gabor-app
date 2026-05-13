<template>
  <div class="flex-1 flex flex-col w-full overflow-hidden">
    <!-- Slides Container -->
    <div 
      ref="scrollContainer"
      class="flex-1 flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
      @scroll="handleScroll"
    >
      <!-- Carousel Content with Clones for Infinite Loop -->
      <div 
        v-for="(step, idx) in displaySteps" 
        :key="idx"
        class="w-full flex-shrink-0 snap-center flex flex-col items-center justify-center px-4"
      >
        <!-- Illustration Container -->
        <div class="flex items-center justify-center w-full h-[360px] mb-8">
            
            <!-- Step 1 & 2 logic (Observe / Find) -->
            <div v-if="step.type === 'gabor'" class="grid grid-cols-3 gap-4 w-full max-w-[320px]">
                <div v-for="i in 6" :key="`g-${idx}-${i}`" class="aspect-square flex items-center justify-center relative">
                    <div class="absolute inset-0 flex items-center justify-center z-10">
                        <ClientOnly>
                            <GaborCanvas
                                ref="gaborRefs"
                                :size="80"
                                :params="getGaborParams(step.id, i)"
                                primary-color="#FFFFFF"
                                secondary-color="#000000"
                                @ready="handleReady"
                            />
                        </ClientOnly>
                    </div>                    <!-- Success Feedback (Only for Step 2) -->
                    <div v-if="step.id === 1 && i === 5" 
                         class="absolute inset-0 rounded-full border-[6px] border-primary bg-primary/30 shadow-[0_0_30px_rgba(var(--primary-rgb),0.6)] z-30 animate-pulse">
                    </div>
                </div>
            </div>

            <!-- Step 3 logic (Records) -->
            <div v-else class="w-full px-4 space-y-6">
                <div class="space-y-4">
                    <div class="flex items-end space-x-4">
                        <h3 class="display-lg-emphasis text-primary">7</h3>
                        <span class="title-lg-emphasis text-primary">連續達成天數</span>
                    </div>
                    <div class="bg-surface-container p-4 rounded-2xl shadow-sm border border-outline-variant/20">
                        <div class="grid grid-cols-7 gap-2">
                            <div v-for="day in 21" :key="day" 
                                class="aspect-square rounded-full flex items-center justify-center text-[10px] font-bold"
                                :class="[day <= 7 ? 'bg-primary text-white' : 'bg-surface-variant text-on-surface-variant']">
                                {{ day }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Text Content -->
        <div class="text-left w-full px-4 space-y-2 min-h-[120px]">
            <h3 class="title-lg-emphasis text-on-background">{{ step.title }}</h3>
            <p class="body-lg text-on-surface-variant">{{ step.description }}</p>
        </div>
      </div>
    </div>

    <!-- Page Control (Dots) -->
    <div class="flex justify-center items-center w-full gap-2 h-16">
        <div v-for="(_, i) in steps" :key="i" 
            class="h-2 rounded-full transition-all duration-300"
            :class="[i === activeIndex ? 'w-6 bg-primary' : 'w-2 bg-outline-variant']"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue';

const scrollContainer = ref<HTMLElement | null>(null);
const activeIndex = ref(0);
const gaborRefs = ref<any[]>([]);

const steps = [
  {
    id: 0,
    type: 'gabor',
    title: '觀察盤面',
    description: '進入遊戲後，系統會生成蓋博符號網格。請保持放鬆，觀察所有符號的細微差異。'
  },
  {
    id: 1,
    type: 'gabor',
    title: '找出異類',
    description: '點擊那個角度或頻率與眾不同的符號。正確選中將會以主色光圈標記並進入下一關。'
  },
  {
    id: 2,
    type: 'record',
    title: '持續訓練',
    description: '追蹤你的連續達成天數。穩定的每日練習是提升視力的唯一途徑。'
  }
];

const displaySteps = computed(() => [
    steps[2],
    ...steps,
    steps[0]
]);

const handleReady = () => {
    nextTick(() => {
        gaborRefs.value.forEach(canvas => {
            if (canvas && canvas.drawGabor) {
                canvas.drawGabor();
            }
        });
    });
};

const getGaborParams = (stepId: number, itemIndex: number) => {
    const baseParams = {
        orientation: 45,
        frequency: 0.05,
        contrast: 1,
        sigma: 18,
        phase: 0
    };
    if (itemIndex === 5) {
        return { ...baseParams, orientation: 135 };
    }
    return { ...baseParams };
};

let isJumping = false;

const handleScroll = (event: Event) => {
    if (isJumping) return;

    const container = event.target as HTMLElement;
    const width = container.clientWidth;
    const scrollLeft = container.scrollLeft;
    
    const rawIndex = Math.round(scrollLeft / width);
    
    let visualIdx = rawIndex - 1;
    if (visualIdx < 0) visualIdx = 2;
    if (visualIdx > 2) visualIdx = 0;
    activeIndex.value = visualIdx;

    if (scrollLeft <= 0) {
        jumpTo(3);
    } else if (scrollLeft >= width * 4) {
        jumpTo(1);
    }
};

const jumpTo = (index: number) => {
    isJumping = true;
    nextTick(() => {
        if (scrollContainer.value) {
            scrollContainer.value.scrollLeft = scrollContainer.value.clientWidth * index;
        }
        setTimeout(() => {
            isJumping = false;
        }, 50);
    });
};

onMounted(() => {
    if (scrollContainer.value) {
        scrollContainer.value.scrollLeft = scrollContainer.value.clientWidth;
    }
    
    setTimeout(() => {
        handleReady();
    }, 150);
});
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
