const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    // setTitle: (title) => ipcRenderer.send('set-title', title)
    mainWindowloaded: () => ipcRenderer.send('main-window-loaded', {}),
    send: (arg) => ipcRenderer.send('main-window', arg),

    timer: (arg) => ipcRenderer.send('timer', arg),
    displayMessage: (sender) => ipcRenderer.send('main-window-dispayMessage', sender.checked),
    changeMessage: (sender) => ipcRenderer.send('main-window-changeMessage', sender.value),

    changeChimeTime: (chimeId, sender) => ipcRenderer.send('main-window-changeChimeTime', chimeId, sender.value),
    handleChime: (callback) => ipcRenderer.on('chime', callback),

    changeAlarmTime: (sender) => ipcRenderer.send('main-window-changeAlarmTime', sender.value),
    handleAlarm: (callback) => ipcRenderer.on('alarm', callback),

    mainWindowTopmostChanged: (sender) => ipcRenderer.send('main-window-topmost-changed', sender.checked),
    timerWindowTopmostChanged: (sender) => ipcRenderer.send('timer-window-topmost-changed', sender.checked),
    messageWindowTopmostChanged: (sender) => ipcRenderer.send('message-window-topmost-changed', sender.checked),

    handleSetSoundfile: (callback) => ipcRenderer.on('set-soundfile', callback),
    handleUpdateDisplay: (callback) => ipcRenderer.on('update-display', callback),
})
