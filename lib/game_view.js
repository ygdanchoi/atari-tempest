class GameView {
  constructor(game, canvasEl) {
    this.game = game;
    this.context = canvasEl.getContext('2d');
    this.game.draw(this.context);
    this.blaster = this.game.addBlaster();
    this.bindHandlers(canvasEl);
  }

  bindHandlers(canvasEl) {
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
      }
    });
    document.addEventListener('keyup', (e) => {
      switch (e.code) {
        case 'Space':
          this.blaster.firing = false;
          break;
      }
    });
  }

  start() {
    // requestAnimationFrame(this.animate.bind(this));
    setTimeout(this.animate.bind(this), 40); // 25 fps
  }

  animate(time) {
    this.game.step();
    this.game.draw(this.context);
    // requestAnimationFrame(this.animate.bind(this));
    setTimeout(this.animate.bind(this), 40); // 25 fps
  }

}

module.exports = GameView;
