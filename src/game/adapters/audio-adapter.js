export class AudioAdapter {
  
  constructor() {
    this.capture = new Audio('/audio/capture.mp3')
    this.move = new Audio('/audio/move.mp3')
    this.castle = new Audio('/audio/castle.mp3')
    this.end = new Audio('/audio/game-end.mp3')
  }

  play(sound) {
    let soundMap = {
      capture: this.capture,
      move: this.move,
      castle: this.castle,
      end: this.end,
    }

    this.resetAll(Object.values(soundMap))
    soundMap[sound].play()
  }

  resetAll(audios) {
    audios.forEach((audio) => {
      this.reset(audio)
    })
  }

  reset(audio) {
    audio.pause();
    audio.currentTime = 0;
  }
}