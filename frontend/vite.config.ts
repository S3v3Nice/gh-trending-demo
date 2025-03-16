import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import * as process from 'node:process'

// https://vite.dev/config/
export default defineConfig((configEnv) => {
    // Load .env file based on `mode` in the current working directory
    const env = loadEnv(configEnv.mode, process.cwd())

    return {
        publicDir: 'public',
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
            },
        },
        server: {
            host: '0.0.0.0',
            hmr: {
                clientPort: parseInt(env.VITE_PORT || "5173", 10),
                host: 'localhost',
                protocol: 'ws'
            },
            port: 5173,
            watch: {
                usePolling: true
            }
        },
        plugins: [
            vue(),
            tailwindcss(),
        ],
    }
})
