import { Sprite } from './sprite';
import { ImgHelper } from './imghelper';
import { AudioHelper } from './audiohelper';
import { GameJam } from './gamejam';
import { PowerUp } from './powerup';
import { Flash } from './flash';
import { Splash } from './splash';

import './style.css';

var canvas: HTMLCanvasElement;
// var splash: HTMLElement;
var ctx: CanvasRenderingContext2D;

// dimensions
let width: number;
let height: number;
let jamWidth: number;
let jamHeight: number;
let dropYPos: number;

const powerUpProbability: number = 8; // percent
const numJams: number = 6;
const maxVelocity = 5;
const maxInvaders = 1;
const invaderFontSize = 20;
const kbSize = 40;

let kb: Sprite;
let imgHelper: ImgHelper;
// let audioHelper: AudioHelper;
let audioHelper: AudioHelper;
let gameJam: GameJam;

let flashDistraction: Flash;
let flashPowerUp: Flash;
let splash: Splash;
let powerUp: PowerUp;
let invaders: Array<Sprite>;
let missles: Array<Sprite>;
let deadSprites: Array<Sprite>;

let missleSpawnX: number;
let missleWidth: number;

let frameCnt: number = 0;
let gamePaused: boolean = true;

var bugCount: number;
var distractionCount: number;
var errorCount: number;

function newSprite(): Sprite {
  return deadSprites.pop() || new Sprite(imgHelper, audioHelper);
}

function gameLoop() {
  requestAnimationFrame(gameLoop);

  if (gamePaused) return;
  ctx.clearRect(0, 0, width, height);

  // game Jam progress

  gameJam.draw(ctx);

  // spawn new error invader
  if (invaders.filter((i) => i.kind === 'error').length < maxInvaders) {
    const s = newSprite();
    s.setUp({
      x: 0,
      y: 0,
      kind: 'error',
      dropYPos: dropYPos,
      vx: Math.random() * maxVelocity,
      vy: Math.random() * maxVelocity,
      text: splash.nextError(),
      fontSize: invaderFontSize,
      maxLife: powerUp.invaderMaxLife,
      rotate: true,
      yAcceleration: 0.05,
    });
    s.x = Math.round((width - s.width) / 2);
    invaders.push(s);
  }

  // spawn missles
  if (frameCnt % powerUp.missleFrameCnt === 0) {
    let m: Sprite = deadSprites.pop() || new Sprite(imgHelper, audioHelper);
    m.setUp({
      x: missleSpawnX,
      y: height - jamHeight - kbSize * 0.8,
      vx: powerUp.missleVx,
      vy: powerUp.missleVy,
      text: powerUp.missleText,
      kind: powerUp.missleKind,
      width: powerUp.missleSize,
      height: powerUp.missleSize,
      range: 100,
      fontSize: powerUp.missleFontSize,
    });

    missleWidth = m.width;

    if (powerUp.doubleShot) {
      let m2: Sprite = deadSprites.pop() || new Sprite(imgHelper, audioHelper);
      m2.setUp({
        x: missleSpawnX + 6,
        y: height - jamHeight - kbSize * 0.8,
        vx: powerUp.missleVx,
        vy: powerUp.missleVy,
        text: powerUp.missleText,
        kind: powerUp.missleKind,
        width: powerUp.missleSize,
        height: powerUp.missleSize,
        range: 100,
        fontSize: powerUp.missleFontSize,
      });

      missleWidth = m2.width;
      m.x = m.x - 6;
      missles.push(m2);
    }

    missles.push(m);
  }

  // move missles
  missles.forEach((missle, _) => {
    missle.move();
    missle.draw(ctx);
  });

  deadSprites.push(...missles.filter((missle) => !missle.alive));
  missles = missles.filter((missle) => missle.alive);

  invaders.forEach((invader, i) => {
    invader.move();
    // Check for collision with a missle
    missles.forEach((missle, _) => {
      if (!missle.checkCollision(invader)) return;

      invader.hit(missle);
      if (invader.kind == 'mushroom') {
        audioHelper.play('upgrade');
        powerUp.select();
        powerUp.apply();
        flashPowerUp.text = '🏆 ' + powerUp.currentPowerUp + ' 🏆';
      }

      if (missle.kind === 'text' && invader.invulnerable) {
        missle.vy = Math.abs(missle.vy);
        missle.vx = Math.random() * 4 - 2;
      } else {
        missle.alive = false;
      }
    });

    // Check for collision with other invader (n^2)
    invaders.forEach((chkSprite, chkIndex) => {
      if (i === chkIndex) {
        return;
      }
      if (![invader.kind, chkSprite.kind].includes('error'))
        invader.handleSpriteCollision(chkSprite);
    });

    // Check for collision with wall
    invader.handleWallCollision(width, 0, height - jamHeight);

    // Check for collision with the game Jam progress
    if (gameJam.isCollided(invader)) {
      invader.alive = false;
      if (gameJam.handleCollisionActive(invader)) {
        if (powerUp.currentPowerUp)
          flashPowerUp.text = '🚫 Powerups removed 🚫';
        powerUp.reset();
      }
    }

    // Check if invader is destroyed
    invader.checkDestroy();

    // Spawn extra invaders on destruction if it is an Error type
    if (!invader.alive) {
      if (invader.kind === 'error') {
        errorCount++;
        gameJam.add();
        if (gameJam.checkWin()) {
          gameJam.draw(ctx);
          gamePaused = true;
          splash.showWin(
            errorCount,
            bugCount,
            gameJam.crashCount,
            powerUp.count,
            distractionCount,
            imgHelper,
          );
        }
        invader.textChars.forEach((_, i) => {
          const s = newSprite();
          s.setUp({
            x: invader.x + invader.charPositions[i],
            y: invader.y,
            vx: Math.random() * 4 - 2,
            vy: Math.random() * 4 - 2,
            kind: imgHelper.randomBug(),
            maxLife: 1,
            yAcceleration: 0.05,
            width: powerUp.bugSize,
            height: powerUp.bugSize,
          });
          invaders.push(s);
        });
      } else if (imgHelper.bugs().includes(invader.kind)) {
        bugCount++;
      } else if (imgHelper.distractions().includes(invader.kind)) {
        distractionCount++;
      }
    }

    invader.draw(ctx);
  });

  deadSprites.push(...invaders.filter((invader) => !invader.alive));
  invaders = invaders.filter((invader) => invader.alive);

  if (gameJam.newJam) {
    flashDistraction.enabled = true;
    flashAndDistract();
  }

  // spawn distractions
  if (frameCnt % 30 === 0) {
    spawnDistractions();
  }
  // draw kb over other sprites
  kb.draw(ctx);
  frameCnt += 1;

  flashPowerUp.flash();
}

function spawnDistractions() {
  let d = invaders.filter((invader) => invader.kind === 'distraction')[0];
  if (!d) return;

  if (d.vx >= 0 && d.x > width) d.x = -d.width;
  if (d.vx <= 0 && d.x + d.width < 0) d.x = width;

  if (
    d.center.x - powerUp.distractionSize < 0 ||
    d.center.x + powerUp.distractionSize > width
  )
    return;

  let kind = imgHelper.kindFromDesc(d.text);
  if (Math.random() * 100 < powerUpProbability) {
    kind = 'mushroom';
  }
  const s = newSprite();
  s.setUp({
    x: d.center.x,
    y: d.height,
    vx: 0,
    vy: Math.random() * 4 + 1,
    kind: kind,
    maxLife: 1,
    width: powerUp.distractionSize,
    height: powerUp.distractionSize,
  });
  invaders.push(s);
}

function flashAndDistract() {
  let d = invaders.filter((invader) => invader.kind === 'distraction')[0];
  if (d) return;

  // no distractions, create a flash message and spawn one
  flashDistraction.flash('🚨 stay focused! 🚨', () => {
    const d = newSprite();
    d.setUp({
      x: 0,
      y: 0,
      vx: 2,
      kind: 'distraction',
      text: imgHelper.randomDistractionDesc(),
      maxLife: powerUp.distractionMaxLife,
    });
    d.x = -d.width;
    invaders.push(d);
  });
}

function initialize(): void {
  kb = new Sprite(imgHelper, audioHelper);
  kb.setUp({
    x: width / 2 - kbSize / 2,
    y: height - jamHeight - kbSize * 0.4,
    kind: 'keyboard',
    width: kbSize,
    height: kbSize,
  });
  errorCount = 0;
  bugCount = 0;
  distractionCount = 0;
  powerUp = new PowerUp();
  flashDistraction = new Flash(width, ctx);
  flashPowerUp = new Flash(width, ctx, height / 2);
  flashPowerUp.flashDuration = 100;
  invaders = [];
  missles = [];
  deadSprites = [];
  gameJam = new GameJam(
    0,
    height - jamHeight,
    jamWidth,
    jamHeight,
    numJams,
    imgHelper,
    audioHelper,
  );
}

function setupEventListeners(): void {
  canvas.onmousemove = (e) => {
    kb.x = e.clientX - canvas.offsetLeft - kb.width / 2;
    kb.move();
    missleSpawnX = e.clientX - canvas.offsetLeft - missleWidth / 2;
  };

  // Prevent scrolling when touching the canvas
  document.body.addEventListener(
    'touchstart',
    (e) => {
      if (e.target === canvas) {
        e.preventDefault();
      }
    },
    { passive: false },
  );
  document.body.addEventListener(
    'touchend',
    (e) => {
      if (e.target === canvas) {
        e.preventDefault();
      }
    },
    { passive: false },
  );
  document.body.addEventListener(
    'touchmove',
    (e) => {
      if (e.target === canvas) {
        e.preventDefault();
      }
    },
    { passive: false },
  );

  document.addEventListener('keydown', (e) => {
    if (e.code === 'KeyS') {
      audioHelper.toggle();
    }
  });

  canvas.addEventListener('touchmove', (e) => {
    let touch = e.touches[0];
    let mouseEvent = new MouseEvent('mousemove', {
      clientX: touch.clientX,
      clientY: touch.clientY,
    });
    canvas.dispatchEvent(mouseEvent);
  });

  document.addEventListener('click', function (e) {
    const target = e.target as Element;
    if (target.classList.contains('interactive')) return;
    if (splash.active) {
      splash.hide();
      gamePaused = false;
    } else {
      gamePaused = true;
      splash.showIntro();
    }
  });
}

window.onload = () => {
  canvas = <HTMLCanvasElement>document.getElementById('game');

  let innerWidth = window.innerWidth;
  let innerHeight = window.innerHeight;

  width = 480;
  height = innerHeight < 600 ? innerHeight : 600;
  jamWidth = 80;
  jamHeight = 50;
  if (innerWidth < 480) {
    width = innerWidth;
    let ratio = innerWidth / 480;
    jamWidth = Math.floor(ratio * jamWidth);
    jamHeight = Math.floor(ratio * jamHeight);
  }

  missleSpawnX = Math.round(width / 2);
  dropYPos = Math.round(height / 3);

  canvas.width = width;
  canvas.height = height;
  const ctxRet = canvas.getContext('2d');

  if (!ctxRet || !(ctxRet instanceof CanvasRenderingContext2D)) {
    throw new Error('Failed to get 2D context');
  }
  ctx = ctxRet;
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';

  audioHelper = new AudioHelper();
  imgHelper = new ImgHelper(() => {
    initialize();
    setupEventListeners();
    splash = new Splash(initialize, imgHelper, audioHelper);
    splash.showIntro();
    gameLoop();
  });
};
