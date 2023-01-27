import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    site: process.env.DEPLOY_URL || 'https://houston.astro.build/'
});
