class GameView {
  constructor(game, ctx) {
    this.game = game;
    this.ctx = ctx;
    game.draw(ctx);
  }

}

module.exports = GameView;
