const MovingObject = require('./moving_object');
const Util = require('./util');

class BlasterBullet extends MovingObject {
  constructor(options) {
    super(options);
    this.tubeQuadIdx = options.tubeQuadIdx;
    this.zPos = 0;
  }

  draw(context) {
    const tubeQuad = this.game.tubeQuads[this.tubeQuadIdx];
    context.fillStyle = '#ffffff';
    context.beginPath();
    const posFrom = Util.midpoint(tubeQuad[0], tubeQuad[1]);
    const posTo = Util.midpoint(tubeQuad[2], tubeQuad[3]);
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

BlasterBullet.MAX_Z_POS = 120;

module.exports = BlasterBullet;
