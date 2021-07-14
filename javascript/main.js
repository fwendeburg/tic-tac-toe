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
    const boardContainer = document.querySelector('.board-container');
    const playerMenu = document.querySelector('.menu-wrapper');
    const _tiles = document.querySelectorAll('.tile');
    const gameInfo = document.querySelector('.game-info');

    const playerOneSelectBtn = document.querySelectorAll('.player1');
    playerOneSelectBtn.forEach(btn => btn.addEventListener('click', function(e) {
        showPlayerSelection(e.target, playerOneSelectBtn);
    }));

    const playerTwoSelectBtn = document.querySelectorAll('.player2');
    playerTwoSelectBtn.forEach(btn => btn.addEventListener('click', function(e) {
        showPlayerSelection(e.target, playerTwoSelectBtn);
    }));

    const openPlayerSelec = document.querySelector('#open-player-selection');
    openPlayerSelec.addEventListener('click', openSelectionMenu);

    function openSelectionMenu() {
        boardContainer.classList.add('hidden');
        playerMenu.classList.remove('hidden');
    }
     
    function showPlayerSelection(selectedBtn, btnNodeList) {
        for (let i = 0; i < btnNodeList.length; i++) {
            if (btnNodeList[i].classList.contains('selected-player')) {
                btnNodeList[i].classList.remove('selected-player');
            }
        }

       selectedBtn.classList.add('selected-player');
    }

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

    const updateGameInfo = (text) => {
        gameInfo.textContent = text;
    }

    const toggleGameInfoClass = (cssClass, action) => {
        if (action === 'toggle') {
            gameInfo.classList.toggle(cssClass);
        }
        else if (action === 'add') {
            gameInfo.classList.add(cssClass);
        }
        else if (action === 'remove') {
            gameInfo.classList.remove(cssClass);
        }
    }

    const togglePlayerMenu = () => {
        playerMenu.classList.add('hidden');
        boardContainer.classList.remove('hidden');
    }

    return {displayAllBoard, displayBoardElement, updateGameInfo,
            toggleGameInfoClass, togglePlayerMenu};
})()

const Player = (name, symbol) => {
    let playerSymbol = symbol;
    let playerName = name;

    const getSymbol = () => {
        return playerSymbol;
    }

    const getName = () => {
        return playerName;
    }

    return {
        getSymbol,
        getName
    }
}

const GameFlow = (function() {
    let playerOne;
    let playerTwo;
    let playerOneTurn = true;
    let winner = '';

    const _resetBoardBtn = document.querySelector('#restart');
    _resetBoardBtn.addEventListener('click', restartGame);

    const _tiles = document.querySelectorAll('.tile');
    _tiles.forEach(tile => tile.addEventListener('click', getPlayerMovement));

    const startGameBtn = document.querySelector('#start');
    const playerOneSelectBtn = document.querySelectorAll('.player1');
    const playerTwoSelectBtn = document.querySelectorAll('.player2');
    startGameBtn.addEventListener('click', getPlayerSelection);

    function getPlayerSelection() {
        for (let i = 0; i < playerOneSelectBtn.length; i++) {
            if (playerOneSelectBtn[i].classList.contains('selected-player')) {
                playerOne = Player(playerOneSelectBtn[i].id, 'X');
            }
        }

        for (i = 0; i < playerTwoSelectBtn.length; i++) {
            if (playerTwoSelectBtn[i].classList.contains('selected-player')) {
                playerTwo = Player(playerTwoSelectBtn[i].id, 'O');
            }
        }

        DisplayController.togglePlayerMenu();

        GameFlow.restartGame();
    }

    function restartGame() {
        GameBoard.resetBoard();
        DisplayController.displayAllBoard(GameBoard.getBoard());

        playerOneTurn = true;
        winner = '';

        DisplayController.toggleGameInfoClass('show-tie', 'remove');
        DisplayController.toggleGameInfoClass('show-winner', 'remove');
        DisplayController.updateGameInfo(`Player ${playerOneTurn? playerOne.getSymbol(): playerTwo.getSymbol()
            }'s turn`);
    }

    function getPlayerMovement(e) {
        let ij = e.target.id.split('');

        if (!GameBoard.isPositionOcupied(ij[0], ij[1]) && winner == '') {
            GameBoard.populateBoard(ij[0], ij[1], playerNextTurn);
            DisplayController.displayBoardElement(ij[0], ij[1], playerNextTurn);

            changePlayerTurn();
        }

        if (checkWinDiagonal(playerPastTurn) || checkWinHorizontal(playerPastTurn) ||
            checkWinVertical(playerPastTurn)) winner = playerPastTurn;
    
        if (winner != '') {
            DisplayController.updateGameInfo(`${playerPastTurn} won the game`);
            DisplayController.toggleGameInfoClass('show-winner', 'add');
        }
        else if (GameBoard.isBoardComplete()) {
            DisplayController.updateGameInfo('It´s a draw!');
            DisplayController.toggleGameInfoClass('show-tie', 'add');
        }
    }

    function changePlayerTurn() {
        playerPastTurn = playerNextTurn;

        if (playerPastTurn === playerOne.getPlayer()) {
            playerNextTurn = playerTwo.getPlayer();
        }
        else {
            playerNextTurn = playerOne.getPlayer();
        }

        DisplayController.updateGameInfo(`Player ${playerNextTurn}'s turn`);
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

    return {restartGame};
})()

const Bot = (function() {
    const easyBotPlay = () => {
        let isPosValid = false;
        let posI;
        let posJ;

        while(!isPosValid) {
            posI = Math.floor(Math.random() * 3);
            posJ = Math.floor(Math.random() * 3);

            if (!GameBoard.isPositionOcupied(posI, posJ)) {
                isPosValid = true;
            }
        }
        
        return [posI, posJ];
    }

    return {easyBotPlay}
})()