/**
 * Create a new tile on grid
 */
function createTile() {
    var x = 7;
    var y = 10;
    var max = 2;
    var type = Math.floor(Math.random() * (max)) + 1;
    var tile = document.createElement('p');
    tile.classList.add('tile');
    tile.classList.add('tile-' + type);
    tile.style.left = (x * TILE_SIZE) + 'px';
    $grid.appendChild(tile);
    currentTile = {
        tile,
        x,
        y,
        type
    };
}

/**
 * Moves current tile
 */
function downCurrentTile() {
    currentTile.y += 1;
    moveTile();
}

/**
 * Moves current tile
 */
function moveTile() {
    currentTile.tile.style.top = (currentTile.y * TILE_SIZE) + 'px';
    currentTile.tile.style.left = (currentTile.x * TILE_SIZE) + 'px';

    // Checks collision
    if(currentTile.y >= GRID_HEIGHT - 1 || grid[currentTile.y + 1][currentTile.x] !== null) {
        if(currentTile.y <= 1) {
            gameOver();
        }

        grid[currentTile.y][currentTile.x] = currentTile.type;
        currentTile.tile.setAttribute('data-x', currentTile.x);
        currentTile.tile.setAttribute('data-y', currentTile.y);
        checkLineCompletion();
        createTile();
    }
}
