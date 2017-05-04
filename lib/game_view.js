class GameView {
  constructor(game, context) {
    this.game = game;
    this.context = context;
    this.game.draw(this.context);
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
