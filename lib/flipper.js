const MovingObject = require('./moving_object');
const BlasterBullet = require('./blaster_bullet');
const Blaster = require('./blaster');
const BlasterExplosion = require('./blaster_explosion');
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
    this.wait = this.game.flipperWait;
    this.waiting = 0;
    if (Math.random() < 0.5) {
      this.fireBullet();
    }
  }

  draw(context) {
    this.xPosInTubeQuad = this.xPos % Flipper.NUM_FLIPPER_POSITIONS;
    this.tubeQuadIdx = Math.floor(this.xPos / Flipper.NUM_FLIPPER_POSITIONS);
    const tubeQuad = this.game.tubeQuads[this.tubeQuadIdx];
    context.fillStyle = Flipper.RED;
    context.shadowColor = Flipper.RED;
    context.shadowBlur = Flipper.SHADOW_BLUR;
    context.beginPath();
    const easeFraction = Util.easeOutQuad(this.zPos / Flipper.MAX_Z_POS);
    const vectorTo0 = Util.vector(tubeQuad[0], tubeQuad[3], easeFraction);
    const vectorTo1 = Util.vector(tubeQuad[1], tubeQuad[2], easeFraction);
    let pos0 = Util.addVector(tubeQuad[0], vectorTo0);
    let pos1 = Util.addVector(tubeQuad[1], vectorTo1);
    context.fill();
    const midFlip = Math.floor(Flipper.NUM_FLIPPER_POSITIONS / 2);
    let orthogonalVector;
    if (this.xPosInTubeQuad > midFlip) {
      orthogonalVector = Util.orthogonalUnitVector(pos0, pos1, 15 * (1 - 0.9 * easeFraction));
      pos0 = Util.rotateAroundPoint(pos0, pos1, -Math.PI * (this.xPosInTubeQuad - midFlip) / Flipper.NUM_FLIPPER_POSITIONS);
      orthogonalVector = Util.rotateAroundPoint(orthogonalVector, [0, 0], -Math.PI * (this.xPosInTubeQuad - midFlip) / Flipper.NUM_FLIPPER_POSITIONS);
    } else {
      orthogonalVector = Util.orthogonalUnitVector(pos0, pos1, -15 * (1 - 0.9 * easeFraction));
      pos1 = Util.rotateAroundPoint(pos1, pos0, -Math.PI * (this.xPosInTubeQuad - midFlip) / Flipper.NUM_FLIPPER_POSITIONS);
      orthogonalVector = Util.rotateAroundPoint(orthogonalVector, [0, 0], -Math.PI * (this.xPosInTubeQuad - midFlip) / Flipper.NUM_FLIPPER_POSITIONS);
    }
    const halfOrthogonalVector = Util.vector([0, 0], orthogonalVector, 0.5);
    const pos0Inner = Util.addVector(Util.weightedMidpoint(pos0, pos1, 0.1), orthogonalVector);
    const pos0Crease = Util.addVector(Util.weightedMidpoint(pos0, pos1, 0.2), halfOrthogonalVector);
    const pos1Crease = Util.addVector(Util.weightedMidpoint(pos0, pos1, 0.8), halfOrthogonalVector);
    const pos1Inner = Util.addVector(Util.weightedMidpoint(pos0, pos1, 0.9), orthogonalVector);

    context.strokeStyle = '#ff0000';
    context.moveTo(...pos0);
    context.lineTo(...pos1Inner);
    context.lineTo(...pos1Crease);
    context.lineTo(...pos1);
    context.lineTo(...pos0Inner);
    context.lineTo(...pos0Crease);
    context.closePath();
    context.stroke();
    if (!this.game.died && Math.random() < 0.01 * this.game.maxNumEnemyBullets) {
      this.fireBullet();
    }
  }

  fireBullet() {
    if (this.game.enemyBullets.length < this.game.maxNumEnemyBullets) {
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
      this.game.score += 150;
    } else if (blasterObject instanceof Blaster) {
      blasterObject.remove();
      this.game.add(new BlasterExplosion({
        tubeQuadIdx: this.tubeQuadIdx,
        game: this.game
      }));
    }
  }

  move(delta) {
    if (this.game.died) {
      this.zPos += 10;
      if (this.zPos > Flipper.MAX_Z_POS) {
        this.game.queueEnemies('flipper');
        this.remove();
      }
    } else {
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
}

Flipper.RED = '#ff0000';
Flipper.SHADOW_BLUR = 10;
Flipper.NUM_FLIPPER_POSITIONS = 7;
Flipper.MAX_Z_POS = 120;

module.exports = Flipper;
