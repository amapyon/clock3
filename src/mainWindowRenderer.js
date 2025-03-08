'use strict'

function setSelectSoundList(soundfilePath, soundfileName) {
  console.log(soundfileName);
  const soundListItem = document.createElement('option')
  soundListItem.setAttribute('value', soundfilePath)
  soundListItem.innerHTML = soundfileName
  document.getElementById('soundfileList[1]').appendChild(soundListItem.cloneNode(true))
  document.getElementById('soundfileList[2]').appendChild(soundListItem.cloneNode(true))
  document.getElementById('soundfileList[clock]').appendChild(soundListItem.cloneNode(true))
}

function playSoundfileList(chimeId) {
  console.log(`PLAY-SOUND-[${chimeId}]`)
  const soundfileList = document.getElementById(`soundfileList[${chimeId}]`)
  const soundfilePath = soundfileList.value

  if (soundfilePath !== 'NONE') {
    playSoundfilePath(soundfilePath)
  }
}

function playSoundfile(sender) {
  console.log('playSoundfile()');
  const sounfilePath = sender.children[0].value
  playSoundfilePath(sounfilePath)
}

function playSoundfilePath(soundfilePath) {
  const soundfile = new Audio('file://' + soundfilePath)
  soundfile.play()
}

window.electronAPI.handleSetSoundfile((event, dirName, soundfileName) => {
  console.log('SET-SOUND-FILE');

  const radioNode = document.createElement('label')
  const soundfilePath = `${dirName}/../media/${soundfileName}`
  radioNode.innerHTML = `<spawn ondblclick="playSoundfile(this)"><input type="radio" name="sound" value="${soundfilePath}">${soundfileName}</input></spawn>`
  
  const soundNode = document.getElementById('sound')
  soundNode.appendChild(radioNode)

  setSelectSoundList(soundfilePath, soundfileName)
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

window.electronAPI.handleChime((event, chimeId) => {
  console.log(chimeId)
  playSoundfileList(chimeId)
})

window.electronAPI.handleAlarm((event) => {
  playSoundfileList('clock')
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

const audioContext = new AudioContext()
let _player = null

function getSoundfilePath() {
  const sounds = document.getElementsByName('sound')
  for (const soundfileNode of sounds.values()) {
    if (soundfileNode.checked) {
      return soundfileNode.value
    }
  }
  return 'NONE'
}

async function playLoop() {
  if (_player) {
    _player.stop()
  }
  const soundfilePath = getSoundfilePath()
  console.log(soundfilePath)

  const response = await fetch('file://' + soundfilePath)
  const arrayBuffer = await response.arrayBuffer()
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
  _player = audioContext.createBufferSource()
  _player.buffer = audioBuffer;
  _player.loop = true
  _player.connect(audioContext.destination)
  _player.start()
}

function playStop() {
  _player.stop()
}

function changeChimeTime(chimeId, sender) {
  window.electronAPI.changeChimeTime(chimeId, sender)
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

function setTimePanels() {
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

function loaded() {
  window.electronAPI.mainWindowloaded()
  setTimePanels()
}

loaded()
