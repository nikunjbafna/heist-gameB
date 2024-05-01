function handleGameState() {
    if (shared.gameState === "intro") {
        drawIntroScreen();
    }
    if (shared.gameState === "playing") {
        drawPlayScreen();
        // background("#FF0000");
    }
}

function drawIntroScreen() {

}

function drawPlayScreen() {
    connector();

    playerStates();

    movement();

    if (kb.presses('space')) {
        swapTurns();
    };

    patrol();

}