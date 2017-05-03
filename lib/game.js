class Game {
  constructor() {

  }

  draw(ctx) {
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
  }
}

Game.DIM_X = 512;
Game.DIM_Y = 450;

module.exports = Game;
