import { removeListener } from "cluster";

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
            case 37:
                if(currentTile.x <= 0 || grid[currentTile.y][currentTile.x - 1] !== null) {
                    return;
                }
                currentTile.x -=1;
                moveTile();
                break;
            case 39:
                if(currentTile.x > GRID_WIDTH || grid[currentTile.y][currentTile.x + 1] !== null) {
                    return;
                }
                currentTile.x +=1;
                moveTile();
                break;
        }
    };
}

function initGrid() {
    for (var y = 0; y < GRID_HEIGHT; ++y) {    
        grid[y]=[];

        for (var x = 0; x < GRID_WIDTH; ++x) {
            grid[y][x] = null;
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

    if(isEndJoined && isStartJoined) {
        console.log('line complete!!');
        removeLine();
    }
}

function removeLine() {
    for (var y = 0; y < GRID_HEIGHT; ++y) {    
        for (var x = 0; x < GRID_WIDTH; ++x) {
            if(adjacentTileList.indexOf(x + '-' + y) >= 0) {
                grid[y][x] = null;
                document.querySelector(`.tile[data-x="${x}"][data-y="${y}"]`).remove();
            }
        }
    }
}

function checkTile(tileX, tileY, type) {
    // Checks tiles around
    var minX = Math.max(tileX - 1, 0);
    var maxX = Math.min(tileX + 1, GRID_WIDTH);
    var minY = Math.max(tileY - 1, 0);
    var maxY = Math.min(tileY + 1, GRID_HEIGHT - 1);
    for(var x = minX; x <= maxX; ++x) {
        for(var y = minY; y <= maxY; ++y) {
            // Ignores current tile and already checked matching tiles
            if(adjacentTileList.indexOf(x + '-' + y) >= 0) {
                continue;
            }

            if(grid[y][x] === type) {
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