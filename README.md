# Atari Tempest Lite

Atari Tempest Lite is a retro browser game built with JavaScript and Canvas. Inspired by Tempest, a 1981 arcade game by Atari, it calculates vectors on the fly to render three-dimensional surfaces.

[Play Here](https://ygdanchoi.github.io/atari-tempest/)

![gif](https://ygdanchoi.github.io/images/tempest.gif)

## How to Play

### Controls

|Control|Action|
|-|-|
|Point mouse|Move blaster to segment|
|Click mouse|Shoot bullet|
|← key|Move blaster clockwise|
|→ key|Move blaster counter-clockwise|
|Space key|Shoot bullet|

### Objective
- Eliminate all red flippers (150 points each)
- Avoid flippers & enemy bullets

### Tips
- Flippers are harmless mid-flip
  - If a flipper reaches the rim, it still can be shot from the adjacent segment.
  - Time your shots carefully!
- Enemy bullets are destructible
  - However, they're not worth any points.

## Notable Features

### Rendering the Tube

Each tube shape is stored as a multi-dimensional array of coordinates for the rim and the pit.
```js
Game.TUBE_CIRCLE = [
  [
    [256, 60], [316, 73], [368, 108], [403, 160], [416, 221], [403, 281], [368, 334], [315, 368], [256, 381], [195, 368], [143, 334], [108, 281], [95, 221], [108, 160], [143, 108], [195, 73], [256, 60]
  ],
  [
    [256, 255], [264, 257], [273, 262], [277, 270], [280, 279], [277, 289], [273, 296], [264, 301], [256, 303], [247, 301], [238, 296], [234, 289], [231, 279], [234, 270], [238, 262], [247, 257], [256, 255]
  ]
];
Game.TUBE_SHAPES = [
  Game.TUBE_CIRCLE, Game.TUBE_SQUARE, Game.TUBE_STARBURST, Game.TUBE_CROSS, Game.TUBE_PEANUT, Game.TUBE_CLOVER, Game.TUBE_CELTIC, Game.TUBE_HEART
];
```

Upon starting the game or advancing levels, the tube coordinates are converted into quadrilaterals and pushed to an array `this.tubeQuads`.
```js
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
}
```

Afterwards, each quadrilateral is rendered for each animation frame using Canvas's `lineTo` function.

```js
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
```
![tube](https://raw.githubusercontent.com/ygdanchoi/atari-tempest/master/docs/clippings/tube.jpg)

All rendering is done in HTML 5 Canvas. I predefined several Tube shapes with outer and inner rims, and then stored an array of all the quadrilaterals. Upon mousemove, I used a public algorithm to check if it's inside a polygon, and then found the distance from the mouse point to each of the adjacent radial lines, then used the ratio of that to calculate a single xPos.

### Rendering the blaster

The blaster, which holds an xPos, matches its xPos to the current tube segment, and then uses the vector from the midpoint of the inner line to the midpoint of the outer line to extend from a weighted midpoint of the outer line - rendering a claw shape that bends based on its relative xPos within each tube segment.

### Rendering the bullets

Bullets have a tubeQuadIdx and a zPos, and an x^2 polynomial function to determine its distance from the midpoint of the inner tube line towards the outer tube line.

### Render the flippers

The flipper, which holds an xPos and zPos, first determines which tube segment it should be rendered at, and then uses an x^2 polynomial function to determine its distance from the center of the tube while keeping its edges on the edge of the radial segment lines. From there, depending on whether its relative xPos is less than or greater than the "middle" relative xPos value, the vector is rotated around either of the two points. Finally, an orthogonal vector is calculated in order to form a basis around which to to render the rest of the "bowtie" shape.
