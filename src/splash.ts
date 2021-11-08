import { Errors } from './errors';
import { ShuffleArray } from './shuffle';
import { ImgHelper } from './imghelper';
import { AudioHelper } from './audiohelper';

export class Splash {
  public errors: Array<string> = [];

  private splash: HTMLElement;
  private errorIndex: number = 0;
  private _active: boolean = false;
  private reset: () => void;
  private imgHelper: ImgHelper;
  private audioHelper: AudioHelper;

  public get active() {
    return this._active;
  }

  public constructor(
    reset: () => void,
    imgHelper: ImgHelper,
    audioHelper: AudioHelper,
  ) {
    this.errors = ShuffleArray(Errors['Javascript']);
    this.splash = <HTMLElement>document.getElementById('splash');
    this.reset = reset;
    this.imgHelper = imgHelper;
    this.audioHelper = audioHelper;
  }

  public nextError(): string {
    let numErrors = this.errors.length;
    let ret = this.errors[this.errorIndex];
    this.errorIndex = (this.errorIndex + 1) % numErrors;
    return ret;
  }

  public showWin(
    errorCount: number,
    bugCount: number,
    crashCount: number,
    powerUpCount: number,
    distractionCount: number,
    imgHelper: ImgHelper,
  ) {
    this.splash.innerHTML = `
      <h2>Code complete!</h2>
      <p>Contratulations, you completed the Game Off by eliminating all of the errors in your code!</p>
      <img src='${imgHelper.imgs.tada.url}' /><img src='${imgHelper.imgs.jamRight.url}' /><img src='${imgHelper.imgs.tada.url}' />
      <table>
        <tr><td>Errors fixed</td><td class="value"> ${errorCount}</td></tr>
        <tr><td>Bugs destroyed</td><td class="value"> ${bugCount}</td></tr>
        <tr><td>Distractions removed</td><td class="value">${distractionCount}</td></tr>
        <tr><td>PowerUps collected</td><td class="value">${powerUpCount}</td></tr>
        <tr><td>Number of crashes</td><td class="value">${crashCount}</td></tr>
      </table>
      `;
    this.splash.style.display = 'block';
    this._active = true;
    this.reset();
  }

  private interactives(): HTMLDivElement {
    let languages = Object.keys(Errors);

    const languageList = document.createElement('select');
    languageList.classList.add('interactive');
    languageList.id = 'languages';

    languages.forEach((e, _) => {
      const option = document.createElement('option');
      option.classList.add('interactive');
      option.value = e;
      option.text = e;
      languageList.appendChild(option);
    });

    const intDiv = document.createElement('div');
    intDiv.classList.add('interactive');
    intDiv.innerHTML = `Select a programming language: `;
    intDiv.appendChild(languageList);

    const soundDiv = document.createElement('div');
    soundDiv.classList.add('interactive');
    soundDiv.id = 'sound';

    const btn = document.createElement('button');
    btn.classList.add('interactive');
    btn.id = 'soundBtn';

    btn.appendChild(this.soundImg());
    soundDiv.appendChild(btn);
    intDiv.appendChild(soundDiv);

    return intDiv;
  }

  public showIntro(): void {
    this.splash.innerHTML = `<h2>Error Invaders!</h2>`;
    this.splash.appendChild(this.interactives());
    this.splash.innerHTML += `
        <p>
        The deadline for the 2021 GitHub Game Off is fast approaching and your code is not done due to errors that morph into bugs that infest your code.
        Will it be ready in time?
        </p>
        <p>Destroy errors to advance your code to completion!</p>
        <img width="80" src='${this.imgHelper.imgs.jamRight.url}' />
        <ul>
          <li>Move the <img src='${this.imgHelper.imgs.keyboard.url}' /> with <img src='${this.imgHelper.imgs.touch.url}' /> or <img src='${this.imgHelper.imgs.mouse.url}' /></li>
          <li>Earn power-ups by shooting <img src='${this.imgHelper.imgs.mushroom.url}' /></li>
          <li><img src='${this.imgHelper.imgs.alert.url}' />Watch out for distractions <img src='${this.imgHelper.imgs.alert.url}' /></li>
        </ul>`;
    this.splash.style.display = 'block';
    this._active = true;
    this.addLangEventListeners();
  }

  public hide(): void {
    this.splash.style.display = 'none';
    this._active = false;
  }

  private addLangEventListeners(): void {
    let select = <HTMLElement>document.getElementById('languages');
    select.addEventListener('change', () => {
      let value: string = (
        document.getElementById('languages') as HTMLInputElement
      ).value;
      this.errors = ShuffleArray(Errors[value]);
      this.reset();
    });

    let soundBtn = <HTMLElement>document.getElementById('soundBtn');
    soundBtn.addEventListener('click', () => {
      soundBtn.innerHTML = '';
      this.audioHelper.toggle();
      soundBtn.appendChild(this.soundImg());
    });
  }

  private soundImg(): HTMLImageElement {
    if (this.audioHelper.enabled) {
      const img = this.imgHelper.imgs.speaker.img;
      img.classList.add('interactive');
      return img;
    }
    const img = this.imgHelper.imgs.speakerDisabled.img;
    img.classList.add('interactive');
    return img;
  }
}
