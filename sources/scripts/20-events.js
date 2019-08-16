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

window.addEventListener('resize', function(k) {
    checkSize();
});