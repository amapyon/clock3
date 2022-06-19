'use strict'

let _soundName = null

const setSoundName = (soundName) => {
  _soundName = soundName
}

const playChime = (mainWindow) => {
  if (_soundName !== 'none') {
    mainWindow.send('play-chime', _soundName)
  }
}

module.exports = {
  setSoundName,
  playChime,
}
