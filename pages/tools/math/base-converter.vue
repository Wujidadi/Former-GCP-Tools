<script setup lang="ts">
const { $base62 } = useNuxtApp();

useHead({
  title: 'Base Converter',
});

const base10: Ref<string> = ref('');
const base16: Ref<string> = ref('');
const base62: Ref<string> = ref('');

const convert = () => {
  const base10Value = base10.value === '' ? '0' : base10.value;
  base16.value = parseInt(base10Value, 10).toString(16);
  const base62Value = $base62.decToBase62(base10Value);
  base62.value = base62Value === '' ? '0' : base62Value;
};

const convertByHex = () => {
  const base16Value = base16.value === '' ? '0' : base16.value;
  base10.value = parseInt(base16Value, 16).toString();
  const base62Value = $base62.decToBase62(base10.value);
  base62.value = base62Value === '' ? '0' : base62Value;
};

const convertByBase62 = () => {
  const base62Value = base62.value === '' ? '0' : base62.value;
  base10.value = $base62.base62ToDec(base62Value);
  base16.value = parseInt(base10.value, 10).toString(16);
};
</script>

<template>
  <div class="container max-w-full flex flex-col items-center justify-center text-center">
    <div class="block">
      <h2 class="mt-3 mb-3">Base Converter</h2>
      <div class="w-500px flex col items-center mt-2">
        <div class="w-130px col my-2">
          <label>Base10 (Dec)</label>
        </div>
        <div class="w-400px col">
          <input type="text" class="input-dark text-lg" v-model="base10" @change="convert" />
        </div>
      </div>
      <div class="w-500px flex col items-center mt-2">
        <div class="w-130px col my-2">
          <label>Base16 (Hex)</label>
        </div>
        <div class="w-400px col">
          <input type="text" class="input-dark text-lg" v-model="base16" @change="convertByHex" />
        </div>
      </div>
      <div class="w-500px flex col items-center mt-2">
        <div class="w-130px col my-2">
          <label>Base62</label>
        </div>
        <div class="w-400px col">
          <input type="text" class="input-dark text-lg" v-model="base62" @change="convertByBase62" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>