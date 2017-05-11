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

### Drawing the Tube

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

### Moving the Blaster

The `Blaster` has four relevant instance variables:
- `this.game`
- `this.xPos` (`0` to `119`)
- `this.targetPos` (`0` to `119`, or `null`)
- `this.changingXPos` (`-7`, `0`, or `7`)

The canvas has a `mousemove` listener that iterates through each tube quadrilateral and determines if the mouse position is inside the quadrilateral.
```js
for (let i = 0; i < this.tubeQuads.length; i++) {
  const boundary = this.tubeQuads[i];
  if (Util.isInside(point, boundary)) {
    this.blasters[0].targetXPos = Game.NUM_BLASTER_POSITIONS * i + this.xPosInTubeQuad(point, boundary);
  }
}
```

If so, then the relative position inside the quadrilateral is calculated. This `xPosInTubeQuad` plus the `xPos` for the current quadrilateral is passed as `targetPos` to the `Blaster`.
```js
class Game {
  ...
  xPosInTubeQuad(point, boundary) {
    return Math.floor(Game.NUM_BLASTER_POSITIONS * Util.xFractionInTubeQuad(point, boundary));
  }
  ...
}

class Util {
  ...
  xFractionInTubeQuad(point, tubeQuad) {
    const distBack = Util.distanceToLine(point, tubeQuad[0], tubeQuad[3]);
    const distForward = Util.distanceToLine(point, tubeQuad[1], tubeQuad[2]);
    const distTotal = distBack + distForward;
    return distBack / distTotal;
  },
  ...
}
```

If `this.targetPos` is not `null` (in case of keyboard input), the blaster determines the shortest path from `this.xPos` to `this.targetPos` and sets its moving direction `this.changingXPos` accordingly.
```js
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
  ...
}
```

Finally, the `Blaster` wraps around if necessary and plays a sound if on a new tube segment.
```js
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
```

### Drawing the Blaster

The `Blaster` coordinates are defined based on:
1. The rim of the current quadrilateral, i.e. the line from `tubeQuad[0]` to `tubeQuad[1]`
2. The relative position within the current quadrilateral, i.e. `this.xPosInTubeQuad`
  - `this.xPosInTubeQuad === this.xPos % Blaster.NUM_BLASTER_POSITIONS`

```js
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
```

### Rendering the bullets

Bullets have a tubeQuadIdx and a zPos, and an x^2 polynomial function to determine its distance from the midpoint of the inner tube line towards the outer tube line.

### Render the flippers

The flipper, which holds an xPos and zPos, first determines which tube segment it should be rendered at, and then uses an x^2 polynomial function to determine its distance from the center of the tube while keeping its edges on the edge of the radial segment lines. From there, depending on whether its relative xPos is less than or greater than the "middle" relative xPos value, the vector is rotated around either of the two points. Finally, an orthogonal vector is calculated in order to form a basis around which to to render the rest of the "bowtie" shape.
