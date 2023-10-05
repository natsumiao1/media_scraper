const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path');
import * as fs from 'fs';
import * as handler from './handler';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

// 打开文件夹
async function openMediaFolder() {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory'],
    defaultPath: store.get('path.lastOpenFolder')
  })

  if (!canceled) {
    return _getFolderContent(filePaths[0]);
  }
  return [];
}

// 获取文件夹内容, 返回子文件夹名
function _getFolderContent(folderPath) {
  if (folderPath === undefined) {
    folderPath = store.get('path.lastOpenFolder')
  } else {
    store.set('path.lastOpenFolder', folderPath)
  }

  try {
    const subfolders = fs.readdirSync(folderPath, { withFileTypes: true });
    var folderNames = subfolders
      .filter((item) => item.isDirectory())
      .map(item => ({
        'name': item.name,
        'path': path.join(folderPath, item.name)
      }))

    return folderNames;
  } catch (error) {
    console.error('获取文件夹内容出错:', error);
    return [];
  }
}

const Store = require('electron-store');
const store = new Store();


const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  mainWindow.webContents.once("did-finish-load", () => {
    const folderNames = _getFolderContent();
    mainWindow.webContents.send('initMediaListAtStart', folderNames)
  });

};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
ipcMain.handle('getFolderContent', openMediaFolder);
ipcMain.on('startScrap', handler.startScrap);