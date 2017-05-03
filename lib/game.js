class Game {
  constructor() {

  }

  draw(context) {
    context.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    context.fillStyle = '#000000';
    context.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
    context.strokeStyle = Game.BLUE;
    this.defineQuadrilaterals(context, Game.TUBE_CIRCLE_OUTER, Game.TUBE_CIRCLE_INNER);
  }

  defineQuadrilaterals(context, outer, inner) {
    for (let i = 0; i < outer.length - 1; i++) {
      context.beginPath();
      context.moveTo(...outer[i]);
      context.lineTo(...outer[i + 1]);
      context.lineTo(...inner[i + 1]);
      context.lineTo(...inner[i]);
      context.closePath();
      context.stroke();
    }
  }

}

Game.DIM_X = 512;
Game.DIM_Y = 450;
Game.BLUE = '#0000cc';
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
