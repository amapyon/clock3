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
    this.chimes = [undefined, {time: 0, played: false}, {time: 0, played: false}]
    this.alarm = {time: '12:00:00', played: false}
  }

  start(time) {
    console.log("TIMER START")
    console.log(time)
    this.settedTime = time * 1000
    this.remainTime = this.settedTime 
    this.updateDisplay(toMMSS(this.remainTime))
    this.elipseTime = 0
    this.chimes[1].played = false
    this.chimes[2].played = false
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
    this.chime(1)
    this.chime(2)
  
    if (this.remainTime <= 0) {
      this.stop()
      if (this.timerCallbacks && this.timerCallbacks.finishTimer) {
        this.timerCallbacks.finishTimer()
      }
    }
  }

  chime(chimeId) {
    if (!this.chimes[chimeId].played && this.remainTime <= this.chimes[chimeId].time) {
      this.chimes[chimeId].played = true
      if (this.timerCallbacks && this.timerCallbacks.chime) {
        console.log(`PLAY chimes[${chimeId}]`)
        this.timerCallbacks.chime(chimeId)
      }
    }
  }

  clockStart() {
    this.alarm.played = false
    clearInterval(this.timer)
    this.timer = setInterval(this.clockUpdate.bind(this), 200)
  }

  clockUpdate() {
    const now = new Date()
    const clockString = now.toLocaleTimeString()
    this.updateDisplay(clockString)

    console.log(clockString, this.alarm.time, this.alarm.played)

    if (clockString === this.alarm.time && !this.alarm.played) {
      this.alarm.played = true
      if (this.timerCallbacks && this.timerCallbacks.alarmClock) {
        this.timerCallbacks.alarmClock()
      }
    }
  }

  setChimeTime(id, chimeTime) {
    console.log([id, chimeTime])
    this.chimes[id].time = parseInt(chimeTime, 10) * 1000
    console.log(this.chimes);
  }

  setAlarmTime(alarmTime) {
    console.log('setAlarmTime')
    console.log(alarmTime)
    this.alarm.time = alarmTime
    this.alarm.played = false
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
