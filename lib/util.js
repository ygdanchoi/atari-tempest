const Game = require('./game');

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
