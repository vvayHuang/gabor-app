import { ref } from 'vue'

// 使用者在登入頁選了「先不登入」：之後開 App 直接進準備頁，資料只存在本機。
// 登入成功或登出時清掉，登出後回到登入頁重新選擇。
const GUEST_MODE_KEY = 'gabor_guest_mode'

const isGuest = ref(false)
const isLoaded = ref(false)

export const useGuestMode = () => {
    const loadGuestMode = () => {
        if (!import.meta.client || isLoaded.value) return
        isGuest.value = localStorage.getItem(GUEST_MODE_KEY) === '1'
        isLoaded.value = true
    }

    const setGuestMode = (enabled: boolean) => {
        if (!import.meta.client) return
        isGuest.value = enabled
        isLoaded.value = true
        if (enabled) {
            localStorage.setItem(GUEST_MODE_KEY, '1')
        } else {
            localStorage.removeItem(GUEST_MODE_KEY)
        }
    }

    return {
        isGuest,
        loadGuestMode,
        setGuestMode
    }
}
