import { Sprite } from './sprite';

export class Flash {
  private numFlashFrames: number = 0;
  public flashDuration: number = 100;
  public _text: string = '';
  private flashMsg: Sprite;
  private width: number;
  private ctx: CanvasRenderingContext2D;
  private _enabled: boolean = false;

  public get enabled() {
    return this._enabled;
  }

  public set enabled(value: boolean) {
    this._enabled = value;
    if (!this._enabled) this.numFlashFrames = 0;
  }

  public get text() {
    return this._text;
  }

  public set text(value: string) {
    this.enabled = true;
    this._text = value;
  }

  public constructor(
    width: number,
    ctx: CanvasRenderingContext2D,
    height?: number,
  ) {
    this.ctx = ctx;
    this.width = width;
    this.flashMsg = new Sprite();
    this.flashMsg.setUp({
      x: 0,
      y: height || 0,
      kind: 'text',
      color: 'cyan',
      text: '',
      fontSize: 24,
      fontWeight: 'bold',
    });
  }

  public flash(text?: string, callback?: () => void) {
    if (!this._enabled) return;

    this.flashMsg.text = text || this.text;
    this.flashMsg.x = this.width / 2 - Math.floor(this.flashMsg.width / 2);

    if (this.numFlashFrames >= this.flashDuration) {
      if (callback) callback();
      this.enabled = false;
      return;
    }
    this.flashMsg.alpha = 1 - this.numFlashFrames / this.flashDuration;
    this.flashMsg.draw(this.ctx);
    this.numFlashFrames++;
  }
}
