// const Util = require('./util');

class MovingObject {
  constructor(options) {
    this.game = options.game;
  }

  draw(context) {
  }

  move(delta) {
  }

  remove() {
    this.game.remove(this);
  }
}

module.exports = MovingObject;
