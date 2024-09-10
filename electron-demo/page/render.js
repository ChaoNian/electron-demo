// 渲染进程
const btn = document.getElementById('btn')

btn.onclick = () => {
    myAPI.saveFile('存入text')
}

btn.onclick = () => {
    myAPI.readFile()
}