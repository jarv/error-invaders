import { ShuffleArray } from './shuffle';

export class PowerUp {
  public readonly powerUps: Array<string> = [];

  public missleVy: number = -5;
  public missleFontSize: number = 20;
  public missleFrameCnt: number = 8;
  public missleKind: string = 'text';
  public missleSize: number = 0;
  public bugSize: number = 30;
  public distractionSize: number = 20;
  public doubleShot: boolean = false;
  public invaderMaxLife: number = 10;
  public currentPowerUp: string | undefined = undefined;
  public distractionMaxLife: number = 10;
  public count: number = 0;

  private randMissles: boolean = true;
  private spreadShot: boolean = false;
  private powerUpIndex: number = 0;
  private distrationVyOffset: number = 2;
  private _maxInvaderVelocity: number = 5;
  private _doubleBug: boolean = true;
  public _missleVx: number = 0;

  private shots: Array<string> = ['0', '1'];
  private _missleText: string = '0';

  private readonly P: Record<string, () => void> = {
    'BigO!': () => {
      this.randMissles = false;
      this.missleText = 'O';
      this.missleFontSize = 30;
    },
    'Double shot!': () => {
      this.doubleShot = true;
    },
    'Fast fire!': () => {
      this.missleVy = -12;
      this.missleFrameCnt = 3;
    },
    'Spread shot!': () => {
      this.spreadShot = true;
      this.missleVy = -7;
      this.missleFrameCnt = 2;
      this.missleFontSize = 10;
    },
    'Big bugs!': () => {
      this.bugSize = 60;
    },
    'Nuclear shots!': () => {
      this.missleKind = 'bomb';
      this.missleSize = 40;
      this.distractionMaxLife = 1;
      this.invaderMaxLife = 1;
    },
  };

  public constructor() {
    this.setDefault();
    this.powerUps = ShuffleArray(Object.keys(this.P));
  }

  public reset(): void {
    this.currentPowerUp = undefined;
    this.setDefault();
  }

  public select(): void {
    this.currentPowerUp = this.powerUps[this.powerUpIndex];
    this.powerUpIndex = (this.powerUpIndex + 1) % this.powerUps.length;
    this.count++;
  }

  public apply(): void {
    this.distrationVyOffset++;
    this._maxInvaderVelocity++;

    if (this.currentPowerUp) this.P[this.currentPowerUp]();
  }

  public get missleText() {
    if (this.randMissles) {
      return this.shots[Math.floor(Math.random() * this.shots.length)];
    }
    return this._missleText;
  }

  public set missleText(value: string) {
    this._missleText = value;
  }

  public get missleVx() {
    if (this.spreadShot) {
      return Math.random() * 6 - 3;
    }
    return this._missleVx;
  }

  public get bugVy() {
    return -Math.random() * 4;
  }

  public get bugYAccel() {
    return 0.15;
  }

  public get distractionVy() {
    return Math.random() * 4 + this.distrationVyOffset;
  }

  public get maxInvaderVelocity() {
    return this._maxInvaderVelocity;
  }

  public get doubleBug() {
    return this._doubleBug;
  }

  private setDefault(): void {
    this.missleVy = -5;
    this.missleFontSize = 15;
    this.randMissles = true;
    this.spreadShot = false;
    this.missleFrameCnt = 8;
    this.bugSize = 40;
    this.distractionSize = 20;
    this.doubleShot = false;
    this.missleKind = 'text';
    this.missleSize = 0;
    this.invaderMaxLife = 10;
    this.distractionMaxLife = 10;
    this.distrationVyOffset = 0;
    this._maxInvaderVelocity = 5;
    this._doubleBug = true;
  }
}
