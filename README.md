# electron-vue-app

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Node.js说明
虽然您需要在开发环境安装 Node.js 才能编写 Electron 项目，但是 Electron 不使用您系统的 Node.js 环境来运行它的代码。 相反地，它使用它内置的 Node.js 运行时。 这意味着您的终端用户不需要 Node.js 环境也可以运行您的应用。
通过主进程process.versions获取内置node.js版本
```javascript
 process.versions
```
### 使用electron改造vue
（1）创建vue项目
```javascript
// 安装vue-cli：
npm i @vue/cli -g
// 创建项目：
vue create <项目名>
```
（2）安装Vue CLI Plugin Electron Builder
```javascript
// 安装electron-builder
vue add electron-builder
```
### electron打包dist_electron目录结构说明

- bundled webpack编译输出文件
- win-unpacked 解压的electron 应用
- index.js 编译过的background.js文件
- background.js electron应用的入口文件

### electron组件通讯：
使用@electron/remote，直接操作electron