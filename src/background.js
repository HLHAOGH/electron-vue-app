'use strict'

import { app, protocol, BrowserWindow, Tray, Menu, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const path = require('path');

const isDevelopment = process.env.NODE_ENV !== 'production';

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true, stream: true } }
])

let win;
async function createWindow() {
  // 创建并控制浏览器窗口
  win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: true, // 创建无边框窗口（不能拖动窗口）
    // 网页功能设置
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // 加载预加载脚本
      nativeWindowOpen: true, // 原生 window.open () 允许同步打开窗口
      enableRemoteModule: true, // 将 JavaScript 对象从主进程桥接到渲染器进程
      devTools: true,
      webSecurity: false, // 是否允许跨域
      allowRunningInsecureContent: false, // 允许一个 https 页面运行来自http url的JavaScript, CSS 或 plugins
      images: true, // 允许加载图片
      webgl: true, //  启用 WebGL 支持
      plugins: true, // 是否应该启用插件。默认值为 false
      navigateOnDragDrop: false, // 将文件或链接拖放到页面上时是否触发页面跳转
      spellcheck: true, // 是否启用内置拼写检查器
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION, // 是否启用Node环境继承
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

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  // 开发环境安装vue-devtools
  // if (isDevelopment && !process.env.IS_TEST) {
  //   try {
  //     await installExtension(VUEJS_DEVTOOLS)
  //   } catch (e) {
  //     console.error('Vue Devtools failed to install:', e.toString())
  //   }
  // }
  ipcMain.handle('ping', () => 'pong');
  
  createWindow();
  // 隐藏菜单栏
  // Menu.setApplicationMenu(null);
  // hide menu for Mac 
  if (process.platform !== 'darwin') {
    app.dock.hide();
  }

  const iconPath = path.join(__dirname, '../build/icons/16x16.png');
  let tray = new Tray(iconPath) ;     // 实例化一个tray对象，构造函数的唯一参数是需要在托盘中显示的图标url  
  
  tray.setToolTip('JSAS');  // 鼠标移到托盘中应用程序的图标上时，显示的文本
  // 点击图标的响应事件，这里是切换主窗口的显示和隐藏
  tray.on('click', () => {
    if (win.isVisible()) {
      win.hide()
    } else {
      win.show()
    }
  })
  // 右键点击图标时，出现的菜单，通过Menu.buildFromTemplate定制，这里只包含退出程序的选项
  tray.on('right-click', () => {
    const menuConfig = Menu.buildFromTemplate([
      {
        label: 'Quit',
        click: () => app.quit()
      }
    ]);
    tray.popUpContextMenu(menuConfig)
  })

})

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

// 解决证书错误-https
app.on('certificate-error', function(event, webContents, url, error, certificate, callback) {
  event.preventDefault();
  callback(true);
});