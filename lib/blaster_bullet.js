const MovingObject = require("./moving_object");

class BlasterBullet extends MovingObject {
  constructor(options) {
    super(options);
    this.pos = options.pos;
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
    this.pos = [
      this.pos[0] + 2,
      this.pos[1] + 2,
    ];
  }
}

module.exports = BlasterBullet;
