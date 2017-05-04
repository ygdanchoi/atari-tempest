const MovingObject = require('./moving_object');
const BlasterBullet = require('./blaster_bullet');
const Util = require('./util');

class Blaster extends MovingObject {
  constructor(options) {
    super(options);
    this.xPos = options.xPos;
    this.tubeQuad = options.tubeQuad;
  }

  draw(context) {
    this.drawTubeQuad(context, this.tubeQuad);
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
    const blasterBullet = new BlasterBullet({
      game: this.game,
      tubeQuad: this.tubeQuad,
    });
    this.game.add(blasterBullet);
  }
}

module.exports = Blaster;
