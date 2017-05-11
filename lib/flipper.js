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
    const toRimRight = Util.vector(tubeQuad[0], tubeQuad[3], easeFraction);
    const toRimLeft = Util.vector(tubeQuad[1], tubeQuad[2], easeFraction);
    const midFlip = Math.floor(Flipper.NUM_FLIPPER_POSITIONS / 2);
    let posPivotRight = Util.addVector(tubeQuad[0], toRimRight);
    let posPivotLeft = Util.addVector(tubeQuad[1], toRimLeft);
    let orthogonalVector;
    const orthogonalHeight = 15 * (1 - 0.9 * easeFraction);
    let leftTubeIdx = this.tubeQuadIdx + 1;
    if (leftTubeIdx >= this.game.tubeQuads.length) {
      leftTubeIdx = 0;
    }
    let rightTubeIdx = this.tubeQuadIdx - 1;
    if (rightTubeIdx < 0) {
      rightTubeIdx = this.game.tubeQuads.length - 1;
    }
    if (this.xPosInTubeQuad > midFlip) {
      const farLeftTubeQuad = this.game.tubeQuads[leftTubeIdx];
      const posFarLeft = farLeftTubeQuad[1];
      let theta = Util.theta(tubeQuad[0], tubeQuad[1], posFarLeft);
      theta *= -(this.xPosInTubeQuad - midFlip) / Flipper.NUM_FLIPPER_POSITIONS;
      orthogonalVector = Util.orthogonalUnitVector(posPivotRight, posPivotLeft, orthogonalHeight);
      posPivotRight = Util.rotateAroundPoint(posPivotRight, posPivotLeft, theta);
      orthogonalVector = Util.rotateAroundPoint(orthogonalVector, [0, 0], theta);
    } else {
      const farRightTubeQuad = this.game.tubeQuads[rightTubeIdx];
      const posFarRight = farRightTubeQuad[0];
      let theta = Util.theta(posFarRight, tubeQuad[0], tubeQuad[1]);
      theta *= -(this.xPosInTubeQuad - midFlip) / Flipper.NUM_FLIPPER_POSITIONS;
      orthogonalVector = Util.orthogonalUnitVector(posPivotRight, posPivotLeft, -orthogonalHeight);
      posPivotLeft = Util.rotateAroundPoint(posPivotLeft, posPivotRight, theta);
      orthogonalVector = Util.rotateAroundPoint(orthogonalVector, [0, 0], theta);
    }
    const posCornerRight = Util.addVector(Util.weightedMidpoint(posPivotRight, posPivotLeft, 0.1), orthogonalVector);
    const posCreaseRight = Util.addVector(Util.weightedMidpoint(posPivotRight, posPivotLeft, 0.2), orthogonalVector, 0.5);
    const posCreaseLeft = Util.addVector(Util.weightedMidpoint(posPivotRight, posPivotLeft, 0.8), orthogonalVector, 0.5);
    const posCornerLeft = Util.addVector(Util.weightedMidpoint(posPivotRight, posPivotLeft, 0.9), orthogonalVector);

    context.strokeStyle = '#ff0000';
    context.moveTo(...posPivotRight);
    context.lineTo(...posCornerLeft);
    context.lineTo(...posCreaseLeft);
    context.lineTo(...posPivotLeft);
    context.lineTo(...posCornerRight);
    context.lineTo(...posCreaseRight);
    context.closePath();
    context.stroke();
  }

  fireBullet() {
    if (this.zPos > 0 && this.game.enemyBullets.length < this.game.maxNumEnemyBullets) {
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
      const numXPos = Flipper.NUM_FLIPPER_POSITIONS * this.game.tubeQuads.length;
      const normalCase = Math.abs(blasterObjectXPos - this.xPos) < Flipper.NUM_FLIPPER_POSITIONS;
      const rightEdgeCase = this.xPos > numXPos - midFlip && Math.abs(blasterObjectXPos + numXPos - this.xPos) < Flipper.NUM_FLIPPER_POSITIONS;
      const leftEdgeCase = this.xPos < midFlip && Math.abs(blasterObjectXPos - numXPos - this.xPos) < Flipper.NUM_FLIPPER_POSITIONS;
      return (normalCase || rightEdgeCase || leftEdgeCase) && Math.abs(blasterObject.zPos - this.zPos) < 5;
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

  move() {
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
    if (!this.game.died && Math.random() < 0.01 * this.game.maxNumEnemyBullets) {
      this.fireBullet();
    }
  }
}

Flipper.RED = '#ff0000';
Flipper.SHADOW_BLUR = 10;
Flipper.NUM_FLIPPER_POSITIONS = 7;
Flipper.MAX_Z_POS = 120;

module.exports = Flipper;
