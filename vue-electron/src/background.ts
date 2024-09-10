// 主进程文件  electron 入口文件
import {app, BrowserWindow} from 'electron'

// 等待Electron应用就绪后创建BrowserWindow 窗口
app.whenReady().then(async () => {
    const win = await new BrowserWindow({
        width: 800,
        height: 600,
        // 配置窗口的webPreference选项， 用于控制渲染进程的行为
        webPreferences: {
            nodeIntegration:true, // 可以在渲染进程中使用启用Node.js api， 为了安全不可以使用
            contextIsolation: false, // 禁用上下文隔离，关闭渲染进程的沙箱， 避免第三方NPM 包注入代码
            webSecurity: false, // 禁用web 安全策略 跨域
        }
    })

    // 根据命令行参数加载URL 或本地文件
    if (process.argv[2]) { // 进程传参法， 能够读到， 说明时开发环境
        win.loadURL(process.argv[2])
    } else {
        // 生产环境
        win.loadFile('index.html')
    }
})