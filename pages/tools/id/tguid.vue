<script setup lang="ts">
const { $tguid } = useNuxtApp();

useHead({
  title: 'TGUID 產生器',
});

const count: Ref<number> = ref(1);
const withDash: Ref<boolean> = ref(false);
const tguid: Ref<string> = ref('');
const generateTGuid = (): void => {
  const tguids = [];
  for (let i: number = 0; i < count.value; i++) {
    tguids.push($tguid.create(withDash.value));
  }
  tguid.value = tguids.join('\n');
};
</script>

<template>
  <div class="container max-w-full flex flex-col items-center justify-center text-center">
    <div class="block">
      <h2 class="mt-3 mb-3">TGUID 產生器</h2>
      <div class="w-500px flex col items-center">
        <div class="w-60px col my-2">
          <label>長度</label>
        </div>
        <div class="w-360px col">
          <input type="number" step="1" min="1" class="input-dark text-lg" v-model="count" />
        </div>
        <div class="w-80px col">
          <input type="checkbox" id="dash" v-model="withDash" />
          <label for="dash">連字號</label>
        </div>
      </div>
      <div class="w-500px mt-2">
        <button class="button-dark w-full p1 text-lg" @click="generateTGuid">產生</button>
      </div>
      <div class="w-500px mt-2">
        <pre>{{ tguid }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped></style>