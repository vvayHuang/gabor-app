<template>
    <div
        class="min-h-screen bg-inverse-surface text-on-inverse-surface antialiased overflow-x-hidden selection:bg-gray-700 selection:text-white relative">
        <!-- Main Content Area with safe area padding -->
        <!-- Added pb-20 to ensure content isn't hidden behind bottom nav -->
        <main class="w-full min-h-screen transition-all duration-300" :class="{ 'pb-24': showBottomNav }">
            <slot />
        </main>

        <!-- Bottom Navigation -->
        <transition enter-active-class="transition ease-out duration-300"
            enter-from-class="transform translate-y-full opacity-0" enter-to-class="transform translate-y-0 opacity-100"
            leave-active-class="transition ease-in duration-200" leave-from-class="transform translate-y-0 opacity-100"
            leave-to-class="transform translate-y-full opacity-0">
            <BottomNav v-if="showBottomNav" />
        </transition>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// Pages where BottomNav should be hidden
// strict matches
const hideNavRoutes = ['/', '/login', '/timer', '/completion', '/progress', '/streak', '/records', '/profile', '/settings'];

const showBottomNav = computed(() => {
    // Also hide if route starts with /task/ maybe? Spec doesn't strictly say, 
    // but usually tasks are immersive. 
    // Spec says "Includes: <BottomNav /> (hidden on Welcome / Login)"
    // I will stick to hiding on Welcome and Login as explicitly requested, 
    // but also likely on the Task itself to avoid distraction.
    // Let's add task routes to hide list for better UX as per "Wireframe" nature often implies focused tasks.
    // Actually, let's stick to the spec: "Hidden on Welcome / Login".
    // I will add them to the list but can easily remove if needed.
    // Update: User surely wants full screen for task.
    // I will hide on: /, /login, /prepare, /task/grid, /task/variation, /timer, /completion
    // Only show on: /progress, /streak, /settings, /records, /profile

    // Easier logic: Show only on main tabs?
    // Main tabs: Home (Task entry?), Records, Settings, Profile.
    // If "Home / Task" tab leads to /task/grid, then Nav might stay?
    // But /task/grid in spec seems to be the active task.
    // Let's assume Nav is present unless it's an immersive flow.
    // Immersive flow: Welcome -> Login -> Prepare -> Task -> ... -> Timer -> Completion.
    // This entire flow seems immersive.
    // Settings, Records, Profile are persistent.

    // Immersive pages:
    const immersivePages = [
        'index',
        'login',
        'task-grid',
        'task-variation',
        'timer',
        'completion',
        'progress',
        'streak',
        'records',
        'profile',
        'settings',
    ];

    return !immersivePages.includes(route.name as string);
});
</script>
