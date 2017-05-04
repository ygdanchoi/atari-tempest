const MovingObject = require('./moving_object');
const Util = require('./util');

class Flipper extends MovingObject {
  constructor(options) {
    super(options);
    this.xPos = options.xPos;
    this.xVel = options.xVel;
    this.zPos = Flipper.MAX_Z_POS;
    this.wait = 10;
    this.waiting = 0;
  }

  draw(context) {
    this.xPosInTubeQuad = this.xPos % Flipper.NUM_FLIPPER_POSITIONS;
    this.tubeQuadIdx = Math.floor(this.xPos / Flipper.NUM_FLIPPER_POSITIONS);
    const tubeQuad = this.game.tubeQuads[this.tubeQuadIdx];
    context.fillStyle = '#ff0000';
    context.beginPath();
    const posFrom = Util.midpoint(tubeQuad[0], tubeQuad[1]);
    const posTo = Util.midpoint(tubeQuad[2], tubeQuad[3]);
    const zFraction = this.zPos / Flipper.MAX_Z_POS;
    const easeFraction = 1 - Math.pow(zFraction - 1, 2);
    const vectorTo = Util.vector(posFrom, posTo, easeFraction);
    const pos = Util.addVector(posFrom, vectorTo);
    context.font = 'bold 12px Arial';
    context.fillText(this.xPosInTubeQuad, pos[0], pos[1]);
    context.fill();
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
      if (this.xPosInTubeQuad === Math.floor(Flipper.NUM_FLIPPER_POSITIONS / 2) - 1) {
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
