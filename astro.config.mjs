// @ts-check
import { defineConfig } from 'astro/config';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import icon from "astro-icon";
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: "http://rsass-rcs.uncc.edu/~cmuntz/",
  base: "/~cmuntz/",
  outDir: "/home/cmuntz/public_html",
  trailingSlash: "always",
  build: { format: "directory",},
  server: {
      prerender: { crawlLinks: true,},
  },
  markdown: {
      remarkPlugins:[
        remarkMath,
      ],
      rehypePlugins: [rehypeKatex],
      shikiConfig:{
        themes:{
          light: 'monokai',
          dark: 'night-owl',
        },
        wrap: false,
      },
  },
  integrations:[
    icon({iconDir: 'src/icons'}), 
    mdx()],
});