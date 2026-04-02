<template>
    <component :is="to ? NuxtLink : 'button'" :to="to" :disabled="!enabled" :type="to ? undefined : type" :class="[
        'flex items-center justify-center transition cursor-pointer font-sans transition-all duration-200',

        // Size and Padding (Figma mapping)
        size === 'small' ? 'px-[10px] py-[4px] gap-[3px]' :
            size === 'large' ? 'px-[20px] py-[14px] gap-[4px]' :
                'px-[14px] py-[7px] gap-[4px]', // medium default

        // Typography (Figma mapping)
        size === 'small' ? 'label-sm' :
            size === 'large' ? 'label-lg' :
                'label-md',

        // Radius
        'rounded-full',

        // Variant styles based on Figma Style prop
        getStyleClasses(),

        // Width
        fullWidth ? 'w-full' : 'w-fit',

        // Disabled state (Figma Enabled=False)
        !enabled ? 'opacity-38 cursor-not-allowed pointer-events-none' : ''
    ]" v-bind="$attrs">
        <!-- Icon Slot / Prop -->
        <slot name="icon">
            <Icon v-if="icon" :name="icon" :size="getIconSize()" />
        </slot>

        <!-- Label / Default Slot (Only if labelType is text) -->
        <span v-if="labelType === 'text' && (label || $slots.default)">
            <slot>{{ label }}</slot>
        </span>
    </component>
</template>

<script setup lang="ts">
import { NuxtLink } from '#components'
import type { PropType } from 'vue'

const props = defineProps({
    size: {
        type: String as PropType<'small' | 'medium' | 'large'>,
        default: 'medium'
    },
    buttonStyle: {
        type: String as PropType<'bordered' | 'bordered-secondary' | 'bordered-prominent' | 'borderless'>,
        default: 'bordered'
    },
    labelType: {
        type: String as PropType<'text' | 'symbol'>,
        default: 'text'
    },
    enabled: {
        type: Boolean,
        default: true
    },
    destructive: {
        type: Boolean,
        default: false
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
        type: String as PropType<'button' | 'submit' | 'reset'>,
        default: 'button'
    },
    fullWidth: {
        type: Boolean,
        default: true
    }
})

const getIconSize = () => {
    switch (props.size) {
        case 'small': return '18'
        case 'large': return '24'
        default: return '20'
    }
}

const getStyleClasses = () => {
    if (props.destructive) {
        return 'bg-error text-on-error hover:bg-error/90'
    }

    switch (props.buttonStyle) {
        case 'bordered-prominent':
            return 'bg-primary text-on-primary hover:bg-primary/90'
        case 'bordered-secondary':
            return 'bg-secondary-fixed text-on-secondary-fixed hover:bg-secondary-fixed/90'
        case 'bordered':
            return 'bg-primary-fixed text-on-primary-fixed hover:bg-primary-fixed/90'
        case 'borderless':
            return 'bg-transparent text-primary hover:bg-surface-container-high'
        default:
            return 'border border-outline text-on-background'
    }
}
</script>
