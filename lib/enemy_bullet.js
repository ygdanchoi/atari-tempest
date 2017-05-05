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
  }

  draw(context) {
    const tubeQuad = this.game.tubeQuads[this.tubeQuadIdx];
    context.fillStyle = '#ffffff';
    context.beginPath();
    const posFrom = Util.midpoint(tubeQuad[0], tubeQuad[1]);
    const posTo = Util.midpoint(tubeQuad[2], tubeQuad[3]);
    const zFraction = this.zPos / EnemyBullet.MAX_Z_POS;
    const easeFraction = 1 - Math.pow(zFraction - 1, 2);
    const vectorTo = Util.vector(posFrom, posTo, easeFraction);
    const pos = Util.addVector(posFrom, vectorTo);
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

  move(delta) {
    if (this.zPos === 0) {
      this.remove();
    }
    this.zPos -= 2;
    if (this.zPos < 0) {
      this.zPos = 0;
    }
  }
}

EnemyBullet.MAX_Z_POS = 120;

module.exports = EnemyBullet;
