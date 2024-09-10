// 主进程
const {app, BrowserWindow,ipcMain} = require('electron')
const path = require('path') 
const fs = require('fs')
function writeFile(_, data) {
    fs.writeFileSync('hellow.txt', data)
} 
function rradFile(_, data) {
    return fs.readFileSync('hellow.txt', data).toString()
} 
function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 800,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.resolve(__dirname, './preload.js')
        }
    })
    ipcMain.on('file-save', writeFile) // 接收与渲染过来的通信
    ipcMain.handle('file-read', readFile) // 接收通信
    win.loadFile('./pages/index/html')
}