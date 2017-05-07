const MovingObject = require('./moving_object');
const Util = require('./util');

class EnemyExplosion extends MovingObject {
  constructor(options) {
    super(options);
    this.tubeQuadIdx = options.tubeQuadIdx;
    this.zPos = options.zPos;
    this.size = 0.25;
  }

  draw(context) {
    this.drawExplosion(context);
  }

  drawExplosion(context) {
    const tubeQuad = this.game.tubeQuads[this.tubeQuadIdx];
    const posFrom = Util.midpoint(tubeQuad[0], tubeQuad[1]);
    const posTo = Util.midpoint(tubeQuad[2], tubeQuad[3]);
    const zFraction = this.zPos / EnemyExplosion.MAX_Z_POS;
    const easeFraction = 1 - Math.pow(zFraction - 1, 2);
    const vectorTo = Util.vector(posFrom, posTo, easeFraction);
    const pos = Util.addVector(posFrom, vectorTo);
    const size = 10 * this.size * (2 - easeFraction);
    context.strokeStyle = EnemyExplosion.WHITE;
    context.shadowColor = EnemyExplosion.WHITE;
    context.shadowBlur = EnemyExplosion.WHITE;
    context.beginPath();
    context.moveTo(pos[0] - size, pos[1]);
    context.lineTo(pos[0] + size , pos[1]);
    context.moveTo(pos[0], pos[1] - size);
    context.lineTo(pos[0], pos[1] + size);
    context.moveTo(pos[0] - size / Math.sqrt(2), pos[1] - size / Math.sqrt(2));
    context.lineTo(pos[0] + size / Math.sqrt(2), pos[1] + size / Math.sqrt(2));
    context.moveTo(pos[0] + size / Math.sqrt(2), pos[1] - size / Math.sqrt(2));
    context.lineTo(pos[0] - size / Math.sqrt(2), pos[1] + size / Math.sqrt(2));
    context.moveTo(pos[0] + size * Math.sin(Math.PI / 8), pos[1] + size * Math.cos(Math.PI / 8));
    context.lineTo(pos[0] - size * Math.sin(Math.PI / 8), pos[1] - size * Math.cos(Math.PI / 8));
    context.moveTo(pos[0] + size * Math.sin(3 * Math.PI / 8), pos[1] + size * Math.cos(3 * Math.PI / 8));
    context.lineTo(pos[0] - size * Math.sin(3 * Math.PI / 8), pos[1] - size * Math.cos(3 * Math.PI / 8));
    context.moveTo(pos[0] + size * Math.sin(Math.PI / 8), pos[1] - size * Math.cos(Math.PI / 8));
    context.lineTo(pos[0] - size * Math.sin(Math.PI / 8), pos[1] + size * Math.cos(Math.PI / 8));
    context.moveTo(pos[0] + size * Math.sin(3 * Math.PI / 8), pos[1] - size * Math.cos(3 * Math.PI / 8));
    context.lineTo(pos[0] - size * Math.sin(3 * Math.PI / 8), pos[1] + size * Math.cos(3 * Math.PI / 8));
    context.closePath();
    context.stroke();
  }

  move(delta) {
    this.size += 0.25;
    if (this.size > 1) {
      this.remove();
    }
  }
}

EnemyExplosion.WHITE = '#ffffff';
EnemyExplosion.SHADOW_BLUR = 10;
EnemyExplosion.MAX_Z_POS = 120;

module.exports = EnemyExplosion;
