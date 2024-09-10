// 编写electron 开发模式
import type {Plugin} from 'vite'
import type { AddressInfo } from 'net'
import { spawn } from 'child_process'
import fs from 'node:fs'

// 导出vite 插件函数
export const viteElectronDev = (): Plugin => {
 return {
    name: 'vite-electron-dev',
    // 在configureServer 中实现插件的逻辑
    configureServer(server) {
        // 定义初始化Electron 的函数
        const initElectron = () => {
            // 提前变异号js代码，这样在监听文件时就可以找到文件
            require('esbuild').buildSync({
                entryPoints: ['src/background.ts'], // 指定要编译的入口文件，这里是src/background.ts
                bundle: true, // 指定是否打包所有依赖项，这里是true，表示需要打包所有依赖项。
                outfile: 'dist/background.js', // 指定输出文件的路径和名称，这里是dist/background.js。
                platform:' node', // 指定编译的目标平台，这里是node，表示编译为Node.js可用的代码
                target: 'node12', // 指定编译的目标JavaScript版本，这里是node12，表示编译为Node.js 12及以上版本可用的代码。
                external: ['electron'] // 指定不需要被打包的外部依赖项，这里是['electron']，表示electron模块不需要被打包。
            })
        }
        // 调用初始化Electron函数
        initElectron()

        // 监听Vite 的HTTP 服务器的listening事件
        server?.httpServer?.once('listening', () => {
            // 获取HTTP 服务器的监听地址和端口号
            const addressInfo = server?.httpServer?.address() as AddressInfo
            // 拼接ip地址，给electron 启动服务的时候要用
            const IP = `http://localhost:${addressInfo.port}`

            // 启动Electron 进程， 进程传参法
            let electronProcess = spawn(require('electron'), ['dist/background.js', IP])

            // 监听主进程代码更改 主要实现热更新
            fs.watchFile('src/background.js', () => {
                // 杀死当前的electron 进程
                electronProcess.kill()
                // 重新编译主进程代码并重新启动Electron进程
                initElectron()
                // 运行shell命令
                electronProcess = spawn(require('electron'), ['dist/background.js', IP])
            })

            // 监听Electron 进程stdout 输出
            electronProcess.stdout?.on('data', (data) => {
                console.log(`日志 ${data}`);
                
            })

        })
    }
 }
}