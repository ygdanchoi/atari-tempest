const Util = require('./util');

class GameView {
  constructor(game, canvasEl) {
    this.game = game;
    this.context = canvasEl.getContext('2d');
    this.blaster = this.game.blaster;
    this.bindHandlers(canvasEl);
    this.animate();
    this.clickToStartTimer = 16;
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

  start(e) {
    if (this.game.over === true) {
      if (Util.overGitHub([e.offsetX, e.offsetY])) {
        window.open('https://github.com/ygdanchoi');
      } else if (Util.overPortfolio([e.offsetX, e.offsetY])) {
        window.open('https://ygdanchoi.github.io');
      } else if (Util.overMailTo([e.offsetX, e.offsetY])) {
        window.location.href = 'mailto:ygdanchoi@gmail.com';
        // window.open('mailto:ygdanchoi@gmail.com');
      } else {
        this.game.over = false;
        this.game.start();
        this.clickToStartTimer = 16;
      }
    }
  }

  animate(time) {
    if (!this.game.over) {
      this.game.step();
      this.game.draw(this.context);
    } else {
      this.drawSplashScreen(this.context);
    }
    setTimeout(this.animate.bind(this), 33); // 30 fps
  }

  drawSplashScreen(context) {
    context.clearRect(0, 0, GameView.DIM_X, GameView.DIM_Y);
    context.fillStyle = GameView.BLACK;
    context.fillRect(0, 0, GameView.DIM_X, GameView.DIM_Y);
    this.game.drawScore(context);
    this.game.drawLevel(context);
    if (this.clickToStartTimer > 0) {
      Util.drawString('CLICK TO START', [181, 193], 'small', 'align-left', GameView.RED, context);
    } else if (this.clickToStartTimer < -8) {
      this.clickToStartTimer = 16;
    }
    this.clickToStartTimer -= 1;
    Util.drawString('POINT OR < & > TO MOVE', [132, 225], 'small', 'align-left', GameView.YELLOW, context);
    Util.drawString('CLICK OR SPACE TO SHOOT', [132, 241], 'small', 'align-left', GameView.YELLOW, context);
    Util.drawString('FLIPPERS ARE HARMLESS MID-FLIP', [99, 273], 'small', 'align-left', GameView.RED, context);
    Util.drawString('ENEMY BULLETS ARE DESTRUCTIBLE', [99, 289], 'small', 'align-left', GameView.RED, context);
    Util.drawString('CODED BY DANIEL CHOI', [148, 406], 'small', 'align-left', GameView.CYAN, context);
    Util.drawString('GITHUB - PORTFOLIO - MAILTO', [110, 422], 'small', 'align-left', GameView.CYAN, context);
  }

}

GameView.DIM_X = 512;
GameView.DIM_Y = 450;
GameView.BLACK = '#000000';
GameView.WHITE = '#ffffff';
GameView.RED = '#ff0000';
GameView.BLUE = '#0000cc';
GameView.CYAN = '#00ffff';
GameView.YELLOW = '#ffff00';
GameView.GREEN = '#00ff00';
GameView.SHADOW_BLUR = 10;

module.exports = GameView;
