const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    getFolderContent: () => ipcRenderer.invoke('getFolderContent'),
    initMediaList: () => ipcRenderer.invoke('initMediaList'),
})