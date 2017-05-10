const MovingObject = require('./moving_object');
const BlasterBullet = require('./blaster_bullet');
const Util = require('./util');

class Blaster extends MovingObject {
  constructor(options) {
    super(options);
    this.xPos = 0;
    this.targetXPos = null;
    this.firing = false;
    this.changingXPos = 0;
  }

  draw(context) {
    this.xPosInTubeQuad = this.xPos % Blaster.NUM_BLASTER_POSITIONS;
    this.tubeQuadIdx = Math.floor(this.xPos / Blaster.NUM_BLASTER_POSITIONS);
    const tubeQuad = this.game.tubeQuads[this.tubeQuadIdx];
    this.drawTubeQuad(context, tubeQuad);
    this.drawBlaster(context, tubeQuad);
  }

  move() {
    if (this.targetXPos) {
      const numXPos = this.game.tubeQuads.length * Blaster.NUM_BLASTER_POSITIONS;
      if (this.xPos <= this.targetXPos - Blaster.NUM_BLASTER_POSITIONS) {
        if (this.targetXPos - this.xPos < numXPos / 2) {
          this.changingXPos = Blaster.NUM_BLASTER_POSITIONS;
        } else {
          this.changingXPos = -Blaster.NUM_BLASTER_POSITIONS;
        }
      } else if (this.xPos >= this.targetXPos + Blaster.NUM_BLASTER_POSITIONS) {
        if (this.xPos - this.targetXPos < numXPos / 2) {
          this.changingXPos = -Blaster.NUM_BLASTER_POSITIONS;
        } else {
          this.changingXPos = Blaster.NUM_BLASTER_POSITIONS;
        }
      } else {
        this.changingXPos = 0;
        this.changeXPos(this.targetXPos - this.xPos);
        this.targetXPos = null;
      }
    }
    if (this.changingXPos !== 0) {
      this.changeXPos(this.changingXPos);
    }
    if (this.firing) {
      this.fireBullet();
    }
  }

  drawTubeQuad(context, tubeQuad) {
    context.strokeStyle = Blaster.YELLOW;
    context.shadowColor = Blaster.YELLOW;
    context.shadowBlur = Blaster.SHADOW_BLUR;
    context.beginPath();
    context.moveTo(...tubeQuad[1]);
    context.lineTo(...tubeQuad[2]);
    context.moveTo(...tubeQuad[3]);
    context.lineTo(...tubeQuad[0]);
    context.closePath();
    context.stroke();
  }

  drawBlaster(context, tubeQuad) {
    const posRimFlexible = Util.weightedMidpoint(tubeQuad[0], tubeQuad[1], (this.xPosInTubeQuad + 1) / (Blaster.NUM_BLASTER_POSITIONS + 1));
    const posRimLeft = Util.weightedMidpoint(tubeQuad[0], tubeQuad[1], 0.9);
    const posRimMidLeft = Util.weightedMidpoint(tubeQuad[0], tubeQuad[1], 0.6);
    const posRimMidRight = Util.weightedMidpoint(tubeQuad[0], tubeQuad[1], 0.4);
    const posRimRight = Util.weightedMidpoint(tubeQuad[0], tubeQuad[1], 0.1);
    const posPitFlexible = Util.weightedMidpoint(tubeQuad[3], tubeQuad[2], (this.xPosInTubeQuad + 1) / (Blaster.NUM_BLASTER_POSITIONS + 1));
    const toClawBack = Util.orthogonalUnitVector(tubeQuad[0], tubeQuad[1], 10);
    const posClawBackOuter = Util.addVector(posRimFlexible, toClawBack, 2);
    const posClawBackInner = Util.addVector(posRimFlexible, toClawBack);
    const posClawPointLeft = Util.addVector(posRimMidLeft, toClawBack, -1);
    const posClawPointRight = Util.addVector(posRimMidRight, toClawBack, -1);
    context.strokeStyle = Blaster.YELLOW;
    context.shadowColor = Blaster.YELLOW;
    context.shadowBlur = Blaster.SHADOW_BLUR;
    context.beginPath();
    context.moveTo(...tubeQuad[0]);
    context.lineTo(...posClawBackOuter);
    context.lineTo(...tubeQuad[1]);
    context.lineTo(...posClawPointLeft);
    context.lineTo(...posRimLeft);
    context.lineTo(...posClawBackInner);
    context.lineTo(...posRimRight);
    context.lineTo(...posClawPointRight);
    context.closePath();
    context.stroke();
  }

  fireBullet() {
    const tubeQuad = this.tubeQuad;
    if (this.game.blasterBullets.length < Blaster.MAX_NUM_BULLETS) {
      const blasterBullet = new BlasterBullet({
        game: this.game,
        tubeQuadIdx: this.tubeQuadIdx,
      });
      this.game.add(blasterBullet);
    }
  }

  changeXPos(increment) {
    const oldXPos = this.xPos;
    this.xPos += increment;
    const numXPos = this.game.tubeQuads.length * Blaster.NUM_BLASTER_POSITIONS;
    if (this.xPos < 0) {
      this.xPos += numXPos;
    } else if (this.xPos >= numXPos) {
      this.xPos -= numXPos;
    }
    if (Math.floor(oldXPos / Blaster.NUM_BLASTER_POSITIONS) !== Math.floor(this.xPos / Blaster.NUM_BLASTER_POSITIONS)) {
      this.game.blasterMoveSound.currentTime = 0;
      this.game.blasterMoveSound.play();
    }
  }
}

Blaster.YELLOW = '#ffff00';
Blaster.SHADOW_BLUR = 10;
Blaster.NUM_BLASTER_POSITIONS = 7;
Blaster.MAX_NUM_BULLETS = 8;

module.exports = Blaster;
