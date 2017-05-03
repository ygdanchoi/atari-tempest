class Game {
  constructor(canvasEl) {
    this.tubeQuads = [];
    canvasEl.addEventListener('mousemove', this.handleClick(canvasEl.getContext('2d')).bind(this));
  }

  draw(context) {
    context.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    context.fillStyle = '#000000';
    context.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
    context.strokeStyle = Game.BLUE;
    this.defineTubeQuads(Game.TUBE_CIRCLE_OUTER, Game.TUBE_CIRCLE_INNER);
    this.drawTubeQuads(context);
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

  drawTubeQuads(context) {
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

  handleClick(context) {
    return (e) => {
      for (let i = 0; i < this.tubeQuads.length; i++) {
        const point = [e.clientX, e.clientY];
        const boundary = this.tubeQuads[i];
        if (this.isInside(point, boundary)) {
          this.draw(context);
          this.drawTubeQuad(context, this.tubeQuads[i]);
          return i;
        }
      }
      return -1;
    };
  }

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

}

Game.DIM_X = 512;
Game.DIM_Y = 450;
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
