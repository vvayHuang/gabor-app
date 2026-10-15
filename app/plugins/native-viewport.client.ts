import { Capacitor } from '@capacitor/core'

// Inside the iOS app, pinch and double-tap zoom make the UI feel like a web page, so lock the
// scale there. The web version keeps zoom available for accessibility.
export default defineNuxtPlugin(() => {
    if (!Capacitor.isNativePlatform()) return

    const viewport = document.querySelector<HTMLMetaElement>('meta[name="viewport"]')
    if (!viewport) return

    viewport.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover'
})
