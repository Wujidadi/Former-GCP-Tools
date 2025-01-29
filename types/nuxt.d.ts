import { NuxtApp } from '#app';
import Decimal from "decimal.js";

declare module '#app' {
  interface NuxtApp {
    $decimal: typeof Decimal;
    $numberFormat: (num: string | number) => string;
    $fixDate: (date: string, digit?: number) => string;
    $trimFloat: (num: string | number) => string;
    $base62: {
      DICT: string[];
      REVERSE_DICT: Record<string, number>;
      string(length?: number): string;
      decToBase62(num: number | string): string;
      base62ToDec(num: string): string;
    };
    $guid: {
      create(): string;
      isValid(guid: string): boolean;
      getEmptyGuid(): string;
    };
    $tguid: {
      setTestHooks(dateNowFn: () => number, performanceNowFn: () => number): void;
      create(withDash?: boolean): string;
      base62Guid(withDash?: boolean): string;
      base62TGuid(withDash?: boolean): string;
      tGuidToTime(tGuid: string, toDate?: boolean): string | number;
      timeToTGuid(time?: string): string;
      getMicrosecondsTimestamp(): string;
      extractOriginalTimestamps(uniqueId: string): number;
    };
    $eu4: {
      encode(input: string, whitespace: boolean = false): string;
      decode(input: string): string;
    };
  }
}
