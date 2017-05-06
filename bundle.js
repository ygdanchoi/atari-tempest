/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const Game = __webpack_require__(6);

const Util = {
  isInside(point, boundary) {
    let result = false;
    // http://stackoverflow.com/questions/8721406/how-to-determine-if-a-point-is-inside-a-2d-convex-polygon
    for (let i = 0, j = boundary.length - 1; i < boundary.length; j = i++) {
      if ((boundary[i][1] > point[1]) != (boundary[j][1] > point[1]) &&
      (point[0] < (boundary[j][0] - boundary[i][0]) * (point[1] - boundary[i][1]) / (boundary[j][1] - boundary[i][1]) + boundary[i][0])) {
        result = !result;
      }
    }
    return result;
  },

  distanceBetweenPoints(point1, point2) {
    const x1 = point1[0];
    const y1 = point1[1];
    const x2 = point2[0];
    const y2 = point2[1];
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  },

  distanceToLine(point0, point1, point2) {
    const x0 = point0[0];
    const y0 = point0[1];
    const x1 = point1[0];
    const y1 = point1[1];
    const x2 = point2[0];
    const y2 = point2[1];
    const numerator = Math.abs((y2 - y1) * x0 - (x2 - x1) * y0 + x2 * y1 - y2 * x1);
    const denominator = Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));
    return numerator / denominator;
  },

  xFractionInTubeQuad(point, tubeQuad) {
    const distBack = Util.distanceToLine(point, tubeQuad[0], tubeQuad[3]);
    const distForward = Util.distanceToLine(point, tubeQuad[1], tubeQuad[2]);
    const distTotal = distBack + distForward;
    return distBack / distTotal;
  },

  midpoint(point1, point2) {
    const x1 = point1[0];
    const y1 = point1[1];
    const x2 = point2[0];
    const y2 = point2[1];
    return [(x1 + x2) / 2, (y1 + y2) / 2];
  },

  weightedMidpoint(point1, point2, weight) {
    const x1 = point1[0];
    const y1 = point1[1];
    const x2 = point2[0];
    const y2 = point2[1];
    return [x1 * (1 - weight) + x2 * weight, y1 * (1 - weight) + y2 * weight];
  },

  vector(point1, point2, scalar) {
    const x1 = point1[0];
    const y1 = point1[1];
    const x2 = point2[0];
    const y2 = point2[1];
    return [(x2 - x1) * scalar, (y2 - y1) * scalar];
  },

  unitVector(point1, point2, scalar) {
    const x1 = point1[0];
    const y1 = point1[1];
    const x2 = point2[0];
    const y2 = point2[1];
    const distance = Util.distanceBetweenPoints(point1, point2);
    return [(x2 - x1) / distance * scalar, (y2 - y1) / distance * scalar];
  },

  orthogonalUnitVector(point1, point2, scalar) {
    const x1 = point1[0];
    const y1 = point1[1];
    const x2 = point2[0];
    const y2 = point2[1];
    const x = (x2 - x1) / Util.distanceBetweenPoints(point1, point2) * scalar;
    const y = (y2 - y1) / Util.distanceBetweenPoints(point1, point2) * scalar;
    return [y, -x];
  },

  addVector(point1, point2) {
    const x1 = point1[0];
    const y1 = point1[1];
    const x2 = point2[0];
    const y2 = point2[1];
    return [x1 + x2, y1 + y2];
  },

  addVectorScaled(point1, point2, scalar) {
    const x1 = point1[0];
    const y1 = point1[1];
    const x2 = point2[0];
    const y2 = point2[1];
    return [x1 + x2 * scalar, y1 + y2 * scalar];
  },

  slope(point1, point2) {
    const x1 = point1[0];
    const y1 = point1[1];
    const x2 = point2[0];
    const y2 = point2[1];
    return (y2 - y1) / (x2 - x1);
  },

  rotateAroundPoint(point1, point2, angle) {
    const x1 = point1[0];
    const y1 = point1[1];
    const x2 = point2[0];
    const y2 = point2[1];
    const x = (x1 - x2) * Math.cos(angle) - (y1 - y2) * Math.sin(angle) + x2;
    const y = (x1 - x2) * Math.sin(angle) + (y1 - y2) * Math.cos(angle) + y2;
    return [x, y];
  },
};

module.exports = Util;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

class MovingObject {
  constructor(options) {
    this.game = options.game;
  }

  draw(context) {
  }

  move(delta) {
  }

  remove() {
    this.game.remove(this);
  }
}

module.exports = MovingObject;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const MovingObject = __webpack_require__(1);
const Util = __webpack_require__(0);

class BlasterBullet extends MovingObject {
  constructor(options) {
    super(options);
    this.tubeQuadIdx = options.tubeQuadIdx;
    this.zPos = 0;
  }

  draw(context) {
    const tubeQuad = this.game.tubeQuads[this.tubeQuadIdx];
    context.fillStyle = '#ffffff';
    context.beginPath();
    const posFrom = Util.midpoint(tubeQuad[0], tubeQuad[1]);
    const posTo = Util.midpoint(tubeQuad[2], tubeQuad[3]);
    const zFraction = this.zPos / BlasterBullet.MAX_Z_POS;
    const easeFraction = 1 - Math.pow(zFraction - 1, 2);
    const vectorTo = Util.vector(posFrom, posTo, easeFraction);
    const pos = Util.addVector(posFrom, vectorTo);
    context.arc(
      pos[0], pos[1], 3 * (1 - easeFraction) + 1, 0, 2 * Math.PI, true
    );
    context.fill();
  }

  move(delta) {
    this.zPos += 5;
    if (this.zPos > 120) {
      this.remove();
    }
  }
}

BlasterBullet.MAX_Z_POS = 120;

module.exports = BlasterBullet;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const MovingObject = __webpack_require__(1);
const BlasterBullet = __webpack_require__(2);
const Util = __webpack_require__(0);

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
        this.xPos = this.targetXPos;
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
    context.strokeStyle = '#ffff00';
    context.beginPath();
    context.moveTo(...tubeQuad[1]);
    context.lineTo(...tubeQuad[2]);
    context.moveTo(...tubeQuad[3]);
    context.lineTo(...tubeQuad[0]);
    context.closePath();
    context.stroke();
  }

  drawBlaster(context, tubeQuad) {
    const posOuterMid = Util.weightedMidpoint(tubeQuad[0], tubeQuad[1], (this.xPosInTubeQuad + 1) / (Blaster.NUM_BLASTER_POSITIONS + 1));
    const posOuterLeft = Util.weightedMidpoint(tubeQuad[0], tubeQuad[1], 0.9);
    const posOuterClawLeft = Util.weightedMidpoint(tubeQuad[0], tubeQuad[1], 0.6);
    const posOuterClawRight = Util.weightedMidpoint(tubeQuad[0], tubeQuad[1], 0.4);
    const posOuterRight = Util.weightedMidpoint(tubeQuad[0], tubeQuad[1], 0.1);
    const posInnerMid = Util.weightedMidpoint(tubeQuad[3], tubeQuad[2], (this.xPosInTubeQuad + 1) / (Blaster.NUM_BLASTER_POSITIONS + 1));
    const vectorOuterBack = Util.unitVector(posOuterMid, posInnerMid, -20);
    const vectorInnerBack = Util.unitVector(posOuterMid, posInnerMid, -10);
    const vectorClawLeft = Util.unitVector(posOuterClawLeft, posInnerMid, 10);
    const vectorClawRight = Util.unitVector(posOuterClawRight, posInnerMid, 10);
    const posOuterBack = Util.addVector(posOuterMid, vectorOuterBack);
    const posInnerBack = Util.addVector(posOuterMid, vectorInnerBack);
    const posClawLeft = Util.addVector(posOuterClawLeft, vectorClawLeft);
    const posClawRight = Util.addVector(posOuterClawRight, vectorClawRight);
    context.strokeStyle = '#ffff00';
    context.beginPath();
    context.moveTo(...tubeQuad[0]);
    context.lineTo(...posOuterBack);
    context.lineTo(...tubeQuad[1]);
    context.lineTo(...posClawLeft);
    context.lineTo(...posOuterLeft);
    context.lineTo(...posInnerBack);
    context.lineTo(...posOuterRight);
    context.lineTo(...posClawRight);
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

  changeXPos(increment) {
    this.xPos += increment;
    const numXPos = this.game.tubeQuads.length * Blaster.NUM_BLASTER_POSITIONS;
    if (this.xPos < 0) {
      this.xPos += numXPos;
    } else if (this.xPos >= numXPos) {
      this.xPos -= numXPos;
    }
  }
}

Blaster.NUM_BLASTER_POSITIONS = 7;
Blaster.MAX_NUM_BULLETS = 8;

module.exports = Blaster;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const MovingObject = __webpack_require__(1);
const Util = __webpack_require__(0);

class BlasterExplosion extends MovingObject {
  constructor(options) {
    super(options);
    this.tubeQuadIdx = options.tubeQuadIdx;
    this.size = 1;
    this.shinking = false;
  }

  draw(context) {
    this.drawExplosion(context);
  }

  drawExplosion(context) {
    const tubeQuad = this.game.tubeQuads[this.tubeQuadIdx];
    const pos = Util.midpoint(tubeQuad[0], tubeQuad[1]);
    const colors = [BlasterExplosion.RED, BlasterExplosion.WHITE, BlasterExplosion.YELLOW];
    for (let i = 0; i < BlasterExplosion.COORDS.length - 1; i += 2) {
      context.beginPath();
      const flip = this.shrinking ? 1 : -1;
      context.strokeStyle = colors[(BlasterExplosion.MAX_SIZE + i / 2 + this.size * flip) % 3];
      for (var j = 1; j <= this.size; j += 2) {
        const scalar = j / (BlasterExplosion.MAX_SIZE - 1);
        context.moveTo(...Util.addVectorScaled(pos, BlasterExplosion.COORDS[i], scalar));
        context.lineTo(...Util.addVectorScaled(pos, BlasterExplosion.COORDS[i + 1], scalar));
        context.lineTo(...Util.addVectorScaled(pos, BlasterExplosion.COORDS[i + 2], scalar));
      }
      context.stroke();
    }
  }

  move(delta) {
    if (this.shrinking) {
      this.size -= 1;
    } else {
      this.size += 1;
    }
    if (this.size >= BlasterExplosion.MAX_SIZE) {
      this.shrinking = true;
    } else if (this.size <= 0) {
      this.remove();
    }
  }
}

BlasterExplosion.MAX_SIZE = 12;
BlasterExplosion.WHITE = '#ffffff';
BlasterExplosion.YELLOW = '#ffff00';
BlasterExplosion.RED = '#ff0000';
BlasterExplosion.COORDS = [
  [6, -72],
  [31, -86],
  [28, -39],
  [60, -57],
  [49, -38],
  [64, -36],
  [57, -22],
  [100, -14],
  [42, 14],
  [60, 54],
  [31, 43],
  [28, 79],
  [6, 57],
  [-15, 79],
  [-22, 57],
  [-30, 61],
  [-24, 25],
  [-69, 41],
  [-58, 18],
  [-69, 14],
  [-51, 0],
  [-83, -43],
  [-22, -32],
  [-19, -81],
  [6, -72],
];

module.exports = BlasterExplosion;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const MovingObject = __webpack_require__(1);
const Util = __webpack_require__(0);

class EnemyExplosion extends MovingObject {
  constructor(options) {
    super(options);
    this.tubeQuadIdx = options.tubeQuadIdx;
    this.zPos = options.zPos;
    this.size = 0.25;
  }

  draw(context) {
    this.drawExplosion(context);
  }

  drawExplosion(context) {
    const tubeQuad = this.game.tubeQuads[this.tubeQuadIdx];
    const posFrom = Util.midpoint(tubeQuad[0], tubeQuad[1]);
    const posTo = Util.midpoint(tubeQuad[2], tubeQuad[3]);
    const zFraction = this.zPos / EnemyExplosion.MAX_Z_POS;
    const easeFraction = 1 - Math.pow(zFraction - 1, 2);
    const vectorTo = Util.vector(posFrom, posTo, easeFraction);
    const pos = Util.addVector(posFrom, vectorTo);
    const size = 10 * this.size * (2 - easeFraction);
    context.strokeStyle = '#ffffff';
    context.beginPath();
    context.moveTo(pos[0] - size, pos[1]);
    context.lineTo(pos[0] + size , pos[1]);
    context.moveTo(pos[0], pos[1] - size);
    context.lineTo(pos[0], pos[1] + size);
    context.moveTo(pos[0] - size / Math.sqrt(2), pos[1] - size / Math.sqrt(2));
    context.lineTo(pos[0] + size / Math.sqrt(2), pos[1] + size / Math.sqrt(2));
    context.moveTo(pos[0] + size / Math.sqrt(2), pos[1] - size / Math.sqrt(2));
    context.lineTo(pos[0] - size / Math.sqrt(2), pos[1] + size / Math.sqrt(2));
    context.moveTo(pos[0] + size * Math.sin(Math.PI / 8), pos[1] + size * Math.cos(Math.PI / 8));
    context.lineTo(pos[0] - size * Math.sin(Math.PI / 8), pos[1] - size * Math.cos(Math.PI / 8));
    context.moveTo(pos[0] + size * Math.sin(3 * Math.PI / 8), pos[1] + size * Math.cos(3 * Math.PI / 8));
    context.lineTo(pos[0] - size * Math.sin(3 * Math.PI / 8), pos[1] - size * Math.cos(3 * Math.PI / 8));
    context.moveTo(pos[0] + size * Math.sin(Math.PI / 8), pos[1] - size * Math.cos(Math.PI / 8));
    context.lineTo(pos[0] - size * Math.sin(Math.PI / 8), pos[1] + size * Math.cos(Math.PI / 8));
    context.moveTo(pos[0] + size * Math.sin(3 * Math.PI / 8), pos[1] - size * Math.cos(3 * Math.PI / 8));
    context.lineTo(pos[0] - size * Math.sin(3 * Math.PI / 8), pos[1] + size * Math.cos(3 * Math.PI / 8));
    context.closePath();
    context.stroke();
  }

  move(delta) {
    this.size += 0.25;
    if (this.size > 1) {
      this.remove();
    }
  }
}

EnemyExplosion.MAX_Z_POS = 120;

module.exports = EnemyExplosion;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(0);
const Blaster = __webpack_require__(3);
const BlasterBullet = __webpack_require__(2);
const BlasterExplosion = __webpack_require__(4);
const Flipper = __webpack_require__(10);
const EnemyBullet = __webpack_require__(7);
const EnemyExplosion = __webpack_require__(5);

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
    this.maxNumEnemies = 4;
    this.lives = 2;
    this.score = 0;
    this.level = 1;

    this.defineTubeQuads(Game.TUBE_CIRCLE_OUTER, Game.TUBE_CIRCLE_INNER);
    this.innerEnemyQueue = [];
    this.outerEnemyQueue = Array(this.tubeQuads.length).fill(null);

    this.queueEnemies(
      'flipper',
      'flipper',
      'flipper',
      'flipper',
      'flipper',
      'flipper',
      'flipper',
      'flipper',
      'flipper',
      'flipper',
      'flipper',
      'flipper'
    );
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
    let outerEnemies = 0;
    for (let i = 0; i < this.outerEnemyQueue.length; i++) {
      if (this.outerEnemyQueue[i] !== null) {
        outerEnemies += 1;
      }
    }
    if (this.innerEnemyQueue.length > 0 && outerEnemies < this.maxNumEnemies && this.outerEnemyQueue[this.innerEnemyQueue[0].tubeQuadIdx] === null && Math.random() < 0.1) {
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


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

const MovingObject = __webpack_require__(1);
const BlasterBullet = __webpack_require__(2);
const Blaster = __webpack_require__(3);
const BlasterExplosion = __webpack_require__(4);
const EnemyExplosion = __webpack_require__(5);
const Util = __webpack_require__(0);

class EnemyBullet extends MovingObject {
  constructor(options) {
    super(options);
    this.tubeQuadIdx = options.tubeQuadIdx;
    this.zPos = options.zPos;
  }

  draw(context) {
    const tubeQuad = this.game.tubeQuads[this.tubeQuadIdx];
    context.fillStyle = '#ffffff';
    context.beginPath();
    const posFrom = Util.midpoint(tubeQuad[0], tubeQuad[1]);
    const posTo = Util.midpoint(tubeQuad[2], tubeQuad[3]);
    const zFraction = this.zPos / EnemyBullet.MAX_Z_POS;
    const easeFraction = 1 - Math.pow(zFraction - 1, 2);
    const vectorTo = Util.vector(posFrom, posTo, easeFraction);
    const pos = Util.addVector(posFrom, vectorTo);
    context.arc(
      pos[0], pos[1], 3 * (1 - easeFraction) + 1, 0, 2 * Math.PI, true
    );
    context.fill();
  }

  isCollidedWith(blasterObject) {
    if (blasterObject instanceof BlasterBullet) {
      return this.tubeQuadIdx === blasterObject.tubeQuadIdx && Math.abs(blasterObject.zPos - this.zPos) < 5;
    } else if (blasterObject instanceof Blaster) {
      return this.tubeQuadIdx === blasterObject.tubeQuadIdx && this.zPos === 0;
    }
  }

  collideWith(blasterObject) {
    if (blasterObject instanceof BlasterBullet) {
      this.remove();
      blasterObject.remove();
      this.game.add(new EnemyExplosion({
        tubeQuadIdx: this.tubeQuadIdx,
        zPos: this.zPos,
        game: this.game
      }));
    } else if (blasterObject instanceof Blaster) {
      blasterObject.remove();
      this.game.add(new BlasterExplosion({
        tubeQuadIdx: this.tubeQuadIdx,
        game: this.game
      }));
    }
  }

  move(delta) {
    if (this.zPos === 0) {
      this.remove();
    }
    this.zPos -= 2;
    if (this.zPos < 0) {
      this.zPos = 0;
    }
  }
}

EnemyBullet.MAX_Z_POS = 120;

module.exports = EnemyBullet;


/***/ }),
/* 8 */
/***/ (function(module, exports) {

class GameView {
  constructor(game, canvasEl) {
    this.game = game;
    this.context = canvasEl.getContext('2d');
    this.game.draw(this.context);
    this.blaster = this.game.addBlaster();
    this.bindHandlers(canvasEl);
  }

  bindHandlers(canvasEl) {
    canvasEl.addEventListener('mousemove', this.game.handleMouseMove(this.context));
    canvasEl.addEventListener('mousedown', () => {
      this.blaster.firing = true;
    });
    canvasEl.addEventListener('mouseup', () => {
      this.blaster.firing = false;
    });
    document.addEventListener('keydown', (e) => {
      switch (e.code) {
        case 'Space':
          this.blaster.firing = true;
          break;
        case 'ArrowLeft':
          this.blaster.changingXPos = 7;
          break;
        case 'ArrowRight':
          this.blaster.changingXPos = -7;
          break;
      }
    });
    document.addEventListener('keyup', (e) => {
      switch (e.code) {
        case 'Space':
          this.blaster.firing = false;
          break;
        case 'ArrowLeft':
          this.blaster.changingXPos = 0;
          break;
        case 'ArrowRight':
          this.blaster.changingXPos = 0;
          break;
      }
    });

  }

  start() {
    // requestAnimationFrame(this.animate.bind(this));
    setTimeout(this.animate.bind(this), 40); // 25 fps
  }

  animate(time) {
    this.game.step();
    this.game.draw(this.context);
    // requestAnimationFrame(this.animate.bind(this));
    setTimeout(this.animate.bind(this), 40); // 25 fps
  }

}

module.exports = GameView;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

const Game = __webpack_require__(6);
const GameView = __webpack_require__(8);

document.addEventListener('DOMContentLoaded', () => {
  const canvasEl = document.getElementsByTagName('canvas')[0];
  canvasEl.width = Game.DIM_X;
  canvasEl.height = Game.DIM_Y;

  context = canvasEl.getContext('2d');

  const game = new Game();
  new GameView(game, canvasEl).start();
});


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

const MovingObject = __webpack_require__(1);
const BlasterBullet = __webpack_require__(2);
const Blaster = __webpack_require__(3);
const BlasterExplosion = __webpack_require__(4);
const EnemyBullet = __webpack_require__(7);
const EnemyExplosion = __webpack_require__(5);
const Util = __webpack_require__(0);

class Flipper extends MovingObject {
  constructor(options) {
    super(options);
    this.xPos = options.xPos;
    this.xVel = options.xVel;
    this.zPos = Flipper.MAX_Z_POS;
    this.xPosInTubeQuad = this.xPos % Flipper.NUM_FLIPPER_POSITIONS;
    this.tubeQuadIdx = Math.floor(this.xPos / Flipper.NUM_FLIPPER_POSITIONS);
    this.wait = 10;
    this.waiting = 0;
    if (Math.random() < 0.5) {
      this.fireBullet();
    }
  }

  draw(context) {
    this.xPosInTubeQuad = this.xPos % Flipper.NUM_FLIPPER_POSITIONS;
    this.tubeQuadIdx = Math.floor(this.xPos / Flipper.NUM_FLIPPER_POSITIONS);
    const tubeQuad = this.game.tubeQuads[this.tubeQuadIdx];
    context.fillStyle = '#ff0000';
    context.beginPath();
    const zFraction = this.zPos / Flipper.MAX_Z_POS;
    const easeFraction = 1 - Math.pow(zFraction - 1, 2);
    const vectorTo0 = Util.vector(tubeQuad[0], tubeQuad[3], easeFraction);
    const vectorTo1 = Util.vector(tubeQuad[1], tubeQuad[2], easeFraction);
    let pos0 = Util.addVector(tubeQuad[0], vectorTo0);
    let pos1 = Util.addVector(tubeQuad[1], vectorTo1);
    context.fill();
    const midFlip = Math.floor(Flipper.NUM_FLIPPER_POSITIONS / 2);
    let orthogonalVector;
    if (this.xPosInTubeQuad > midFlip) {
      orthogonalVector = Util.orthogonalUnitVector(pos0, pos1, 15 * (1 - 0.9 * easeFraction));
      pos0 = Util.rotateAroundPoint(pos0, pos1, -Math.PI * (this.xPosInTubeQuad - midFlip) / Flipper.NUM_FLIPPER_POSITIONS);
      orthogonalVector = Util.rotateAroundPoint(orthogonalVector, [0, 0], -Math.PI * (this.xPosInTubeQuad - midFlip) / Flipper.NUM_FLIPPER_POSITIONS);
    } else {
      orthogonalVector = Util.orthogonalUnitVector(pos0, pos1, -15 * (1 - 0.9 * easeFraction));
      pos1 = Util.rotateAroundPoint(pos1, pos0, -Math.PI * (this.xPosInTubeQuad - midFlip) / Flipper.NUM_FLIPPER_POSITIONS);
      orthogonalVector = Util.rotateAroundPoint(orthogonalVector, [0, 0], -Math.PI * (this.xPosInTubeQuad - midFlip) / Flipper.NUM_FLIPPER_POSITIONS);
    }
    const halfOrthogonalVector = Util.vector([0, 0], orthogonalVector, 0.5);
    const pos0Inner = Util.addVector(Util.weightedMidpoint(pos0, pos1, 0.1), orthogonalVector);
    const pos0Crease = Util.addVector(Util.weightedMidpoint(pos0, pos1, 0.2), halfOrthogonalVector);
    const pos1Crease = Util.addVector(Util.weightedMidpoint(pos0, pos1, 0.8), halfOrthogonalVector);
    const pos1Inner = Util.addVector(Util.weightedMidpoint(pos0, pos1, 0.9), orthogonalVector);

    context.strokeStyle = '#ff0000';
    context.moveTo(...pos0);
    context.lineTo(...pos1Inner);
    context.lineTo(...pos1Crease);
    context.lineTo(...pos1);
    context.lineTo(...pos0Inner);
    context.lineTo(...pos0Crease);
    context.closePath();
    context.stroke();
    if (!this.game.died && Math.random() < 0.01) {
      this.fireBullet();
    }
  }

  fireBullet() {
    if (this.game.enemyBullets.length < 3) {
      const enemyBullet = new EnemyBullet({
        tubeQuadIdx: this.tubeQuadIdx,
        zPos: this.zPos,
        game: this.game,
      });
      this.game.add(enemyBullet);
    }
  }

  isCollidedWith(blasterObject) {
    if (blasterObject instanceof BlasterBullet) {
      const midFlip = Math.floor(Flipper.NUM_FLIPPER_POSITIONS / 2);
      const blasterObjectXPos = blasterObject.tubeQuadIdx * Flipper.NUM_FLIPPER_POSITIONS + midFlip;
      return Math.abs(blasterObjectXPos - this.xPos) < Flipper.NUM_FLIPPER_POSITIONS && Math.abs(blasterObject.zPos - this.zPos) < 5;
    } else if (blasterObject instanceof Blaster) {
      const midFlip = Math.floor(Flipper.NUM_FLIPPER_POSITIONS / 2);
      const blasterObjectXPos = blasterObject.tubeQuadIdx * Flipper.NUM_FLIPPER_POSITIONS + midFlip;
      return this.xPos === blasterObjectXPos && this.zPos === 0;
    }
  }

  collideWith(blasterObject) {
    if (blasterObject instanceof BlasterBullet) {
      this.remove();
      blasterObject.remove();
      this.game.add(new EnemyExplosion({
        tubeQuadIdx: this.tubeQuadIdx,
        zPos: this.zPos,
        game: this.game
      }));
    } else if (blasterObject instanceof Blaster) {
      blasterObject.remove();
      this.game.add(new BlasterExplosion({
        tubeQuadIdx: this.tubeQuadIdx,
        game: this.game
      }));
    }
  }

  move(delta) {
    if (this.game.died) {
      this.zPos += 10;
      if (this.zPos > Flipper.MAX_Z_POS) {
        this.game.queueEnemies('flipper');
        this.remove();
      }
    } else {
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
        if (this.xPosInTubeQuad + this.xVel === Math.floor(Flipper.NUM_FLIPPER_POSITIONS / 2)) {
          if (this.zPos > 0) {
            this.waiting = this.wait;
          } else {
            this.waiting = Math.floor(this.wait / 2);
          }
        }
      }
    }
  }
}

Flipper.NUM_FLIPPER_POSITIONS = 7;
Flipper.MAX_Z_POS = 120;

module.exports = Flipper;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map