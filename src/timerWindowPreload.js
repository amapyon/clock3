const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    timerWindowloaded: () => ipcRenderer.send('timer-window-loaded', {}),

    handleUpdateDisplay: (callback) => ipcRenderer.on('update-display', callback),
    handleUpdateDisplayColor: (callback) => ipcRenderer.on('update-display-color', callback),
})
