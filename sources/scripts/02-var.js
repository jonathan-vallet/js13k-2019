// Set your global var here
var $ = function( id ) { return document.getElementById( id ); };

var TILE_SIZE = 20;

var $grid = $('grid');
var grid = {};
var currentTile;
var GRID_HEIGHT = 25;
var GRID_WIDTH = 15;

var isgameOver = false; // Checks if game is over
