// Set your global var here
var $ = function( id ) { return document.getElementById( id ); };

const TILE_SIZE = 40;
const MAX_TILE_NUMBER = 9;
var SCORE_STEP_MULTIPLIER = 250;
var TILE_NUMBER = 2;
var GRID_HEIGHT = 20;
var GRID_WIDTH = 11;

const TUTORIAL_GRID = {
    '0-0': 2,
    '1-0': 1,
    '2-0': 0,
    '3-0': 2,
    '4-0': 2,
    '5-0': 2,
    '6-0': 1,
    '7-0': 1,
    '8-0': 2,
    '8-0': 2,
    '9-0': 2,
    '0-1': 1,
    '1-1': 2,
    '2-1': 1,
    '3-1': 0,
    '4-1': 1,
    '5-1': 1,
    '6-1': 2,
    '7-1': 2,
    '8-1': 1,
    '8-1': 1,
    '9-1': 1,
    '2-2': 2,
    '0-2': 3,
    '1-2': 3,
    '4-2': 0,
    '5-2': 0,
    '4-3': 1,
    '5-3': 2,
};

// Elements
var $game = $('game');
var $grid = $('grid');
var $score = $('score');
var $tileList = $('tile-list');
var $nextTile = $('next-tile');
var $play = $('menu-play');
var $restart = $('menu-restart');
var $resume = $('menu-resume');
var $tutorialLink = $('menu-tutorial');
var $ghost = $('ghost');
var $lineScore = $('line-score');

var isGameStarted = false;
var grid = {
}; // The grid content with list of tiles
var adjacentTileList = []; // Used when checking line completion, list of adjacent tiles
var currentTile; // The current tile played
var nextTileType; // Preview of next tile type

var isgameOver = false; // Checks if game is over
var isMovingDown = false;
var isMovingLeft = false;
var isMovingRight = false;

var lastDownTime = 0;
var lastMoveTime = 0;
var downSpeedDelay = 800; // timer before tile going down
var moveSpeedDelay = 100;
var downAcceleratedSpeedDelay = 75; // timer before tile going down when speed is increased
var score = 0;

var isGamePaused = true; // Pause set by player
var isGamePerformingAnimation = false; // Pause forced by game during animations