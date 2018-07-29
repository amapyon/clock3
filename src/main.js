'use strict'

const {app, BrowserWindow, ipcMain} = require('electron')

var subWin = null
var mainWin = null
var timerWin = null
var settedTime = 0
var remainTime = 0
var elipseTime = 0
var oldTime = 0
var timer = 0
var soundName = 'none'

function createMainWindow () {
  const win = new BrowserWindow({width: 600, height: 250, autoHideMenuBar: true})

  win.loadFile('src/main.html')

  win.on('closed', function(){
    subWin.close()
  })

}

function createTimerWindow () {
  const win = new BrowserWindow({width: 200, height: 100, transparent: true, frame: false})
  subWin = win

  win.loadFile('src/timer.html')
}

function createWindow() {
  createMainWindow()
  createTimerWindow()
  
  ipcMain.on('button-clicked', function(event, arg) {
    console.log('BUTTON-CLICKED')
    console.log(event)
    console.log(arg)
    
    if (arg == '継続') {
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
    updateDisplay(0)
  })
  
  ipcMain.on('topmost-changed', function(event, arg) {
    console.log('TOPMOST-CHAGED')
    console.log(arg)
    subWin.setAlwaysOnTop(arg)
  })
  
  ipcMain.on('sound-changed', function(event, arg) {
    console.log('SOUND-CHAGED')
    console.log(arg)
    soundName = arg
  })
}

function timerStart(time) {
  settedTime = time * 1000
  remainTime = settedTime
  updateDisplay(remainTime)
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

function updateDisplay(remainTime) {
  const sec = Math.trunc(remainTime / 1000)
  const minute = Math.trunc(sec / 60)
  const second = (sec % 60 + 100).toString().slice(-2)
  console.log(sec, minute, second)
  if (timerWin != null) timerWin.send('update-display', minute + ':' + second)
  if (mainWin != null) mainWin.send('update-display', minute + ':' + second)
}

function updateDisplayColor(color) {
  timerWin.send('update-display-color', color)
}

function updateDisplayColorEnable() {
  updateDisplayColor('#FFFFFF')
}
function updateDisplayColorDisable() {
  updateDisplayColor('#AAAAAA')
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

  updateDisplay(remainTime)
  if (remainTime <= 0) {
    timerStop()
    playChime()
  }
}

app.on('ready', createWindow)
