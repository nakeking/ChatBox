#### ChatBox

<!-- Badge -->

[![Author](https://img.shields.io/badge/Author-nakeking-red 'Author')](https://github.com/nakeking 'Nakeking')

#### 环境搭建

##### pnpm，create-react-app 创建 react 项目

```
pnpx create-react-app electron-chatbox --use-pnpm --template typescript

// cd electron-chatbox
// 删除 node_modules 文件夹

pnpm install

// 你可能会遇到一个错误
// Property 'toBeInTheDocument' does not exist on type 'JestMatchers<HTMLElement>'.

pnpm add -D @types/testing-library__jest-dom

// https://dev.to/lico/set-up-create-react-app-using-pnpm-nji
```

##### 安装 Electron

```
pnpm add -D electron

// 你可能会遇到一个错误
Error: Electron failed to instal1 correctly, please delete node modules/electron and try installing again

// 方法一
// 进入 node_modules/electron
npm install
// cnpm install

// 方法二
pnpm config set electron_mirror "https://npm.taobao.org/mirrors/electron/"

pnpm add -D electron

// 后续步骤请参考electron官方文档
https://www.electronjs.org/zh/docs/latest/tutorial/quick-start

```

##### 添加 Electron 调试

```
pnpm add -D electron-devtools-installer electron-debug devtron
pnpm add -S electron-is-dev

// main.ts
const isDev = require('electron-is-dev');
// const { default: installExtension, REDUX_DEVTOOLS } = require('electron-devtools-installer');
const { default: installExtension, REACT_DEVELOPER_TOOLS } = require("electron-extension-installer")


// 利用electron-debug，添加和Chrome类似的快捷键
isDev && require('electron-debug')({ enabled: true, showDevTools: false });

// 添加Chromium插件
function createDevTools() {
  installExtension(REACT_DEVELOPER_TOOLS, {
    loadExtensionOptions: {
      allowFileAccess: true,
    }
  })
  .then((name) => console.log(`Added Extension:  ${name}`))
  .catch((err) => console.log('An error occurred: ', err));
}

app.whenReady().then(() => {
  ...

  // 开发环境加载开发者工具
  + isDev && createDevTools()

  ...
})

// 请根据自身项目Electron版本选择使用工具加载 DevTools 扩展
// electron-devtools-installer 和 electron-extension-installer
// 当前项目Electron版本25.1.0，使用electron-extension-installer进行安装 React_Developer_Tools拓展。
// 当使用 electron-devtools-installer 安装 React_Developer_Tools时报错，尝试安装其他扩展(REDUX_DEVTOOLS)正常。似乎是与 Electron >= 24.0版本问题。
// https://github.com/MarshallOfSound/electron-devtools-installer/issues/238
```

#### 你可能会遇到的问题集合

```
react-scripts 5 webpack Module not found: Error: Can't resolve 'fs'|'crypto'| ...

// https://github.com/facebook/create-react-app/issues/11756
```

```
fs.existsSync is not a function

// craco.config.js
module.exports = {
  webpack: {
      configure: {
        + target: 'electron-main',
        ...
      }
  }
  ...
}

// 目前使用的是craco配置webpack，使用react-app-rewired可移步文档添加此项配置
```

```
Uncaught ReferenceError: require is not defined

// main.ts
new BrowserWindow({
  ...
  webPreferences: {
    + nodeIntegration: true,
    + contextIsolation: false,
    ...
  }
  ...
})
```

```

```
