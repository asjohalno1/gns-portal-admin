// vite.config.js
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import rollupNodePolyFill from 'rollup-plugin-node-polyfills'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  console.log('>>> Building for mode:', mode)
  console.log('>>> VITE_ENV:', env.VITE_ENV)

  return {
    base: '/',
    build: {
      outDir: `dist-${mode}`, // separate folders for clarity
      rollupOptions: {
        plugins: [rollupNodePolyFill()],
      },
    },
    define: {
      'process.env.MY_ENV_VAR': JSON.stringify(env.MY_ENV_VAR),
      'process.env.VITE_ENV': JSON.stringify(env.VITE_ENV), // ✅ key change
      global: 'globalThis',
    },
    optimizeDeps: {
      include: ['buffer', 'process'],
      esbuildOptions: {
        loader: { '.js': 'jsx' },
        define: { global: 'globalThis' },
      },
    },
    esbuild: {
      loader: 'jsx',
      include: /src\/.*\.jsx?$/,
    },
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        src: path.resolve(__dirname, 'src'),
        crypto: 'crypto-browserify',
        stream: 'stream-browserify',
        buffer: 'buffer',
        process: 'process/browser',
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.scss'],
    },
    server: { port: 8077 },
  }
})
