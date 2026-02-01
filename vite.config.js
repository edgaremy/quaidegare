import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Get base path from environment variable for GitHub Pages
  // This will be /repo-name/ when deploying to GitHub Pages
  const base = process.env.BASE_PATH || '/'

  return {
    plugins: [svelte()],
    base: base,
    assetsInclude: ['**/*.JPG', '**/*.jpg', '**/*.JPEG', '**/*.jpeg'],
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false
    }
  }
})
