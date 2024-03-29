// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron')
const fs = require('fs')

// const { default: installExtension, REDUX_DEVTOOLS } = require('electron-devtools-installer');
const {
  default: installExtension,
  REACT_DEVELOPER_TOOLS
} = require('electron-extension-installer')

const path = require('path')

// const Store = require('electron-store')
// import Store from 'electron-store'
// let store = new Store()
// Store.initRenderer()

// dev环境添加调试
const isDev = require('electron-is-dev')
isDev && require('electron-debug')({ enabled: true, showDevTools: false })

// 不需要菜单栏
Menu.setApplicationMenu(null)

// 添加Chrome插件
function createDevTools() {
  installExtension(REACT_DEVELOPER_TOOLS, {
    loadExtensionOptions: {
      allowFileAccess: true
    }
  })
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err))

  // 安装React开发者工具
  // installExtension(REDUX_DEVTOOLS)
  //       .then((name) => console.log(`Added Extension:  ${name}`))
  //       .catch((err) => console.log('An error occurred: ', err));
}

// 创建窗口
let mainWindow
function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'ChatBox',
    icon: path.join(__dirname, './favicon.ico'),
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: false,
      contextIsolation: false,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
      preload: path.join(__dirname, 'preload.ts')
    }
  })

  // 热重载
  if (isDev) {
    try {
      require('electron-reloader')(module)
    } catch {}
  }

  // and load the index.html of the app.
  // mainWindow.loadFile('build/index.html')  //正式环境
  mainWindow.loadURL('http://localhost:3000') //开发环境

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  // 开发环境加载开发者工具
  isDev && createDevTools()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  // 关闭窗口
  ipcMain.on('chatbox-close', (event) => {
    mainWindow.destroy()
  })

  // 导出md文件
  ipcMain.on('exportMd', (event, dialogue) => {
    dialog
      .showSaveDialog({
        filters: [
          {
            name: 'MD文件',
            extensions: ['md']
          }
        ],
        properties: [],
        defaultPath: `${dialogue.name}.md`,
        buttonLabel: '导出',
        title: '保存文件'
      })
      .then((res) => {
        const md = dialogue.messages.reduce((prev, cur) => {
          let { content, role } = cur

          prev += `**${role}**: \n`
          prev += content + '\n'
          prev += '\n--------------------\n\n'

          return prev
        }, '')

        // fs 写文件
        fs.writeFileSync(res.filePath, md, (err) => {})
      })
      .catch((error) => {
        console.log('error: ', error)
      })
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
