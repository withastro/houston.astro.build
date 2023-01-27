import { defineConfig } from 'astro/config';

// https://astro.build/config
import netlify from "@astrojs/netlify/functions";

// https://astro.build/config
export default defineConfig({
  site: process.env.DEPLOY_URL || 'https://houston.astro.build/',
  output: "server",
  adapter: netlify()
});