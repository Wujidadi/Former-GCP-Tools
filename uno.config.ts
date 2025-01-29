import { defineConfig } from 'unocss';
import transformerDirectives from '@unocss/transformer-directives';

export default defineConfig({
  preflights: [
    {
      getCSS: () => `
        *, *::before, *::after {
          box-sizing: border-box;
        }
      `,
    }
  ],
  shortcuts: [
    {
      'input-dark': 'w-full p-1.5 text-center text-light-500 bg-neutral-800 rounded-md',
      'button-dark': 'text-center text-light-500 bg-neutral-700 rounded-lg cursor-pointer',
    },
  ],
  transformers: [
    transformerDirectives(),
  ],
});
