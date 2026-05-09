<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/ca477a8b-5e44-4884-a820-b7649308b769

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`

## Deploy to Cloudflare Pages

Use these settings in Pages:

- Build command: `npm run build`
- Build output directory: `dist`
- Framework preset: `Vite`

This repo also includes `wrangler.toml`, so `wrangler pages deploy dist` can publish the built game after `npm run build`.
