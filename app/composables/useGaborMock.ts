import { reactive } from 'vue';

export function useGaborMock() {
    const params = reactive({
        orientation: 0,
        frequency: 1,
        contrast: 0.5,
        sigma: 20,
        phase: 0,
    })

    return { params }
}
