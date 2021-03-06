'use strict'

const {app, BrowserWindow, ipcMain} = require('electron')

//var subWin = null
var mainWindow = null
var mainWin = null
var timerWindow = null
var timerWin = null
var messageWindow = null
var messageWin = null
var settedTime = 0
var remainTime = 0
var elipseTime = 0
var oldTime = 0
var timer = 0
var soundName = 'none'

function createMainWindow () {
  mainWindow = new BrowserWindow({
    width: 600, height: 350,
    autoHideMenuBar: true,
    icon: '../icon/32.png'
  })

  mainWindow.loadFile('src/main.html')

  mainWindow.on('closed', function(){
    if (timerWindow != null) timerWindow.close()
    if (messageWindow != null) messageWindow.close()
  })

}

function createTimerWindow () {
  timerWindow = new BrowserWindow({
    width: 200, height: 100,
    transparent: true,
    frame: false
  })

  timerWindow.loadFile('src/timer.html')

  timerWindow.on('closed', function(){
    timerWindow = null
  })
}

function createMessageWindow() {
  if (messageWindow != null) return
  messageWindow = new BrowserWindow({
    width: 640, height: 480,
    transparent: true,
    frame: false
  })

  messageWindow.loadFile('src/message.html')

  messageWindow.on('closed', function(){
    messageWindow = null
  })
}


function createWindow() {
  createMainWindow()
  createTimerWindow()
  
  ipcMain.on('timer', function(event, arg) {
    console.log('TIMER')
    console.log(event)
    console.log(arg)
    
    if (arg == '時計') {
      clockStart()
    } else if (arg == '継続') {
      timerContinue()
    } else if (arg == '停止') {
      timerPause()
    } else {
      timerStop()

      const match = arg.match(/(\d+)(分|秒)/)
      console.log(match)
      if (match == null) {
        return
      }
      timerStart(match[1] * {'分': 60, '秒': 1}[match[2]])
    }
    
  })
  
  ipcMain.on('main-window-loaded', function(event, arg) {
    mainWin = event.sender

    const fs = require('fs')
    fs.readdir(__dirname + '/../media', function(err, files){
      if (err) throw err
      files.forEach(function(filename){
        if (/.*\.mp3$/.test(filename) || /.*\.wav$/.test(filename)) {
          mainWin.send('set-soundfile', filename)
        }
      })
    })
  })

  ipcMain.on('timer-window-loaded', function(event, arg) {
    timerWin = event.sender
    updateDisplayColorDisable()
    updateDisplay(toMMSS(0))
  })

  ipcMain.on('main-window', (event, arg) => {
    if (arg == 'minimize') {
      timerWindow.minimize()
    } else if (arg == 'restore') {
      timerWindow.restore()
    }
  })
  
  ipcMain.on('main-window-topmost-changed', function(event, arg) {
    console.log('main-WINDOW-TOPMOST-CHAGED')
    console.log(event)
    console.log(arg)
    mainWindow.setAlwaysOnTop(arg)
  })
  
  ipcMain.on('timer-window-topmost-changed', function(event, arg) {
    console.log('TIMER-WINDOW-TOPMOST-CHAGED')
    console.log(event)
    console.log(arg)
    timerWindow.setAlwaysOnTop(arg)
  })
  
  ipcMain.on('message-window-topmost-changed', function(event, arg) {
    console.log('MESSAGE-WINDOW-TOPMOST-CHAGED')
    console.log(event)
    console.log(arg)
    if (messageWindow == null) return
    messageWindow.setAlwaysOnTop(arg)
  })
  
  ipcMain.on('sound-changed', function(event, arg) {
    console.log('SOUND-CHAGED')
    console.log(arg)
    soundName = arg
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

  ipcMain.on('main-window-changeMessage', function(event, arg) {
    console.log('MAIN-WINDOW-CHANGE_MESSAGE')
    console.log(arg)
    if (messageWindow == null) return
    messageWindow.webContents.send('message', arg.replace(/\n/g, '<br />'))
  })
}

function clockStart() {
  clearInterval(timer)
  updateDisplayColorEnable()

  timer = setInterval(clockUpdate, 200)
}

function clockUpdate() {
  const now = new Date()
  updateDisplay(now.toLocaleTimeString())
}

function timerStart(time) {
  settedTime = time * 1000
  remainTime = settedTime
  updateDisplay(toMMSS(remainTime))
  elipseTime = 0
  
  timerContinue()
}

function timerPause() {
  updateDisplayColorDisable()
  clearInterval(timer)
}

function timerStop() {
  timerPause()
}

function timerContinue() {
  updateDisplayColorEnable()
  oldTime = Date.now()
  timer = setInterval(countDown, 200)
}

function toMMSS(time) {
  const sec = Math.trunc(remainTime / 1000)
  const minute = Math.trunc(sec / 60)
  const second = (sec % 60 + 100).toString().slice(-2)
  console.log(sec, minute, second)

  return minute + ':' + second
}

function updateDisplay(message) {
  if (timerWin != null) timerWin.send('update-display', message)
  if (mainWin != null) mainWin.send('update-display', message)
}

function updateDisplayColor(color) {
  timerWin.send('update-display-color', color)
}

function updateDisplayColorEnable() {
  updateDisplayColor('rgba(255, 255, 266, 0.8)')
}
function updateDisplayColorDisable() {
  updateDisplayColor('rgba(192, 192, 192, 0.8)')
}

function playChime() {
  if (soundName != 'none') {
    timerWin.send('play-chime', soundName)
  }
}

function countDown() {
  const currentTime = Date.now()
  const diffTime = currentTime - oldTime
  oldTime = currentTime
  elipseTime += diffTime
  remainTime = settedTime - elipseTime
  console.log(settedTime, elipseTime, remainTime)

  updateDisplay(toMMSS(remainTime))
  if (remainTime <= 0) {
    timerStop()
    playChime()
  }
}

app.on('ready', createWindow)
app.on('window-all-closed', function() {  
  app.quit()
})