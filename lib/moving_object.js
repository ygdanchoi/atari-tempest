class MovingObject {
  constructor(options) {
    this.game = options.game;
  }

  draw(context) {
  }

  move() {
  }

  remove() {
    this.game.remove(this);
  }
}

module.exports = MovingObject;
