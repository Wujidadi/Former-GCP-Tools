<script setup lang="ts">
import dayjs, { Dayjs, type ManipulateType } from 'dayjs';
const { $numberFormat }: { $numberFormat: (num: string|number) => string } = useNuxtApp();
const { $fixDate }: { $fixDate: (date: string, digit?: number) => string } = useNuxtApp();

useHead({
  title: '時間計算器',
});

const base: Ref<string> = ref(dayjs().format('YYYY-MM-DD HH:mm:ss.SSS'));
const calculationType: Ref<string> = ref('plus');
const delta: Ref<string> = ref('');
const timeUnit: Ref<string> = ref('seconds');
const result: Ref<string> = ref('');

// 指定日期加減運算
const addSubtract = (): void => {
  const multiplier: number = calculationType.value === 'plus' ? 1 : -1;
  const deltaValue: number = Number((delta.value).replace(',', '')) * multiplier;
  if (!isNaN(deltaValue) && (delta.value).trim() !== '') {
    const fixedBase: string = $fixDate(base.value);
    const newDate: Dayjs = dayjs(fixedBase).add(deltaValue, timeUnit.value as ManipulateType);
    const format: string = newDate.millisecond() > 0 ? 'YYYY-MM-DD HH:mm:ss.SSS' : 'YYYY-MM-DD HH:mm:ss';
    result.value = newDate.format(format);
  }
};
watch(calculationType, addSubtract);

const from: Ref<string> = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'));
const to: Ref<string> = ref('');
const dateSpan: Ref<string> = ref('');

// 計算兩日期之間距離
const getDateSpan = (): void => {
  const fixedFrom: string = $fixDate(from.value);
  const fixedTo: string = $fixDate(to.value);
  const interval: number = Math.abs(dayjs(fixedTo).diff(dayjs(fixedFrom)));

  if (isNaN(interval)) {
    dateSpan.value = '';
    return;
  }

  const seconds: number = interval / 1000;

  let second: number = seconds;
  let minute: number = second / 60;
  let hour: number = minute / 60;
  let day: number = hour / 24;
  let year: number = day / 365;

  const dateSpans: string[] = [
    `${$numberFormat(second)} 秒`,
  ];

  if (interval >= 60_000) {
    second = seconds % 60;
    minute = Math.floor(seconds / 60);
    dateSpans.push(`${$numberFormat(minute)} 分 ${$numberFormat(second)} 秒`);
  }
  if (interval >= 3_600_000) {
    minute = Math.floor(seconds % 3_600 / 60);
    hour = Math.floor(seconds / 3_600);
    dateSpans.push(`${$numberFormat(hour)} 小時 ${minute} 分 ${$numberFormat(second)} 秒`);
  }
  if (interval >= 86_400_000) {
    hour = Math.floor(seconds % 86_400 / 3_600);
    day = Math.floor(seconds / 86_400);
    dateSpans.push(`${$numberFormat(day)} 日 ${hour} 小時 ${minute} 分 ${$numberFormat(second)} 秒`);
  }
  if (interval >= 31_536_000_000) {
    day = Math.floor(seconds % 31_536_000 / 86_400);
    year = Math.floor(seconds / 31_536_000);
    dateSpans.push(`${$numberFormat(year)} 年 ${day} 日 ${hour} 小時 ${minute} 分 ${$numberFormat(second)} 秒`);
  }

  dateSpan.value = dateSpans.join('<br />');
};
</script>

<template>
  <div class="container max-w-full flex flex-col items-center justify-center text-center">
    <div class="block add-subtract">
      <h2 class="mt-3 mb-3">指定日期加減運算</h2>
      <div class="w-500px">
        <input type="text" class="input-dark text-lg" v-model="base" @keyup="addSubtract" />
      </div>
      <div class="w-500px mt-2 flex col items-center">
        <div class="w-80px col my-2">
          <input type="radio" id="goLate" v-model="calculationType" value="plus" />
          <label for="goLate">加</label>
          <input type="radio" id="goEarly" v-model="calculationType" value="minus" />
          <label for="goEarly">減</label>
        </div>
        <div class="w-360px col">
          <input class="input-dark text-lg" v-model="delta" @keyup="addSubtract" />
        </div>
        <div class="w-60px col ms-1">
          <select class="h-40px input-dark text-base" v-model="timeUnit" @change="addSubtract">
            <option value="seconds">秒</option>
            <option value="minutes">分</option>
            <option value="hours">時</option>
            <option value="days">日</option>
            <option value="months">月</option>
            <option value="years">年</option>
          </select>
        </div>
      </div>
      <div class="w-500px mt-2">
        <input type="text" class="input-dark text-lg" v-model="result" />
      </div>
    </div>
    <div class="block date-span">
      <h2 class="mt-5 mb-3">計算兩日期之間距離</h2>
      <div class="w-500px">
        <input type="text" class="input-dark text-lg" v-model="from" @keyup="getDateSpan" />
      </div>
      <div class="w-500px mt-2">
        <input type="text" class="input-dark text-lg" v-model="to" @keyup="getDateSpan" />
      </div>
      <div class="w-500px mt-4 text-center text-lg" v-html="dateSpan"></div>
    </div>
  </div>
</template>

<style scoped></style>