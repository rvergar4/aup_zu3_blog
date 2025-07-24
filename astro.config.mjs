// @ts-check
import { defineConfig } from 'astro/config';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import icon from "astro-icon";
import mdx from '@astrojs/mdx';

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
  integrations: [
    icon({iconDir: 'src/icons'}), 
    mdx()],
});