/**
 * Math Collector
 * Menggunakan variasi hasil operasi matematika untuk fingerprinting
 * Teknik: Floating point precision dan trigonometri bervariasi antar CPU/browser
 */
export interface MathData {
    floatPrecision: number;
    sinValue: string;
    cosValue: string;
    tanValue: string;
    expValue: string;
    logValue: string;
    sqrtValue: string;
    powValue: string;
    atan2Value: string;
    hash: string;
}
export declare class MathCollector {
    name: string;
    enabled: boolean;
    collect(): Promise<MathData>;
    private getFloatPrecision;
    private preciseSin;
    private preciseCos;
    private preciseTan;
    private preciseExp;
    private preciseLog;
    private preciseSqrt;
    private precisePow;
    private preciseAtan2;
    private hashString;
}
//# sourceMappingURL=MathCollector.d.ts.map