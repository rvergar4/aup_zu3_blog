// @ts-check
import { defineConfig } from 'astro/config';
import rehypeKatex from 'rehype-katex'; // relevant
import remarkMath from 'remark-math';   // relevant

// https://astro.build/config
export default defineConfig({
markdown: {
    remarkPlugins: [
      remarkMath,
    ],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      // For more themes, visit https://shiki.style/themes
      theme: "night-owl",
      wrap: false,
    },
  },

});
