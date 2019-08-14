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