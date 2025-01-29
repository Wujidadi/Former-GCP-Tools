<script setup lang="ts">
const { $base62 } = useNuxtApp();

useHead({
  title: 'Base62 ID 產生器',
});

const length: Ref<number> = ref(24);
const count: Ref<number> = ref(8);
const id: Ref<string> = ref('');
const generateBase62Id = (): void => {
  const ids: string[] = [];
  for (let i = 0; i < count.value; i++) {
    ids.push($base62.string(length.value));
  }
  id.value = ids.join('\n');
};
</script>

<template>
  <div class="container max-w-full flex flex-col items-center justify-center text-center">
    <div class="block">
      <h2 class="mt-3 mb-3">Base62 ID 產生器</h2>
      <div class="w-500px flex col items-center">
        <div class="w-60px col my-2">
          <label>長度</label>
        </div>
        <div class="w-440px col">
          <input type="number" step="1" min="1" class="input-dark text-lg" v-model="length" />
        </div>
      </div>
      <div class="w-500px flex col items-center mt-2">
        <div class="w-60px col my-2">
          <label>數量</label>
        </div>
        <div class="w-440px col">
          <input type="number" step="1" min="1" class="input-dark text-lg" v-model="count" />
        </div>
      </div>
      <div class="w-500px mt-2">
        <button class="button-dark w-full p1 text-lg" @click="generateBase62Id">產生</button>
      </div>
      <div class="w-500px mt-2">
        <pre>{{ id }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped></style>