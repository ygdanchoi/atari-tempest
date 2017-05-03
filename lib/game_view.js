class GameView {
  constructor(game, canvasEl) {
    this.game = game;
    this.canvasEl = canvasEl;
    this.context = canvasEl.getContext('2d');
    game.draw(this.context);
    this.canvasEl.addEventListener('click', this.handleClick.bind(this));
  }

  handleClick(e) {
    for (let i = 0; i < this.game.tubeQuads.length; i++) {
      const point = [e.clientX, e.clientY];
      const boundary = this.game.tubeQuads[i];
      if (this.isInside(point, boundary)) {
        console.log(i);
        this.drawTubeQuad(this.game.tubeQuads[i]);
        return i;
      }
    }
    console.log(-1);
    return -1;
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

  drawTubeQuad(tubeQuad) {
    this.context.strokeStyle = '#ffff00';
    this.context.beginPath();
    this.context.moveTo(...tubeQuad[0]);
    this.context.lineTo(...tubeQuad[1]);
    this.context.lineTo(...tubeQuad[2]);
    this.context.lineTo(...tubeQuad[3]);
    this.context.closePath();
    this.context.stroke();
  }
}

module.exports = GameView;
