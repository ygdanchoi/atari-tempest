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

  tubeCenter(tubeShape) {
    let x = tubeShape[1][0][0];
    let y = tubeShape[1][0][1];
    for (let i = 1; i < tubeShape[1].length - 1; i++) {
      x += tubeShape[1][i][0];
      y += tubeShape[1][i][1];
    }
    x /= tubeShape[1].length - 1;
    y /= tubeShape[1].length - 1;
    return [x, y];
  },

  weightedMidpoint(point1, point2, weight) {
    const x1 = point1[0];
    const y1 = point1[1];
    const x2 = point2[0];
    const y2 = point2[1];
    return [x1 * (1 - weight) + x2 * weight, y1 * (1 - weight) + y2 * weight];
  },

  vector(point1, point2, scalar = 1) {
    const x1 = point1[0];
    const y1 = point1[1];
    const x2 = point2[0];
    const y2 = point2[1];
    return [(x2 - x1) * scalar, (y2 - y1) * scalar];
  },

  unitVector(point1, point2, scalar = 1) {
    const x1 = point1[0];
    const y1 = point1[1];
    const x2 = point2[0];
    const y2 = point2[1];
    const distance = Util.distanceBetweenPoints(point1, point2);
    return [(x2 - x1) / distance * scalar, (y2 - y1) / distance * scalar];
  },

  orthogonalUnitVector(point1, point2, scalar = 1) {
    const x1 = point1[0];
    const y1 = point1[1];
    const x2 = point2[0];
    const y2 = point2[1];
    const x = (x2 - x1) / Util.distanceBetweenPoints(point1, point2) * scalar;
    const y = (y2 - y1) / Util.distanceBetweenPoints(point1, point2) * scalar;
    return [y, -x];
  },

  addVector(point1, point2, scalar = 1) {
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

  theta(point1, point2, point3) {
    const a = Util.distanceBetweenPoints(point1, point2);
    const b = Util.distanceBetweenPoints(point2, point3);
    const c = Util.distanceBetweenPoints(point1, point3);
    const numerator = Math.pow(a, 2) + Math.pow(b, 2) - Math.pow(c, 2);
    const denominator = 2 * a * b;
    return Math.acos(numerator/denominator);
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

  easeInQuad(fraction) {
    return Math.pow(fraction, 2);
  },

  easeOutQuad(fraction) {
    return 1 - Math.pow(fraction - 1, 2);
  },

  drawString(string, pos, size, align, color, context) {
    string = string.toString();
    let width;
    if (size === 'small') {
      width = 11;
    } else if (size === 'large') {
      width = 22;
    }
    if (align === 'align-left') {
      for (let i = 0; i < string.length; i++) {
        newPos = Util.addVector(pos, [width * i, 0]);
        Util.drawChar(string[i], newPos, size, color, context);
      }
    } else if (align === 'align-right') {
      for (let i = 0; i < string.length; i++) {
        newPos = Util.addVector(pos, [width * i, 0], -1);
        Util.drawChar(string[string.length - 1 - i], newPos, size, color, context);
      }
    }
  },

  drawChar(char, pos, size, color, context) {
    let points;
    if (size === 'large') {
      points = {
        topL: [0, 0],
        topC: [8, 0],
        topR: [15, 0],
        midL: [0, 11],
        midC: [8, 11],
        midR: [15, 11],
        btmL: [0, 21],
        btmC: [8, 21],
        btmR: [15, 21],
      };
    } else if (size === 'small') {
      points = {
        topL: [0, 0],
        topC: [4, 0],
        topR: [8, 0],
        midL: [0, 6],
        midC: [4, 6],
        midR: [8, 6],
        btmL: [0, 11],
        btmC: [4, 11],
        btmR: [8, 11],
      };
    }
    context.strokeStyle = color;
    context.shadowColor = color;
    context.shadowBlur = 10;
    context.beginPath();
    switch (char) {
      case '0':
        context.moveTo(...Util.addVector(pos, points.topL));
        context.lineTo(...Util.addVector(pos, points.topR));
        context.lineTo(...Util.addVector(pos, points.btmR));
        context.lineTo(...Util.addVector(pos, points.btmL));
        context.lineTo(...Util.addVector(pos, points.topL));
        break;
      case '1':
        context.moveTo(...Util.addVector(pos, points.topR));
        context.lineTo(...Util.addVector(pos, points.btmR));
        break;
      case '2':
        context.moveTo(...Util.addVector(pos, points.topL));
        context.lineTo(...Util.addVector(pos, points.topR));
        context.lineTo(...Util.addVector(pos, points.midR));
        context.lineTo(...Util.addVector(pos, points.midL));
        context.lineTo(...Util.addVector(pos, points.btmL));
        context.lineTo(...Util.addVector(pos, points.btmR));
        break;
      case '3':
        context.moveTo(...Util.addVector(pos, points.topL));
        context.lineTo(...Util.addVector(pos, points.topR));
        context.lineTo(...Util.addVector(pos, points.btmR));
        context.lineTo(...Util.addVector(pos, points.btmL));
        context.moveTo(...Util.addVector(pos, points.midL));
        context.lineTo(...Util.addVector(pos, points.midR));
        break;
      case '4':
        context.moveTo(...Util.addVector(pos, points.topL));
        context.lineTo(...Util.addVector(pos, points.midL));
        context.lineTo(...Util.addVector(pos, points.midR));
        context.moveTo(...Util.addVector(pos, points.topR));
        context.lineTo(...Util.addVector(pos, points.btmR));
        break;
      case '5':
        context.moveTo(...Util.addVector(pos, points.topR));
        context.lineTo(...Util.addVector(pos, points.topL));
        context.lineTo(...Util.addVector(pos, points.midL));
        context.lineTo(...Util.addVector(pos, points.midR));
        context.lineTo(...Util.addVector(pos, points.btmR));
        context.lineTo(...Util.addVector(pos, points.btmL));
        break;
      case '6':
        context.moveTo(...Util.addVector(pos, points.topL));
        context.lineTo(...Util.addVector(pos, points.btmL));
        context.lineTo(...Util.addVector(pos, points.btmR));
        context.lineTo(...Util.addVector(pos, points.midR));
        context.lineTo(...Util.addVector(pos, points.midL));
        break;
      case '7':
        context.moveTo(...Util.addVector(pos, points.topL));
        context.lineTo(...Util.addVector(pos, points.topR));
        context.lineTo(...Util.addVector(pos, points.btmR));
        break;
      case '8':
        context.moveTo(...Util.addVector(pos, points.topL));
        context.lineTo(...Util.addVector(pos, points.topR));
        context.lineTo(...Util.addVector(pos, points.btmR));
        context.lineTo(...Util.addVector(pos, points.btmL));
        context.lineTo(...Util.addVector(pos, points.topL));
        context.moveTo(...Util.addVector(pos, points.midL));
        context.lineTo(...Util.addVector(pos, points.midR));
        break;
      case '9':
        context.moveTo(...Util.addVector(pos, points.btmR));
        context.lineTo(...Util.addVector(pos, points.topR));
        context.lineTo(...Util.addVector(pos, points.topL));
        context.lineTo(...Util.addVector(pos, points.midL));
        context.lineTo(...Util.addVector(pos, points.midR));
        break;
      case 'A':
        context.moveTo(...Util.addVector(pos, points.btmL));
        context.lineTo(...Util.addVector(pos, points.midL));
        context.lineTo(...Util.addVector(pos, points.topC));
        context.lineTo(...Util.addVector(pos, points.midR));
        context.lineTo(...Util.addVector(pos, points.btmR));
        context.moveTo(...Util.addVector(pos, points.midL));
        context.lineTo(...Util.addVector(pos, points.midR));
        break;
      case 'B':
        context.moveTo(...Util.addVector(pos, points.topL));
        context.lineTo(...Util.addVector(pos, points.topC));
        context.lineTo(...Util.addVector(pos, Util.weightedMidpoint(points.topR, points.midR, 1/3)));
        context.lineTo(...Util.addVector(pos, Util.weightedMidpoint(points.topR, points.midR, 2/3)));
        context.lineTo(...Util.addVector(pos, points.midC));
        context.lineTo(...Util.addVector(pos, points.midL));
        context.moveTo(...Util.addVector(pos, points.midC));
        context.lineTo(...Util.addVector(pos, Util.weightedMidpoint(points.midR, points.btmR, 1/3)));
        context.lineTo(...Util.addVector(pos, Util.weightedMidpoint(points.midR, points.btmR, 2/3)));
        context.lineTo(...Util.addVector(pos, points.btmC));
        context.lineTo(...Util.addVector(pos, points.btmL));
        context.lineTo(...Util.addVector(pos, points.topL));
        break;
      case 'C':
        context.moveTo(...Util.addVector(pos, points.topR));
        context.lineTo(...Util.addVector(pos, points.topL));
        context.lineTo(...Util.addVector(pos, points.btmL));
        context.lineTo(...Util.addVector(pos, points.btmR));
        break;
      case 'D':
        context.moveTo(...Util.addVector(pos, points.topL));
        context.lineTo(...Util.addVector(pos, points.topC));
        context.lineTo(...Util.addVector(pos, points.midR));
        context.lineTo(...Util.addVector(pos, points.btmC));
        context.lineTo(...Util.addVector(pos, points.btmL));
        context.lineTo(...Util.addVector(pos, points.topL));
        break;
      case 'E':
        context.moveTo(...Util.addVector(pos, points.topR));
        context.lineTo(...Util.addVector(pos, points.topL));
        context.lineTo(...Util.addVector(pos, points.btmL));
        context.lineTo(...Util.addVector(pos, points.btmR));
        context.moveTo(...Util.addVector(pos, points.midL));
        context.lineTo(...Util.addVector(pos, points.midR));
        break;
      case 'F':
        context.moveTo(...Util.addVector(pos, points.topR));
        context.lineTo(...Util.addVector(pos, points.topL));
        context.lineTo(...Util.addVector(pos, points.btmL));
        context.moveTo(...Util.addVector(pos, points.midL));
        context.lineTo(...Util.addVector(pos, points.midR));
        break;
      case 'G':
        context.moveTo(...Util.addVector(pos, points.topR));
        context.lineTo(...Util.addVector(pos, points.topL));
        context.lineTo(...Util.addVector(pos, points.btmL));
        context.lineTo(...Util.addVector(pos, points.btmR));
        context.lineTo(...Util.addVector(pos, points.midR));
        context.lineTo(...Util.addVector(pos, points.midC));
        break;
      case 'H':
        context.moveTo(...Util.addVector(pos, points.topL));
        context.lineTo(...Util.addVector(pos, points.btmL));
        context.moveTo(...Util.addVector(pos, points.midL));
        context.lineTo(...Util.addVector(pos, points.midR));
        context.moveTo(...Util.addVector(pos, points.topR));
        context.lineTo(...Util.addVector(pos, points.btmR));
        break;
      case 'I':
        context.moveTo(...Util.addVector(pos, points.topC));
        context.lineTo(...Util.addVector(pos, points.btmC));
        context.moveTo(...Util.addVector(pos, points.topL));
        context.lineTo(...Util.addVector(pos, points.topR));
        context.moveTo(...Util.addVector(pos, points.btmL));
        context.lineTo(...Util.addVector(pos, points.btmR));
        break;
      case 'K':
        context.moveTo(...Util.addVector(pos, points.topL));
        context.lineTo(...Util.addVector(pos, points.btmL));
        context.moveTo(...Util.addVector(pos, points.topR));
        context.lineTo(...Util.addVector(pos, points.midL));
        context.lineTo(...Util.addVector(pos, points.btmR));
        break;
      case 'L':
        context.moveTo(...Util.addVector(pos, points.topL));
        context.lineTo(...Util.addVector(pos, points.btmL));
        context.lineTo(...Util.addVector(pos, points.btmR));
        break;
      case 'M':
        context.moveTo(...Util.addVector(pos, points.btmL));
        context.lineTo(...Util.addVector(pos, points.topL));
        context.lineTo(...Util.addVector(pos, points.midC));
        context.lineTo(...Util.addVector(pos, points.topR));
        context.lineTo(...Util.addVector(pos, points.btmR));
        break;
      case 'N':
        context.moveTo(...Util.addVector(pos, points.btmL));
        context.lineTo(...Util.addVector(pos, points.topL));
        context.lineTo(...Util.addVector(pos, points.btmR));
        context.lineTo(...Util.addVector(pos, points.topR));
        break;
      case 'O':
        context.moveTo(...Util.addVector(pos, points.topL));
        context.lineTo(...Util.addVector(pos, points.topR));
        context.lineTo(...Util.addVector(pos, points.btmR));
        context.lineTo(...Util.addVector(pos, points.btmL));
        context.lineTo(...Util.addVector(pos, points.topL));
        break;
      case 'P':
        context.moveTo(...Util.addVector(pos, points.btmL));
        context.lineTo(...Util.addVector(pos, points.topL));
        context.lineTo(...Util.addVector(pos, points.topR));
        context.lineTo(...Util.addVector(pos, points.midR));
        context.lineTo(...Util.addVector(pos, points.midL));
        break;
      case 'R':
        context.moveTo(...Util.addVector(pos, points.btmL));
        context.lineTo(...Util.addVector(pos, points.topL));
        context.lineTo(...Util.addVector(pos, points.topR));
        context.lineTo(...Util.addVector(pos, points.midR));
        context.lineTo(...Util.addVector(pos, points.midL));
        context.lineTo(...Util.addVector(pos, points.btmR));
        break;
      case 'S':
        context.moveTo(...Util.addVector(pos, points.topR));
        context.lineTo(...Util.addVector(pos, points.topL));
        context.lineTo(...Util.addVector(pos, points.midL));
        context.lineTo(...Util.addVector(pos, points.midR));
        context.lineTo(...Util.addVector(pos, points.btmR));
        context.lineTo(...Util.addVector(pos, points.btmL));
        break;
      case 'T':
        context.moveTo(...Util.addVector(pos, points.topL));
        context.lineTo(...Util.addVector(pos, points.topR));
        context.moveTo(...Util.addVector(pos, points.topC));
        context.lineTo(...Util.addVector(pos, points.btmC));
        break;
      case 'U':
        context.moveTo(...Util.addVector(pos, points.topL));
        context.lineTo(...Util.addVector(pos, points.btmL));
        context.lineTo(...Util.addVector(pos, points.btmR));
        context.lineTo(...Util.addVector(pos, points.topR));
        break;
      case 'V':
        context.moveTo(...Util.addVector(pos, points.topL));
        context.lineTo(...Util.addVector(pos, points.btmC));
        context.lineTo(...Util.addVector(pos, points.topR));
        break;
      case 'Y':
        context.moveTo(...Util.addVector(pos, points.topL));
        context.lineTo(...Util.addVector(pos, points.midC));
        context.lineTo(...Util.addVector(pos, points.topR));
        context.moveTo(...Util.addVector(pos, points.midC));
        context.lineTo(...Util.addVector(pos, points.btmC));
        break;
      case ' ':
        break;
      case '-':
        context.moveTo(...Util.addVector(pos, points.midL));
        context.lineTo(...Util.addVector(pos, points.midR));
        break;
      case '<':
        context.moveTo(...Util.addVector(pos, points.topC));
        context.lineTo(...Util.addVector(pos, points.midL));
        context.lineTo(...Util.addVector(pos, points.btmC));
        context.moveTo(...Util.addVector(pos, points.midL));
        context.lineTo(...Util.addVector(pos, points.midR));
        break;
      case '>':
        context.moveTo(...Util.addVector(pos, points.topC));
        context.lineTo(...Util.addVector(pos, points.midR));
        context.lineTo(...Util.addVector(pos, points.btmC));
        context.moveTo(...Util.addVector(pos, points.midL));
        context.lineTo(...Util.addVector(pos, points.midR));
        break;
      case '&':
        context.moveTo(...Util.addVector(pos, Util.midpoint(points.topR, points.midR)));
        context.lineTo(...Util.addVector(pos, Util.midpoint(points.topL, points.midL)));
        context.lineTo(...Util.addVector(pos, Util.midpoint(points.btmL, points.midL)));
        context.lineTo(...Util.addVector(pos, Util.midpoint(points.btmR, points.midR)));
        context.moveTo(...Util.addVector(pos, points.midL));
        context.lineTo(...Util.addVector(pos, points.midR));
        context.moveTo(...Util.addVector(pos, points.topC));
        context.lineTo(...Util.addVector(pos, Util.midpoint(points.topC, points.midC)));
        context.lineTo(...Util.addVector(pos, points.btmC));
        context.lineTo(...Util.addVector(pos, Util.midpoint(points.btmC, points.midC)));
        break;
      case '*':
        context.moveTo(...Util.addVector(pos, points.topL));
        context.lineTo(...Util.addVector(pos, points.btmR));
        context.moveTo(...Util.addVector(pos, points.topR));
        context.lineTo(...Util.addVector(pos, points.btmL));
        context.moveTo(...Util.addVector(pos, points.midL));
        context.lineTo(...Util.addVector(pos, points.midR));
        context.moveTo(...Util.addVector(pos, points.topC));
        context.lineTo(...Util.addVector(pos, points.btmC));
        break;
      default:
        context.font="18px Arial";
        context.fillText(char, pos[0], pos[1] + 10);
        break;
    }
    context.stroke();
  },

  overGitHub(pos) {
    const topLft = [110, 422];
    const btmRgt = [173, 433];
    return topLft[0] <= pos[0] && pos[0] <= btmRgt[0] && topLft[1] <= pos[1] && pos[1] <= btmRgt[1];
  },

  overPortfolio(pos) {
    const topLft = [209, 422];
    const btmRgt = [305, 433];
    return topLft[0] <= pos[0] && pos[0] <= btmRgt[0] && topLft[1] <= pos[1] && pos[1] <= btmRgt[1];
  },

  overMailTo(pos) {
    const topLft = [341, 422];
    const btmRgt = [404, 433];
    return topLft[0] <= pos[0] && pos[0] <= btmRgt[0] && topLft[1] <= pos[1] && pos[1] <= btmRgt[1];
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

  move() {
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
    this.game.blasterBulletSound.currentTime = 0.001;
    this.game.blasterBulletSound.play();
  }

  draw(context) {
    const tubeQuad = this.game.tubeQuads[this.tubeQuadIdx];
    context.fillStyle = BlasterBullet.WHITE;
    context.shadowColor = BlasterBullet.WHITE;
    context.shadowBlur = BlasterBullet.SHADOW_BLUR;
    context.beginPath();
    const posRim = Util.midpoint(tubeQuad[0], tubeQuad[1]);
    const posPit = Util.midpoint(tubeQuad[2], tubeQuad[3]);
    const easeFraction = Util.easeOutQuad(this.zPos / BlasterBullet.MAX_Z_POS);
    const distInward = Util.vector(posRim, posPit, easeFraction);
    const pos = Util.addVector(posRim, distInward);
    context.arc(
      pos[0], pos[1], 3 * (1 - easeFraction) + 1, 0, 2 * Math.PI, true
    );
    context.fill();
  }

  move() {
    this.zPos += BlasterBullet.Z_VEL;
    if (this.zPos > BlasterBullet.MAX_Z_POS) {
      this.remove();
    }
  }
}

BlasterBullet.Z_VEL = 5;
BlasterBullet.WHITE = '#ffffff';
BlasterBullet.SHADOW_BLUR = 10;
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
    this.xPosInTubeQuad = this.xPos % Blaster.NUM_BLASTER_POSITIONS;
    this.tubeQuadIdx = Math.floor(this.xPos / Blaster.NUM_BLASTER_POSITIONS);
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
  }

  move() {
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
        this.changeXPos(this.targetXPos - this.xPos);
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
    context.strokeStyle = Blaster.YELLOW;
    context.shadowColor = Blaster.YELLOW;
    context.shadowBlur = Blaster.SHADOW_BLUR;
    context.beginPath();
    context.moveTo(...tubeQuad[1]);
    context.lineTo(...tubeQuad[2]);
    context.moveTo(...tubeQuad[3]);
    context.lineTo(...tubeQuad[0]);
    context.closePath();
    context.stroke();
  }

  drawBlaster(context, tubeQuad) {
    const posRimFlexible = Util.weightedMidpoint(tubeQuad[0], tubeQuad[1], (this.xPosInTubeQuad + 1) / (Blaster.NUM_BLASTER_POSITIONS + 1));
    const posRimLeft = Util.weightedMidpoint(tubeQuad[0], tubeQuad[1], 0.9);
    const posRimMidLeft = Util.weightedMidpoint(tubeQuad[0], tubeQuad[1], 0.6);
    const posRimMidRight = Util.weightedMidpoint(tubeQuad[0], tubeQuad[1], 0.4);
    const posRimRight = Util.weightedMidpoint(tubeQuad[0], tubeQuad[1], 0.1);
    const toClawBack = Util.orthogonalUnitVector(tubeQuad[0], tubeQuad[1], 10);
    const posClawBackOuter = Util.addVector(posRimFlexible, toClawBack, 2);
    const posClawBackInner = Util.addVector(posRimFlexible, toClawBack);
    const posClawPointLeft = Util.addVector(posRimMidLeft, toClawBack, -1);
    const posClawPointRight = Util.addVector(posRimMidRight, toClawBack, -1);
    context.strokeStyle = Blaster.YELLOW;
    context.shadowColor = Blaster.YELLOW;
    context.shadowBlur = Blaster.SHADOW_BLUR;
    context.beginPath();
    context.moveTo(...tubeQuad[0]);
    context.lineTo(...posClawBackOuter);
    context.lineTo(...tubeQuad[1]);
    context.lineTo(...posClawPointLeft);
    context.lineTo(...posRimLeft);
    context.lineTo(...posClawBackInner);
    context.lineTo(...posRimRight);
    context.lineTo(...posClawPointRight);
    context.closePath();
    context.stroke();
  }

  fireBullet() {
    const tubeQuad = this.tubeQuad;
    if (this.game.blasterBullets.length < Blaster.MAX_NUM_BULLETS) {
      const blasterBullet = new BlasterBullet({
        game: this.game,
        tubeQuadIdx: this.tubeQuadIdx,
      });
      this.game.add(blasterBullet);
    }
  }

  changeXPos(increment) {
    const oldXPos = this.xPos;
    this.xPos += increment;
    const numXPos = this.game.tubeQuads.length * Blaster.NUM_BLASTER_POSITIONS;
    if (this.xPos < 0) {
      this.xPos += numXPos;
    } else if (this.xPos >= numXPos) {
      this.xPos -= numXPos;
    }
    if (Math.floor(oldXPos / Blaster.NUM_BLASTER_POSITIONS) !== Math.floor(this.xPos / Blaster.NUM_BLASTER_POSITIONS)) {
      this.game.blasterMoveSound.currentTime = 0;
      this.game.blasterMoveSound.play();
    }
  }
}

Blaster.YELLOW = '#ffff00';
Blaster.SHADOW_BLUR = 10;
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
    this.game.blasterExplosionSound.currentTime = 0;
    this.game.blasterExplosionSound.play();
  }

  draw(context) {
    this.drawExplosion(context);
  }

  drawExplosion(context) {
    const tubeQuad = this.game.tubeQuads[this.tubeQuadIdx];
    const pos = Util.midpoint(tubeQuad[0], tubeQuad[1]);
    for (let i = 0; i < BlasterExplosion.COORDS.length - 1; i += 2) {
      context.beginPath();
      context.strokeStyle = this.cycleColors(i);
      context.shadowColor = this.cycleColors(i);
      context.shadowBlur = BlasterExplosion.SHADOW_BLUR;
      for (var j = 1; j <= this.size; j += 2) {
        const scalar = j / (BlasterExplosion.MAX_SIZE - 1);
        context.moveTo(...Util.addVector(pos, BlasterExplosion.COORDS[i], scalar));
        context.lineTo(...Util.addVector(pos, BlasterExplosion.COORDS[i + 1], scalar));
        context.lineTo(...Util.addVector(pos, BlasterExplosion.COORDS[i + 2], scalar));
      }
      context.stroke();
    }
  }

  cycleColors(i) {
    const colors = [BlasterExplosion.RED, BlasterExplosion.WHITE, BlasterExplosion.YELLOW];
    const flip = this.shrinking ? 1 : -1;
    return colors[(BlasterExplosion.MAX_SIZE + i / 2 + this.size * flip) % 3];
  }

  move() {
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
BlasterExplosion.SHADOW_BLUR = 10;
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
    this.game.enemyExplosionSound.currentTime = 0;
    this.game.enemyExplosionSound.play();
  }

  draw(context) {
    this.drawExplosion(context);
  }

  drawExplosion(context) {
    const tubeQuad = this.game.tubeQuads[this.tubeQuadIdx];
    const posRim = Util.midpoint(tubeQuad[0], tubeQuad[1]);
    const posPit = Util.midpoint(tubeQuad[2], tubeQuad[3]);
    const easeFraction = Util.easeOutQuad(this.zPos / EnemyExplosion.MAX_Z_POS);
    const distInward = Util.vector(posRim, posPit, easeFraction);
    const pos = Util.addVector(posRim, distInward);
    const size = EnemyExplosion.ABS_SIZE * this.size * (2 - easeFraction);
    context.strokeStyle = EnemyExplosion.WHITE;
    context.shadowColor = EnemyExplosion.WHITE;
    context.shadowBlur = EnemyExplosion.WHITE;
    context.beginPath();
    for (var i = 0; i < 8; i++) {
      const theta = i * Math.PI / 8;
      context.moveTo(pos[0] + size * Math.sin(theta), pos[1] + size * Math.cos(theta));
      context.lineTo(pos[0] - size * Math.sin(theta), pos[1] - size * Math.cos(theta));
    }
    context.closePath();
    context.stroke();
  }

  move() {
    this.size += 0.25;
    if (this.size > 1) {
      this.remove();
    }
  }
}

EnemyExplosion.WHITE = '#ffffff';
EnemyExplosion.SHADOW_BLUR = 10;
EnemyExplosion.ABS_SIZE = 10;
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
    this.zVel = this.game.enemyBulletZVel;
    this.game.enemyBulletSound.currentTime = 0;
    this.game.enemyBulletSound.play();
  }

  draw(context) {
    const tubeQuad = this.game.tubeQuads[this.tubeQuadIdx];
    context.fillStyle = EnemyBullet.WHITE;
    context.shadowColor = EnemyBullet.WHITE;
    context.shadowBlur = EnemyBullet.WHITE;
    context.beginPath();
    const posRim = Util.midpoint(tubeQuad[0], tubeQuad[1]);
    const posPit = Util.midpoint(tubeQuad[2], tubeQuad[3]);
    const easeFraction = Util.easeOutQuad(this.zPos / EnemyBullet.MAX_Z_POS);
    const distInward = Util.vector(posRim, posPit, easeFraction);
    const pos = Util.addVector(posRim, distInward);
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

  move() {
    if (this.zPos === 0) {
      this.remove();
    }
    this.zPos -= this.zVel;
    if (this.zPos < 0) {
      this.zPos = 0;
    }
  }
}

EnemyBullet.WHITE = '#ffffff';
EnemyBullet.SHADOW_BLUR = 10;
EnemyBullet.MAX_Z_POS = 120;

module.exports = EnemyBullet;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(0);

class GameView {
  constructor(game, canvasEl) {
    this.game = game;
    this.context = canvasEl.getContext('2d');
    this.blaster = this.game.blaster;
    this.bindHandlers(canvasEl);
    this.animate();
    this.clickToStartTimer = 16;
    this.changeXPosOnMouseWheel = true;
  }

  bindHandlers(canvasEl) {
    canvasEl.addEventListener('click', this.start.bind(this));
    canvasEl.addEventListener('mousemove', this.game.handleMouseMove(this.context));
    canvasEl.addEventListener('mousedown', () => {
      this.blaster.firing = true;
    });
    canvasEl.addEventListener('mouseup', () => {
      this.blaster.firing = false;
    });
    canvasEl.addEventListener('mousewheel', (e) => {
      if (this.game.over === false && this.game.died === false) {
        let dY;
        if (e.deltaY < 0) {
          dY = -Math.ceil(Math.pow(Math.abs(e.deltaY) / 3.3, 2.6));
        } else {
          dY = Math.ceil(Math.pow(Math.abs(e.deltaY) / 3.3, 2.6));
        }
        if (e.deltaY) {
          if (dY < 0) {
            if (this.changeXPosOnMouseWheel) {
              this.blaster.changeXPos(Math.max(dY, -7));
              this.changeXPosOnMouseWheel = false;
            }
          } else if (dY > 0) {
            if (this.changeXPosOnMouseWheel) {
              this.blaster.changeXPos(Math.min(dY, 7));
              this.changeXPosOnMouseWheel = false;
            }
          }
        }
      }
    });
    document.addEventListener('keydown', (e) => {
      switch (e.code) {
        case 'Space':
          this.blaster.firing = true;
          document.getElementById('canvas').click();
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
    key('[', () => {
      if (this.game.over === false && this.game.died === false) {
        this.blaster.changeXPos(-7);
      }
    });
    key(']', () => {
      if (this.game.over === false && this.game.died === false) {
        this.blaster.changeXPos(7);
      }
    });
    key('\\', () => {
      if (this.game.over === false && this.game.died === false) {
        this.blaster.fireBullet();
      }
      document.getElementById('canvas').click();
    });
  }

  start(e) {
    if (this.game.over === true) {
      if (Util.overGitHub([e.offsetX, e.offsetY])) {
        window.open('https://github.com/ygdanchoi');
      } else if (Util.overPortfolio([e.offsetX, e.offsetY])) {
        window.open('https://ygdanchoi.github.io');
      } else if (Util.overMailTo([e.offsetX, e.offsetY])) {
        window.open('mailto:ygdanchoi@gmail.com');
      } else {
        this.game.over = false;
        this.game.start();
        this.clickToStartTimer = 16;
      }
    }
  }

  animate(time) {
    if (!this.game.over) {
      this.game.step();
      this.game.draw(this.context);
    } else {
      this.drawSplashScreen(this.context);
    }
    setTimeout(this.animate.bind(this), 33); // 30 fps
    this.changeXPosOnMouseWheel = true;
  }

  drawSplashScreen(context) {
    context.clearRect(0, 0, GameView.DIM_X, GameView.DIM_Y);
    context.fillStyle = GameView.BLACK;
    context.fillRect(0, 0, GameView.DIM_X, GameView.DIM_Y);
    this.game.drawScore(context);
    this.game.drawLevel(context);
    if (this.clickToStartTimer > 0) {
      Util.drawString('CLICK TO START', [181, 193], 'small', 'align-left', GameView.RED, context);
    } else if (this.clickToStartTimer < -8) {
      this.clickToStartTimer = 16;
    }
    this.clickToStartTimer -= 1;
    Util.drawString('POINT OR  < >  TO MOVE', [132, 225], 'small', 'align-left', GameView.YELLOW, context);
    Util.drawString('CLICK OR SPACE TO SHOOT', [132, 241], 'small', 'align-left', GameView.YELLOW, context);
    Util.drawString('FLIPPERS ARE HARMLESS MID-FLIP', [99, 273], 'small', 'align-left', GameView.RED, context);
    Util.drawString('ENEMY BULLETS ARE DESTRUCTIBLE', [99, 289], 'small', 'align-left', GameView.RED, context);
    Util.drawString('CODED BY DANIEL CHOI', [148, 406], 'small', 'align-left', GameView.CYAN, context);
    Util.drawString('GITHUB - PORTFOLIO - MAILTO', [110, 422], 'small', 'align-left', GameView.CYAN, context);
  }

}

GameView.DIM_X = 512;
GameView.DIM_Y = 450;
GameView.BLACK = '#000000';
GameView.WHITE = '#ffffff';
GameView.RED = '#ff0000';
GameView.BLUE = '#0000cc';
GameView.CYAN = '#00ffff';
GameView.YELLOW = '#ffff00';
GameView.GREEN = '#00ff00';
GameView.SHADOW_BLUR = 10;

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
  new GameView(game, canvasEl);
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
    this.wait = this.game.flipperWait;
    this.waiting = 0;
    if (Math.random() < 0.5) {
      this.fireBullet();
    }
  }

  draw(context) {
    this.xPosInTubeQuad = this.xPos % Flipper.NUM_FLIPPER_POSITIONS;
    this.tubeQuadIdx = Math.floor(this.xPos / Flipper.NUM_FLIPPER_POSITIONS);
    const tubeQuad = this.game.tubeQuads[this.tubeQuadIdx];
    context.strokeStyle = Flipper.RED;
    context.shadowColor = Flipper.RED;
    context.shadowBlur = Flipper.SHADOW_BLUR;
    context.beginPath();
    const easeFraction = Util.easeOutQuad(this.zPos / Flipper.MAX_Z_POS);
    const toRimRight = Util.vector(tubeQuad[0], tubeQuad[3], easeFraction);
    const toRimLeft = Util.vector(tubeQuad[1], tubeQuad[2], easeFraction);
    let posPivotRight = Util.addVector(tubeQuad[0], toRimRight);
    let posPivotLeft = Util.addVector(tubeQuad[1], toRimLeft);
    let orthogonalVector;
    const orthogonalHeight = 15 * (1 - 0.9 * easeFraction);
    let theta;
    const midFlip = Math.floor(Flipper.NUM_FLIPPER_POSITIONS / 2);
    if (this.xPosInTubeQuad > midFlip) {
      theta = Util.theta(tubeQuad[0], tubeQuad[1], this.game.tubeCenter);
      theta *= -2 * (this.xPosInTubeQuad - midFlip) / Flipper.NUM_FLIPPER_POSITIONS;
      orthogonalVector = Util.orthogonalUnitVector(posPivotRight, posPivotLeft, orthogonalHeight);
      posPivotRight = Util.rotateAroundPoint(posPivotRight, posPivotLeft, theta);
      orthogonalVector = Util.rotateAroundPoint(orthogonalVector, [0, 0], theta);
    } else {
      theta = Util.theta(this.game.tubeCenter, tubeQuad[0], tubeQuad[1]);
      theta *= -2 * (this.xPosInTubeQuad - midFlip) / Flipper.NUM_FLIPPER_POSITIONS;
      orthogonalVector = Util.orthogonalUnitVector(posPivotRight, posPivotLeft, -orthogonalHeight);
      posPivotLeft = Util.rotateAroundPoint(posPivotLeft, posPivotRight, theta);
      orthogonalVector = Util.rotateAroundPoint(orthogonalVector, [0, 0], theta);
    }
    const posCornerRight = Util.addVector(Util.weightedMidpoint(posPivotRight, posPivotLeft, 0.1), orthogonalVector);
    const posCreaseRight = Util.addVector(Util.weightedMidpoint(posPivotRight, posPivotLeft, 0.2), orthogonalVector, 0.5);
    const posCreaseLeft = Util.addVector(Util.weightedMidpoint(posPivotRight, posPivotLeft, 0.8), orthogonalVector, 0.5);
    const posCornerLeft = Util.addVector(Util.weightedMidpoint(posPivotRight, posPivotLeft, 0.9), orthogonalVector);

    context.moveTo(...posPivotRight);
    context.lineTo(...posCornerLeft);
    context.lineTo(...posCreaseLeft);
    context.lineTo(...posPivotLeft);
    context.lineTo(...posCornerRight);
    context.lineTo(...posCreaseRight);
    context.closePath();
    context.stroke();
  }

  fireBullet() {
    if (this.zPos > 0 && this.game.enemyBullets.length < this.game.maxNumEnemyBullets) {
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
      const numXPos = Flipper.NUM_FLIPPER_POSITIONS * this.game.tubeQuads.length;
      const normalCase = Math.abs(blasterObjectXPos - this.xPos) < Flipper.NUM_FLIPPER_POSITIONS;
      const rightEdgeCase = this.xPos > numXPos - midFlip && Math.abs(blasterObjectXPos + numXPos - this.xPos) < Flipper.NUM_FLIPPER_POSITIONS;
      const leftEdgeCase = this.xPos < midFlip && Math.abs(blasterObjectXPos - numXPos - this.xPos) < Flipper.NUM_FLIPPER_POSITIONS;
      return (normalCase || rightEdgeCase || leftEdgeCase) && Math.abs(blasterObject.zPos - this.zPos) < 5;
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
      this.game.score += 150;
    } else if (blasterObject instanceof Blaster) {
      blasterObject.remove();
      this.game.add(new BlasterExplosion({
        tubeQuadIdx: this.tubeQuadIdx,
        game: this.game
      }));
    }
  }

  move() {
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
    if (!this.game.died && Math.random() < 0.01 * this.game.maxNumEnemyBullets) {
      this.fireBullet();
    }
  }
}

Flipper.RED = '#ff0000';
Flipper.SHADOW_BLUR = 10;
Flipper.NUM_FLIPPER_POSITIONS = 7;
Flipper.MAX_Z_POS = 120;

module.exports = Flipper;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map