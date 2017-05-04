const MovingObject = require('./moving_object');
const BlasterBullet = require('./blaster_bullet');
const Util = require('./util');

class Blaster extends MovingObject {
  constructor(options) {
    super(options);
    this.xPos = options.xPos;
    this.tubeQuadIdx = options.tubeQuadIdx;
  }

  draw(context) {
    this.drawTubeQuad(context, this.game.tubeQuads[this.tubeQuadIdx]);
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
    const tubeQuad = this.game.tubeQuads[this.tubeQuadIdx];
    const blasterBullet = new BlasterBullet({
      pos: tubeQuad[0]
    });
    this.game.add(blasterBullet);
  }
}

module.exports = Blaster;
