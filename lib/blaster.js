const MovingObject = require("./moving_object");

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
    console.log(this.xPos);
    context.strokeStyle = '#ffff00';
    context.beginPath();
    context.moveTo(...tubeQuad[1]);
    context.lineTo(...tubeQuad[2]);
    context.moveTo(...tubeQuad[3]);
    context.lineTo(...tubeQuad[0]);
    context.closePath();
    context.stroke();
  }
}

module.exports = Blaster;
