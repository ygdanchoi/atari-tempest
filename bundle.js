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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(4);
const Blaster = __webpack_require__(6);
const BlasterBullet = __webpack_require__(7);

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
    }
  }

  addBlaster() {
    const blaster = new Blaster({
      xPos: 0,
      tubeQuad: this.tubeQuads[0],
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
          this.blasters[0].xPos = this.xPosInTubeQuad(point, boundary);
          this.blasters[0].tubeQuad = this.tubeQuads[i];
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


/***/ }),
/* 1 */
/***/ (function(module, exports) {

class GameView {
  constructor(game, canvasEl) {
    this.game = game;
    this.context = canvasEl.getContext('2d');
    this.game.draw(this.context);
    this.blaster = this.game.addBlaster();

    canvasEl.addEventListener('mousemove', game.handleMouseMove(this.context));
    canvasEl.addEventListener('click', this.blaster.fireBullet.bind(this.blaster));
  }

  start() {
    requestAnimationFrame(this.animate.bind(this));
  }

  animate(time) {
    this.game.step();
    this.game.draw(this.context);
    requestAnimationFrame(this.animate.bind(this));
  }

}

module.exports = GameView;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const Game = __webpack_require__(0);
const GameView = __webpack_require__(1);

document.addEventListener('DOMContentLoaded', () => {
  const canvasEl = document.getElementsByTagName('canvas')[0];
  canvasEl.width = Game.DIM_X;
  canvasEl.height = Game.DIM_Y;

  context = canvasEl.getContext('2d');

  const game = new Game();
  new GameView(game, canvasEl).start();
});


/***/ }),
/* 3 */,
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const Game = __webpack_require__(0);

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

  vector(point1, point2, scalar) {
    const x1 = point1[0];
    const y1 = point1[1];
    const x2 = point2[0];
    const y2 = point2[1];
    return [(x2 - x1) * scalar, (y2 - y1) * scalar];
  },

  addVector(point1, point2) {
    const x1 = point1[0];
    const y1 = point1[1];
    const x2 = point2[0];
    const y2 = point2[1];
    return [x1 + x2, y1 + y2];
  },

  slope(point1, point2) {
    const x1 = point1[0];
    const y1 = point1[1];
    const x2 = point2[0];
    const y2 = point2[1];
    return (y2 - y1) / (x2 - x1);
  },
};

module.exports = Util;


/***/ }),
/* 5 */
/***/ (function(module, exports) {

// const Util = require('./util');

class MovingObject {
  constructor(options) {
    this.game = options.game;
  }

  draw(context) {
  }

  move(delta) {
  }
}

module.exports = MovingObject;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const MovingObject = __webpack_require__(5);
const BlasterBullet = __webpack_require__(7);
const Util = __webpack_require__(4);

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
      pos: Util.midpoint(tubeQuad[0], tubeQuad[1]),
      tubeQuad: this.tubeQuad
    });
    this.game.add(blasterBullet);
  }
}

module.exports = Blaster;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

const MovingObject = __webpack_require__(5);
const Util = __webpack_require__(4);

class BlasterBullet extends MovingObject {
  constructor(options) {
    super(options);
    this.pos = options.pos;
    this.tubeQuad = options.tubeQuad;
    this.zPos = 0;
  }

  draw(context) {
    context.fillStyle = '#ffffff';
    context.beginPath();
    const posFrom = Util.midpoint(this.tubeQuad[0], this.tubeQuad[1]);
    const posTo = Util.midpoint(this.tubeQuad[2], this.tubeQuad[3]);
    const vectorTo = Util.vector(posFrom, posTo, this.zPos / BlasterBullet.MAX_Z_POS);
    const pos = Util.addVector(posFrom, vectorTo);
    context.arc(
      pos[0], pos[1], 3, 0, 2 * Math.PI, true
    );
    context.fill();
  }

  move(delta) {
    this.pos = [
      this.pos[0] + 2,
      this.pos[1] + 2,
    ];
    this.zPos += 5;
  }
}

module.exports = BlasterBullet;

BlasterBullet.MAX_Z_POS = 120;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map