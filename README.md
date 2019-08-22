# JS13K 2019

This repository allow you to quick start your JS13K project to develop, compile, minify and zip you JS13K project.

Uses adfab-gulp-boilerplate to compile sass or less, concat you JS, minify your assets...with additional tasks to zip and improve minification

[You can play the game here thanks to the GitHub Pages](https://jonathan-vallet.github.io/js13k-2018/index.html).

## Installing

Run `npm install` in the project directory to install all needed packages.

## Compile game

`gulp` to compile your files

Project will be generated in `/www` folder.

## Generate final game

run `gulp --production && gulp zip`

Your game.zip file will be generated in `/dist` folder.

## TODO list

### Gameplay

* Add monetisation
* Add customize game options (speed, ghost on/off, grid size...) for accessibility
* Improve shape unlock with score
* Improve randomization (increase chances if player has a line almost completed)

### UI

* Improve resize, add mobile support and orientation detection
* Correctly hide/display elements when game not started

### "Juice"

* Improve effect when tile go on floor
* Improve effect for line completion and combos
* Add visual effect for scoring when line is completed
* Improve visual effect when a new tile is available
* Add animation for next tile/tile go on screen
* Add animations on game start

### Sound
* Add SFX when tile move, is set on floor, speed up, line completed...
* Add SFX for buttons click/hover?
* Add global music

### Bonus

* Remove one kind of blocks
* Make a tile back to previous tile
* Remove a line
