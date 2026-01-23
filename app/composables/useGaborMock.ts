import { reactive } from 'vue';

export function useGaborMock() {
    const params = reactive({
        orientation: 0,
        frequency: 0.05, // Range: 0.02 (thick) - 0.08 (thin)
        contrast: 1.0,   // Range: 0.0 - 1.0
        sigma: 40,
        phase: 0,
        // Settings - System
        isDarkMode: true, // Default to true as per image dark theme
        isNotificationsEnabled: true,
        whiteNoiseType: 'waves', // 'waves', 'forest', 'rain'

        // Settings - Display
        symbolContrast: 100, // Maps to contrast 1.0
        colorTemperature: 50,
        fontSize: 50,
        screenBrightness: 50,
        volume: 50,

        // Settings - Gabor Config (Advanced)
        symbolSize: 40,     // Maps to sigma
        stripeDensity: 50,  // Maps to frequency
        driftSpeed: 0,      // Maps to phase shift speed
    })

    return { params }
}
