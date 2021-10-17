function minimax(board, depth, isMaxPlayer) {
    if (GameFlow.getWinner(board) !== null) {
        return GameFlow.getWinner(board);
    }

    let bestScore = isMaxPlayer? -Infinity : Infinity;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {   
            if (!GameBoard.isPositionOcupied(i, j)) {
                if (isMaxPlayer) {
                    let score = minimax(board, depth + 1, false);
                    bestScore = max(score, bestScore);
                }
                else {
                    let score = minimax(board, depth + 1, true);
                    bestScore = min(score, bestScore);
                }
            }
        }
    }

    return bestScore;
}

const hardBotPlay = () => {
    let isMaxPlayer = GameFlow.getPlayerOneTurn(); // 'X' is playerOne so if it is playerOne's turn it's maximizing.
    let playerSymbol = isMaxPlayer? GameFlow.getPlayerOne().getSymbol() :  GameFlow.getPlayerTwo().getSymbol();
    let boardCopy = GameBoard.getBoard();

    let bestScore = isMaxPlayer? -Infinity : Infinity;
    let posI, posJ;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {   
            boardCopy = GameBoard.getBoardCopy();
            if (!GameBoard.isPositionOcupied(i, j)) {
                boardCopy[i][j] = playerSymbol;

                let score = minimax(boardCopy, 0, isMaxPlayer);
                
                if (score > bestScore) {
                    bestScore = score;
                    posI = i;
                    posJ = j;
                }
            }
        }
    }

    GameBoard.populateBoard(posI, posJ, `${playerOneTurn? playerOne.getSymbol() :
        playerTwo.getSymbol()}`);
    DisplayController.displayBoardElement(posI, posJ, `${playerOneTurn? playerOne.getSymbol() :
        playerTwo.getSymbol()}`);

    GameFlow.togglePlayerOneTurn();
    GameFlow.playGame();    
}
