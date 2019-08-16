/**
 * Create a new tile on grid
 */
function createTile(x, y, type) {
    x = typeof x !== 'undefined' ? x : Math.floor(GRID_WIDTH / 2);
    y = typeof y !== 'undefined' ? y : GRID_HEIGHT - 1;
    type = typeof type !== 'undefined' ? type : nextTileType;
    
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
    return currentTile;
}

/**
 * Defines the type of the next tile for preview
 */
function setNextTileType(forcedType) {
    // Blocking tile
    if(typeof forcedType !== 'undefined') {
        nextTileType = forcedType;
    } else if(Math.random() <= 0.08) {
        nextTileType = 0;
    } else {
        nextTileType = Math.ceil(Math.random() * TILE_NUMBER);
    }

    $nextTile.innerHTML = '';
    var tile = document.createElement('p');
    tile.classList.add('tile');
    tile.classList.add('tile-' + nextTileType);
    $nextTile.append(tile);
}

/**
 * Updates tile position
 */
function setTilePosition(tile) {
    tile.tile.style.left = (tile.x * TILE_SIZE) + 'px';
    tile.tile.style.top = ((GRID_HEIGHT - tile.y - 1) * TILE_SIZE) + 'px';
}

/**
 * Change the tile type, once per tile, to previous tile type.
 */
function updateCurrentTileType() {
    currentTile.tile.classList.remove(`tile-${currentTile.type}`);
    currentTile.type -= 1;
    currentTile.hasChanged = true;
    currentTile.tile.classList.add(`tile-${currentTile.type}`);
}

/**
 * Moves current tile
 */
function moveTile() {
    setTilePosition(currentTile);
    // Checks collision
    if(currentTile.y <= 0 || grid[currentTile.x][currentTile.y - 1] !== null) {
        if(currentTile.y >= GRID_HEIGHT) {
            gameOver();
        }

        setTileOnGrid(currentTile)
        shakeScreen();
        isGamePerformingAnimation = true;
        flickerTile(currentTile).then(() => {
            checkComboLineCompletion(currentTile).then(() => {
                createTile();
                setNextTileType();
                isGamePerformingAnimation = false;
            });
        });
    }
}

function setTileOnGrid(tile) {
    grid[tile.x][tile.y] = tile.type;
    tile.tile.setAttribute('data-x', tile.x);
    tile.tile.setAttribute('data-y', tile.y);
}

/**
 * Shakes the screen when tile touch the floor, depending of speed
 */
function shakeScreen() {
    $grid.classList.remove('added-tile-speed');
    $grid.classList.remove('added-tile');
    void $grid.offsetWidth; // Triggers a reflow
    $grid.classList.add(isMovingDown ? 'added-tile-speed' : 'added-tile');
}

async function flickerTile(tile) {
    tile.tile.classList.add(isLineCompleted(tile) ? 'added-tile-success': 'added-tile');
    await wait(500);
}

/**
 * Sets the animation of line removing
 */
function showRemoveLineAnimation() {
    var tileIndex = 0;
    for (var x = 0; x < GRID_WIDTH; ++x) {
        for (var y = 0; y < GRID_HEIGHT; ++y) {    
            if(adjacentTileList.indexOf(x + '-' + y) >= 0) {
                var $tile = document.querySelector(`.tile[data-x="${x}"][data-y="${y}"]`);
                $tile.style.transitionDelay = `${++tileIndex / (adjacentTileList.length + 1)}s`;
                $tile.classList.add('removed');
                var $rotate = (Math.round(Math.random()) * 2 - 1) * (Math.random() * 10 + 7);
                $tile.style.transformOrigin = `${-($rotate * 10 + 50)}px center`;
                $tile.style.transform = `rotate(${$rotate}deg)`;
            }
        }
    }
}