const MovingObject = require('./moving_object');
const BlasterBullet = require('./blaster_bullet');
const Blaster = require('./blaster');
const EnemyBullet = require('./enemy_bullet');
const EnemyExplosion = require('./enemy_explosion');
const Util = require('./util');

class Flipper extends MovingObject {
  constructor(options) {
    super(options);
    this.xPos = options.xPos;
    this.xVel = options.xVel;
    this.zPos = Flipper.MAX_Z_POS;
    this.xPosInTubeQuad = this.xPos % Flipper.NUM_FLIPPER_POSITIONS;
    this.tubeQuadIdx = Math.floor(this.xPos / Flipper.NUM_FLIPPER_POSITIONS);
    this.wait = 10;
    this.waiting = 0;
    if (Math.random() < 0.5) {
      this.fireBullet();
    }
  }

  draw(context) {
    this.xPosInTubeQuad = this.xPos % Flipper.NUM_FLIPPER_POSITIONS;
    this.tubeQuadIdx = Math.floor(this.xPos / Flipper.NUM_FLIPPER_POSITIONS);
    const tubeQuad = this.game.tubeQuads[this.tubeQuadIdx];
    context.fillStyle = '#ff0000';
    context.beginPath();
    const zFraction = this.zPos / Flipper.MAX_Z_POS;
    const easeFraction = 1 - Math.pow(zFraction - 1, 2);
    const vectorTo0 = Util.vector(tubeQuad[0], tubeQuad[3], easeFraction);
    const vectorTo1 = Util.vector(tubeQuad[1], tubeQuad[2], easeFraction);
    let pos0 = Util.addVector(tubeQuad[0], vectorTo0);
    let pos1 = Util.addVector(tubeQuad[1], vectorTo1);
    let orthogonalVector = Util.orthogonalUnitVector(pos0, pos1, 10 * (1 - easeFraction));
    context.fill();
    const midFlip = Math.floor(Flipper.NUM_FLIPPER_POSITIONS / 2);
    if (this.xPosInTubeQuad > midFlip) {
      pos0 = Util.rotateAroundPoint(pos0, pos1, - Math.PI * (this.xPosInTubeQuad - midFlip) / Flipper.NUM_FLIPPER_POSITIONS);
      orthogonalVector = Util.rotateAroundPoint(orthogonalVector, [0, 0], - Math.PI * (this.xPosInTubeQuad - midFlip) / Flipper.NUM_FLIPPER_POSITIONS);
    } else {
      pos1 = Util.rotateAroundPoint(pos1, pos0, - Math.PI * (this.xPosInTubeQuad - midFlip) / Flipper.NUM_FLIPPER_POSITIONS);
      orthogonalVector = Util.rotateAroundPoint(orthogonalVector, [0, 0], - Math.PI * (this.xPosInTubeQuad - midFlip) / Flipper.NUM_FLIPPER_POSITIONS);
    }
    const orthogonalPoint = Util.addVector(Util.midpoint(pos0, pos1), orthogonalVector, 1);

    context.strokeStyle = '#ff0000';
    context.moveTo(...pos0);
    context.lineTo(...orthogonalPoint);
    context.lineTo(...pos1);
    context.stroke();
    if (Math.random() < 0.01) {
      this.fireBullet();
    }
  }

  fireBullet() {
    if (this.game.enemyBullets.length < 3) {
      const enemyBullet = new EnemyBullet({
        tubeQuadIdx: this.tubeQuadIdx,
        zPos: this.zPos,
        game: this.game,
      });
      this.game.add(enemyBullet);
    }
  }

  isCollidedWith(blasterObject) {
    if (blasterObject instanceof BlasterBullet) {
      const midFlip = Math.floor(Flipper.NUM_FLIPPER_POSITIONS / 2);
      const blasterObjectXPos = blasterObject.tubeQuadIdx * Flipper.NUM_FLIPPER_POSITIONS + midFlip;
      return Math.abs(blasterObjectXPos - this.xPos) < Flipper.NUM_FLIPPER_POSITIONS && Math.abs(blasterObject.zPos - this.zPos) < 5;
    } else if (blasterObject instanceof Blaster) {
      const midFlip = Math.floor(Flipper.NUM_FLIPPER_POSITIONS / 2);
      const blasterObjectXPos = blasterObject.tubeQuadIdx * Flipper.NUM_FLIPPER_POSITIONS + midFlip;
      return this.xPos === blasterObjectXPos && this.zPos === 0;
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
    }
  }

  move(delta) {
    if (this.zPos > 0) {
      this.zPos -= 1;
    }
    if (this.waiting > 0) {
      this.waiting -= 1;
    } else {
      this.xPos += this.xVel;
      const numXPos = this.game.tubeQuads.length * Flipper.NUM_FLIPPER_POSITIONS;
      if (this.xPos < 0) {
        this.xPos += numXPos;
      } else if (this.xPos >= numXPos) {
        this.xPos -= numXPos;
      }
      if (this.xPosInTubeQuad + this.xVel === Math.floor(Flipper.NUM_FLIPPER_POSITIONS / 2)) {
        if (this.zPos > 0) {
          this.waiting = this.wait;
        } else {
          this.waiting = Math.floor(this.wait / 2);
        }
      }
    }
  }
}

Flipper.NUM_FLIPPER_POSITIONS = 7;
Flipper.MAX_Z_POS = 120;

module.exports = Flipper;
