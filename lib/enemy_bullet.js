const MovingObject = require('./moving_object');
const BlasterBullet = require('./blaster_bullet');
const Blaster = require('./blaster');
const BlasterExplosion = require('./blaster_explosion');
const EnemyExplosion = require('./enemy_explosion');
const Util = require('./util');

class EnemyBullet extends MovingObject {
  constructor(options) {
    super(options);
    this.tubeQuadIdx = options.tubeQuadIdx;
    this.zPos = options.zPos;
    this.zVel = this.game.enemyBulletZVel;
    if (this.zPos > 0) {
      this.game.enemyBulletSound.currentTime = 0;
      this.game.enemyBulletSound.play();
    }
  }

  draw(context) {
    const tubeQuad = this.game.tubeQuads[this.tubeQuadIdx];
    context.fillStyle = EnemyBullet.WHITE;
    context.shadowColor = EnemyBullet.WHITE;
    context.shadowBlur = EnemyBullet.WHITE;
    context.beginPath();
    const posRim = Util.midpoint(tubeQuad[0], tubeQuad[1]);
    const posPit = Util.midpoint(tubeQuad[2], tubeQuad[3]);
    const easeFraction = Util.easeOutQuad(this.zPos / EnemyBullet.MAX_Z_POS);
    const distInward = Util.vector(posRim, posPit, easeFraction);
    const pos = Util.addVector(posRim, distInward);
    context.arc(
      pos[0], pos[1], 3 * (1 - easeFraction) + 1, 0, 2 * Math.PI, true
    );
    context.fill();
  }

  isCollidedWith(blasterObject) {
    if (blasterObject instanceof BlasterBullet) {
      return this.tubeQuadIdx === blasterObject.tubeQuadIdx && Math.abs(blasterObject.zPos - this.zPos) < 5;
    } else if (blasterObject instanceof Blaster) {
      return this.tubeQuadIdx === blasterObject.tubeQuadIdx && this.zPos === 0;
    }
  }

  collideWith(blasterObject) {
    if (blasterObject instanceof BlasterBullet) {
      this.remove();
      blasterObject.remove();
      this.game.add(new EnemyExplosion({
        tubeQuadIdx: this.tubeQuadIdx,
        zPos: this.zPos,
        game: this.game
      }));
    } else if (blasterObject instanceof Blaster) {
      blasterObject.remove();
      this.game.add(new BlasterExplosion({
        tubeQuadIdx: this.tubeQuadIdx,
        game: this.game
      }));
    }
  }

  move() {
    if (this.zPos === 0) {
      this.remove();
    }
    this.zPos -= this.zVel;
    if (this.zPos < 0) {
      this.zPos = 0;
    }
  }
}

EnemyBullet.WHITE = '#ffffff';
EnemyBullet.SHADOW_BLUR = 10;
EnemyBullet.MAX_Z_POS = 120;

module.exports = EnemyBullet;
