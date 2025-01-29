import { Base62 } from './base62';
import { SecureGuid as Guid } from './guid';

export class TGuid {
  private static readonly FINAL_PADDING_LENGTH = 3;
  private static readonly RANDOM_RATIO = 4;
  private static readonly RANDOM_RATIO_POWER = 10;

  private static testHooks = {
    dateNow: (): number => Date.now(),
    performanceNow: (): number => performance.now(),
  };

  public static setTestHooks(dateNowFn: () => number, performanceNowFn: () => number): void {
    this.testHooks.dateNow = dateNowFn;
    this.testHooks.performanceNow = performanceNowFn;
  }

  public static create(withDash: boolean = false): string {
    const baseTGuid = this.base62TGuid(withDash);
    const padding = Array.from({ length: TGuid.FINAL_PADDING_LENGTH }, () => this.getRandomBase62Char()).join('');
    return withDash ? `${baseTGuid}-${padding}` : baseTGuid + padding;
  }

  private static tGuid16(): string {
    const microTimestamp = this.getMicrosecondsTimestamp();
    const guid = Guid.create();
    const randomPart = (this.getRandomLargeNumber() * this.RANDOM_RATIO).toString(16).padStart(8, '0');
    return `${microTimestamp}-${randomPart}-${guid}`;
  }

  public static base62Guid(withDash: boolean = false): string {
    const guidHex = Guid.create().split('-');
    const padLengths = [6, 3, 3, 3, 9];
    const base62Parts = guidHex.map((part, index) => {
      const padLength = padLengths[index] || 0;
      const base62 = Base62.decToBase62(parseInt(part, 16));
      return base62.padStart(padLength, '0');
    });
    return base62Parts.join(withDash ? '-' : '');
  }

  public static base62TGuid(withDash: boolean = false): string {
    const tGuidParts: string[] = this.tGuid16().split('-');
    const padLengths: number[] = [10, 5, 6, 3, 3, 3, 9];
    const base62Parts: string[] = tGuidParts.map((part: string, index: number) => {
      const padLength: number = padLengths[index] || 0;
      let numericValue: number;
      let base62: string;

      switch (index) {
        case 1:
          numericValue = parseInt(this.getMicrosecondsTimestamp().slice(-8), 16) + this.getRandomLargeNumber() * this.RANDOM_RATIO;
          return this.fitBase62Number(numericValue, padLength);
        case 2:
          numericValue = parseInt(part, 16) + this.getRandomLargeNumber() * this.RANDOM_RATIO;
          return this.fitBase62Number(numericValue, padLength);
        case 6:
          numericValue = parseInt(part, 16) + this.getRandomLargeNumber() * Math.pow(this.RANDOM_RATIO, this.RANDOM_RATIO_POWER);
          return this.fitBase62Number(numericValue, padLength);
        default:
          base62 = Base62.decToBase62(parseInt(part, 16));
          return base62.padStart(padLength, '0');
      }
    });

    return base62Parts.join(withDash ? '-' : '');
  }

  private static fitBase62Number(numericValue: number, padLength: number): string {
    let base62 = Base62.decToBase62(numericValue).padStart(padLength, '0');
    if (base62.length > padLength) {
      base62 = base62.slice(0, padLength);
    }
    return base62;
  }

  public static tGuidToTime(tGuid: string, toDate: boolean = true): string | number {
    const base62Part = tGuid.slice(0, 10);
    const decTimestamp = Base62.base62ToDec(base62Part);
    const hexTimestamp = BigInt(decTimestamp).toString(16);

    const is64Bit = hexTimestamp.length > 8;
    const hexSecond = is64Bit ? hexTimestamp.slice(0, -6) : hexTimestamp.slice(0, -5);
    const hexMicrosecond = is64Bit ? hexTimestamp.slice(-6) : hexTimestamp.slice(-5);

    // 考慮時差
    const second = parseInt(hexSecond, 16) - (new Date().getTimezoneOffset() * 60)*0;
    // 前綴補 0
    const microsecond = (parseInt(hexMicrosecond, 16) % 1000000).toString().padStart(6, '0');

    if (toDate) {
      const date = new Date(second * 1000);
      return `${date.toISOString().slice(0, 19).replace('T', ' ')}.${microsecond}`;
    }

    return Number(`${second}.${microsecond}`);
  }

  /**
   * 將秒級時間戳或 `YYYY-MM-DD HH:mm:ss.uuuuuu` 格式的時間字串轉換為 TGuid
   */
  public static timeToTGuid(time: string = ''): string {
    const timestamp = {
      second: '0',
      microsecond: '0',
    };

    // 輸入時間為整數時間戳
    const isIntegerTimestamp = time.match(/^\d+$/);
    if (isIntegerTimestamp) {
      timestamp.second = time;
    }

    // 輸入時間為浮點數時間戳
    const isFloatTimestamp = time.match(/^\d+\.\d+$/);
    if (isFloatTimestamp) {
      const [second, microsecond] = time.split('.');
      timestamp.second = second;
      timestamp.microsecond = microsecond.padEnd(6, '0');
    }

    // 輸入時間為日期字串
    const isDateString = time.match(/^\d+-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(\.\d+)?$/);
    if (isDateString) {
      const [dateString, timeString] = time.split(' ');
      const [year, month, day] = dateString.split('-');
      const timeStringParts = timeString.split('.');
      const [hour, minute, second] = timeStringParts[0].split(':');
      let microsecond = timeStringParts[1] || '0';
      const dateObj = new Date(Date.UTC(+year, +month - 1, +day, +hour, +minute, +second));
      timestamp.second = (dateObj.getTime() / 1000).toString();
      timestamp.microsecond = microsecond;
    }

    // 若無法識別輸入時間，套用當前時間
    if (!isIntegerTimestamp && !isFloatTimestamp && !isDateString) {
      time = new Date().getTime().toString();
      timestamp.second = time.slice(0, -3);
      timestamp.microsecond = time.slice(-3);
    }

    // 調整微秒部分總位數
    if (timestamp.microsecond === undefined) {
      timestamp.microsecond = '0';
    }
    timestamp.microsecond = timestamp.microsecond.padEnd(6, '0');
    if (timestamp.microsecond.length > 6) {
      timestamp.microsecond = timestamp.microsecond.slice(0, 6);
    }

    const hexSecond = BigInt(timestamp.second).toString(16);
    const hexMicrosecond = BigInt(timestamp.microsecond).toString(16).padStart(6, '0');
    const hexTimestamp = hexSecond + hexMicrosecond;

    const base62 = Base62.decToBase62(BigInt(`0x${hexTimestamp}`).toString());
    return base62.padStart(10, '0');
  }

  private static getRandomBase62Char(): string {
    const randomArray = new Uint8Array(1);
    do {
      crypto.getRandomValues(randomArray);
    } while (randomArray[0] >= 62 * Math.floor(256 / 62));

    return Base62.DICT[randomArray[0] % 62];
  }

  private static getRandomLargeNumber(): number {
    const randomArray = new Uint32Array(1);
    crypto.getRandomValues(randomArray);
    return randomArray[0] * Math.floor(Math.random() * 10 + 1);
  }

  public static getMicrosecondsTimestamp(): string {
    const now = this.testHooks.dateNow();
    const performanceOffset = this.testHooks.performanceNow() % 1000;
    const microseconds = Math.floor(performanceOffset * 1000);

    const secondsHex = Math.floor(now / 1000).toString(16);
    const microsecondsHex = microseconds.toString(16).padStart(6, '0');
    return secondsHex + microsecondsHex;
  }

  // 還原 getMicrosecondsTimestamp 的原始時間戳
  public static extractOriginalTimestamps(uniqueId: string): number {
    return parseInt(uniqueId, 16) * 1000;
  }
}

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.provide('tguid', TGuid);
});
