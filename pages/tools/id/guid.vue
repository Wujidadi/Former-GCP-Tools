<script setup lang="ts">
const { $guid } = useNuxtApp();

useHead({
  title: 'GUID 產生器',
});

const count: Ref<number> = ref(1);
const guid: Ref<string> = ref('');
const generateGuid = (): void => {
  const guids = [];
  for (let i: number = 0; i < count.value; i++) {
    let newGuid: string;
    do {
      newGuid = $guid.create();
    } while (!$guid.isValid(newGuid));
    guids.push(newGuid);
  }
  guid.value = guids.join('\n');
};
</script>

<template>
  <div class="container max-w-full flex flex-col items-center justify-center text-center">
    <div class="block">
      <h2 class="mt-3 mb-3">GUID 產生器</h2>
      <div class="w-500px">
        <input type="number" step="1" min="1" class="input-dark text-lg" v-model="count" />
      </div>
      <div class="w-500px mt-2">
        <button class="button-dark w-full p1 text-lg" @click="generateGuid">產生</button>
      </div>
      <div class="w-500px mt-2">
        <pre>{{ guid }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped></style>