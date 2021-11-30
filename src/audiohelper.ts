import backgroundUrl from '../sounds/norameld-sad-song-loop.mp3';
import destroyUrl from '../sounds/gameaudio-casual-death-loose.wav';
import newJamUrl from '../sounds/gameaudio-spacey-1up-power-up.wav';
import bounceUrl from '../sounds/gameaudio-ping-sound-ricochet.wav';
import beepUrl from '../sounds/gameaudio-click-pop.wav';
import powerUpUrl from '../sounds/gameaudio-space-swoosh-brighter.wav';

export class AudioHelper {
  background: HTMLAudioElement;
  sounds: Record<string, HTMLAudioElement>;

  private _enabled: boolean = false;

  public constructor() {
    this.sounds = {
      newJam: new Audio(newJamUrl),
      destroy: new Audio(destroyUrl),
      bounce: new Audio(bounceUrl),
      beep: new Audio(beepUrl),
      powerUp: new Audio(powerUpUrl),
    };
    this.background = new Audio(backgroundUrl);
    this.background.loop = true;
    this.background.volume = 0.2;
    this._enabled = false;
    this.sounds['bounce'].volume = 0.2;
    this.sounds['beep'].volume = 0.2;
  }

  public set enabled(value: boolean) {
    this._enabled = value;
    value ? this.background.play() : this.background.pause();
  }

  public get enabled() {
    return this._enabled;
  }

  public toggle(): void {
    this.enabled ? (this.enabled = false) : (this.enabled = true);
  }

  public play(sound: string) {
    if (!this._enabled) return;

    let s = this.sounds[sound];
    if (!s) return;

    s.pause();
    s.currentTime = 0;
    s.play().catch((_) => {
      // ignore errors
    });
  }
}
