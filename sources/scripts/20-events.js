function initKeys() {
    $play.addEventListener('click', () => {
        startGame();
        unpauseGame();
    });

    $restart.addEventListener('click', () => {
        startGame();
        unpauseGame();
    });
    
    $resume.addEventListener('click', () => {
        unpauseGame();
    });

    $tutorialStart.addEventListener('click', () => {
        document.body.classList.remove('tutorial');
        unpauseGame();
    });

    $('game-over-restart').addEventListener('click', () => {
        document.body.classList.remove('game-over');
        isgameOver = false;
        TILE_NUMBER = 3;
        startGame();
    });
    
    $tutorialLink.addEventListener('click', () => {
        startGame(true);
        document.body.classList.add('tutorial');
    });

    $('touch-down').addEventListener('touchstart', () => {
        isMovingDown = true;
    });
    $('touch-down').addEventListener('touchend', () => {
        isMovingDown = false;
    });

    $('touch-up').addEventListener('touchstart', () => {
        // Tile can change once and not from starter form
        if(currentTile.hasChanged || currentTile.type <= 1 || isGamePaused) {
            return; 
        }
        updateCurrentTileType();
    });
    $('touch-left').addEventListener('touchstart', () => {
        if(currentTile.x <= 0 || grid[currentTile.x - 1][currentTile.y] !== null) {
            return;
        }
        isMovingLeft = true;
    });
    $('touch-left').addEventListener('touchend', () => {
        isMovingLeft = false;
    });

    $('touch-right').addEventListener('touchstart', () => {
        if(currentTile.x + 1 >= GRID_WIDTH || grid[currentTile.x + 1][currentTile.y] !== null) {
            return;
        }
        isMovingRight = true;
    });
    $('touch-right').addEventListener('touchend', () => {
        isMovingRight = false;
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
                if(currentTile.hasChanged || currentTile.type <= 1 || isGamePaused) {
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

window.addEventListener('resize', function(k) {
    checkSize();
});