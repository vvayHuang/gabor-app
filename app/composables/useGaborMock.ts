import { reactive } from 'vue';

export function useGaborMock() {
    const params = reactive({
        orientation: 0,
        frequency: 1,
        contrast: 0.5,
        sigma: 20,
        phase: 0,
        // Settings
        symbolContrast: 50,
        colorTemperature: 50,
        fontSize: 50,
        screenBrightness: 50,
        volume: 50,
    })

    return { params }
}
