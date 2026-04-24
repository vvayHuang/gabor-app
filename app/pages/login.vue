<template>
    <div class="flex-1 flex flex-col items-center justify-center px-4 pt-8 space-y-8 bg-background overflow-hidden">
        <!-- Phase 3: Login Elements (Restored to original) -->
        <div ref="loginContainer"
            class="flex flex-col items-center justify-center space-y-8 w-full max-w-sm opacity-0 translate-y-8">
            <div class="flex flex-col space-y-2 w-full">
                <h1 class="title-lg-emphasis text-on-background">登入或創建新帳號</h1>
            </div>

            <!-- Input Fields -->
            <div class="w-full space-y-4">
                <TextField v-model="email" type="email" placeholder="電子信箱" />
                <TextField v-model="password" type="password" placeholder="密碼" />
                
                <!-- Primary Action -->
                <div class="pt-2">
                    <Buttons buttonStyle="Bordered - Prominent" size="Large" label="登入" @click="handleLogin" />
                </div>
            </div>

            <!-- Social Login -->
            <div class="w-full flex flex-col items-center space-y-4">
                <p class="title-sm text-on-background">或繼續使用</p>
                <div class="w-full space-y-3">
                    <Buttons buttonStyle="Bordered" size="Large" labelType="Symbol" @click="handleLogin">
                        <template #icon>
                            <img src="@/assets/icons/apple.svg" alt="Apple" class="w-6 h-6" />
                        </template>
                    </Buttons>
                    <Buttons buttonStyle="Bordered" size="Large" labelType="Symbol" @click="handleLogin">
                        <template #icon>
                            <img src="@/assets/icons/google.svg" alt="Google" class="w-6 h-6" />
                        </template>
                    </Buttons>
                    <Buttons buttonStyle="Bordered" size="Large" labelType="Symbol" @click="handleLogin">
                        <template #icon>
                            <img src="@/assets/icons/figma.svg" alt="Figma" class="w-6 h-6" />
                        </template>
                    </Buttons>
                </div>
            </div>

            <!-- Footer -->
            <div class="w-full">
                <p class="body-sm text-on-surface-variant">
                    繼續即表示您同意我們的服務條款和隱私政策。
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'

const router = useRouter()
const loginContainer = ref<HTMLElement | null>(null)

const email = ref('')
const password = ref('')

const handleLogin = () => {
    router.push('/prepare');
};

onMounted(() => {
    if (loginContainer.value) {
        gsap.to(loginContainer.value, {
            duration: 0.6,
            opacity: 1,
            translateY: 0,
            ease: "power2.out"
        });
    }
})
</script>
