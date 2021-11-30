import { ImgHelper } from './imghelper';
import { AudioHelper } from './audiohelper';

class Position {
  private _x: number;
  private _y: number;

  public constructor(x: number = 0, y: number = 0) {
    this._x = x;
    this._y = y;
  }

  public get x() {
    return this._x;
  }
  public set x(value: number) {
    this._x = value;
  }

  public get y() {
    return this._y;
  }
  public set y(value: number) {
    this._y = value;
  }
}

class CollisionCnt {
  public left: number = 0;
  public right: number = 0;
  public top: number = 0;
  public bottom: number = 0;
  public sprite: number = 0;
}

interface SpriteConfig {
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  text?: string;
  kind?: string;
  range?: number | undefined;
  fontSize?: number;
  fontName?: string;
  fontVariant?: string;
  fontWeight?: string;
  fontStyle?: string;
  color?: string;
  maxCollisions?: number;
  width?: number;
  height?: number;
  radius?: number;
  maxLife?: number;
  yAcceleration?: number;
  rotate?: boolean;
  dropYPos?: number;
  imgHelper?: ImgHelper;
}

export class Sprite {
  private _x: number = 0;
  private _y: number = 0;
  public vx: number = 0;
  public vy: number = 0;
  public va: number = Math.PI / 64;
  private _text: string = '';
  public textChars: Array<string> = [];
  public charPositions: Array<number> = [];

  public kind: string = 'text';
  public color: string = 'white';

  public width: number = 0;
  public height: number = 0;
  public radius: number = 0;

  public fontSize: number = 15;
  public fontName: string = 'Monospace';
  public fontVariant: string = 'normal';
  public fontWeight: string = 'normal';
  public fontStyle: string = 'normal';
  public collisionCnt: CollisionCnt = new CollisionCnt();
  public center: any;
  public range: number | undefined = undefined;
  public decay: number = 0;
  public alive: boolean = true;
  public hitColor: string = 'red';
  public noHitColor: string = 'grey';
  public hitFrames: number = 3;
  public hitDecay: number = 0;
  public maxLife: number = 0;
  public life: number = 0;
  public yAcceleration: number = 0;
  public rotate: boolean = false;
  public angle: number = 0;
  public positions: Array<Position> = [];
  public maxCollisions: number = 1;
  public dropYPos: number = 0;
  private isDropping: boolean = false;
  public invulnerable: boolean = false;
  public alpha: number = 1;
  private imgHelper: ImgHelper | undefined;
  private audioHelper: AudioHelper | undefined;

  public move = (): void => {
    if (this.isDropping && this._y <= this.dropYPos) {
      this._y += 2;
      this.isDropping = true;
      this.invulnerable = true;
      this.setCoordinates();
      return;
    }
    this._x += this.vx;
    this._y += this.vy;
    this.isDropping = false;
    this.invulnerable = false;
    this.vy += this.yAcceleration;
    if (this.rotate) {
      this.angle += this.va;
    }
    this.checkDecay();
    this.checkDestroy();
    this.setCoordinates();
  };

  private checkDecay = (): void => {
    if (!this.range) {
      // no range set on sprite, nothing to do
      return;
    }

    if (this.decay <= 0) {
      this.alive = false;
      return;
    }

    this.decay--;
  };

  public constructor(imgHelper?: ImgHelper, audioHelper?: AudioHelper) {
    this.imgHelper = imgHelper;
    this.audioHelper = audioHelper;
  }

  public setUp = ({
    x = 0,
    y = 0,
    vx = 0,
    vy = 0,
    text = '',
    kind = 'text',
    range = undefined,
    fontSize = 15,
    fontName = 'Monospace',
    fontVariant = 'normal',
    fontWeight = 'normal',
    fontStyle = 'normal',
    color = 'white',
    width = 5,
    height = 5,
    radius = 5,
    maxLife = 0,
    yAcceleration = 0,
    rotate = false,
    dropYPos = 0,
  }: SpriteConfig): void => {
    this._x = x;
    this._y = y;
    this.vx = vx;
    this.vy = vy;
    this.kind = kind;
    this.color = color;
    this.radius = radius;
    this.range = range;
    if (range) {
      this.decay = range;
    }
    this.life = this.maxLife = maxLife;
    this.fontSize = fontSize;
    this.fontName = fontName;
    this.fontVariant = fontVariant;
    this.fontWeight = fontWeight;
    this.fontStyle = fontStyle;
    this.alive = true;
    this.yAcceleration = yAcceleration;
    this.rotate = rotate;
    this.angle = 0;
    this.dropYPos = dropYPos;
    this.width = width;
    this.height = height;
    this.radius = Math.round(this.width / 2);

    // Setting text overrides width and height
    this.text = text;

    this.setCoordinates();
    this.initCharPositions();
    this.collisionCnt = new CollisionCnt();
    if (this.dropYPos > 0) this.isDropping = true;
  };

  public get text(): string {
    return this._text;
  }

  public set text(text: string) {
    if (text === '') return;

    this.textChars = [...text];
    this._text = text;
    let m = this.measureText(text, this.fontSize + 'px ' + this.fontName);
    this.width = m.width;
    this.height = m.height;
    this.setCoordinates();
    this.initCharPositions();
  }

  public get x(): number {
    return this._x;
  }
  public set x(x: number) {
    this._x = x;
    this.setCoordinates();
  }

  public get y() {
    this.setCoordinates();
    return this._y;
  }
  public set y(y: number) {
    this._y = y;
  }

  private initCharPositions(): void {
    for (let i = 0; i < this.textChars.length; i++) {
      this.charPositions.push(
        this.measureText(
          this.textChars.slice(0, i).join(''),
          this.fontSize + 'px ' + this.fontName,
        ).width,
      );
    }
  }

  public hit(sprite: Sprite): void {
    this.hitDecay = this.hitFrames;

    if (this.isDropping) return;

    if (this.center.y < sprite.center.y && this.center.x < sprite.center.x)
      this.va = -Math.abs(this.va);
    if (this.center.y < sprite.center.y && this.center.x > sprite.center.x)
      this.va = Math.abs(this.va);
    if (this.center.y > sprite.center.y && this.center.x > sprite.center.x)
      this.va = -Math.abs(this.va);
    if (this.center.y > sprite.center.y && this.center.x < sprite.center.x)
      this.va = Math.abs(this.va);

    this.vy = -Math.abs(this.vy);
    if (this.maxLife > 0) {
      this.life--;
      if (this.audioHelper && this.kind === 'error')
        this.audioHelper.play('beep');
    }
  }

  public checkCollision(sprite: Sprite): boolean {
    if (this.isIntersecting(sprite)) {
      if (this.collisionCnt.sprite > this.maxCollisions) {
        return false;
      }
      this.collisionCnt.sprite += 1;
      return true;
    }

    this.collisionCnt.sprite = 0;
    return false;
  }

  private checkDestroy(): void {
    if (this.maxLife === 0 || this.life > 0) {
      return;
    }
    // destroyed!
    this.alive = false;
  }

  public draw = (ctx: CanvasRenderingContext2D): void => {
    if (ctx == null) {
      return;
    }

    if (!this.alive) {
      return;
    }

    ctx.save();
    if (this.range) {
      ctx.globalAlpha = this.decay / this.range;
    } else {
      ctx.globalAlpha = this.alpha;
    }

    if (this.hitDecay > 0) {
      this.isDropping
        ? (ctx.strokeStyle = this.noHitColor)
        : (ctx.strokeStyle = this.hitColor);
      this.isDropping
        ? (ctx.fillStyle = this.noHitColor)
        : (ctx.fillStyle = this.hitColor);
      this.hitDecay -= 1;
    } else {
      ctx.strokeStyle = this.color;
      ctx.fillStyle = this.color;
    }

    switch (this.kind) {
      case 'error':
      case 'distraction':
      case 'text': {
        ctx.font = [
          this.fontStyle,
          this.fontVariant,
          this.fontWeight,
          `${this.fontSize}px`,
          this.fontName,
        ].join(' ');
        if (this.rotate) {
          ctx.translate(this.center.x, this.center.y);
          ctx.rotate(this.angle);
          ctx.fillText(
            this.text,
            -this.width / 2,
            -this.height / 2 + Math.round(0.15 * this.fontSize),
          );
        } else {
          ctx.fillText(
            this.text,
            this._x,
            this._y + Math.round(0.15 * this.fontSize),
          );
        }
        break;
      }
      case 'circle': {
        ctx.beginPath();
        ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
        break;
      }

      case 'line': {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo(this.center.x, this._y);
        ctx.lineTo(this.center.x, this._y + this.height);
        ctx.stroke();
        break;
      }

      case 'rect': {
        ctx.lineWidth = 1;
        ctx.rect(this._x, this._y, this.width, this.height);
        ctx.fill();

        break;
      }

      case 'triangle': {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.moveTo(this._x, this._y + this.height);
        ctx.lineTo(this._x + Math.round(this.width / 2), this._y);
        ctx.lineTo(this._x + this.width, this._y + this.height);
        ctx.lineTo(this._x, this._y + this.height);
        ctx.fill();
        break;
      }

      default: {
        if (this.imgHelper) {
          this.imgHelper.draw({
            ctx: ctx,
            kind: this.kind,
            x: this._x,
            y: this._y,
            width: this.width,
            height: this.height,
          });
        }
      }
    }
    ctx.restore();
  };

  public getDirection(): number {
    return Math.atan2(this.vx, this.vy);
  }

  public setMagnitude(magnitude: number): void {
    this.vx = magnitude * Math.cos(this.getDirection());
    this.vy = magnitude * Math.sin(this.getDirection());
  }

  private setCoordinates(): void {
    this.center = {
      x: this._x + Math.round(this.width / 2),
      y: this._y + Math.round(this.height / 2),
    };
    this.positions = this.rotatedCorners();
  }

  private measureText(text: string, font: string): any {
    const span = document.createElement('span');
    span.appendChild(document.createTextNode(text));
    Object.assign(span.style, {
      background: 'white',
      font: font,
      margin: '0',
      padding: '0',
      border: '0',
      whiteSpace: 'nowrap',
    });
    document.body.appendChild(span);
    const { width, height } = span.getBoundingClientRect();
    span.remove();
    return { width, height };
  }

  /**
   * https://stackoverflow.com/a/12414951/468910
   *
   * Helper function to determine whether there is an intersection between the two polygons described
   * by the lists of vertices. Uses the Separating Axis Theorem
   *
   * @param polygonToCompare a polygon to compare with
   * @param allowTouch consider it an intersection when polygons only "touch"
   * @return true if there is any intersection between the 2 polygons, false otherwise
   */
  private isIntersecting(
    spriteToCompare: Sprite,
    allowTouch: boolean = true,
  ): boolean {
    const polygons: Array<any> = [this.positions, spriteToCompare.positions];

    const firstPolygonPositions: Array<any> = polygons[0];
    const secondPolygonPositions: Array<any> = polygons[1];

    let minA, maxA, projected, i, i1, j, minB, maxB;

    for (i = 0; i < polygons.length; i++) {
      // for each polygon, look at each edge of the polygon, and determine if it separates
      // the two shapes
      const polygon = polygons[i];
      for (i1 = 0; i1 < polygon.length; i1++) {
        // grab 2 vertices to create an edge
        const i2 = (i1 + 1) % polygon.length;
        const p1 = polygon[i1];
        const p2 = polygon[i2];

        // find the line perpendicular to this edge
        const normal = {
          x: p2.y - p1.y,
          y: p1.x - p2.x,
        };

        minA = maxA = undefined;
        // for each vertex in the first shape, project it onto the line perpendicular to the edge
        // and keep track of the min and max of these values
        for (j = 0; j < firstPolygonPositions.length; j++) {
          projected =
            normal.x * firstPolygonPositions[j].x +
            normal.y * firstPolygonPositions[j].y;

          if (
            !minA ||
            projected < minA ||
            (!allowTouch && projected === minA)
          ) {
            minA = projected;
          }

          if (
            !maxA ||
            projected > maxA ||
            (!allowTouch && projected === maxA)
          ) {
            maxA = projected;
          }
        }

        // for each vertex in the second shape, project it onto the line perpendicular to the edge
        // and keep track of the min and max of these values
        minB = maxB = undefined;
        for (j = 0; j < secondPolygonPositions.length; j++) {
          projected =
            normal.x * secondPolygonPositions[j].x +
            normal.y * secondPolygonPositions[j].y;

          if (
            !minB ||
            projected < minB ||
            (!allowTouch && projected === minB)
          ) {
            minB = projected;
          }

          if (
            !maxB ||
            projected > maxB ||
            (!allowTouch && projected === maxB)
          ) {
            maxB = projected;
          }
        }

        // if there is no overlap between the projects, the edge we are looking at separates the two
        // polygons, and we know there is no overlap

        if (maxA && maxB && minA && minB) {
          if (
            maxA < minB ||
            (!allowTouch && maxA === minB) ||
            maxB < minA ||
            (!allowTouch && maxB === minA)
          ) {
            return false;
          }
        }
      }
    }

    return true;
  }

  rotatedCorners(): Array<Position> {
    const ul = new Position(this._x, this._y);
    const ur = new Position(this._x + this.width, this._y);
    const ll = new Position(this._x, this._y + this.height);
    const lr = new Position(this._x + this.width, this._y + this.height);

    if (Math.round(100 * this.angle) % Math.round(100 * Math.PI) === 0) {
      return [ul, ur, lr, ll];
    }

    const ball_cos = Math.cos(-this.angle);
    const ball_sin = Math.sin(-this.angle);

    return [
      new Position(
        this.center.x +
          (ul.x - this.center.x) * ball_cos +
          (ul.y - this.center.y) * ball_sin,
        this.center.y -
          (ul.x - this.center.x) * ball_sin +
          (ul.y - this.center.y) * ball_cos,
      ),
      new Position(
        this.center.x +
          (ur.x - this.center.x) * ball_cos +
          (ur.y - this.center.y) * ball_sin,
        this.center.y -
          (ur.x - this.center.x) * ball_sin +
          (ur.y - this.center.y) * ball_cos,
      ),
      new Position(
        this.center.x +
          (lr.x - this.center.x) * ball_cos +
          (lr.y - this.center.y) * ball_sin,
        this.center.y -
          (lr.x - this.center.x) * ball_sin +
          (lr.y - this.center.y) * ball_cos,
      ),
      new Position(
        this.center.x +
          (ll.x - this.center.x) * ball_cos +
          (ll.y - this.center.y) * ball_sin,
        this.center.y -
          (ll.x - this.center.x) * ball_sin +
          (ll.y - this.center.y) * ball_cos,
      ),
    ];
  }

  public handleWallCollision(width: number, top: number, bottom: number): void {
    // distractions are marquee so they do not bounce off walls
    if (this.kind === 'distraction') return;

    const x_max = Math.max(...this.positions.map((p) => p.x));
    const x_min = Math.min(...this.positions.map((p) => p.x));
    const y_max = Math.max(...this.positions.map((p) => p.y));
    const y_min = Math.min(...this.positions.map((p) => p.y));

    let collision = false;
    // right
    if (x_max >= width) {
      collision = true;
      this.vx = -Math.abs(this.vx);
    }
    // left
    if (x_min <= 0) {
      collision = true;
      this.vx = Math.abs(this.vx);
    }
    // top
    if (y_min <= top) {
      collision = true;
      this.vy = Math.abs(this.vy);
    }
    // bottom
    if (y_max >= bottom) {
      collision = true;
      this.vy = -Math.abs(this.vy);
    }

    if (collision) {
      this.va *= -1;
    }
  }

  public handleSpriteCollision(sprite: Sprite): void {
    if (!this.checkCollision(sprite)) {
      return;
    }
    this.bounce(sprite);
    this.va *= -1;
  }

  private bounce(sprite: Sprite): void {
    // ---------
    // | \ b / |
    // |c \ / a|
    // |  / \  |
    // | / d \ |
    // ---------

    // a = PI/4 to -PI/4
    // b = -PI/4 to -3PI/4
    // c = -3PI/4 to -PI or 3PI/4 to PI
    // d = PI/4 to 3PI/4

    const aoa = Math.atan2(
      this.center.y - sprite.center.y,
      this.center.x - sprite.center.x,
    );

    if (aoa <= Math.PI / 4 && aoa > -Math.PI / 4) {
      // quad a
      this.vx = Math.abs(this.vx);
    } else if (aoa <= -Math.PI / 4 && aoa > (-3 * Math.PI) / 4) {
      // quad b
      this.vy = -Math.abs(this.vy);
    } else if (
      (aoa <= (-3 * Math.PI) / 4 && aoa >= -Math.PI) ||
      (aoa <= Math.PI && aoa >= (3 * Math.PI) / 4)
    ) {
      // quad c
      this.vx = -Math.abs(this.vx);
    } else if (aoa <= (3 * Math.PI) / 4 && aoa > Math.PI / 4) {
      // quad d
      this.vy = Math.abs(this.vy);
    }
  }
}
