'use strict'

const { BrowserWindow, ipcMain } = require('electron')

let thisWindow = null

module.exports = class TimerWindow {
  createWindow() {
    thisWindow = new BrowserWindow({
      width: 200, height: 100,
      // width: 1200, height: 600,
      transparent: true,
      frame: false,
      webPreferences: {
        preload: __dirname + '/timerWindowPreload.js'
      }
    })
  
    thisWindow.loadFile('src/timer.html')
    // thisWindow.webContents.openDevTools()
  
    thisWindow.on('closed', () => {
      thisWindow = null
    })

    ipcMain.on('timer-window-topmost-changed', function(event, arg) {
      console.log('TIMER-WINDOW-TOPMOST-CHAGED')
      thisWindow.setAlwaysOnTop(arg)
    })  
  }

  close() {
    thisWindow.close()
  }

  minimize() {
    thisWindow.minimize()
  }

  restore() {
    thisWindow.restore()
  }

  setAlwaysOnTop(always) {
    thisWindow.setAlwaysOnTop(always)
  }
  
  updateDisplay(displayText) {
    thisWindow.webContents.send('update-display', displayText)
  }

  updateDisplayColor(color) {
    if (thisWindo) {
      thisWindow.send('update-display-color', color)
    }
  }
}
