# Bowtie Brutality IN SPACE

Play Here

## About

Bowtie Brutality IN SPACE is a retro browser game built with JavaScript and Canvas. Inspired by Tempest, a 1981 arcade game by Atari, it calculates vectors on the fly to render three-dimensional surfaces.

## How to Play

- Point to move
- Click to shoot

- Left/Right Arrow Keys to move
- Space to shoot

## Features

### Rendering the tube

All rendering is done in HTML 5 Canvas. I predefined several Tube shapes with outer and inner rims, and then stored an array of all the quadrilaterals. Upon mousemove, I used a public algorithm to check if it's inside a polygon, and then found the distance from the mouse point to each of the adjacent radial lines, then used the ratio of that to calculate a single xPos.

### Rendering the blaster

The blaster, which holds an xPos, matches its xPos to the current tube segment, and then uses the vector from the midpoint of the inner line to the midpoint of the outer line to extend from a weighted midpoint of the outer line - rendering a claw shape that bends based on its relative xPos within each tube segment.

### Rendering the bullets

Bullets have a tubeQuadIdx and a zPos, and an x^2 polynomial function to determine its distance from the midpoint of the inner tube line towards the outer tube line.

### Render the flippers

The flipper, which holds an xPos and zPos, first determines which tube segment it should be rendered at, and then uses an x^2 polynomial function to determine its distance from the center of the tube while keeping its edges on the edge of the radial segment lines. From there, depending on whether its relative xPos is less than or greater than the "middle" relative xPos value, the vector is rotated around either of the two points. Finally, an orthogonal vector is calculated in order to form a basis around which to to render the rest of the "bowtie" shape.
