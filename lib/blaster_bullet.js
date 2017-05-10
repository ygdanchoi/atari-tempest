const MovingObject = require('./moving_object');
const Util = require('./util');

class BlasterBullet extends MovingObject {
  constructor(options) {
    super(options);
    this.tubeQuadIdx = options.tubeQuadIdx;
    this.zPos = 0;
    this.game.blasterBulletSound.currentTime = 0.001;
    this.game.blasterBulletSound.play();
  }

  draw(context) {
    const tubeQuad = this.game.tubeQuads[this.tubeQuadIdx];
    context.fillStyle = BlasterBullet.WHITE;
    context.shadowColor = BlasterBullet.WHITE;
    context.shadowBlur = BlasterBullet.SHADOW_BLUR;
    context.beginPath();
    const posRim = Util.midpoint(tubeQuad[0], tubeQuad[1]);
    const posPit = Util.midpoint(tubeQuad[2], tubeQuad[3]);
    const easeFraction = Util.easeOutQuad(this.zPos / BlasterBullet.MAX_Z_POS);
    const distInward = Util.vector(posRim, posPit, easeFraction);
    const pos = Util.addVector(posRim, distInward);
    context.arc(
      pos[0], pos[1], 3 * (1 - easeFraction) + 1, 0, 2 * Math.PI, true
    );
    context.fill();
  }

  move(delta) {
    this.zPos += BlasterBullet.Z_VEL;
    if (this.zPos > BlasterBullet.MAX_Z_POS) {
      this.remove();
    }
  }
}

BlasterBullet.Z_VEL = 5;
BlasterBullet.WHITE = '#ffffff';
BlasterBullet.SHADOW_BLUR = 10;
BlasterBullet.MAX_Z_POS = 120;

module.exports = BlasterBullet;
