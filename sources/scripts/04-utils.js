// Utils functions

/**
 * Checks the size of screen to simulate a "conain" size for all elements
 */
function checkSize() {
    var ww = window.innerWidth;
    var wh = window.innerHeight;

    var GAME_WIDTH = 800;
    var GAME_HEIGHT = 800;

    var scaleX = GAME_WIDTH / ww;
    var scaleY = (GAME_HEIGHT + 100) / wh;
    var gameScale = Math.min(1.2, 1 / Math.max(scaleX, scaleY));

    $game.style.webkitTransform = $game.style.transform = 'scale(' + gameScale + ')';
}