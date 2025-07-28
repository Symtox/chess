
export type AudioTrack = 'capture' | 'move' | 'castle' | 'end';

export class AudioAdapter {

  private soundMap: {[key in AudioTrack]: HTMLAudioElement} = {
    capture: new Audio('/audio/capture.mp3'),
    move: new Audio('/audio/move.mp3'),
    castle: new Audio('/audio/castle.mp3'),
    end: new Audio('/audio/game-end.mp3')
  }

  play(sound: AudioTrack) {
    this.resetAll()
    this.soundMap[sound].play()
  }

  resetAll() {
    Object.values(this.soundMap).forEach((audio) => {
      this.reset(audio)
    })
  }

  reset(audio: HTMLAudioElement) {
    audio.pause();
    audio.currentTime = 0;
  }
}