const Util = require('./util');
const Blaster = require('./blaster');
const BlasterBullet = require('./blaster_bullet');
const Flipper = require('./flipper');
const EnemyBullet = require('./enemy_bullet');
const EnemyExplosion = require('./enemy_explosion');

class Game {
  constructor() {
    this.tubeQuads = [];
    this.blasters = [];
    this.blasterBullets = [];
    this.flippers = [];
    this.enemyBullets = [];
    this.enemyExplosions = [];

    this.add(new Flipper({
      xVel: Math.random() < 0.5 ? -1 : 1,
      xPos: Math.floor(112 * Math.random()),
      game: this
    }));
  }

  add(object) {
    if (object instanceof Blaster) {
      this.blasters.push(object);
    } else if (object instanceof BlasterBullet) {
      this.blasterBullets.push(object);
    } else if (object instanceof Flipper) {
      this.flippers.push(object);
    } else if (object instanceof EnemyBullet) {
      this.enemyBullets.push(object);
    } else if (object instanceof EnemyExplosion) {
      this.enemyExplosions.push(object);
    } else {
      throw 'unexpected object';
    }
  }

  addBlaster() {
    const blaster = new Blaster({ game: this });

    this.add(blaster);

    return blaster;
  }

  allObjects() {
    return [].concat(
      this.blasters,
      this.blasterBullets,
      this.flippers,
      this.enemyBullets,
      this.enemyExplosions
    );
  }

  checkCollisions() {
    const blasterObjects = [].concat(
      this.blasters,
      this.blasterBullets
    );
    const enemyObjects = [].concat(
      this.flippers,
      this.enemyBullets
    );
    for (let i = 0; i < enemyObjects.length; i++) {
      for (let j = 0; j < blasterObjects.length; j++) {
        const enemy = enemyObjects[i];
        const blasterObject = blasterObjects[j];
        if (enemy.isCollidedWith(blasterObject)) {
          enemy.collideWith(blasterObject);
        }
      }
    }
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
          this.blasters[0].targetXPos = Game.NUM_BLASTER_POSITIONS * i + this.xPosInTubeQuad(point, boundary);
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
    if (object instanceof Blaster) {
      console.log('you died');
      this.blasters = [];
    } else if (object instanceof BlasterBullet) {
      this.blasterBullets.splice(this.blasterBullets.indexOf(object), 1);
    } else if (object instanceof Flipper) {
      this.flippers.splice(this.flippers.indexOf(object), 1);
    } else if (object instanceof EnemyBullet) {
      this.enemyBullets.splice(this.enemyBullets.indexOf(object), 1);
    } else if (object instanceof EnemyExplosion) {
      this.enemyExplosions.splice(this.enemyExplosions.indexOf(object), 1);
    } else {
      throw 'unexpected object';
    }
  }

  step(delta) {
    this.checkCollisions();
    this.moveObjects(delta);
    if (Math.random() < 0.02) {
      this.add(new Flipper({
        xVel: Math.random() < 0.5 ? -1 : 1,
        xPos: Math.floor(112 * Math.random()),
        game: this
      }));
    }
  }

}

Game.DIM_X = 512;
Game.DIM_Y = 450;
Game.NUM_BLASTER_POSITIONS = 7;
Game.NUM_FLIPPER_POSITIONS = 7;
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
