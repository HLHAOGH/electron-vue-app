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

### electron打包dist_electron目录结构说明

- bundled webpack编译输出文件
- win-unpacked 解压的electron 应用
- index.js 编译过的background.js文件
- background.js electron应用的入口文件