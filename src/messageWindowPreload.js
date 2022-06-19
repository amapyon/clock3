const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    messageWindowloaded: () => ipcRenderer.send('message-window-loaded', {}),

    handleUpdateDisplay: (callback) => ipcRenderer.on('update-display', callback),
    // handleUpdateDisplayColor: (callback) => ipcRenderer.on('update-display-color', callback),
})
