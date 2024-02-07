import { docsSchema } from '@astrojs/starlight/schema'
import { defineCollection } from 'astro:content'

export const collections = {
  // @ts-ignore
  docs: defineCollection({ schema: docsSchema() })
}
