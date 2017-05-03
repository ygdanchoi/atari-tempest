class GameView {
  constructor(game, context) {
    this.game = game;
    this.game.draw(context);
  }

}

module.exports = GameView;
