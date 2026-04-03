<template>
  <div class="flex flex-col w-full" :class="{ 'opacity-50 pointer-events-none': disabled }">
    <!-- Input Field Container -->
    <div class="flex flex-row items-center px-4 w-full h-[52px]">
      <div class="flex flex-col justify-center items-start flex-1 h-[52px]">
        <!-- Value Input -->
        <input :value="modelValue" :type="type" :placeholder="placeholder" :disabled="disabled"
          class="w-full h-[51px] bg-transparent outline-none text-[17px] font-[510] leading-[20px] tracking-[-0.43px] text-on-surface-variant flex items-center transition-colors placeholder:text-on-surface-variant"
          @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" @focus="isFocused = true"
          @blur="isFocused = false" />

        <!-- _Separator -->
        <div class="w-full h-[1px] mix-blend-plus-darker transition-colors duration-200" :class="[
          error ? 'bg-error' : (isFocused ? 'bg-primary' : 'bg-outline-variant')
        ]"></div>
      </div>
    </div>

    <!-- Optional Error Message -->
    <p v-if="error && errorMessage" class="mt-1 px-4 text-xs text-error">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  modelValue: string | number
  type?: 'text' | 'email' | 'password' | 'tel' | 'url'
  placeholder?: string
  disabled?: boolean
  error?: boolean
  errorMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  disabled: false,
  error: false,
  errorMessage: ''
})

defineEmits(['update:modelValue'])

const isFocused = ref(false)
</script>
