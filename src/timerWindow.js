'use strict'

const { BrowserWindow, ipcMain } = require('electron')

let thisWindow = null

module.exports = class TimerWindow {
  createWindow() {
    thisWindow = new BrowserWindow({
      width: 240, height: 100,
      // width: 1200, height: 600,
      transparent: true,
      frame: false,
      icon: '../icon/32.png',
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
    if (thisWindow) {
      thisWindow.close()
    }
  }

  minimize() {
    if (thisWindow) {
      thisWindow.minimize()
    }
  }

  restore() {
    if (thisWindow) {
      thisWindow.restore()
    }
  }

  setAlwaysOnTop(always) {
    if (thisWindow) {
      thisWindow.setAlwaysOnTop(always)
    }
  }
  
  updateDisplay(displayText) {
    if (thisWindow) {
      thisWindow.webContents.send('update-display', displayText)
      thisWindow.setTitle(displayText)
    }
  }

  updateDisplayColor(color) {
    if (thisWindow) {
      thisWindow.send('update-display-color', color)
    }
  }
}
