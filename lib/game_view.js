const Util = require('./util');

class GameView {
  constructor(game, canvasEl) {
    this.game = game;
    this.context = canvasEl.getContext('2d');
    this.blaster = this.game.blaster;
    this.bindHandlers(canvasEl);
    this.drawSplashScreen(this.context);
  }

  bindHandlers(canvasEl) {
    canvasEl.addEventListener('click', this.start.bind(this));
    canvasEl.addEventListener('mousemove', this.game.handleMouseMove(this.context));
    canvasEl.addEventListener('mousedown', () => {
      this.blaster.firing = true;
    });
    canvasEl.addEventListener('mouseup', () => {
      this.blaster.firing = false;
    });
    document.addEventListener('keydown', (e) => {
      switch (e.code) {
        case 'Space':
          this.blaster.firing = true;
          break;
        case 'ArrowLeft':
          this.blaster.changingXPos = 7;
          break;
        case 'ArrowRight':
          this.blaster.changingXPos = -7;
          break;
      }
    });
    document.addEventListener('keyup', (e) => {
      switch (e.code) {
        case 'Space':
          this.blaster.firing = false;
          break;
        case 'ArrowLeft':
          this.blaster.changingXPos = 0;
          break;
        case 'ArrowRight':
          this.blaster.changingXPos = 0;
          break;
      }
    });

  }

  start() {
    if (this.game.over === true) {
      this.game.over = false;
      this.game.start();
      setTimeout(this.animate.bind(this), 33); // 30 fps
    }
  }

  animate(time) {
    this.game.step();
    this.game.draw(this.context);
    if (!this.game.over) {
      setTimeout(this.animate.bind(this), 33); // 30 fps
    } else {
      this.drawSplashScreen(this.context);
    }
  }

  drawSplashScreen(context) {
    context.clearRect(0, 0, GameView.DIM_X, GameView.DIM_Y);
    context.fillStyle = GameView.BLACK;
    context.fillRect(0, 0, GameView.DIM_X, GameView.DIM_Y);
    const clickToShoot = 'CLICK TO SHOOT';
    for (let i = 0; i < clickToShoot.length; i++) {
      const pos = [181 + 11 * i, 193];
      this.drawChar(clickToShoot[i], pos, GameView.RED, context);
    }
  }

  drawChar(char, pos, color, context) {
    const points = {
      topL: [0, 0],
      topC: [4, 0],
      topR: [8, 0],
      midL: [0, 6],
      midC: [4, 6],
      midR: [8, 6],
      btmL: [0, 11],
      btmC: [4, 11],
      btmR: [8, 11],
    };
    context.strokeStyle = color;
    context.shadowColor = color;
    context.shadowBlur = GameView.SHADOW_BLUR;
    context.beginPath();
    switch (char) {
      case 'C':
        context.moveTo(...Util.addVector(pos, points.topR));
        context.lineTo(...Util.addVector(pos, points.topL));
        context.lineTo(...Util.addVector(pos, points.btmL));
        context.lineTo(...Util.addVector(pos, points.btmR));
        break;
      case 'L':
        context.moveTo(...Util.addVector(pos, points.topL));
        context.lineTo(...Util.addVector(pos, points.btmL));
        context.lineTo(...Util.addVector(pos, points.btmR));
        break;
      case 'I':
        context.moveTo(...Util.addVector(pos, points.topC));
        context.lineTo(...Util.addVector(pos, points.btmC));
        break;
      case 'K':
        context.moveTo(...Util.addVector(pos, points.topL));
        context.lineTo(...Util.addVector(pos, points.btmL));
        context.moveTo(...Util.addVector(pos, points.topR));
        context.lineTo(...Util.addVector(pos, points.midL));
        context.lineTo(...Util.addVector(pos, points.btmR));
        break;
      case 'T':
        context.moveTo(...Util.addVector(pos, points.topL));
        context.lineTo(...Util.addVector(pos, points.topR));
        context.moveTo(...Util.addVector(pos, points.topC));
        context.lineTo(...Util.addVector(pos, points.btmC));
        break;
      case 'O':
        context.moveTo(...Util.addVector(pos, points.topL));
        context.lineTo(...Util.addVector(pos, points.topR));
        context.lineTo(...Util.addVector(pos, points.btmR));
        context.lineTo(...Util.addVector(pos, points.btmL));
        context.lineTo(...Util.addVector(pos, points.topL));
        break;
      case 'S':
        context.moveTo(...Util.addVector(pos, points.topR));
        context.lineTo(...Util.addVector(pos, points.topL));
        context.lineTo(...Util.addVector(pos, points.midL));
        context.lineTo(...Util.addVector(pos, points.midR));
        context.lineTo(...Util.addVector(pos, points.btmR));
        context.lineTo(...Util.addVector(pos, points.btmL));
        break;
      case 'H':
        context.moveTo(...Util.addVector(pos, points.topL));
        context.lineTo(...Util.addVector(pos, points.btmL));
        context.moveTo(...Util.addVector(pos, points.midL));
        context.lineTo(...Util.addVector(pos, points.midR));
        context.moveTo(...Util.addVector(pos, points.topR));
        context.lineTo(...Util.addVector(pos, points.btmR));
        break;
      default:
        context.font="22px Arial";
        context.fillStyle = GameView.RED;
        context.fillText(char, pos[0], pos[1]);
        break;
    }
    context.stroke();
  }

}

GameView.DIM_X = 512;
GameView.DIM_Y = 450;
GameView.BLACK = '#000000';
GameView.RED = '#ff0000';
GameView.SHADOW_BLUR = 10;

module.exports = GameView;
