import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { copyFileSync } from 'fs'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [
    react(),
    {
      // Before each build, copy the source sidepanel HTML to the project root
      // so Vite can use it as an entry point and output it there.
      name: 'prepare-html-entry',
      buildStart() {
        copyFileSync(
          resolve(__dirname, 'src/sidepanel/index.html'),
          resolve(__dirname, 'sidepanel.html'),
        )
      },
    },
  ],
  publicDir: 'public',
  build: {
    outDir: '.',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        sidepanel:          resolve(__dirname, 'sidepanel.html'),
        'service-worker':   resolve(__dirname, 'src/background/service-worker.js'),
        content:            resolve(__dirname, 'src/content/content.js'),
      },
      output: {
        entryFileNames: (chunk) => {
          if (chunk.name === 'service-worker') return 'background/service-worker.js'
          if (chunk.name === 'content')        return 'content/content.js'
          return 'assets/[name].js'
        },
        chunkFileNames:  'assets/[name].js',
        assetFileNames:  'assets/[name][extname]',
      },
    },
  },
})
