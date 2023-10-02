const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path');
import * as fs from 'fs';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

// 打开文件夹
async function openMediaFolder() {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory'],
    defaultPath: 'Z:/media/video/电影'
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

function initMediaListHandler(_event, folderPath) {
  return _getFolderContent(folderPath);
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

  // 初始化列表
  const folderNames = _getFolderContent();
  // console.log('folderNames', folderNames);
  mainWindow.webContents.send('initFolderContent', folderNames)

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
ipcMain.handle('initMediaList', initMediaListHandler);

// const { QueryParameters } = require('.\entities');
// const { ImageDownloader, Movie } = require('./src/common/tmdb');
// const imageDownloader = new ImageDownloader();
// const movieClass = new Movie();

// // 主函数，使用 async/await 处理异步操作
// async function main() {
//   const folderPath = 'Z:/media/video/电影/蜘蛛侠 英雄无归 4K REMUX(原盘 蓝光)'
//   const mediaName = path.basename(folderPath);
//   console.log(mediaName)

//   imageDownloader.setFolder(folderPath)

//   const movieName = 'Spider-Man: No Way Home';
//   const params = new QueryParameters(movieName);

//   try {
//     const movies = await movieClass.byName(params);
//     const movie = await movieClass.byId(634649)

//     if (movies.length > 0) {
//       const movie = movies[0]
//       console.log(movie);

//       imageDownloader.poster(movie.poster_path);
//       imageDownloader.background(movie.backdrop_path);

//     } else {
//       console.log('未找到与查询匹配的电影。');
//     }
//   } catch (error) {
//     console.error('查询电影失败');
//   }
// }

// main()