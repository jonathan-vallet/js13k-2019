/**
 * Create a new tile on grid
 */
function createTile() {
    var x = Math.floor(GRID_WIDTH / 2);
    var y = GRID_HEIGHT - 1;
    var max = 4;
    var type = Math.floor(Math.random() * (max));
    var tile = document.createElement('p');
    tile.classList.add('tile');
    tile.classList.add('tile-' + type);
    $grid.appendChild(tile);
    currentTile = {
        tile,
        x,
        y,
        type,
        hasChanged: false
    };
    setTilePosition(currentTile);
}

function setTilePosition(tile) {
    tile.tile.style.left = (tile.x * TILE_SIZE) + 'px';
    tile.tile.style.top = ((GRID_HEIGHT - tile.y - 1) * TILE_SIZE) + 'px';
}

function updateCurrentTileType() {
    currentTile.tile.classList.remove(`tile-${currentTile.type}`);
    currentTile.type -= 1;
    currentTile.hasChanged = true;
    currentTile.tile.classList.add(`tile-${currentTile.type}`);
}

/**
 * Moves current tile
 */
function downCurrentTile() {
    currentTile.y -= 1;
    moveTile();
}

/**
 * Moves current tile
 */
function moveTile() {
    setTilePosition(currentTile);
    // Checks collision
    if(currentTile.y <= 0 || grid[currentTile.x][currentTile.y - 1] !== null) {
        console.log(currentTile.y);
        if(currentTile.y >= GRID_HEIGHT) {
            gameOver();
        }

        grid[currentTile.x][currentTile.y] = currentTile.type;
        currentTile.tile.setAttribute('data-x', currentTile.x);
        currentTile.tile.setAttribute('data-y', currentTile.y);
        checkLineCompletion();
        createTile();
    }
}
