// 为了将 Electron 的不同类型的进程桥接在一起，我们需要使用被称为 预加载 的特殊脚本
// 新建一个 preload.js 文件。该脚本通过 versions 这一全局变量，将 Electron 的 process.versions 对象暴露给渲染器
// BrowserWindow 的预加载脚本运行在具有 HTML DOM 和 Node.js、Electron API 的有限子集访问权限的环境中

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke('ping')
  // we can also expose variables, not just functions
})
