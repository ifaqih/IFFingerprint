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

export class MathCollector {
  name = 'math';
  enabled = true;

  async collect(): Promise<MathData> {
    const result: MathData = {
      floatPrecision: 0,
      sinValue: '',
      cosValue: '',
      tanValue: '',
      expValue: '',
      logValue: '',
      sqrtValue: '',
      powValue: '',
      atan2Value: '',
      hash: '',
    };

    try {
      // Test floating point precision
      result.floatPrecision = this.getFloatPrecision();
      
      // Test trigonometric functions
      result.sinValue = this.preciseSin(1);
      result.cosValue = this.preciseCos(1);
      result.tanValue = this.preciseTan(1);
      
      // Test exponential and logarithmic
      result.expValue = this.preciseExp(1);
      result.logValue = this.preciseLog(2);
      
      // Test other functions
      result.sqrtValue = this.preciseSqrt(2);
      result.powValue = this.precisePow(2, 0.5);
      result.atan2Value = this.preciseAtan2(1, 2);

      // Generate hash
      const hashData = JSON.stringify({
        floatPrecision: result.floatPrecision,
        sinValue: result.sinValue,
        cosValue: result.cosValue,
        tanValue: result.tanValue,
        expValue: result.expValue,
        logValue: result.logValue,
        sqrtValue: result.sqrtValue,
        powValue: result.powValue,
        atan2Value: result.atan2Value,
      });

      result.hash = this.hashString(hashData);
    } catch (error) {
      console.warn('MathCollector error:', error);
    }

    return result;
  }

  private getFloatPrecision(): number {
    // Test floating point precision dengan operasi yang sangat kecil
    const base = 0.1;
    let precision = 0;
    
    for (let i = 0; i < 20; i++) {
      const divisor = Math.pow(10, i);
      const result = base / divisor;
      const back = result * divisor;
      
      if (Math.abs(back - base) < Number.EPSILON) {
        precision = i;
      } else {
        break;
      }
    }
    
    return precision;
  }

  private preciseSin(x: number): string {
    return Math.sin(x).toFixed(20);
  }

  private preciseCos(x: number): string {
    return Math.cos(x).toFixed(20);
  }

  private preciseTan(x: number): string {
    return Math.tan(x).toFixed(20);
  }

  private preciseExp(x: number): string {
    return Math.exp(x).toFixed(20);
  }

  private preciseLog(x: number): string {
    return Math.log(x).toFixed(20);
  }

  private preciseSqrt(x: number): string {
    return Math.sqrt(x).toFixed(20);
  }

  private precisePow(x: number, y: number): string {
    return Math.pow(x, y).toFixed(20);
  }

  private preciseAtan2(y: number, x: number): string {
    return Math.atan2(y, x).toFixed(20);
  }

  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return (hash >>> 0).toString(16).padStart(8, '0');
  }
}
