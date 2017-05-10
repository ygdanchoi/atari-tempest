# JS Project Proposal: Atari Tempest

## Background

Tempest is a vector-based 1981 arcade game produced by Atari. The player controls a crab-shaped blaster that crawls along the edge of a three-dimensional tube, moving from segment to segment. Enemies come up the tube and try to shoot the blaster, but can also be shot.
-	There are 105 or 112 possible X positions for the blaster, depending on the level
   - 	The blaster has 7 increments within each segment
   - Each level has 15 or 16 segments
-	There are 5 possible X positions and 120 possible depth Z positions for each enemy
   - The flipper has 5 possible X positions within each segment
   - Each level has 15 or 16 segments
-	There are 15/16 possible X positions and 24 possible Z positions for each blaster bullet
-	There are 15/16 possible X positions and ~50 possible Z positions for each enemy bullet

Conceptually, these elements can be visualized on a simple 2D X/Z grid, but rendering will be done using vanilla DOM elements and Canvas, as the entire game consists of straight lines.

## Functionality & MVP
In Atari Tempest, users will be able to:
-	Move the blaster around a three-dimensional tube using the cursor
-	Shoot bullets at enemies coming up the tube
-	Lose a life upon contact with enemies or enemy bullets

In addition, this project will include:
-	A production README

## Wireframes

This app will consist of a single screen with game board and nav links to the Github and my LinkedIn. The game will be controlled by the mouse position (move), the left mouse button or space (fire), and the right mouse button or Z key (superzapper). Upon load, the game will simply display a ‘CLICK MOUSE’ message.

![start](https://raw.githubusercontent.com/ygdanchoi/atari-tempest/master/docs/start.PNG)

![start](https://raw.githubusercontent.com/ygdanchoi/atari-tempest/master/docs/tube.PNG)

## Architecture and Technologies

This project will be implemented with the following technologies:
-	JavaScript for game logic
-	Canvas for rendering lines
-	Browserify for bundling js files

In addition to the entry file, there will be the following scripts involved in this project:
-	game.js: this script will handle the logic for creating and updating the blaster, enemies, and bullets and rendering them to the DOM.
-	game_view.js: this script will render the game tube and HUD (lives, score)
-	blaster.js: this script will contain the constructor and update functions for the Blaster object, inheriting from MovingObject
-	blaster_bullet.js: this script will contain the constructor and update functions for the BlasterBullet object, inheriting from MovingObject
-	flipper.js: this script will contain the constructor and update functions for the Flipper enemy object, inheriting from MovingObject
-	flipper_bullet.js: this script will contain the constructor and update functions for the Flipper bullet object, inheriting from MovingObject
-	util.js: this script will contain functions for any mathematical calculations necessary for rendering

## Implementation Timeline
-	Day 1: Setup all necessary Node modules, get Canvas installed, and render a rudimentary tube. Make the tube aware of which segment is mouse hovered over, and make the game aware of mouse clicks and keypresses. Goals:
   - Get a green bundle with Browserify
   - Learn enough Canvas to render a 3D grid with 16 sections
   - Attach a mouse-over listener to get the tube section and position
-	Day 2: Dedicate this day to mastering Canvas in order to render functioning Blaster and Blaster bullets. Also render rudimentary enemies. Goals:
   - Complete the blaster.js and blaster_bullet.js modules.
   - Render the blaster section lines as a different color, and start working on a fully-rendered blaster at the edge.
   - Render a bullet that moves all the way down the tube.
   - Render a flipper that doesn’t necessary move around, but can be destroyed upon collision with a bullet.
-	Day 3: Dedicate this day to making the enemies function, and make the game progress to different levels for when all enemies are eliminated.
   - Complete the flipper.js and flipper_bullet.js modules.
   - Make flippers come up the tube, and then flip around the edge if not destroyed while in the tube. Make blaster die upon contact with a flipper.
   - Make flippers shoot bullets that can be destroyed by blaster bullets. Make blaster die upon contact with a blaster bullet.
   - When all flippers are eliminated, progress to a new level.
   - Update the score based on flippers shot down.
   - End the game after all lives are depleted.
- Bonus:
   - Make different shapes of tubes for different levels.
   - Make a sensible splash screen.
   - Add sound effects.
   - Make different types of enemies.
   - Add a level selector.
   - Make the level transition animated.
   - Integrate the Surface Dial as a control method.
