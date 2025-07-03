// vite.config.js
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'   // ← correct!

import path from 'node:path'
import rollupNodePolyFill from 'rollup-plugin-node-polyfills'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    base: './',
    build: {
      outDir: 'dist',
      rollupOptions: { plugins: [rollupNodePolyFill()] },
    },
    define: {
      'process.env.MY_ENV_VAR': JSON.stringify(env.MY_ENV_VAR),
      'process.env.NODE_ENV':   JSON.stringify(process.env.NODE_ENV),
      global:                   'globalThis',
    },
    optimizeDeps: {
      include: ['buffer','process'],
      esbuildOptions: {
        loader: { '.js': 'jsx' },
        define: { global: 'globalThis' },
      },
    },
    esbuild: {
      loader: 'jsx',
      include: /src\/.*\.jsx?$/,
    },
    plugins: [
      react(),
      tailwindcss(),              // ← add it here
    ],
    resolve: {
      alias: {
        src:     path.resolve(__dirname,'src'),
        crypto:  'crypto-browserify',
        stream:  'stream-browserify',
        buffer:  'buffer',
        process: 'process/browser',
      },
      extensions: ['.mjs','.js','.ts','.jsx','.tsx','.json','.scss'],
    },
    server: { port: 5173 },
  }
})
