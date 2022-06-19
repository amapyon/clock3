'use strict'

window.electronAPI.handleSetSoundfile((event, dirName, soundfileName) => {
  const radioNode = document.createElement('spawn')
  radioNode.innerHTML = '<input type="radio" name="sound" value="' + dirName + '/../media/' + soundfileName + '" onclick="soundChange(this)">' + soundfileName + '</input>'
  
  const soundNode = document.getElementById('sound')
  soundNode.appendChild(radioNode)
})

window.electronAPI.handleUpdateDisplay((event, arg) => {
  console.log('UPDATE-DISPLAY')
  console.log(arg)
  
  const display = document.getElementById('display')
  display.innerHTML = arg
})

function timerStart(sender) {
  console.log('TIMER-START')
  console.log(sender)
  console.log(sender.innerHTML)
  
  window.electronAPI.timer(sender.innerHTML)
}

function controlClicked(sender) {
  console.log('CONTROL CLICKED')
  console.log(sender)
  console.log(sender.value)
  
  window.electronAPI.timer(sender.value)
}

function mainWindowTopmostChanged(sender) {
  console.log(sender.name)
  console.log(sender.checked)
  window.electronAPI.mainWindowTopmostChanged(sender)
}

function timerWindowTopmostChanged(sender) {
  console.log(sender.name)
  console.log(sender.checked)
  window.electronAPI.timerWindowTopmostChanged(sender)
}

function messageWindowTopmostChanged(sender) {
  console.log(sender.name)
  console.log(sender.checked)
  window.electronAPI.messageWindowTopmostChanged(sender)
}

function soundChange(sender) {
  console.log(sender.value)
  window.electronAPI.soundChange(sender)
}

window.electronAPI.handlePlayChime((event, soundName) => {
  console.log(soundName)
  const url = 'file://' + soundName
  const chime = new Audio(url)
  chime.currentTime = 0
  chime.play()
})

function play() {
  const sounds = document.getElementsByName('sound')
  console.log(sounds)
  
  sounds.forEach(function(soundNode) {
    if (soundNode.checked && soundNode.value !== 'none') {
      const chime = new Audio('file://' + soundNode.value)
      chime.play()
    }
  })
}

function changeAlarmTime(sender) {
  window.electronAPI.changeAlarmTime(sender)
}

function setAlarmMode(sender) {
  window.electronAPI.setAlarmMode(sender)
}

function displayMessage(sender) {
  window.electronAPI.displayMessage(sender)
}

function changeMessage(sender) {
  window.electronAPI.changeMessage(sender)
}

function send(arg) {
  window.electronAPI.send(arg)
}

function loaded() {
  window.electronAPI.mainWindowloaded()
  
  function downed(sender) {
    console.log('DOWNED')
    console.log(sender)
    
    if (sender.button == 2) {
      sender.target.setAttribute('contenteditable', true)
    }
  }
  
  function blured(sender) {
    console.log('BLURED')
    sender.target.setAttribute('contenteditable', false)
  }
  
  const elements = document.getElementsByName('time')
  elements.forEach(function(element) {
    element.addEventListener('mousedown', downed)
    element.addEventListener('blur', blured)
  })
}

loaded()
