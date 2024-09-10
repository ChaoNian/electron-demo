// 预加载脚本
const {contextBridge}  = require('electron')

contextBridge.exposeInMainWorld('myAPI', {
    version: process.version,
    saveFile: (data) => {
        ipcRenderer.send('file-save', data)
    },
    readFile: () => {
        ipcRenderer.invoke('file-read')
    }
})