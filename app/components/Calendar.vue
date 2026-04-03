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
        <div v-for="n in paddingDays" :key="'empty-'+n" class="h-12 w-10 mx-auto"></div>
        
        <!-- Actual Days -->
        <div v-for="day in daysInMonth" :key="day" 
          class="h-12 flex items-center justify-center relative">
          <!-- Achievement Backgrounds (Heatmap style) -->
          <div 
            class="w-10 h-10 flex items-center justify-center rounded-full text-base transition-all"
            :class="[
              getAchievementStatus(day),
              isToday(day) ? 'border border-primary text-on-surface font-bold' : 'text-on-surface'
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

// 取得該日期的成就狀態樣式
const getAchievementStatus = (day: number) => {
  const dateKey = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  const status = props.achievements?.[dateKey] || ''
  
  const styles: Record<string, string> = {
    'level-1': 'bg-[#A8C8FF] text-white',
    'level-2': 'bg-[#76ACFF] text-white',
    'level-3': 'bg-[#3491FF] text-white',
    'level-4': 'bg-[#0076DF] text-white',
    'level-5': 'bg-[#005BAF] text-white'
  }
  
  return styles[status] || ''
}
</script>
