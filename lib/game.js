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
    this.start();
    this.over = true;

    this.blasterMoveSound = new Audio('ogg/blasterMove.ogg');
    this.blasterBulletSound = new Audio('ogg/blasterBullet.ogg');
    this.blasterExplosionSound = new Audio('ogg/blasterExplosion.ogg');
    this.enemyBulletSound = new Audio('ogg/enemyBullet.ogg');
    this.enemyExplosionSound = new Audio('ogg/enemyExplosion.ogg');
  }

  start() {
    this.currentTubeIdx = 0;
    this.tubeQuads = [];
    this.tubeCenter = null;
    this.blasters = [this.blaster];
    this.blasterBullets = [];
    this.blasterExplosions = [];
    this.flippers = [];
    this.enemyBullets = [];
    this.enemyBulletZVel = 2;
    this.enemyExplosions = [];
    this.died = false;
    this.maxNumEnemyBullets = 0;
    this.maxNumEnemies = 2;
    this.flipperWait = 10;
    this.lives = 2;
    this.score = 0;
    this.level = 1;

    this.defineTubeQuads(Game.TUBE_CIRCLE);
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

  allObjectsInTube() {
    return [].concat(
      this.blasters,
      this.blasterBullets,
      this.blasterExplosions,
      this.flippers,
      this.enemyBullets,
      this.enemyExplosions
    );
  }

  allEnemies() {
    return [].concat(
      this.flippers,
      this.innerEnemyQueue,
      Array(this.outerQueueEnemies())
    );
  }

  outerQueueEnemies() {
    let outerQueueEnemies = 0;
    for (let i = 0; i < this.outerEnemyQueue.length; i++) {
      if (this.outerEnemyQueue[i] !== null) {
        outerQueueEnemies += 1;
      }
    }
    return outerQueueEnemies;
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
    context.fillStyle = Game.BLACK;
    context.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
    this.drawLives(context);
    this.drawScore(context);
    this.drawLevel(context);
    this.drawTubeQuads(context, Game.BLUE);
    this.drawInnerEnemyQueue(context);
    this.drawOuterEnemyQueue(context);
    this.allObjectsInTube().forEach((object) => {
      object.draw(context);
    });
  }

  drawLives(context) {
    const coords = [
      [11, 0],
      [21, 5],
      [13, 8],
      [18, 5],
      [11, 2],
      [4, 5],
      [8, 8],
      [0, 5]
    ];
    for (var i = 0; i < this.lives; i++) {
      const pos = [44 + 27 * i, 48];
      context.strokeStyle = Game.YELLOW;
      context.shadowColor = Game.YELLOW;
      context.shadowBlur = Game.SHADOW_BLUR;
      context.beginPath();
      for (let i = 0; i < coords.length; i++) {
        if (i === 0) {
          context.moveTo(...Util.addVector(pos, coords[i]));
        } else {
          context.lineTo(...Util.addVector(pos, coords[i]));
        }
      }
      context.closePath();
      context.stroke();
    }
  }

  drawScore(context) {
    Util.drawString(this.score, [163, 20], 'large', 'align-right', Game.GREEN, context);
  }

  drawLevel(context) {
    Util.drawString(`LEVEL ${this.level}`, [271, 32], 'small', 'align-right', Game.BLUE, context);
  }

  defineTubeQuads(tubeShape) {
    this.tubeQuads = [];
    for (let i = 0; i < tubeShape[0].length - 1; i++) {
      this.tubeQuads.push([
        tubeShape[0][i],
        tubeShape[0][i + 1],
        tubeShape[1][i + 1],
        tubeShape[1][i],
      ]);
    }
    this.tubeCenter = Util.tubeCenter(tubeShape);
  }

  drawTubeQuads(context, color) {
    context.shadowColor = color;
    context.shadowBlur = Game.SHADOW_BLUR;

    context.strokeStyle = color;
    for (let i = 0; i < this.tubeQuads.length; i++) {
      const tubeQuad = this.tubeQuads[i];
      context.beginPath();
      context.moveTo(...tubeQuad[0]);
      context.lineTo(...tubeQuad[1]);
      context.lineTo(...tubeQuad[2]);
      context.lineTo(...tubeQuad[3]);
      context.closePath();
      context.stroke();
    }
  }

  drawInnerEnemyQueue(context) {
    this.pushFirstInnerEnemyToOuterEnemyQueue();

    for (let i = 0; i < this.innerEnemyQueue.length; i++) {
      this.rotateInnerEnemy(i);
      let enemy = this.innerEnemyQueue[i];
      context.fillStyle = Game.RED;
      context.shadowColor = Game.RED;
      context.shadowBlur = Game.SHADOW_BLUR;
      const tubeQuad = this.tubeQuads[Math.floor(enemy.tubeQuadIdx)];
      const posPit = Util.midpoint(tubeQuad[2], tubeQuad[3]);
      const distInward = Util.orthogonalUnitVector(tubeQuad[2], tubeQuad[3], 10 + 5 * enemy.zPos);
      const pos = Util.addVector(posPit, distInward);
      context.beginPath();
      context.arc(
        pos[0], pos[1], 1, 0, 2 * Math.PI, true
      );
      context.fill();
    }
  }

  pushFirstInnerEnemyToOuterEnemyQueue() {
    const innerEnemiesExist = this.innerEnemyQueue.length > 0;
    const outerQueueEnemiesHasRoom = this.outerQueueEnemies() < this.maxNumEnemies;
    if (innerEnemiesExist & outerQueueEnemiesHasRoom) {
      const firstInnerEnemyIdx = this.innerEnemyQueue[0].tubeQuadIdx;
      const outerEnemySlotIsVacant = this.outerEnemyQueue[firstInnerEnemyIdx] === null;
      if (outerEnemySlotIsVacant && Math.random() < 0.5) {
        this.outerEnemyQueue[firstInnerEnemyIdx] = this.innerEnemyQueue.shift().enemyType;
      }
    }
  }

  rotateInnerEnemy(i) {
    if (!this.died) {
      this.innerEnemyQueue[i].tubeQuadIdx -= 0.5;
      if (this.innerEnemyQueue[i].tubeQuadIdx < 0) {
        this.innerEnemyQueue[i].tubeQuadIdx = this.tubeQuads.length - 0.5;
      }
    }
  }

  drawOuterEnemyQueue(context) {
    for (let i = 0; i < this.tubeQuads.length; i++) {
      if (this.outerEnemyQueue[i] !== null) {
        context.fillStyle = Game.RED;
        context.shadowColor = Game.RED;
        context.shadowBlur = Game.SHADOW_BLUR;
        const tubeQuad = this.tubeQuads[i];
        const posPit = Util.midpoint(tubeQuad[2], tubeQuad[3]);
        const distInward = Util.orthogonalUnitVector(tubeQuad[2], tubeQuad[3], 5);
        const pos = Util.addVector(posPit, distInward);
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
      const point = [e.offsetX, e.offsetY];
      if (this.over && Util.overGitHub(point)) {
        e.target.style.cursor = 'pointer';
      } else if (this.over && Util.overPortfolio(point)) {
        e.target.style.cursor = 'pointer';
      } else if (this.over && Util.overMailTo(point)) {
        e.target.style.cursor = 'pointer';
      } else {
        e.target.style.cursor = 'crosshair';
      }
      if (!this.died) {
        for (let i = 0; i < this.tubeQuads.length; i++) {
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

  moveObjects() {
    let bulletsAndExplosions = [].concat(
      this.blasterBullets,
      this.blasterExplosions,
      this.enemyBullets,
      this.enemyExplosions
    );
    if (this.died && bulletsAndExplosions.length > 0) {
      bulletsAndExplosions.forEach((object) => {
        object.move();
      });
    } else {
      this.allObjectsInTube().forEach((object) => {
        object.move();
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

  addOuterEnemyQueueToTube() {
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
  }

  step() {
    this.checkCollisions();
    this.moveObjects();
    this.addOuterEnemyQueueToTube();
    if (this.died && this.allObjectsInTube().length === 0) {
      this.handleDeathLogic();
    }

    const allEnemies = [].concat(
      this.flippers,
      this.innerEnemyQueue,
      Array(this.outerQueueEnemies())
    );
    if (!this.died && this.allEnemies().length === 0) {
      this.advanceToNextLevel();
    }
  }

  handleDeathLogic() {
    if (this.lives > 0) {
      this.died = false;
      this.lives -= 1;
      this.blasters = [this.blaster];
    } else {
      this.over = true;
    }
  }

  advanceToNextLevel() {
    let tubeShapeIdx = Math.floor(Game.TUBE_SHAPES.length * Math.random());
    while (tubeShapeIdx === this.currentTubeIdx) {
      tubeShapeIdx = Math.floor(Game.TUBE_SHAPES.length * Math.random());
    }
    this.currentTubeIdx = tubeShapeIdx;
    this.defineTubeQuads(Game.TUBE_SHAPES[tubeShapeIdx]);
    this.blasterBullets = [];
    this.enemyBullets = [];
    this.level += 1;
    this.maxNumEnemies = Math.ceil(Math.pow(Math.log(this.level + 1), 2));
    this.maxNumEnemyBullets = this.maxNumEnemies;
    this.enemyBulletZVel = Math.ceil(Math.log(this.level + 1));
    if (this.flipperWait > 2) {
      this.flipperWait -= 1;
    }
    this.queueEnemies(...Array(this.level * 2).fill('flipper'));
  }

}

Game.DIM_X = 512;
Game.DIM_Y = 450;
Game.NUM_BLASTER_POSITIONS = 7;
Game.NUM_FLIPPER_POSITIONS = 7;
Game.BLACK = '#000000';
Game.BLUE = '#0000cc';
Game.YELLOW = '#ffff00';
Game.RED = '#ff0000';
Game.GREEN = '#00ff00';
Game.SHADOW_BLUR = 10;
Game.TUBE_CIRCLE = [
  [
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
  ],
  [
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
  ]
];
Game.TUBE_SQUARE = [
  [
    [256, 95],
    [328, 95],
    [401, 95],
    [401, 169],
    [401, 242],
    [401, 314],
    [401, 387],
    [328, 387],
    [256, 387],
    [183, 387],
    [110, 387],
    [110, 314],
    [110, 242],
    [110, 169],
    [110, 95],
    [183, 95],
    [256, 95]
  ],
  [
    [256, 270],
    [267, 270],
    [279, 270],
    [279, 282],
    [279, 294],
    [279, 305],
    [279, 317],
    [267, 317],
    [256, 317],
    [244, 317],
    [232, 317],
    [232, 305],
    [232, 294],
    [232, 282],
    [232, 270],
    [244, 270],
    [256, 270],
  ]
];
Game.TUBE_STARBURST = [
  [
    [256, 114],
    [332, 79],
    [346, 151],
    [421, 168],
    [389, 242],
    [421, 314],
    [346, 332],
    [332, 413],
    [256, 368],
    [179, 413],
    [165, 332],
    [90, 314],
    [128, 242],
    [90, 168],
    [165, 151],
    [179, 79],
    [256, 114],
  ],
  [
    [256, 268],
    [266, 263],
    [268, 273],
    [278, 275],
    [274, 286],
    [278, 295],
    [268, 298],
    [266, 309],
    [256, 303],
    [245, 309],
    [243, 298],
    [233, 295],
    [238, 286],
    [233, 275],
    [243, 273],
    [245, 263],
    [256, 268],
  ]
];
Game.TUBE_CROSS = [
  [
    [256, 60],
    [336, 60],
    [336, 141],
    [416, 141],
    [416, 221],
    [416, 301],
    [336, 301],
    [336, 381],
    [256, 381],
    [175, 381],
    [175, 301],
    [95, 301],
    [95, 221],
    [95, 141],
    [175, 141],
    [175, 60],
    [256, 60],
  ],
  [
    [256, 255],
    [268, 255],
    [268, 267],
    [280, 267],
    [280, 279],
    [280, 291],
    [268, 291],
    [268, 303],
    [256, 303],
    [243, 303],
    [243, 291],
    [231, 291],
    [231, 279],
    [231, 267],
    [243, 267],
    [243, 255],
    [256, 255],
  ]
];
Game.TUBE_PEANUT = [
  [
    [226, 144],
    [285, 144],
    [346, 113],
    [412, 128],
    [455, 180],
    [455, 254],
    [412, 305],
    [346, 320],
    [285, 288],
    [226, 288],
    [165, 320],
    [99, 305],
    [56, 254],
    [56, 180],
    [99, 128],
    [165, 113],
    [226, 144],
  ],
  [
    [252, 247],
    [259, 247],
    [266, 243],
    [274, 245],
    [280, 251],
    [280, 260],
    [274, 266],
    [266, 268],
    [259, 264],
    [252, 264],
    [245, 268],
    [237, 266],
    [231, 260],
    [231, 251],
    [237, 245],
    [245, 243],
    [252, 247],
  ]
];
Game.TUBE_TRIANGLE = [
  [
    [256, 60],
    [288, 123],
    [318, 188],
    [350, 252],
    [383, 316],
    [416, 381],
    [361, 381],
    [310, 381],
    [256, 381],
    [201, 381],
    [148, 381],
    [95, 381],
    [128, 316],
    [158, 252],
    [190, 188],
    [223, 123],
    [256, 60],
  ],
  [
    [256, 256],
    [260, 264],
    [265, 274],
    [270, 284],
    [275, 294],
    [280, 303],
    [271, 303],
    [264, 303],
    [256, 303],
    [247, 303],
    [239, 303],
    [231, 303],
    [236, 294],
    [241, 284],
    [246, 274],
    [251, 264],
    [256, 256],
  ]
];
Game.TUBE_CLOVER = [
  [
    [256, 164],
    [295, 82],
    [393, 96],
    [407, 188],
    [324, 234],
    [407, 280],
    [393, 372],
    [295, 386],
    [256, 304],
    [216, 386],
    [118, 372],
    [104, 280],
    [187, 234],
    [104, 188],
    [118, 96],
    [216, 82],
    [256, 164],
  ],
  [
    [256, 253],
    [261, 240],
    [276, 242],
    [278, 256],
    [266, 264],
    [278, 270],
    [276, 284],
    [261, 286],
    [256, 273],
    [250, 286],
    [235, 284],
    [233, 270],
    [245, 264],
    [233, 256],
    [235, 242],
    [250, 240],
    [256, 253],
  ]
];
Game.TUBE_CELTIC = [
  [
    [227, 60],
    [284, 60],
    [301, 121],
    [347, 170],
    [416, 189],
    [416, 252],
    [347, 271],
    [301, 319],
    [284, 381],
    [227, 381],
    [210, 319],
    [164, 271],
    [95, 252],
    [95, 189],
    [164, 170],
    [210, 121],
    [227, 60],
  ],
  [
    [251, 255],
    [260, 255],
    [262, 264],
    [269, 271],
    [280, 274],
    [280, 284],
    [269, 286],
    [262, 294],
    [260, 303],
    [251, 303],
    [249, 294],
    [242, 286],
    [231, 284],
    [231, 274],
    [242, 271],
    [249, 264],
    [251, 255],
  ]
];
Game.TUBE_HEART = [
  [
    [256, 217],
    [265, 140],
    [307, 70],
    [385, 76],
    [416, 147],
    [416, 228],
    [393, 301],
    [336, 357],
    [256, 380],
    [175, 357],
    [118, 301],
    [95, 228],
    [95, 147],
    [126, 76],
    [204, 70],
    [246, 140],
    [256, 217]
  ],
  [
    [256, 336],
    [257, 325],
    [263, 314],
    [275, 314],
    [280, 325],
    [280, 338],
    [276, 349],
    [268, 357],
    [256, 360],
    [243, 357],
    [235, 349],
    [231, 338],
    [231, 325],
    [236, 314],
    [248, 314],
    [255, 325],
    [256, 336],
  ]
];
Game.TUBE_SHAPES = [
  Game.TUBE_CIRCLE,
  Game.TUBE_SQUARE,
  Game.TUBE_STARBURST,
  Game.TUBE_CROSS,
  Game.TUBE_PEANUT,
  Game.TUBE_CLOVER,
  Game.TUBE_CELTIC,
  Game.TUBE_HEART,
];

module.exports = Game;
