//Import glob loader
import { glob } from "astro/loaders";
//Import utilities from `astro:content`
import { z, defineCollection } from "astro:content";
//Define a `loader` and `schema` for each collection
const blog = defineCollection({
    loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/blog" }),
    schema: z.object({
      title: z.string(),
      pubDate: z.date(),
      description: z.string(),
      author: z.string(),
      draft: z.boolean().default(false).optional(),
      image: z.object({
        url: z.string(),
        alt: z.string(),
        width: z.number().optional()
      }).optional(),
      tags: z.array(z.string())
    })
});

//Export a single `collections` object to register your collection(s)
export const collections = {blog};