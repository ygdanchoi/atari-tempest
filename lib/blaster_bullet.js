const MovingObject = require('./moving_object');
const Util = require('./util');

class BlasterBullet extends MovingObject {
  constructor(options) {
    super(options);
    this.pos = options.pos;
    this.tubeQuad = options.tubeQuad;
    this.zPos = 0;
  }

  draw(context) {
    context.fillStyle = '#ffffff';
    context.beginPath();
    const posFrom = Util.midpoint(this.tubeQuad[0], this.tubeQuad[1]);
    const posTo = Util.midpoint(this.tubeQuad[2], this.tubeQuad[3]);
    const vectorTo = Util.vector(posFrom, posTo, this.zPos / BlasterBullet.MAX_Z_POS);
    const pos = Util.addVector(posFrom, vectorTo);
    context.arc(
      pos[0], pos[1], 3, 0, 2 * Math.PI, true
    );
    context.fill();
  }

  move(delta) {
    this.pos = [
      this.pos[0] + 2,
      this.pos[1] + 2,
    ];
    this.zPos += 5;
  }
}

module.exports = BlasterBullet;

BlasterBullet.MAX_Z_POS = 120;
