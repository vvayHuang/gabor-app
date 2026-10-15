import { Capacitor, CapacitorCookies } from '@capacitor/core'

// On iOS, CapacitorCookies routes document.cookie to the native cookie jar. When Supabase
// signs out it deletes the session cookie that way, which only clears the jar: the WebView's
// own cookie store keeps the old session, and Capacitor can sync it back into the jar later,
// so a signed-out user comes back as the previous account.
// deleteCookie() clears both stores but only for a cookie the jar still has, so write an
// empty one first and then delete it.
const MAX_CHUNKS = 5

export default defineNuxtPlugin(() => {
    if (!Capacitor.isNativePlatform()) return

    const supabase = useSupabaseClient()
    const prefix = useRuntimeConfig().public.supabase.cookiePrefix
    // Large sessions are split into `<prefix>.0`, `<prefix>.1`, ...
    const keys = [prefix, ...Array.from({ length: MAX_CHUNKS }, (_, i) => `${prefix}.${i}`)]

    const clearSessionCookies = async () => {
        for (const key of keys) {
            await CapacitorCookies.setCookie({ key, value: '' })
            await CapacitorCookies.deleteCookie({ key })
        }
    }

    supabase.auth.onAuthStateChange((event) => {
        if (event !== 'SIGNED_OUT') return
        clearSessionCookies().catch((e) => console.error('Clearing session cookies failed:', e))
    })
})
