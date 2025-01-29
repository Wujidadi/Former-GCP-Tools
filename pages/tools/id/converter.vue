<script setup lang="ts">
import dayjs from 'dayjs';
const { $decimal, $tguid } = useNuxtApp();
const { $trimFloat }: { $trimFloat: (num: string | number) => string } = useNuxtApp();

useHead({
  title: '日期、時間戳與 ID 轉換',
});

const timestamp: Ref<string> = ref('');
const dateTime: Ref<string> = ref('');
const uniqueId: Ref<string> = ref('');
const tguid: Ref<string> = ref('');

onMounted(() => {
  firstCalculate();
});

const firstCalculate = () => {
  const time = (Date.now() + performance.now() % 1);
  calculateByTimestamp((time / 1000).toString());
}

const recalculate = (type: string) => {
  switch (type) {
    case 'tguid':
      calculateByTGuid();
      break;
    case 'uniqueId':
      calculateByUniqueId();
      break;
    case 'dateTime':
      calculateByDateTime(dateTime.value);
      break;
    case 'timestamp':
    default:
      calculateByTimestamp(timestamp.value);
      break;
  }
};

const calculateByTimestamp = (time: string) => {
  const timeParts = time.split('.');
  const second: string = timeParts[0];
  const microsecond: string = (timeParts[1] ?? '').padEnd(6, '0');
  const millisecond: string = microsecond.slice(0, 3);
  const now = $decimal(`${second}${millisecond}`);
  $tguid.setTestHooks(
    () => now.toNumber(),
    () => $decimal(microsecond).div(1000).toNumber(),
  );
  timestamp.value = $trimFloat(time);
  dateTime.value = $trimFloat(dayjs(now.toNumber()).format('YYYY-MM-DD HH:mm:ss') + '.' + microsecond);
  uniqueId.value = $tguid.getMicrosecondsTimestamp().slice(0, 8);
  tguid.value = $tguid.timeToTGuid(time) ?? '';
};

const calculateByDateTime = (date: string) => {
  const match = date.match(/^\d{4}-\d{2}-\d{2}(?: \d{2}:\d{2}:\d{2})?(?:\.\d+)?$/);
  if (!match) {
    dateTime.value = '';
    return;
  }
  const dateParts = date.split('.');
  const dateString = dateParts[0];
  const microsecond = (dateParts[1] ?? '').padEnd(6, '0');
  const second: string = (BigInt(new Date(dateString).getTime()) / BigInt(1000)).toString();
  const time = `${second}.${microsecond}`;
  calculateByTimestamp(time);
};

const calculateByUniqueId = () => {
  const time = $tguid.extractOriginalTimestamps(uniqueId.value) / 1000;
  calculateByTimestamp(time.toString());
};

const calculateByTGuid = () => {
  const time = $tguid.tGuidToTime(tguid.value, false) ?? '';
  calculateByTimestamp(time.toString());
};
</script>

<template>
  <div class="container max-w-full flex flex-col items-center justify-center text-center">
    <div class="block">
      <h2 class="mt-3 mb-3">日期、時間戳與 ID 轉換</h2>
      <div class="mb-3 text-red-800 text-sm">1970-01-01T00:00:00Z 以後有效，使用 UTC 時間</div>
      <div class="w-500px flex col items-center">
        <div class="w-100px col my-2">
          <label>Timestamp</label>
        </div>
        <div class="w-400px col">
          <input type="text" class="input-dark text-lg" v-model="timestamp" @change="recalculate('timestamp')" />
        </div>
      </div>
      <div class="w-500px mt-2 flex col items-center">
        <div class="w-100px col my-2">
          <label>Date Time</label>
        </div>
        <div class="w-400px col">
          <input type="text" class="input-dark text-lg" v-model="dateTime" @change="recalculate('dateTime')" />
        </div>
      </div>
      <div class="w-500px mt-2 flex col items-center">
        <div class="w-100px col my-2">
          <label>Unique ID</label>
        </div>
        <div class="w-400px col">
          <input type="text" class="input-dark text-lg font-mono" v-model="uniqueId" @change="recalculate('uniqueId')" />
        </div>
      </div>
      <div class="w-500px mt-2 flex col items-center">
        <div class="w-100px col my-2">
          <label>TGUID</label>
        </div>
        <div class="w-400px col">
          <input type="text" class="input-dark text-lg font-mono" v-model="tguid" @change="recalculate('tguid')" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>