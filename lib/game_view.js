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
    context.fillStyle = GameView.RED;
    context.font="22px Arial";
    context.fillText('CLICK TO SHOOT', 22, 22);
    context.stroke();
  }

}

GameView.DIM_X = 512;
GameView.DIM_Y = 450;
GameView.BLACK = '#000000';
GameView.RED = '#ff0000';

module.exports = GameView;
