import { ref } from 'vue'

// 使用者在登入頁選了「先不登入」：資料只存在本機。
// 開 App 時不看這個標記，未登入（包含訪客）每次都先到登入頁重新選擇（2026-10-15，Way 決定）。
// 登入成功或登出時清掉。
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
