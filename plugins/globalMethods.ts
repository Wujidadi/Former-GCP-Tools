export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.provide('numberFormat', (num: string | number): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 3,
    }).format(num as number);
  });

  // 補足日期字串的毫秒部分至 3 位數，以免 Day.js 解析錯誤
  nuxtApp.provide('fixDate', (date: string, digit: number = 3): string => {
    const maxCaptureDigit = digit > 1 ? digit - 1 : 1;
    const regex = new RegExp(`(\\.\\d{1,${maxCaptureDigit}})(?!(?:\\s\\S)+)$`);
    return date.replace(regex, (match) => {
      return match + '0'.repeat(digit - match.length + 1);
    });
  });

  // 去除浮點數尾部不必要的 0 及小數點
  nuxtApp.provide('trimFloat', (num: string | number): string => {
    if (typeof num === 'number') {
      num = num.toString();
    }
    return num.replace(/0+$/, '').replace(/\.+$/, '');
  });
});
