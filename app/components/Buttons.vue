<template>
    <component :is="to ? NuxtLink : 'button'" :to="to" :type="to ? undefined : type" :class="[
        'flex items-center justify-center transition font-bold',
        // Size classes
        size === 'small' ? 'px-4 py-2 text-sm' :
            size === 'large' ? 'px-8 py-4 text-lg' :
                'px-6 py-3 text-base', // medium default

        // Radius classes - mostly full rounded unless specified
        'rounded-full',

        // Variant classes
        variant === 'primary' ? 'bg-primary text-on-primary hover:bg-primary-container' :
            variant === 'outline' ? 'border border-inverse-on-surface text-inverse-on-surface hover:bg-gray-800' :
                variant === 'ghost' ? 'bg-transparent text-gray-500 hover:text-gray-300 rounded-2xl' : '',

        // Width
        fullWidth ? 'w-full' : '',

        // Layout
        'space-x-3'
    ]" v-bind="$attrs">
        <Icon v-if="icon" :name="icon" :size="iconSize" :mode="iconMode"
            :class="[variant === 'primary' ? 'text-on-primary' : 'text-inverse-on-surface']" />
        <span :class="[
            variant === 'outline' ? 'group-hover:text-white' : ''
        ]">
            <slot>{{ label }}</slot>
        </span>
    </component>
</template>

<script setup lang="ts">
import { NuxtLink } from '#components'
import type { PropType } from 'vue'

const props = defineProps({
    variant: {
        type: String,
        default: 'primary',
        validator: (value: string) => ['primary', 'outline', 'ghost'].includes(value)
    },
    size: {
        type: String,
        default: 'medium',
        validator: (value: string) => ['small', 'medium', 'large'].includes(value)
    },
    label: {
        type: String,
        default: ''
    },
    icon: {
        type: String,
        default: undefined
    },
    to: {
        type: [String, Object],
        default: undefined
    },
    type: {
        type: String,
        default: 'button'
    },
    fullWidth: {
        type: Boolean,
        default: true
    },
    iconSize: {
        type: String,
        default: '24'
    },
    iconMode: {
        type: String as PropType<'svg' | 'css'>,
        default: 'svg',
        validator: (value: string) => ['svg', 'css'].includes(value)
    }
})
</script>
