const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    getFolderContent: () => ipcRenderer.invoke('getFolderContent'),
    initMediaList: (callback) => ipcRenderer.on('initMediaListAtStart', callback),
    startScrap: (media) => ipcRenderer.send('startScrap', media)
})