<template>
  <div class="flex flex-col w-full max-w-[370px] mx-auto gap-2 select-none">
    <!-- Calendar Header -->
    <div class="flex flex-row justify-between items-center w-full h-7 mb-2">
      <div class="flex items-center">
        <h2 class="text-base font-bold text-on-surface-variant mix-blend-plus-darker">
          {{ currentYear }}年 {{ currentMonth + 1 }}月
        </h2>
      </div>
      <div class="flex flex-row gap-4">
        <button 
          @click="prevMonth"
          class="w-7 h-7 flex items-center justify-center rounded-full hover:bg-surface-variant transition-colors"
        >
          <Icon name="material-symbols:arrow-back-ios-new-rounded" size="16" class="text-on-surface" />
        </button>
        <button 
          @click="nextMonth"
          class="w-7 h-7 flex items-center justify-center rounded-full hover:bg-surface-variant transition-colors"
        >
          <Icon name="material-symbols:arrow-forward-ios-rounded" size="16" class="text-on-surface" />
        </button>
      </div>
    </div>

    <!-- Calendar Grid Container -->
    <div class="flex flex-col items-center">
      <!-- Days of the week -->
      <div class="grid grid-cols-7 w-full h-12">
        <div v-for="day in ['日', '一', '二', '三', '四', '五', '六']" :key="day"
          class="flex items-center justify-center text-base text-on-surface font-normal">
          {{ day }}
        </div>
      </div>

      <!-- Date Grid -->
      <div class="grid grid-cols-7 w-full">
        <!-- Empty cells for padding start of month -->
        <div v-for="n in paddingDays" :key="'empty-'+n" class="h-12 w-full"></div>
        
        <!-- Actual Days -->
        <div v-for="day in daysInMonth" :key="day" 
          class="h-12 flex items-center justify-center relative group">
          
          <!-- Achievement Background (Capsule Style) -->
          <div v-if="hasAchievement(day)"
            class="absolute h-10 bg-primary z-0 transition-all duration-200"
            :class="getCapsuleClasses(day)"
          ></div>

          <!-- Day Text -->
          <div 
            class="relative z-10 w-10 h-10 flex items-center justify-center text-base transition-all"
            :class="[
              hasAchievement(day) ? 'text-on-primary' : 'text-on-surface',
              isToday(day) ? 'font-bold border-2 border-primary rounded-full' : ''
            ]"
          >
            {{ day }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  // 傳入的紀錄資料，Key 為 "YYYY-MM-DD"
  achievements?: Record<string, string>
}>()

const displayDate = ref(new Date())

const currentYear = computed(() => displayDate.value.getFullYear())
const currentMonth = computed(() => displayDate.value.getMonth())

// 計算該月第一天是星期幾 (0-6)
const paddingDays = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 1).getDay()
})

// 計算該月總天數
const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
})

const prevMonth = () => {
  displayDate.value = new Date(currentYear.value, currentMonth.value - 1, 1)
}

const nextMonth = () => {
  displayDate.value = new Date(currentYear.value, currentMonth.value + 1, 1)
}

const isToday = (day: number) => {
  const today = new Date()
  return today.getDate() === day && 
         today.getMonth() === currentMonth.value && 
         today.getFullYear() === currentYear.value
}

// 輔助函式：判斷某日是否有紀錄
const hasAchievement = (day: number) => {
  if (day < 1 || day > daysInMonth.value) return false
  const dateKey = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  return !!props.achievements?.[dateKey]
}

// 取得膠囊樣式的 Class
const getCapsuleClasses = (day: number) => {
  const col = (paddingDays.value + day - 1) % 7
  
  // 判斷左鄰居：昨天有紀錄且今天不是週日
  const hasPrev = hasAchievement(day - 1) && col > 0
  // 判斷右鄰居：明天有紀錄且今天不是週六
  const hasNext = hasAchievement(day + 1) && col < 6

  const classes = []

  // 決定寬度與水平定位
  if (hasPrev && hasNext) {
    classes.push('w-full left-0 right-0') // 中間：全寬
  } else if (hasPrev) {
    classes.push('w-[calc(100%-4px)] left-0 rounded-r-full') // 終點：左接，右圓
  } else if (hasNext) {
    classes.push('w-[calc(100%-4px)] right-0 rounded-l-full') // 起點：右接，左圓
  } else {
    classes.push('w-10 rounded-full') // 獨立：正圓
  }

  return classes.join(' ')
}
</script>
