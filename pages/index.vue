<script setup lang="ts">

</script>

<template>
  <div>
    <ul>
      <li><NuxtLink to="/tools/time/calculator">時間計算器</NuxtLink></li>
      <li><NuxtLink to="/tools/id/guid">GUID 產生器</NuxtLink></li>
      <li><NuxtLink to="/tools/id/base62">Base62 ID 產生器</NuxtLink></li>
      <li><NuxtLink to="/tools/id/tguid">TGUID 產生器</NuxtLink></li>
      <li><NuxtLink to="/tools/id/converter">日期、時間戳與 ID 轉換</NuxtLink></li>
      <li><NuxtLink to="/tools/math/base-converter">Base Converter</NuxtLink></li>
      <li><NuxtLink to="/tools/geography/gpx-description-parser">Google Earth GPX Description Parser</NuxtLink></li>
      <li><NuxtLink to="/tools/game/eu4/encoding-converter">歐陸風雲Ⅳ編碼轉換工具</NuxtLink></li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
@use "sass:color";
@use "@/assets/styles/variables" as *;

:global(html), :global(body) {
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: $background-color;
  color: $text-color;
  font-family: Arial, sans-serif;
}

div {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  box-sizing: border-box;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  max-width: 600px;
  width: 100%;

  li {
    margin-bottom: 1rem;
    border-bottom: 1px solid $border-color;
    padding-bottom: 0.8rem;

    &:last-child {
      border-bottom: none;
    }

    a {
      color: $text-color;
      text-decoration: none;
      font-size: 1.1rem;
      font-weight: 500;
      display: inline-block;
      width: 100%;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      transition: color $transition-speed, background $transition-speed, transform $transition-speed;

      &:hover {
        color: $hover-text-color;
        background: $hover-gradient;
        transform: translateX(5px);
      }

      &:focus {
        outline: 2px solid $vue-green;
        border-radius: 4px;
      }

      &:active {
        color: color.adjust($hover-text-color, $lightness: -10%);
      }
    }
  }
}
</style>