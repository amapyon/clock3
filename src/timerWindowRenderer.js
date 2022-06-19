'use strict'

const display = () => document.getElementById('display')

window.electronAPI.handleUpdateDisplay((event, arg) => {
  console.log('UPDATE-DISPLAY')
  console.log(event)
  console.log(arg)
  
  display().innerHTML = arg  
})

window.electronAPI.handleUpdateDisplayColor((event, arg) => {
    display().setAttribute('style', 'color:' + arg + ';')
})

function loaded() {
  window.electronAPI.timerWindowloaded()
  document.addEventListener('wheel', handleWhheel)
}

loaded()
