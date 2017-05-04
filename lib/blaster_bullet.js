const MovingObject = require('./moving_object');
const Util = require('./util');

class BlasterBullet extends MovingObject {
  constructor(options) {
    super(options);
    this.tubeQuad = options.tubeQuad;
    this.zPos = 0;
  }

  draw(context) {
    context.fillStyle = '#ffffff';
    context.beginPath();
    const posFrom = Util.midpoint(this.tubeQuad[0], this.tubeQuad[1]);
    const posTo = Util.midpoint(this.tubeQuad[2], this.tubeQuad[3]);
    const zFraction = this.zPos / BlasterBullet.MAX_Z_POS;
    const easeFraction = 1 - Math.pow(zFraction - 1, 2);
    const vectorTo = Util.vector(posFrom, posTo, easeFraction);
    const pos = Util.addVector(posFrom, vectorTo);
    context.arc(
      pos[0], pos[1], 3 * (1 - easeFraction) + 1, 0, 2 * Math.PI, true
    );
    context.fill();
  }

  move(delta) {
    this.zPos += 5;
    if (this.zPos > 120) {
      this.remove();
    }
  }
}

module.exports = BlasterBullet;

BlasterBullet.MAX_Z_POS = 120;
