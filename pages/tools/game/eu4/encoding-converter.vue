<script setup lang="ts">
const { $eu4 } = useNuxtApp();

useHead({
  title: '歐陸風雲Ⅳ編碼轉換工具',
});

const original: Ref<string> = ref('');
const encoded: Ref<string> = ref('');
const separator: Ref<boolean> = ref(true);
const message: Ref<string> = ref('');

const encode = (): void => {
  encoded.value = $eu4.encode(original.value, separator.value);
};

const decode = (): void => {
  original.value = $eu4.decode(encoded.value);
};

const copy = async (): Promise<void> => {
  try {
    await navigator.clipboard.writeText(encoded.value);
    message.value = '複製成功！';
  } catch (error) {
    message.value = '複製失敗！';
  }

  setTimeout(() => {
    message.value = '';
  }, 1000);
};

const toggleHexGroup = (): void => {
  let encodedValue = encoded.value.replace(/ /g, '');
  if (separator.value) {
    encodedValue = encoded.value.replace(/([\dA-Fa-f]{2})/g, '$1 ').replace(/ $/, '');
  }
  encoded.value = encodedValue;
};
</script>

<template>
  <div class="container max-w-full flex flex-col items-center justify-center text-center">
    <div class="block">
      <h2 class="mt-3 mb-3">歐陸風雲Ⅳ編碼轉換工具</h2>
      <div class="w-500px flex col items-center mt-2">
        <input type="text" class="input-dark text-lg" v-model="original" />
      </div>
      <div class="w-500px flex col items-center mt-2 gap-col-2">
        <div class="w-1/2">
          <button class="btn button button-encode" @click="encode">編碼</button>
        </div>
        <div class="w-1/2">
          <button class="btn button button-decode" @click="decode">解碼</button>
        </div>
      </div>
      <div class="w-500px flex col items-center mt-2">
        <input type="text" class="input-dark text-lg encoded" v-model="encoded" />
      </div>
      <div class="w-500px flex col items-center mt-2">
        <div class="w-440px">
          <button class="btn button button-copy" @click="copy">複製 Hex 碼</button>
        </div>
        <div class="w-60px">
          <input type="checkbox" id="separator" class="func" v-model="separator" @change="toggleHexGroup">
          <label for="separator">空格</label>
        </div>
      </div>
      <div class="w-500px flex col items-center mt-2">
        <span class="w-full">{{ message }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.button {
  @apply text-center rounded-lg w-full text-lg text-black cursor-pointer;
}
.button-encode {
  background-color: royalblue;
  &:hover {
    background-color: #6584e1;
  }
}
.button-decode {
  background-color: #0aa10a;
  &:hover {
    background-color: #1cb31c;
  }
}
.button-copy {
  background-color: goldenrod;
  &:hover {
    background-color: #e0b957;
  }
}
input.encoded {
  font-family: monospace;
}
</style>