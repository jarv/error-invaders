import soundsUrl from '../sounds/sounds.mp3';
import backgroundUrl from '../sounds/forest.ambience.mp3';

export class AudioHelper {
  audio: HTMLAudioElement;
  background: HTMLAudioElement;
  private static sounds: Record<string, Array<number>> = {
    bounce: [0.0, 0.1],
    death: [2, 2.597],
    hit: [4, 4.034],
    paddle: [6, 6.082],
    pause: [8, 8.44],
    unpause: [10, 10.44],
    upgrade: [12, 12.297],
  };

  private _enabled: boolean = false;

  public constructor() {
    this.audio = new Audio(soundsUrl);
    this.background = new Audio(backgroundUrl);
    this.background.loop = true;
    this._enabled = false;
  }

  public get enabled() {
    return this._enabled;
  }

  public toggle(): void {
    if (this._enabled) {
      this._enabled = false;
      this.background.pause();
    } else {
      this._enabled = true;
      this.background.play();
    }
  }

  public play(sound: string) {
    if (!this._enabled) return;

    this.audio.currentTime = AudioHelper.sounds[sound][0];
    let stopTime = AudioHelper.sounds[sound][1];
    this.audio.play();
    this.audio.addEventListener(
      'timeupdate',
      function () {
        if (this.currentTime > stopTime) {
          this.pause();
        }
      },
      false,
    );
  }
}
