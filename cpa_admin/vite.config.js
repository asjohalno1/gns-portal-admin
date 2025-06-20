import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import autoprefixer from 'autoprefixer'
import rollupNodePolyFill from 'rollup-plugin-node-polyfills'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    base: './',
    build: {
      outDir: 'dist',
      rollupOptions: {
        plugins: [rollupNodePolyFill()], // ✅ include Node polyfills
      },
    },
    css: {
      postcss: {
        plugins: [autoprefixer()],
      },
    },
    define: {
      'process.env.MY_ENV_VAR': JSON.stringify(process.env.MY_ENV_VAR),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      global: 'globalThis' // ✅ fix for some packages expecting `global`
    },
    esbuild: {
      loader: 'jsx',
      include: /src\/.*\.jsx?$/,
      exclude: [],
    },
    optimizeDeps: {
      include: ['buffer', 'process'],
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
        define: {
          global: 'globalThis', // ✅ also needed here
        },
      },
    },
    plugins: [react()],
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
    server: {
      port: 5173,
    },
  }
})
