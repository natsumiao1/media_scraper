const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    getFolderContent: () => ipcRenderer.invoke('getFolderContent'),
    initFolderContent: (callback) => ipcRenderer.on('initFolderContent', callback),
})