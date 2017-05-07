const MovingObject = require('./moving_object');
const Util = require('./util');

class BlasterExplosion extends MovingObject {
  constructor(options) {
    super(options);
    this.tubeQuadIdx = options.tubeQuadIdx;
    this.size = 1;
    this.shinking = false;
  }

  draw(context) {
    this.drawExplosion(context);
  }

  drawExplosion(context) {
    const tubeQuad = this.game.tubeQuads[this.tubeQuadIdx];
    const pos = Util.midpoint(tubeQuad[0], tubeQuad[1]);
    const colors = [BlasterExplosion.RED, BlasterExplosion.WHITE, BlasterExplosion.YELLOW];
    for (let i = 0; i < BlasterExplosion.COORDS.length - 1; i += 2) {
      context.beginPath();
      const flip = this.shrinking ? 1 : -1;
      context.strokeStyle = colors[(BlasterExplosion.MAX_SIZE + i / 2 + this.size * flip) % 3];
      context.shadowColor = colors[(BlasterExplosion.MAX_SIZE + i / 2 + this.size * flip) % 3];
      context.shadowBlur = BlasterExplosion.SHADOW_BLUR;
      for (var j = 1; j <= this.size; j += 2) {
        const scalar = j / (BlasterExplosion.MAX_SIZE - 1);
        context.moveTo(...Util.addVectorScaled(pos, BlasterExplosion.COORDS[i], scalar));
        context.lineTo(...Util.addVectorScaled(pos, BlasterExplosion.COORDS[i + 1], scalar));
        context.lineTo(...Util.addVectorScaled(pos, BlasterExplosion.COORDS[i + 2], scalar));
      }
      context.stroke();
    }
  }

  move(delta) {
    if (this.shrinking) {
      this.size -= 1;
    } else {
      this.size += 1;
    }
    if (this.size >= BlasterExplosion.MAX_SIZE) {
      this.shrinking = true;
    } else if (this.size <= 0) {
      this.remove();
    }
  }
}

BlasterExplosion.MAX_SIZE = 12;
BlasterExplosion.WHITE = '#ffffff';
BlasterExplosion.YELLOW = '#ffff00';
BlasterExplosion.RED = '#ff0000';
BlasterExplosion.SHADOW_BLUR;
BlasterExplosion.COORDS = [
  [6, -72],
  [31, -86],
  [28, -39],
  [60, -57],
  [49, -38],
  [64, -36],
  [57, -22],
  [100, -14],
  [42, 14],
  [60, 54],
  [31, 43],
  [28, 79],
  [6, 57],
  [-15, 79],
  [-22, 57],
  [-30, 61],
  [-24, 25],
  [-69, 41],
  [-58, 18],
  [-69, 14],
  [-51, 0],
  [-83, -43],
  [-22, -32],
  [-19, -81],
  [6, -72],
];

module.exports = BlasterExplosion;
