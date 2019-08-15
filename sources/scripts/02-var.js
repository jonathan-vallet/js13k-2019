// Set your global var here
var $ = function( id ) { return document.getElementById( id ); };

var TILE_SIZE = 20;
var TILE_NUMBER = 4;

var $grid = $('grid');
var grid = {};
var currentTile;
var GRID_HEIGHT = 20;
var GRID_WIDTH = 10;

var isgameOver = false; // Checks if game is over
var isMovingDown = false;

var lastDownTime = 0;
var downSpeedDelay = 200; // timer before tile going down
var downAcceleratedSpeedDelay = 75; // timer before tile going down when speed is increased
var score = 0;
var $score = $('score');