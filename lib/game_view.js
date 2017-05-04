class GameView {
  constructor(game, canvasEl) {
    this.game = game;
    this.context = canvasEl.getContext('2d');
    this.game.draw(this.context);
    this.blaster = this.game.addBlaster();

    canvasEl.addEventListener('mousemove', game.handleMouseMove(this.context));
  }

  start() {
    requestAnimationFrame(this.animate.bind(this));
  }

  animate(time) {
    this.game.step();
    this.game.draw(this.context);
    requestAnimationFrame(this.animate.bind(this));
  }

}

module.exports = GameView;
