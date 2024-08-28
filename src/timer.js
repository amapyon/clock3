'use strict'

const toMMSS = (remainTime) => {
  const sec = Math.trunc(remainTime / 1000)
  const minute = Math.trunc(sec / 60)
  const second = (sec % 60 + 100).toString().slice(-2)
  return minute + ':' + second
}

class Timer {
  constructor(callbacks) {
    this.timerCallbacks = callbacks
    this.settedTime = 0
    this.remainTime = 0
    this.elipseTime = 0
    this.oldTime = 0
    this.timer = 0
  }

  start(time) {
    console.log("TIMER START")
    console.log(time)
    this.settedTime = time * 1000
    this.remainTime = this.settedTime 
    this.updateDisplay(toMMSS(this.remainTime))
    this.elipseTime = 0
    this.restart()
  }

  pause() {
    clearInterval(this.timer)
  }
  
  stop() {
    this.pause()
  }

  restart() {
    this.oldTime = Date.now()
    this.timer = setInterval(this.countDown.bind(this), 200)
  }
  
  countDown() {
    const currentTime = Date.now()
    const diffTime = currentTime - this.oldTime
    this.oldTime = currentTime
    this.elipseTime += diffTime
    this.remainTime = this.settedTime - this.elipseTime
    console.log(this.settedTime, diffTime, this.elipseTime, this.remainTime)
  
    this.updateDisplay(toMMSS(this.remainTime))
  
    if (this.remainTime <= 0) {
      this.stop()
      console.log(this.timerCallbacks)
      console.log(this.timerCallbacks.finishTimer)
      if (this.timerCallbacks && this.timerCallbacks.finishTimer) {
        this.timerCallbacks.finishTimer()
      }
    }
  }

  clockStart() {
    clearInterval(this.timer)
    this.timer = setInterval(this.clockUpdate.bind(this), 200)
  }

  clockUpdate() {
    const now = new Date()
    const clockString = now.toLocaleTimeString()
    this.updateDisplay(clockString)

    if (this.alarmMode && clockString === this.alarmTime && !this.alarmed) {
      this.alarmed = true
      if (this.timerCallbacks && this.timerCallbacks.alarmClock) {
        this.timerCallbacks.alarmClock()
      }
    }
  }

  setAlarmTime(alarmTime) {
    this.alarmTime = alarmTime
    this.alarmed = false
  }

  setAlarmMode(alarmMode) {
    this.alarmMode = alarmMode
    this.alarmed = false
  }

  updateDisplay(displayText) {
    if (this.timerCallbacks && this.timerCallbacks.updateDisplay) {
      this.timerCallbacks.updateDisplay(displayText)
    }
  }
}

module.exports = {
  toMMSS,
  Timer
}
