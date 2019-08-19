// Plays you music
/*
var audio = document.createElement("audio");
var musicplayer = new CPlayer();
musicplayer.init(song);

while (musicplayer.generate() < 1) { }
var wave = musicplayer.createWave();

audio.src = URL.createObjectURL(new Blob([wave], {type: "audio/wav"}));

function playMusic() {
    audio.play();
    audio.loop = true;
}

function stopMusic() {
    audio.pause();
}
*/

// wait function to be able to wait for animation end before continuing game
const wait = ms => new Promise((resolve) => setTimeout(resolve, ms));

function initGame() {
    //playMusic();
    checkSize();
    initGrid();
    initKeys();
}

function startGame() {
    isGameStarted = true;
    document.body.classList.remove('not-started');
    initGrid();
    $score.innerText = 0;
    updateAvailableTileList();
    setNextTileType();
    createTile();
    highlightTile(); 
    setNextTileType();
    loop();
}

function pauseGame() {
    isGamePaused = true;
    document.body.classList.add('paused');
}

function unpauseGame() {
    isGamePaused = false;
    document.body.classList.remove('paused');
    if(!isGameStarted) {
        startGame();
    }
}

function initGrid() {
    // Removes tile from DOM
    var tileList = $grid.querySelectorAll('.tile').forEach(el => el.remove());
    // Resets grid size
    $grid.style.width = (GRID_WIDTH * TILE_SIZE) + 'px';
    $grid.style.height = (GRID_HEIGHT * TILE_SIZE) + 'px';
    // Resets grid content
    for (var x = 0; x < GRID_WIDTH; ++x) {
        grid[x]=[];
        for (var y = 0; y < GRID_HEIGHT; ++y) {    
            grid[x][y] = null;
        }
    }
}

function setTutorialGrid() {
    Object.entries(TUTORIAL_GRID).forEach(([key, value]) => {
        var coordinates = key.split('-');
        grid[coordinates[0]][coordinates[1]] = value;
        var tile = createTile(coordinates[0], coordinates[1], value);
        setTileOnGrid(tile);
    });

    // Force next tile
    setNextTileType(2);
}

async function checkComboLineCompletion(tile) {
    const isLineCompleted = await checkLineCompletion(tile);
    if(isLineCompleted) {
        // Checks is another line is ended after having removed first one
        // As a line must be completed, just checks first column tiles
        for (var y = 0; y < GRID_HEIGHT; ++y) {
            // Ignores empty and blocking tiles (cannot be completed as second tile)
            if(grid[0][y] !== null && grid[0][y] !== 0) {
                await checkLineCompletion({
                    x: 0,
                    y,
                    type: grid[0][y]
                })
            }
        }
    }
}

function isLineCompleted(checkedTile) {
    // Resets adjacent tile list
    adjacentTileList = [];
    adjacentTileList.push(checkedTile.x + '-' + checkedTile.y);
    getAdjacentTiles(checkedTile.x, checkedTile.y, checkedTile.type);

    // Check is adjacent tile list is from start to end
    var isStartJoined = false;
    var isEndJoined = false;
    adjacentTileList.forEach(function (value) {
        var x = Number(value.split('-')[0]);
        if(x === 0) {
            isStartJoined = true;
        } else if(x === GRID_WIDTH - 1) {
            isEndJoined = true;
        }
    });

    return isStartJoined && isEndJoined;
}

async function checkLineCompletion(tile) {
    // Line is completed
    if(isLineCompleted(tile)) {
        // Removes all line tiles
        showRemoveLineAnimation();
        await wait(1000);
    
        removeLine(); // Removes line from grid after animation end
        updateTilesPosition();
        updateScore(tile.type);
        await wait(300);
        return true;
    }

    return false;
}

function updateScore(tileType) {
    var tileBaseScore = Math.max(1, tileType); // For blockers, uses square scoer instead of 0
    score += 5 * adjacentTileList.length * GRID_WIDTH * tileBaseScore;
    $score.classList.add('updated');
    $score.offsetWidth;
    $score.innerText = score;
    var newTileNumber = Math.min(MAX_TILE_NUMBER, Math.floor(score / 750) + 2);
    if(newTileNumber > TILE_NUMBER) {
        TILE_NUMBER = newTileNumber;
        updateAvailableTileList();
    }
//    $score.classList.remove('updated');
}

function updateAvailableTileList() {
    $tileList.innerHTML = '';
    for(var index = 0; index <= TILE_NUMBER; ++index) {
        var $tile = createTileElement(index);
        $tileList.append($tile);
    }
}

/**
 * Updates all tiles position after a complete line removed
 */
function updateTilesPosition() {
    for (var x = 0; x < GRID_WIDTH; ++x) {
        for (var y = 0; y < GRID_HEIGHT; ++y) {    
            // Checks if cell is not empty and not a blocking tile
            if(grid[x][y] !== null && grid[x][y] !== 0) {
                var tileY = y;
                // while tile under current one is empty, move the tile
                while (tileY > 0 && grid[x][tileY - 1] === null) {
                    var tile = document.querySelector(`.tile[data-x="${x}"][data-y="${tileY}"]`);
                    setTilePosition({
                        tile,
                        x: x,
                        y: tileY - 1
                    });
                    grid[x][tileY - 1] = grid[x][tileY];
                    grid[x][tileY] = null;
                    tile.setAttribute('data-y', tileY - 1);
                    --tileY;
                }
            }
        }
    }
}

function removeLine() {
    for (var x = 0; x < GRID_WIDTH; ++x) {
        for (var y = 0; y < GRID_HEIGHT; ++y) {    
            if(adjacentTileList.indexOf(x + '-' + y) >= 0) {
                grid[x][y] = null;
                document.querySelector(`.tile[data-x="${x}"][data-y="${y}"]`).remove();
            }
        }
    }
}

function getAdjacentTiles(tileX, tileY, type) {
    // Checks tiles around
    var minX = Math.max(tileX - 1, 0);
    var maxX = Math.min(tileX + 1, GRID_WIDTH - 1);
    var minY = Math.max(tileY - 1, 0);
    var maxY = Math.min(tileY + 1, GRID_HEIGHT - 1);

    for(var x = minX; x <= maxX; ++x) {
        for(var y = minY; y <= maxY; ++y) {
            // Ignores current tile and already checked matching tiles
            if(adjacentTileList.indexOf(x + '-' + y) >= 0) {
                continue;
            }

            if(grid[x][y] === type) {
                adjacentTileList.push(x + '-' + y);
                getAdjacentTiles(x, y, type);
            }
        }
    }
}


function gameOver() {
    isgameOver = true;
}

/*
 * Game loop
 */
function loop() {
    var updatePosition = false;
    if(!isGamePaused && !isGamePerformingAnimation) {
        var now = Date.now();

        // Checks movement on left or right
        if(!lastMoveTime || now - lastMoveTime >= moveSpeedDelay) {
            lastMoveTime = now;
            if(isMovingLeft) {
                if(currentTile.x <= 0 || grid[currentTile.x - 1][currentTile.y] !== null) {
                } else {
                    currentTile.x -=1;
                    updatePosition = true;
                }
            } else if(isMovingRight) {
                if(currentTile.x + 1 >= GRID_WIDTH || grid[currentTile.x + 1][currentTile.y] !== null) {
                } else {
                    currentTile.x +=1;
                    updatePosition = true;
                }
            }
        }
        
        // Checks movement down
        var downSpeed = isMovingDown ? downAcceleratedSpeedDelay : downSpeedDelay;
        if(!lastDownTime || now - lastDownTime >= downSpeed) {
            lastDownTime = now;
            currentTile.y -= 1;
            updatePosition = true;
            if(isMovingDown) {
                currentTile.tile.classList.add('speed');
            } else {
                currentTile.tile.classList.remove('speed');
            }
        }

        if(updatePosition) {
            moveTile();
            moveGhost();
        }
    }

    if(!isgameOver) {
        requestAnimationFrame(loop);
    }
}

// Let's the game start!
initGame();