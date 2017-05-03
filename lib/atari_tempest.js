DIM_X = 512;
DIM_Y = 450;

document.addEventListener('DOMContentLoaded', () => {
  const canvasEl = document.getElementsByTagName('canvas')[0];
  canvasEl.width = DIM_X;
  canvasEl.height = DIM_Y;

  const ctx = canvasEl.getContext('2d');
  ctx.clearRect(0, 0, DIM_X, DIM_Y);
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, DIM_X, DIM_Y);
});
