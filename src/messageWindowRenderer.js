'use strict'

window.electronAPI.handleUpdateDisplay((event, arg) => {
  console.log('UPDATE-DISPLAY')
  console.log(event)
  console.log(arg)
  
  const display = document.getElementById('display')
  display.innerHTML = arg
})

function loaded() {
  window.electronAPI.messageWindowloaded()
  document.addEventListener('wheel', handleWhheel)
}

loaded()