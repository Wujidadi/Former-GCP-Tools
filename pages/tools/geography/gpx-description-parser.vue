<script setup lang="ts">
useHead({
  title: 'Google Earth GPX Description Parser',
});

const gpxInfo: Ref<string> = ref('');
const googleEarthDescription: Ref<string> = ref('');

const parse = (): void => {
  let resultDescription: string = '';

  const regex: RegExp = /<b>Start Time<\/b>(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})Z<\/td><\/tr>\n *<tr><td><b>End Time<\/b>(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/;
  const matches: RegExpMatchArray | null = gpxInfo.value.match(regex);
  if (matches) {
    const startTime: string = `${matches[1]}-${matches[2]}-${matches[3]} ${matches[4]}:${matches[5]}:${matches[6]}`;
    const endTime: string = `${matches[7]}-${matches[8]}-${matches[9]} ${matches[10]}:${matches[11]}:${matches[12]}`;

    const taipeiTimeZoneOffset: number = 8 * 60;
    const startTimeTz: Date = new Date(startTime);
    startTimeTz.setMinutes(startTimeTz.getMinutes() + taipeiTimeZoneOffset);
    const endTimeTz: Date = new Date(endTime);
    endTimeTz.setMinutes(endTimeTz.getMinutes() + taipeiTimeZoneOffset);

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Taipei',
      hour12: false
    };

    const newStartTime: string = startTimeTz.toLocaleString('zh-TW', options).replace(/\//g, '-');
    const newEndTime: string = endTimeTz.toLocaleString('zh-TW', options).replace(/\//g, '-');

    resultDescription = `<b>Start: </b>${newStartTime}<br />\n<b>End: </b>${newEndTime}`;
  }

  googleEarthDescription.value = resultDescription;
};
</script>

<template>
  <div class="container max-w-full flex flex-col items-center justify-center text-center">
    <div class="block">
      <h2 class="mt-3 mb-3">Google Earth GPX Description Parser</h2>
      <div class="w-900px flex col items-center mt-2">
        <textarea class="w-full h-240px input-dark text-align-left resize-none" v-model="gpxInfo"></textarea>
      </div>
      <div class="w-900px flex col items-center mt-2">
        <button class="btn button-gold" @click="parse">Parse</button>
      </div>
      <div class="w-900px flex col items-center mt-2">
        <textarea class="w-full h-100px input-dark text-align-left resize-none" v-model="googleEarthDescription"></textarea>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.button-gold {
  @apply text-center rounded-lg w-full text-lg cursor-pointer;
  background-color: #ffcc00;
  color: #000;
}
</style>