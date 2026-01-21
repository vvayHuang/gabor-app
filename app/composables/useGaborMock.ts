import { reactive } from 'vue';

export function useGaborMock() {
    const params = reactive({
        orientation: 0,
        frequency: 1,
        contrast: 0.5,
        sigma: 20,
        phase: 0,
        // Settings - System
        isDarkMode: true, // Default to true as per image dark theme
        isNotificationsEnabled: true,
        whiteNoiseType: 'waves', // 'waves', 'forest', 'rain'

        // Settings - Display
        symbolContrast: 50,
        colorTemperature: 50,
        fontSize: 50,
        screenBrightness: 50,
        volume: 50,

        // Settings - Gabor Config (Advanced)
        symbolSize: 50,     // Maps to sigma
        stripeDensity: 50,  // Maps to frequency
        driftSpeed: 0,      // Maps to phase shift speed
    })

    return { params }
}
