const MovingObject = require('./moving_object');
const Util = require('./util');

class EnemyExplosion extends MovingObject {
  constructor(options) {
    super(options);
    this.tubeQuadIdx = options.tubeQuadIdx;
    this.zPos = options.zPos;
    this.size = 0.25;
    this.game.enemyExplosionSound.currentTime = 0;
    this.game.enemyExplosionSound.play();
  }

  draw(context) {
    this.drawExplosion(context);
  }

  drawExplosion(context) {
    const tubeQuad = this.game.tubeQuads[this.tubeQuadIdx];
    const posRim = Util.midpoint(tubeQuad[0], tubeQuad[1]);
    const posPit = Util.midpoint(tubeQuad[2], tubeQuad[3]);
    const easeFraction = Util.easeOutQuad(this.zPos / EnemyExplosion.MAX_Z_POS);
    const distInwards = Util.vector(posRim, posPit, easeFraction);
    const pos = Util.addVector(posRim, distInwards);
    const size = EnemyExplosion.ABS_SIZE * this.size * (2 - easeFraction);
    context.strokeStyle = EnemyExplosion.WHITE;
    context.shadowColor = EnemyExplosion.WHITE;
    context.shadowBlur = EnemyExplosion.WHITE;
    context.beginPath();
    for (var i = 0; i < 8; i++) {
      const theta = i * Math.PI / 8;
      context.moveTo(pos[0] + size * Math.sin(theta), pos[1] + size * Math.cos(theta));
      context.lineTo(pos[0] - size * Math.sin(theta), pos[1] - size * Math.cos(theta));
    }
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
EnemyExplosion.ABS_SIZE = 10;
EnemyExplosion.MAX_Z_POS = 120;

module.exports = EnemyExplosion;
