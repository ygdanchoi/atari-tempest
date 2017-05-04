const MovingObject = require('./moving_object');
const BlasterBullet = require('./blaster_bullet');
const Util = require('./util');

class Blaster extends MovingObject {
  constructor(options) {
    super(options);
    this.xPos = options.xPos;
    this.firing = false;
  }

  draw(context) {
    this.xPosInTubeQuad = this.xPos % this.game.tubeQuads.length;
    this.tubeQuadIdx = Math.floor(this.xPos / this.game.tubeQuads.length);
    const tubeQuad = this.game.tubeQuads[this.tubeQuadIdx];
    this.drawTubeQuad(context, tubeQuad);
    if (this.firing) {
      this.fireBullet();
    }
  }

  drawTubeQuad(context, tubeQuad) {
    context.strokeStyle = '#ffff00';
    context.beginPath();
    context.moveTo(...tubeQuad[1]);
    context.lineTo(...tubeQuad[2]);
    context.moveTo(...tubeQuad[3]);
    context.lineTo(...tubeQuad[0]);
    context.closePath();
    context.stroke();
  }

  fireBullet() {
    const tubeQuad = this.tubeQuad;
    if (this.game.blasterBullets.length < 8) {
      const blasterBullet = new BlasterBullet({
        game: this.game,
        tubeQuadIdx: this.tubeQuadIdx,
      });
      this.game.add(blasterBullet);
    }
  }
}

Blaster.MAX_X_POS_IN_TUBE_QUAD = 7;
Blaster.MAX_NUM_BULLETS = 8;

module.exports = Blaster;
