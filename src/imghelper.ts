import antUrl from '../img/ant.png';
import spiderUrl from '../img/spider.png';
import beetleUrl from '../img/beetle.png';
import cockroachUrl from '../img/cockroach.png';
import jamRightUrl from '../img/jamRight.png';
import jamRightDisabledUrl from '../img/jamRightDisabled.png';
import jamLeftUrl from '../img/jamLeft.png';
import jamLeftDisabledUrl from '../img/jamLeftDisabled.png';
import jamMiddleUrl from '../img/jamMiddle.png';
import jamMiddleDisabledUrl from '../img/jamMiddleDisabled.png';
import keyboardUrl from '../img/keyboard.png';
import hotBeverageUrl from '../img/hotBeverage.png';
import waterBuffaloUrl from '../img/waterBuffalo.png';
import twitterUrl from '../img/twitter.png';
import githubUrl from '../img/github.png';
import videoGameUrl from '../img/videoGame.png';
import youtubeUrl from '../img/youtube.png';
import hourglassUrl from '../img/hourglass.png';
import bicycleUrl from '../img/bicycle.png';
import mushroomUrl from '../img/mushroom.png';
import bombUrl from '../img/bomb.png';
import trophyUrl from '../img/trophy.png';
import mouseUrl from '../img/mouse.png';
import touchUrl from '../img/touch.png';
import alertUrl from '../img/alert.png';
import tadaUrl from '../img/tada.png';
import speakerUrl from '../img/speaker.png';
import speakerMutedUrl from '../img/speakerDisabled.png';

interface ImageDrawer {
  ctx: CanvasRenderingContext2D;
  kind: string;
  x: number;
  y: number;
  width: number;
  height: number;
  alpha?: number;
}

class Img {
  public url: string;
  public imgType: string;
  public desc: string;
  public img: HTMLImageElement = new Image();

  public constructor(url: string, imgType: string, desc?: string) {
    this.url = url;
    this.imgType = imgType;
    this.desc = desc ? desc : '';
  }
}

export class ImgHelper {
  public imgs: Record<string, Img>;

  public constructor(callback: () => void) {
    this.imgs = {
      ant: new Img(antUrl, 'bug'),
      spider: new Img(spiderUrl, 'bug'),
      beetle: new Img(beetleUrl, 'bug'),
      cockroach: new Img(cockroachUrl, 'bug'),
      jamLeft: new Img(jamLeftUrl, 'jam'),
      jamLeftDisabled: new Img(jamLeftDisabledUrl, 'jam'),
      jamMiddle: new Img(jamMiddleUrl, 'jam'),
      jamMiddleDisabled: new Img(jamMiddleDisabledUrl, 'jam'),
      jamRight: new Img(jamRightUrl, 'jam'),
      jamRightDisabled: new Img(jamRightDisabledUrl, 'jam'),
      keyboard: new Img(keyboardUrl, 'ship'),
      hotBeverage: new Img(hotBeverageUrl, 'distraction', 'Coffee break!'),
      waterBuffalo: new Img(
        waterBuffaloUrl,
        'distraction',
        'Refactor, yak shave!',
      ),
      bomb: new Img(bombUrl, 'missle'),
      twitter: new Img(twitterUrl, 'distraction', 'Tweet storm!'),
      github: new Img(githubUrl, 'distraction', 'GitHub down!'),
      videoGame: new Img(videoGameUrl, 'distraction', 'Steam sale!'),
      youtube: new Img(youtubeUrl, 'distraction', 'Youtube!'),
      hourglass: new Img(hourglassUrl, 'distraction', 'System update!'),
      bicycle: new Img(bicycleUrl, 'distraction', 'Bikeshedding meeting!'),
      mushroom: new Img(mushroomUrl, 'powerup', 'Power Up!'),
      trophy: new Img(trophyUrl, 'misc'),
      mouse: new Img(mouseUrl, 'misc'),
      touch: new Img(touchUrl, 'misc'),
      alert: new Img(alertUrl, 'misc'),
      tada: new Img(tadaUrl, 'misc'),
      speaker: new Img(speakerUrl, 'misc'),
      speakerDisabled: new Img(speakerMutedUrl, 'misc'),
    };

    let imgCnt: number = 0;
    for (const imgName in this.imgs) {
      let img = new Image();
      img.onload = () => {
        this.imgs[imgName].img = img;
        imgCnt++;
        if (imgCnt === Object.keys(this.imgs).length) {
          callback();
        }
      };
      img.src = this.imgs[imgName].url;
    }
  }

  public bugs(): Array<string> {
    return Object.keys(this.imgs).filter((i) => this.imgs[i].imgType === 'bug');
  }

  public distractions(): Array<string> {
    return Object.keys(this.imgs).filter(
      (i) => this.imgs[i].imgType === 'distraction',
    );
  }

  public randomDistraction(): string {
    let d = this.distractions();
    return d[Math.floor(Math.random() * d.length)];
  }

  public randomDistractionDesc(): string {
    let d = this.distractions();
    let descs = d.map((d) => this.imgs[d].desc);
    return descs[Math.floor(Math.random() * descs.length)];
  }

  public kindFromDesc(desc: string): string {
    return Object.keys(this.imgs).filter((i) => this.imgs[i].desc === desc)[0];
  }

  public randomBug(): string {
    let bugs = this.bugs();
    return bugs[Math.floor(Math.random() * bugs.length)];
  }

  public draw({ ctx, kind, x, y, width, height, alpha = 1 }: ImageDrawer) {
    if (!this.imgs[kind].img) {
      throw 'Invalid image: ' + kind;
    }
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.drawImage(this.imgs[kind].img, x, y, width, height);
    ctx.restore();
  }
}
