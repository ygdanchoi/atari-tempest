const Util = require('./util');
const Blaster = require('./blaster');
const BlasterBullet = require('./blaster_bullet');

class Game {
  constructor() {
    this.tubeQuads = [];
    this.blasters = [];
    this.blasterBullets = [];
  }

  add(object) {
    if (object instanceof Blaster) {
      this.blasters.push(object);
    } else if (object instanceof BlasterBullet) {
      this.blasterBullets.push(object);
    } else {
      throw 'unexpected object';
    }
  }

  addBlaster() {
    const blaster = new Blaster({
      xPos: 0,
      xPosInTubeQuad: 0,
      tubeQuadIdx: 0,
      game: this,
    });

    this.add(blaster);

    return blaster;
  }

  allObjects() {
    return [].concat(this.blasters, this.blasterBullets);
  }

  draw(context) {
    context.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    context.fillStyle = '#000000';
    context.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
    this.defineTubeQuads(Game.TUBE_CIRCLE_OUTER, Game.TUBE_CIRCLE_INNER);
    this.drawTubeQuads(context, Game.BLUE);
    this.allObjects().forEach((object) => {
      object.draw(context);
    });
  }

  defineTubeQuads(outer, inner) {
    if (this.tubeQuads.length === 0) {
      for (let i = 0; i < outer.length - 1; i++) {
        this.tubeQuads.push([
          outer[i],
          outer[i + 1],
          inner[i + 1],
          inner[i],
        ]);
      }
    }
  }

  drawTubeQuads(context, color) {
    context.strokeStyle = color;
    for (let i = 0; i < this.tubeQuads.length; i++) {
      const quadrilateral = this.tubeQuads[i];
      context.beginPath();
      context.moveTo(...quadrilateral[0]);
      context.lineTo(...quadrilateral[1]);
      context.lineTo(...quadrilateral[2]);
      context.lineTo(...quadrilateral[3]);
      context.closePath();
      context.stroke();
    }
  }

  handleMouseMove(context) {
    return (e) => {
      for (let i = 0; i < this.tubeQuads.length; i++) {
        const point = [e.offsetX, e.offsetY];
        const boundary = this.tubeQuads[i];
        if (Util.isInside(point, boundary)) {
          this.blasters[0].xPos = this.tubeQuads.length * i + this.xPosInTubeQuad(point, boundary);
        }
      }
    };
  }

  xPosInTubeQuad(point, boundary) {
    return Math.floor(Game.NUM_BLASTER_POSITIONS * Util.xFractionInTubeQuad(point, boundary));
  }

  moveObjects(delta) {
    this.allObjects().forEach((object) => {
      object.move(delta);
    });
  }

  remove(object) {
    if (object instanceof BlasterBullet) {
      this.blasterBullets.splice(this.blasterBullets.indexOf(object), 1);
    } else {
      throw 'unexpected object';
    }
  }

  step(delta) {
    this.moveObjects(delta);
  }

}

Game.DIM_X = 512;
Game.DIM_Y = 450;
Game.NUM_BLASTER_POSITIONS = 7;
Game.BLUE = '#0000cc';
Game.YELLOW = '#ffff00';
Game.TUBE_CIRCLE_OUTER = [
  [256, 60],
  [316, 73],
  [368, 108],
  [403, 160],
  [416, 221],
  [403, 281],
  [368, 334],
  [315, 368],
  [256, 381],
  [195, 368],
  [143, 334],
  [108, 281],
  [95, 221],
  [108, 160],
  [143, 108],
  [195, 73],
  [256, 60],
];
Game.TUBE_CIRCLE_INNER = [
  [256, 255],
  [264, 257],
  [273, 262],
  [277, 270],
  [280, 279],
  [277, 289],
  [273, 296],
  [264, 301],
  [256, 303],
  [247, 301],
  [238, 296],
  [234, 289],
  [231, 279],
  [234, 270],
  [238, 262],
  [247, 257],
  [256, 255],
];

module.exports = Game;
