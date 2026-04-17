<template>
    <component :is="to ? NuxtLink : 'button'" :to="to" :disabled="!enabled" :type="to ? undefined : type" :class="[
        'flex items-center justify-center transition cursor-pointer font-sans transition-all duration-200',

        // Size and Padding (Figma mapping)
        size === 'Small' ? 'px-[10px] py-[4px] gap-[3px] min-h-[28px]' :
            size === 'Large' ? 'px-[20px] py-[14px] gap-[8px] min-h-[48px]' :
                'px-[14px] py-[7px] gap-[4px] min-h-[34px]', // Medium default

        // Typography (Figma mapping)
        size === 'Small' ? 'label-sm' :
            size === 'Large' ? 'label-lg' :
                'label-md',

        // Radius
        'rounded-full',

        // Variant styles based on Figma Style prop
        getStyleClasses(),

        // Width
        fullWidth ? 'w-full' : 'w-fit',

        // Enabled state (Figma Enabled=False)
        !enabled ? 'opacity-38 cursor-not-allowed pointer-events-none' : ''
    ]" v-bind="$attrs">
        <!-- Icon / Symbol Section (Shown if labelType is 'Symbol' or 'Symbol + Text') -->
        <slot name="icon">
            <Icon v-if="(labelType === 'Symbol' || labelType === 'Symbol + Text') && icon" 
                :name="icon" 
                :size="getIconSize()" />
        </slot>

        <!-- Label Section (Shown if labelType is 'Text' or 'Symbol + Text') -->
        <span v-if="(labelType === 'Text' || labelType === 'Symbol + Text') && (label || $slots.default)">
            <slot>{{ label }}</slot>
        </span>
    </component>
</template>

<script setup lang="ts">
import { NuxtLink } from '#components'
import type { PropType } from 'vue'

const props = defineProps({
    // Properties strictly matching Figma
    size: {
        type: String as PropType<'Small' | 'Medium' | 'Large'>,
        default: 'Medium'
    },
    buttonStyle: {
        type: String as PropType<'Bordered' | 'Bordered - Secondary' | 'Bordered - Prominent' | 'Borderless'>,
        default: 'Bordered'
    },
    labelType: {
        type: String as PropType<'Text' | 'Symbol' | 'Symbol + Text'>,
        default: 'Text'
    },
    enabled: {
        type: Boolean,
        default: true
    },
    destructive: {
        type: Boolean,
        default: false
    },
    // Functional props
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
        case 'Small': return '18'
        case 'Large': return '24'
        default: return '20'
    }
}

const getStyleClasses = () => {
    // Destructive logic (Error color system)
    if (props.destructive) {
        switch (props.buttonStyle) {
            case 'Bordered - Prominent':
                return 'bg-error text-on-error hover:bg-error/90 active:scale-[0.98]'
            case 'Bordered':
                return 'bg-error-container text-on-error-container hover:bg-error-container/90 active:scale-[0.98]'
            case 'Bordered - Secondary':
                return 'border border-error text-error hover:bg-error/5 active:scale-[0.98]'
            case 'Borderless':
                return 'bg-transparent text-error hover:bg-error/5 active:scale-[0.98]'
            default:
                return 'bg-error text-on-error'
        }
    }

    // Normal logic (Primary/Secondary color system)
    switch (props.buttonStyle) {
        case 'Bordered - Prominent':
            return 'bg-primary text-on-primary hover:bg-primary/90 active:scale-[0.98]'
        case 'Bordered - Secondary':
            return 'bg-secondary-fixed text-on-secondary-fixed hover:bg-secondary-fixed/90 active:scale-[0.98]'
        case 'Bordered':
            return 'bg-primary-fixed text-on-primary-fixed hover:bg-primary-fixed/90 active:scale-[0.98]'
        case 'Borderless':
            return 'bg-transparent text-primary hover:bg-surface-container-high active:scale-[0.98]'
        default:
            return 'border border-outline text-on-background active:scale-[0.98]'
    }
}
</script>
