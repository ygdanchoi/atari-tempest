// const Util = require('./util');

class MovingObject {
  constructor(options) {
    this.game = options.game;
  }

  draw(context) {
    context.fillStyle = '#ffffff';
    context.beginPath();
    context.arc(
      this.pos[0], this.pos[1], 3, 0, 2 * Math.PI, true
    );
    context.fill();
  }

  move(delta) {
  }
}

module.exports = MovingObject;
