/** 
 * 根目录下 vue.config.js文件
 * 引入的图片里面有一个build/logo.ico的文件，这个文件大小必须是256*256的
 * 然后这个build的目录在项目根目录下创建，图片放进去就行
 */

module.exports = {
	pluginOptions: {
    // electron配置
		electronBuilder: {
      // 是否删除electron运行产生的垃圾（警告或错误提示信息）
      removeElectronJunk: false
			builderOptions: {
        productName: "小蜜蜂",  // 应用的名称
        copyright: "Copyright © 2023 HlHao",
        directories: {
          buildResources: "build",   // 指定打包需要的静态资源，默认是build
          output: "dist_electron",  // 打包生成的目录，默认是dist_electron
        },
				nsis: {
				  allowToChangeInstallationDirectory: true, // 允许修改安装目录
				  oneClick: false, // 是否一键安装
          language: "2052", // 安装语言，2052对应中文
				  installerIcon: "./build/icons/icon.ico",  // 安装logo，大小必须是256*256的
				  installerHeaderIcon: "./build/icons/icon.ico", // 安装时头部logo
          createDesktopShortcut: true, // 创建桌面图标
          createStartMenuShortcut: true, // 创建开始菜单图标
          // shortcutName: "xxxx", // 图标名称
				},
        publish: [
          // {
          //   provider: '',      // 服务器提供商，也可以是GitHub等等
          //   url: "http://xxxxx/"      // 服务器地址
          // }
        ],
				electronDownload: {
					mirror: "https://npm.taobao.org/mirrors/electron/" // 镜像设置
				},
				win: {
					icon: './build/icons/icon.ico', // 打包windows版本的logo，大小必须是256*256的
          target: [
            'nsis',
          ]
				},
        mac: {
          // icon: "build/icons/icon.icns", // 大小至少是512*512的
          target: ["dmg", "zip"],  // 安装包的格式，默认是"dmg"和"zip"
        },
        linux: {
          // icon: "build/icons"
        },
			}
		}
	},
}