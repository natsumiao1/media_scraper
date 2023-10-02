const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    getFolderContent: () => ipcRenderer.invoke('getFolderContent'),
    getFolderContent2: () => ipcRenderer.invoke('getFolderContent2'),
    initFolderContent: (callback) => ipcRenderer.on('initFolderContent', callback),
})