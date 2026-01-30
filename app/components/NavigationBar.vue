<template>
    <div class="fixed bottom-6 left-[16px] right-[16px] w-[360px] bg-white/10 rounded-full">
        <div class="flex justify-around items-center py-2 px-4">
            <NuxtLink to="/prepare"
                class="flex flex-col items-center justify-center w-full h-full text-inverse-on-surface hover:text-gray-300 transition-colors"
                active-class="text-on-secondary-container bg-secondary rounded-full py-1">
                <Icon name="material-symbols:language" size="24" />
            </NuxtLink>

            <NuxtLink to="/records"
                class="flex flex-col items-center justify-center w-full h-full text-inverse-on-surface hover:text-gray-300 transition-colors"
                active-class="text-on-secondary-container bg-secondary rounded-full py-1">
                <Icon name="material-symbols:schedule-outline" size="24" />
            </NuxtLink>

            <NuxtLink to="/settings"
                class="flex flex-col items-center justify-center w-full h-full text-inverse-on-surface hover:text-gray-300 transition-colors"
                active-class="text-on-secondary-container bg-secondary rounded-full py-1">
                <Icon name="material-symbols:settings" size="24" />
            </NuxtLink>
            <NuxtLink to="/profile"
                class="flex flex-col items-center justify-center w-full h-full text-inverse-on-surface hover:text-gray-300 transition-colors"
                active-class="text-on-secondary-container bg-secondary rounded-full py-1">
                <Icon name="material-symbols:person" size="24" />
            </NuxtLink>
        </div>
    </div>
</template>
