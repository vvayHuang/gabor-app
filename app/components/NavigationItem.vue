<script setup lang="ts">
interface Props {
  to: string;
  icon: string;
  label: string;
  size?: 'normal' | 'small';
  showLabel?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'normal',
  showLabel: true
});
</script>

<template>
  <NuxtLink 
    :to="props.to"
    class="nav-item group"
    :class="[props.size === 'small' ? 'is-small' : 'is-normal']"
  >
    <!-- Selection Background (Only visible when active) -->
    <div class="selection-bg"></div>
    
    <Icon :name="props.icon" size="24" class="nav-icon" />
    <span v-if="props.showLabel" class="nav-label">{{ props.label }}</span>
  </NuxtLink>
</template>

<style scoped>
.nav-item {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 6px 8px 7px;
  gap: 1px;
  isolation: isolate;
  text-decoration: none;
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: transparent;
  cursor: pointer;
}

.is-normal {
  width: 72px;
  height: 50px;
}

.is-small {
  width: 50px;
  height: 50px;
}

/* Selected=False 樣式 */
.nav-icon {
  position: relative;
  z-index: 1;
  color: var(--color-on-surface);
  transition: color 0.2s ease;
}

.nav-label {
  position: relative;
  z-index: 2;
  width: 56px;
  height: 12px;
  font-family: 'SF Pro', sans-serif;
  font-weight: 510;
  font-size: 10px;
  line-height: 12px;
  text-align: center;
  color: var(--color-on-surface);
  mix-blend-mode: multiply;
  transition: all 0.2s ease;
}

/* Selection 背景 (預設隱藏) */
.selection-bg {
  position: absolute;
  inset: 0;
  background: var(--color-surface-dim);
  border-radius: 100px;
  opacity: 0;
  z-index: 0;
  mix-blend-mode: multiply;
  transition: opacity 0.2s ease;
}

/* Selected=True 樣式 (NuxtLink 激活時) */
.router-link-active .selection-bg {
  opacity: 1;
}

.router-link-active .nav-icon {
  color: var(--color-primary);
}

.router-link-active .nav-label {
  font-weight: 590;
  letter-spacing: -0.1px;
  color: var(--color-primary);
  mix-blend-mode: normal;
}
</style>
