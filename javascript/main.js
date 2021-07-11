const GameBoard = (function() {
    let _board = [['', '', ''], 
                  ['', '', ''], 
                  ['', '', '']];

    const getBoard = () => {
        return _board;
    }

    const resetBoard = () => {
        _board = [['', '', ''], ['', '', ''], ['', '', '']];
    }

    const populateBoard = function(i, j, symbol) {
        _board[i][j] = symbol;
    }

    const isBoardComplete = function() {
        let counter = 0;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (_board[i][j] != '') counter++;
            }
        }

        return (counter === 9) ? true : false;
    }

    const isPositionOcupied = (i, j) => {
        return (_board[i][j] != '') ? true : false;
    }

    return {
        getBoard,
        resetBoard,
        populateBoard,
        isBoardComplete,
        isPositionOcupied
    }
})()

const DisplayController = (function() {
    const _tiles = document.querySelectorAll('.tile');

    const displayAllBoard = (board) => {
        let counter = 0;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                _tiles[counter].textContent = board[i][j];

                counter++;
            }
        }
    }

    const displayBoardElement = (i, j, symbol) => {
        for (let k = 0; k < _tiles.length; k++) {
            if (_tiles[k].id == i.toString()+j.toString()) {
                _tiles[k].textContent = symbol;
            }
        } 
    }

    const showWinner = (symbol) => {
        alert(`${symbol} has won`)
    }

    return {displayAllBoard, displayBoardElement, showWinner};
})()

const Player = (symbol) => {
    let playerSymbol = symbol;

    const getPlayer = () => {
        return playerSymbol;
    }

    return {
        getPlayer
    }
}

const GameFlow = (function() {
    let playerOne = Player('X');
    let playerTwo = Player('O');
    let playerNextTurn = playerOne.getPlayer();
    let playerPastTurn = '';
    let winner = '';

    const _resetBoardBtn = document.querySelector('.restart');
    _resetBoardBtn.addEventListener('click', restartGame);

    const _tiles = document.querySelectorAll('.tile');
    _tiles.forEach(tile => tile.addEventListener('click', getPlayerMovement));

    function restartGame() {
        GameBoard.resetBoard();
        DisplayController.displayAllBoard(GameBoard.getBoard());
    }

    function getPlayerMovement(e) {
        let ij = e.target.id.split('');

        if (!GameBoard.isPositionOcupied(ij[0], ij[1])) {
            GameBoard.populateBoard(ij[0], ij[1], playerNextTurn);
            DisplayController.displayBoardElement(ij[0], ij[1], playerNextTurn);

            changePlayerTurn();
        }

        if (checkWinDiagonal(playerPastTurn) || checkWinHorizontal(playerPastTurn) ||
            checkWinVertical(playerPastTurn)) winner = playerPastTurn;
    
        if (winner != '') {
            DisplayController.showWinner(playerPastTurn);
            restartGame();
        }
        else if (GameBoard.isBoardComplete()) {
            alert("itsa tie!")
        }
    }

    function restartGame() {
        GameBoard.resetBoard();
        DisplayController.displayAllBoard(GameBoard.getBoard());

        playerNextTurn = playerOne.getPlayer();
        playerPastTurn = '';
        winner = '';
    }

    function changePlayerTurn() {
        playerPastTurn = playerNextTurn;

        if (playerPastTurn === playerOne.getPlayer()) {
            playerNextTurn = playerTwo.getPlayer();
        }
        else {
            playerNextTurn = playerOne.getPlayer();
        }
    }

    function checkWinDiagonal(player) {
        let counterMainDiag = 0;
        let counterSecondDiag = 0;
        let isThereWinner = false;

        for (let i = 0; i < 3; i++) {
            if (GameBoard.getBoard()[i][i] == player) counterMainDiag++;
        }

        for (i = 0; i < 3; i++) {
            if (GameBoard.getBoard()[2-i][i] == player) counterSecondDiag++;
        }
        
        if (counterMainDiag === 3 || counterSecondDiag === 3) {
            isThereWinner = true;
        }

        return isThereWinner;
    }

    function checkWinHorizontal(player) {
        let counter;
        let isThereWinner = false;

        for (let i = 0; i < 3; i++) {
            counter = 0;
            for (let j = 0; j < 3; j++) {
                if (GameBoard.getBoard()[i][j] === player) counter++;
            }

            if (counter === 3) {
                isThereWinner = true;
                return isThereWinner;
            }
        }

        return isThereWinner;
    }

    function checkWinVertical(player) {
        let counter;
        let isThereWinner = false;

        for (let i = 0; i < 3; i++) {
            counter = 0;
            for (let j = 0; j < 3; j++) {
                if (GameBoard.getBoard()[j][i] === player) counter++;
            }

            if (counter === 3) {
                isThereWinner = true;
                return isThereWinner;
            }
        }

        return isThereWinner;
    }
})()