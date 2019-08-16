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
function startGame() {
    //playMusic();
    initGrid();
    initKeys();
    $score.innerText = 0;
    updateAvailableTileList();
    setNextTileType();
    createTile();
    loop();
}

function pauseGame() {
    isGamePaused = true;
    document.body.classList.add('paused');
}

function unpauseGame() {
    isGamePaused = false;
    document.body.classList.remove('paused');
}

function initKeys() {
    $play.addEventListener('click', () => {
    });

    document.onkeydown = function(e) {
        switch (e.which) {
            case 37: // Left
                if(currentTile.x <= 0 || grid[currentTile.x - 1][currentTile.y] !== null) {
                    return;
                }
                isMovingLeft = true;
                break;
            case 39: // Right
                if(currentTile.x + 1 >= GRID_WIDTH || grid[currentTile.x + 1][currentTile.y] !== null) {
                    return;
                }
                isMovingRight = true;
                break;
            case 38: // Top
                // Tile can change once and not from starter form
                if(currentTile.hasChanged || currentTile.type <= 1) {
                    return; 
                }
                updateCurrentTileType();
                break;
            case 40: // Bottom
                isMovingDown = true;
                break;

            case 32: // Bottom
                if(isGamePaused) {
                    unpauseGame();
                } else {
                    pauseGame();
                }
                break;
            }
    };
    document.onkeyup = function(e) {
        switch (e.which) {
            case 37: // Left
                isMovingLeft = false;
                lastMoveTime = 0;
                break;
            case 39: // Right
                isMovingRight = false;
                lastMoveTime = 0;
                break;
            case 40: // Down
                isMovingDown = false;
                break;
        }
    }
}

function initGrid() {
    $grid.style.width = (GRID_WIDTH * TILE_SIZE) + 'px';
    $grid.style.height = (GRID_HEIGHT * TILE_SIZE) + 'px';
    $tileList.style.height = (GRID_HEIGHT * TILE_SIZE) + 'px';
    for (var x = 0; x < GRID_WIDTH; ++x) {
        grid[x]=[];
        for (var y = 0; y < GRID_HEIGHT; ++y) {    
            grid[x][y] = null;
        }
    }
}

function checkLineCompletion(tile, resolve) {
    // Resets adjacent tile list
    adjacentTileList = [];
    adjacentTileList.push(tile.x + '-' + tile.y);
    getAdjacentTiles(tile.x, tile.y, tile.type);

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

    // Line is completed
    if(isEndJoined && isStartJoined) {
        // Removes all line tiles
        isGamePerformingAnimation = true;
        showRemoveLineAnimation();

        setTimeout(() => {
            removeLine();
            updateTilesPosition();
            updateScore(tile.type);
    
            // Checks is another line is ended after having removed first one
            // As a line must be completed, just checks first column tiles
            for (var y = 0; y < GRID_HEIGHT; ++y) {
                // Ignores empty and blocking tiles (cannot be completed as second tile)
                if(grid[0][y] !== null && grid[0][y] !== 0) {
                    checkLineCompletion({
                        x: 0,
                        y,
                        type: grid[0][y]
                    })
                }
            }
            isGamePerformingAnimation = false;
        }, 1000);
    } else {
        if(resolve) {
            resolve();
        }
    }
}

function updateScore(tileType) {
    var tileBaseScore = Math.max(1, tileType); // For blockers, uses square scoer instead of 0
    score += 5 * adjacentTileList.length * GRID_WIDTH * tileBaseScore; 
    $score.innerText = score;
    var newTileNumber = Math.min(MAX_TILE_NUMBER, Math.floor(score / 750) + 2);
    if(newTileNumber > TILE_NUMBER) {
        TILE_NUMBER = newTileNumber;
        updateAvailableTileList();
    } 
}

function updateAvailableTileList() {
    $tileList.innerHTML = '';
    for(var index = 0; index <= TILE_NUMBER; ++index) {
        var tile = document.createElement('p');
        tile.classList.add('tile');
        tile.classList.add('tile-' + index);
        $tileList.append(tile);
    }
}

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
    if(!isGamePaused && !isGamePerformingAnimation) {
        var now = Date.now();
        var speed = isMovingDown ? downAcceleratedSpeedDelay : downSpeedDelay;
        if(!lastMoveTime || now - lastMoveTime >= moveSpeedDelay) {
            lastMoveTime = now;
            if(isMovingLeft) {
                if(currentTile.x <= 0 || grid[currentTile.x - 1][currentTile.y] !== null) {
                } else {
                    currentTile.x -=1;
                    moveTile();
                }
            } else if(isMovingRight) {
                if(currentTile.x + 1 >= GRID_WIDTH || grid[currentTile.x + 1][currentTile.y] !== null) {
                } else {
                    currentTile.x +=1;
                    moveTile();
                }
            }
        }
        if(!lastDownTime || now - lastDownTime >= speed) {
            lastDownTime = now;
            downCurrentTile();
        }
    }

    if(!isgameOver) {
        requestAnimationFrame(loop);
    }
}

// Let's the game start!
startGame();