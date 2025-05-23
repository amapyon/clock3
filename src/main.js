'use strict'

const {app, BrowserWindow, ipcMain} = require('electron')
const TimerWindow = require('./timerWindow.js')
const MessageWindow = require('./messageWindow.js')
const { Timer, toMMSS } = require('./timer.js')

app.disableHardwareAcceleration()

let mainWindow = null
let timerWindow = null
let messageWindow = null

let timer = null

let message = 'message'

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 640, height: 380,
    // width: 1280, height: 720,
    autoHideMenuBar: true,
    icon: '../icon/32.png',
    webPreferences: {
      preload: __dirname + '/mainWindowPreload.js'
    }
  })

  mainWindow.loadFile('src/main.html')
  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => {
    mainWindow = null
    if (timerWindow) {
      timerWindow.close()
      timerWindow = null
    }
    if (messageWindow) {
      messageWindow.close()
      messageWindow = null
    }
  })
}

function createTimerWindow() {
  timerWindow = new TimerWindow()
  timerWindow.createWindow()
}

function createMessageWindow() {
  messageWindow = new MessageWindow()
  messageWindow.createWindow()
}

function createWindow() {
  createMainWindow()
  createTimerWindow()
  
  ipcMain.on('timer', function(event, arg) {
    console.log('TIMER')
    console.log(arg)
    
    if (arg === '時計') {
      clockStart()
    } else if (arg === '継続') {
      timerContinue()
    } else if (arg === '停止') {
      timerPause()
    } else {
      timerStop()

      const match = arg.match(/(\d+)(分|秒)/)
      console.log(match)
      if (match === null) {
        return
      }
      timerStart(match[1] * {'分': 60, '秒': 1}[match[2]])
    }
  })

  ipcMain.on('main-window-loaded', function(event, arg) {
    const mainWin = event.sender

    const fs = require('fs')
    fs.readdir(__dirname + '/../media', function(err, files) {
      if (err) throw err
      files.forEach(function(filename){
        if (/.*\.mp3$/.test(filename) || /.*\.wav$/.test(filename)) {
          mainWin.send('set-soundfile', __dirname, filename)
        }
      })
    })
  })

  ipcMain.on('timer-window-loaded', function(event, arg) {
    updateDisplayColorDisable()
    updateDisplay(toMMSS(0))
  })

  ipcMain.on('message-window-loaded', function(event, arg) {
    messageWindow.updateDisplay(message)
  })

  ipcMain.on('main-window', (event, arg) => {
    if (arg == 'minimize') {
      timerWindow.minimize()
    } else if (arg == 'restore') {
      timerWindow.restore()
    }
  })
  
  ipcMain.on('main-window-topmost-changed', function(event, arg) {
    console.log('MAIN-WINDOW-TOPMOST-CHAGED')
    mainWindow.setAlwaysOnTop(arg)
  })
  
  ipcMain.on('main-window-changeChimeTime', function(event, id, time) {
    console.log('MAIN-WINDOW-CHANGE_CHIME_TIME')
    console.log([id, time])
    timer.setChimeTime(id, time)
  })

  ipcMain.on('main-window-changeAlarmTime', function(event, arg) {
    console.log('MAIN-WINDOW-CHANGE_ALARM_TIME')
    console.log(arg)
    timer.setAlarmTime(arg)
  })

  ipcMain.on('main-window-dispayMessage', function(event, arg) {
    console.log('MAIN-WINDOW-DISPLAY_MESSAGE')
    console.log(arg)
    createMessageWindow()
    if (arg) {
      messageWindow.show()
    } else {
      messageWindow.hide()
    }
  })
}

function clockStart() {
  updateDisplayColorEnable()
  timer.clockStart()
}

function timerStart(time) {
  timer.start(time)
  updateDisplayColorEnable()
}

function timerPause() {
  updateDisplayColorDisable()
  timer.pause()
}

function timerStop() {
  updateDisplayColorDisable()
  timer.pause()
}

function timerContinue() {
  updateDisplayColorEnable()
  timer.restart()
}

function updateDisplayColor(color) {
  timerWindow.updateDisplayColor(color)
}

function updateDisplayColorEnable() {
  updateDisplayColor('rgba(255, 255, 266, 0.8)')
}

function updateDisplayColorDisable() {
  updateDisplayColor('rgba(192, 192, 192, 0.8)')
}

function updateDisplay(message) {
  timerWindow && timerWindow.updateDisplay(message)
  mainWindow && mainWindow.send('update-display', message)
}

function finishTimer() {
  updateDisplayColorDisable()
}

function chime(chimeId) {
  mainWindow.send('chime', chimeId)
}

function alarmClock() {
  mainWindow.send('alarm')
}

const timerCallbacks = {
  updateDisplay: updateDisplay,
  finishTimer: finishTimer,
  chime: chime,
  alarmClock: alarmClock,
}

timer = new Timer(timerCallbacks)

app.on('ready', createWindow)
app.on('window-all-closed', function() {  
  app.quit()
})
