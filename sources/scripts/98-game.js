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
    console.log('game starting!');
    //playMusic();
    initGrid();
    initKeys();
    createTile();
    loop();
}

function initKeys() {
    document.onkeydown = function(e) {
        switch (e.which) {
            case 37: // Left
                if(currentTile.x <= 0 || grid[currentTile.x - 1][currentTile.y] !== null) {
                    return;
                }
                currentTile.x -=1;
                moveTile();
                break;
            case 39: // Right
                console.log(GRID_WIDTH, currentTile.x)
                if(currentTile.x + 1 >= GRID_WIDTH || grid[currentTile.x + 1][currentTile.y] !== null) {
                    return;
                }
                currentTile.x +=1;
                moveTile();
                break;
            case 38: // Top
                // Tile can change once and not from starter form
                console.log(currentTile);
                if(currentTile.hasChanged || currentTile.type <= 1) {
                    return; 
                }
                updateCurrentTileType();
                break;
            case 40: // Bottom
                downCurrentTile();
                break;
        }
    };
}

function initGrid() {
    $grid.style.width = (GRID_WIDTH * TILE_SIZE) + 'px';
    $grid.style.height = (GRID_HEIGHT * TILE_SIZE) + 'px';
    for (var x = 0; x < GRID_WIDTH; ++x) {
        grid[x]=[];
        for (var y = 0; y < GRID_HEIGHT; ++y) {    
            grid[x][y] = null;
        }
    }
}

var adjacentTileList = [];
function checkLineCompletion() {
    // Resets adjacent tile list
    adjacentTileList = [];
    adjacentTileList.push(currentTile.x + '-' + currentTile.y);
    checkTile(currentTile.x, currentTile.y, currentTile.type);
    console.log('line checked!', adjacentTileList);

    // Check is adjacent tile list is from start to end
    var isStartJoined = false;
    var isEndJoined = false;
    adjacentTileList.forEach(function (value) {
        var x = Number(value.split('-')[0]);
        if(x === 0) {
            isStartJoined = true;
            console.log('isStartJoined');
        } else if(x === GRID_WIDTH - 1) {
            isEndJoined = true;
            console.log('isEndJoined');
        }
    });

    // Line is completed
    if(isEndJoined && isStartJoined) {
        // Removes all line tiles
        removeLine();
        // Updates other tiles positions
        for (var x = 0; x < GRID_WIDTH; ++x) {
            for (var y = 0; y < GRID_HEIGHT; ++y) {    
                // Checks if cell is not empty and not a blocking tile
                if(grid[x][y] !== null && grid[x][y] !== 0) {
                    console.log('tile found in', x, y, grid[x][y]);
                    var tileY = y;
                    while (tileY > 0 && grid[x][tileY - 1] === null) {
                        var tile = document.querySelector(`.tile[data-x="${x}"][data-y="${tileY}"]`);
                        console.log('move tile', tile, x, tileY - 1);
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

function checkTile(tileX, tileY, type) {
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
                checkTile(x, y, type);
            }
        }
    }
}


function gameOver() {
    isgameOver = true;
}

var last = 0;
var requiredElapsed = 200; // desired interval is 10fps.

/*
 * Game loop
 */
function loop() {
    var now = Date.now();
    if(!last || now - last >= requiredElapsed) {
        last = now;
        downCurrentTile();
    }

    if(!isgameOver) {
        requestAnimationFrame(loop);
    }
}

// Let's the game start!
startGame();