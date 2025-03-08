'use strict'

const { BrowserWindow, ipcMain } = require('electron')

let thisWindow = null
let thisInstance = null
let message = 'message'

module.exports = class MessageWindow {
  constructor() {
    thisInstance = this
  }

  createWindow() {
    if (thisWindow) return

    thisWindow = new BrowserWindow({
      width: 640, height: 240,
      // width: 1200, height: 600,
      transparent: true,
      frame: false,
      icon: '../icon/32.png',
      webPreferences: {
        preload: __dirname + '/messageWindowPreload.js'
      }
    })
  
    thisWindow.loadFile('src/message.html')
    // messageWindow.webContents.openDevTools()
  
    thisWindow.on('closed', () => {
      thisWindow = null
      thisInstance = null
    })
  }

  show() {
    thisWindow.show()
  }

  hide() {
    thisWindow.hide()
  }

  close() {
    thisWindow.close()
  }

  setAlwaysOnTop(always) {
    thisWindow.setAlwaysOnTop(always)
  }

  updateDisplay(displayText) {
    const html = displayText.replace(/\n/g, '<br />')
    thisWindow.webContents.send('update-display', html)
  }
}

ipcMain.on('message-window-topmost-changed', function(event, arg) {
  console.log('MESSAGE-WINDOW-TOPMOST-CHAGED')
  if (thisWindow === null) return
  thisInstance.setAlwaysOnTop(arg)
})

ipcMain.on('main-window-changeMessage', function(event, arg) {
  console.log('MAIN-WINDOW-CHANGE_MESSAGE')
  console.log(arg)
  message = arg
  if (thisWindow === null) return
  thisInstance.updateDisplay(message)
})

