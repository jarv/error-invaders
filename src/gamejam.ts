import { ImgHelper } from './imghelper';
import { AudioHelper } from './audiohelper';
import { Sprite } from './sprite';

class Jam {
  public x: number;
  public y: number;
  public decay: number;
  private previousKind: string;
  private _kind: string;
  private _active: boolean = false;

  public constructor(x: number, y: number, kind: string, decay: number) {
    this.x = x;
    this.y = y;
    this._kind = kind;
    this.previousKind = kind;
    this.active = false;
    this.decay = decay;
  }

  public get kind() {
    // If we are decay-ing, return the previous kind
    if (this.decay > 0) {
      return this.previousKind;
    }
    return this._kind;
  }

  public set kind(value: string) {
    this.previousKind = this._kind;
    this._kind = value;
  }

  public get active() {
    return this._active;
  }

  public set active(value: boolean) {
    this._active = value;
    if (value) {
      this.kind = this.kind.replace(/Disabled/, '');
    } else {
      this.kind = this.kind.replace(/Disabled/, '') + 'Disabled';
    }
  }
}

export class GameJam {
  public x: number;
  public y: number;
  public newJam: boolean;
  public crashCount: number;
  private hitJams: Set<number> = new Set();
  private jams: Array<Jam> = [];
  private numJams: number;
  private jamHeight: number;
  private jamWidth: number;
  private imgHelper: ImgHelper;
  private audioHelper: AudioHelper;

  public constructor(
    x: number,
    y: number,
    jamWidth: number,
    jamHeight: number,
    numJams: number,
    imgHelper: ImgHelper,
    audioHelper: AudioHelper,
  ) {
    this.x = x;
    this.y = y;
    this.jamHeight = jamHeight;
    this.jamWidth = jamWidth;
    this.numJams = numJams;
    this.newJam = false;
    this.crashCount = 0;
    this.imgHelper = imgHelper;
    this.audioHelper = audioHelper;

    for (let i = 0; i < this.numJams; i++) {
      let kind: string;
      if (i === 0) {
        // first jam
        kind = 'jamLeft';
      } else if (i === this.numJams - 1) {
        kind = 'jamRight';
      } else {
        kind = 'jamMiddle';
      }

      this.jams.push(new Jam(this.x + this.jamWidth * i, this.y, kind, 5 * i));
    }
  }

  public checkWin(): boolean {
    if (this.jams.filter((j) => j.active).length === this.numJams) return true;

    return false;
  }

  public isCollided(sprite: Sprite): boolean {
    let maxYPos = Math.max(...sprite.positions.map((p) => p.y));
    for (let i = 0; i < this.jams.length; i++) {
      if (maxYPos < this.jams[i].y) return false;
    }
    return true;
  }

  public handleCollisionActive(sprite: Sprite): boolean {
    let isHit = false;
    let maxYPos = Math.max(...sprite.positions.map((p) => p.y));
    let hitJams: Array<Jam> = [];

    this.jams.forEach((jam, _) => {
      if (maxYPos < jam.y) return;

      if (jam.active && isHit) {
        hitJams.push(jam);
        jam.active = false;
      }

      if (sprite.center.x > jam.x && sprite.center.x < jam.x + this.jamWidth) {
        if (jam.active) {
          hitJams.push(jam);
          jam.active = false;
          this.newJam = false;
          isHit = true;
          this.crashCount++;
          this.audioHelper.play('death');
        }
      }
    });

    if (isHit) {
      hitJams
        .filter((j) => !j.active)
        .reverse()
        .forEach((j, i) => {
          j.decay = 5 * i;
        });
    }
    return isHit;
  }

  public add(): void {
    for (let i = 0; i < this.jams.length; i++) {
      if (!this.jams[i].active) {
        this.jams[i].active = true;
        this.newJam = true;
        this.hitJams.add(i);
        this.audioHelper.play('pause');
        return;
      }
    }
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    this.jams.forEach((jam, _) => {
      if (jam.decay > 0) jam.decay--;

      this.imgHelper.draw({
        ctx: ctx,
        kind: jam.kind,
        x: jam.x,
        y: jam.y,
        width: this.jamWidth,
        height: this.jamHeight,
        // alpha: !jam.active && jam.decay <= 0 ? 0.5 : 1,
      });
    });
  }
}
