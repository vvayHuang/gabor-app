// 單一 Gabor 斑塊的繪製參數（GaborCanvas 的 params prop）。長度單位皆為 CSS px。
export interface GaborParams {
    /** 條紋方向（度） */
    orientation: number;
    /** 空間頻率（cycles / px） */
    frequency: number;
    /** 峰值對比（0–1） */
    contrast: number;
    /** Gaussian 包絡的 sigma（px） */
    sigma: number;
    /** 條紋相位（弧度） */
    phase: number;
}
