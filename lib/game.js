const Util = require('./util');
const Blaster = require('./blaster');
const BlasterBullet = require('./blaster_bullet');
const BlasterExplosion = require('./blaster_explosion');
const Flipper = require('./flipper');
const EnemyBullet = require('./enemy_bullet');
const EnemyExplosion = require('./enemy_explosion');

class Game {
  constructor() {
    this.blaster = new Blaster({ game: this });
    this.tubeQuads = [];
    this.blasters = [];
    this.blasterBullets = [];
    this.blasterExplosions = [];
    this.flippers = [];
    this.enemyBullets = [];
    this.enemyExplosions = [];
    this.died = false;
    this.maxNumEnemyBullets = 1;
    this.maxNumEnemies = 2;
    this.flipperWait = 10;
    this.lives = 2;
    this.score = 0;
    this.level = 1;

    this.defineTubeQuads(Game.TUBE_CIRCLE_OUTER, Game.TUBE_CIRCLE_INNER);
    this.innerEnemyQueue = [];
    this.outerEnemyQueue = Array(this.tubeQuads.length).fill(null);

    this.queueEnemies(...Array(4).fill('flipper'));
  }

  add(object) {
    if (object instanceof Blaster) {
      this.blasters.push(object);
    } else if (object instanceof BlasterBullet) {
      this.blasterBullets.push(object);
    } else if (object instanceof BlasterExplosion) {
      this.blasterExplosions.push(object);
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

  queueEnemies(...objects) {
    for (let i = 0; i < objects.length; i++) {
      this.innerEnemyQueue.push({
        enemyType: objects[i],
        tubeQuadIdx: Math.floor(this.tubeQuads.length * Math.random()),
        zPos: Math.random(),
      });
    }
  }

  addBlaster() {
    this.add(this.blaster);
    return this.blaster;
  }

  allObjects() {
    return [].concat(
      this.blasters,
      this.blasterBullets,
      this.blasterExplosions,
      this.flippers,
      this.enemyBullets,
      this.enemyExplosions
    );
  }

  outerEnemies() {
    let outerEnemies = 0;
    for (let i = 0; i < this.outerEnemyQueue.length; i++) {
      if (this.outerEnemyQueue[i] !== null) {
        outerEnemies += 1;
      }
    }
    return outerEnemies;
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
    this.drawTubeQuads(context, Game.BLUE);
    this.drawInnerEnemyQueue(context);
    this.drawOuterEnemyQueue(context);
    this.allObjects().forEach((object) => {
      object.draw(context);
    });
    context.fillStyle = '#FFFFFF';
    context.font="20px Arial";
    context.fillText(`Lives: ${this.lives}`, 10, 30);
    context.fillText(`Score: ${this.score}`, 10, 50);
    context.fillText(`Level: ${this.level}`, 10, 70);
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

  drawInnerEnemyQueue(context) {
    if (this.innerEnemyQueue.length > 0 && this.outerEnemies() < this.maxNumEnemies && this.outerEnemyQueue[this.innerEnemyQueue[0].tubeQuadIdx] === null && Math.random() < 0.5) {
      this.outerEnemyQueue[this.innerEnemyQueue[0].tubeQuadIdx] = this.innerEnemyQueue.shift().enemyType;
    }

    for (let i = 0; i < this.innerEnemyQueue.length; i++) {
      if (!this.died) {
        this.innerEnemyQueue[i].tubeQuadIdx -= 0.5;
        if (this.innerEnemyQueue[i].tubeQuadIdx < 0) {
          this.innerEnemyQueue[i].tubeQuadIdx = this.tubeQuads.length - 0.5;
        }
      }
      let enemy = this.innerEnemyQueue[i];
      context.fillStyle = Game.RED;
      const tubeQuad = this.tubeQuads[Math.floor(enemy.tubeQuadIdx)];
      const posFrom = Util.midpoint(tubeQuad[2], tubeQuad[3]);
      const vectorTo = Util.orthogonalUnitVector(tubeQuad[2], tubeQuad[3], 10 + 5 * enemy.zPos);
      const pos = Util.addVector(posFrom, vectorTo);
      context.beginPath();
      context.arc(
        pos[0], pos[1], 1, 0, 2 * Math.PI, true
      );
      context.fill();
    }
  }

  drawOuterEnemyQueue(context) {
    for (let i = 0; i < this.tubeQuads.length; i++) {
      if (this.outerEnemyQueue[i] !== null) {
        context.fillStyle = Game.RED;
        const tubeQuad = this.tubeQuads[i];
        const posFrom = Util.midpoint(tubeQuad[2], tubeQuad[3]);
        const vectorTo = Util.orthogonalUnitVector(tubeQuad[2], tubeQuad[3], 5);
        const pos = Util.addVector(posFrom, vectorTo);
        context.beginPath();
        context.arc(
          pos[0], pos[1], 1, 0, 2 * Math.PI, true
        );
        context.fill();
      }
    }
  }

  handleMouseMove(context) {
    return (e) => {
      if (!this.died) {
        for (let i = 0; i < this.tubeQuads.length; i++) {
          const point = [e.offsetX, e.offsetY];
          const boundary = this.tubeQuads[i];
          if (Util.isInside(point, boundary)) {
            this.blasters[0].targetXPos = Game.NUM_BLASTER_POSITIONS * i + this.xPosInTubeQuad(point, boundary);
          }
        }
      }
    };
  }

  xPosInTubeQuad(point, boundary) {
    return Math.floor(Game.NUM_BLASTER_POSITIONS * Util.xFractionInTubeQuad(point, boundary));
  }

  moveObjects(delta) {
    let bulletsAndExplosions = [].concat(
      this.blasterBullets,
      this.blasterExplosions,
      this.enemyBullets,
      this.enemyExplosions
    );
    if (this.died && bulletsAndExplosions.length > 0) {
      bulletsAndExplosions.forEach((object) => {
        object.move(delta);
      });
    } else {
      this.allObjects().forEach((object) => {
        object.move(delta);
      });
    }
  }

  remove(object) {
    if (object instanceof Blaster) {
      this.blasters = [];
      this.died = true;
    } else if (object instanceof BlasterBullet) {
      this.blasterBullets.splice(this.blasterBullets.indexOf(object), 1);
    } else if (object instanceof BlasterExplosion) {
      this.blasterExplosions.splice(this.blasterExplosions.indexOf(object), 1);
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

    const enemies = [].concat(
      this.flippers
    );
    for (let i = 0; i < this.outerEnemyQueue.length; i++) {
      if (!this.died && this.outerEnemyQueue[i] !== null && enemies.length < this.maxNumEnemies && Math.random() < 0.1) {
        switch (this.outerEnemyQueue[i]) {
          case 'flipper':
            this.add(new Flipper({
              xVel: Math.random() < 0.5 ? -1 : 1,
              xPos: i * Game.NUM_FLIPPER_POSITIONS + Math.floor(Game.NUM_FLIPPER_POSITIONS / 2),
              game: this
            }));
            this.outerEnemyQueue[i] = null;
            break;
          default:
            throw 'unexpected object';
        }
      }
    }
    if (this.died && this.allObjects().length === 0) {
      this.died = false;
      this.lives -= 1;
      this.addBlaster();
    }

    const allEnemies = [].concat(
      this.flippers,
      this.innerEnemyQueue,
      Array(this.outerEnemies())
    );
    if (!this.died && allEnemies.length === 0) {
      this.level += 1;
      if (this.maxNumEnemies < 6) {
        this.maxNumEnemies += 1;
      }
      this.maxNumEnemyBullets += 1;
      if (this.flipperWait > 2) {
        this.flipperWait -= 1;
      }
      this.queueEnemies(...Array(this.level * 2).fill('flipper'));
    }
  }

}

Game.DIM_X = 512;
Game.DIM_Y = 450;
Game.NUM_BLASTER_POSITIONS = 7;
Game.NUM_FLIPPER_POSITIONS = 7;
Game.BLUE = '#0000cc';
Game.YELLOW = '#ffff00';
Game.RED = '#ff0000';
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
