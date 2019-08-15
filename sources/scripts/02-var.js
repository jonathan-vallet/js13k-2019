// Set your global var here
var $ = function( id ) { return document.getElementById( id ); };

var TILE_SIZE = 40;
var MAX_TILE_NUMBER = 4;
var TILE_NUMBER = 2;

// Elements
var $grid = $('grid');
var $score = $('score');
var $tileList = $('tile-list');
var $nextTile = $('next-tile');

var grid = {}; // The grid content with list of tiles
var adjacentTileList = []; // Used when checking line completion, list of adjacent tiles
var currentTile; // The current tile played
var nextTileType; // Preview of next tile type
var GRID_HEIGHT = 20;
var GRID_WIDTH = 10;

var isgameOver = false; // Checks if game is over
var isMovingDown = false;

var lastDownTime = 0;
var downSpeedDelay = 200; // timer before tile going down
var downAcceleratedSpeedDelay = 75; // timer before tile going down when speed is increased
var score = 0;

var isGamePaused = false; // Pause set by player
var isGamePerformingAnimation = false; // Pause forced by game during animations