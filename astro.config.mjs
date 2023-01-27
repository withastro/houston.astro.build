import { defineConfig } from 'astro/config';

// https://astro.build/config
import netlify from "@astrojs/netlify/functions";

// https://astro.build/config
export default defineConfig({
  site: 'https://houston.astro.build/', // process.env.DEPLOY_URL || 
  output: "server",
  adapter: netlify()
});