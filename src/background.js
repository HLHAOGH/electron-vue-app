'use strict'

import { app, protocol, BrowserWindow } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  // 创建并控制浏览器窗口
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    // 网页功能设置
    webPreferences: {
      nativeWindowOpen: true, // 原生 window.open () 允许同步打开窗口
      enableRemoteModule: true, // 将 JavaScript 对象从主进程桥接到渲染器进程
      devTools: true,
      webSecurity: true, // 是否启用同源策略
      allowRunningInsecureContent: false, // 允许一个 https 页面运行来自http url的JavaScript, CSS 或 plugins
      images: true, // 允许加载图片
      webgl: true, //  启用 WebGL 支持
      plugins: true, // 是否应该启用插件。默认值为 false
      navigateOnDragDrop: false, // 将文件或链接拖放到页面上时是否触发页面跳转
      spellcheck: true, // 是否启用内置拼写检查器
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION, // 是否启用Node integration节点继承
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION // 是否在独立 JavaScript 环境中运行 Electron API和指定的preload 脚本. 默认为 true
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow();
  // 隐藏菜单栏
  const { Menu } = require('electron');
  Menu.setApplicationMenu(null);
  // hide menu for Mac 
  if (process.platform !== 'darwin') {
    app.dock.hide();
  }
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
