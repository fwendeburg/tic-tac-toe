const GameBoard = function() {
    let board = [['', '', ''], 
                  ['', '', ''], 
                  ['', '', '']];

    const getBoard = () => {
        return board;
    }

    const resetBoard = () => {
        board = [['', '', ''], ['', '', ''], ['', '', '']];
    }

    const populateBoard = function(i, j, symbol) {
        board[i][j] = symbol;
    }

    const isComplete = function() {
        let counter = 0;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] != '') counter++;
            }
        }

        return (counter === 9) ? true : false;
    }

    const isPositionOcupied = (i, j) => {
        return (board[i][j] != '') ? true : false;
    }

    function checkWinDiagonal(player) {
        let counterMainDiag = 0;
        let counterSecondDiag = 0;
        let isThereWinner = false;

        for (let i = 0; i < 3; i++) {
            if (board[i][i] == player) counterMainDiag++;
        }

        for (i = 0; i < 3; i++) {
            if (board[2-i][i] == player) counterSecondDiag++;
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
                if (board[i][j] === player) counter++;
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
                if (board[j][i] === player) counter++;
            }

            if (counter === 3) {
                isThereWinner = true;
                return isThereWinner;
            }
        }

        return isThereWinner;
    }

    // Returns 0 if it's a tie, 1 if playerOne wins, -1 if playerTwo wins or null if there is no tie or winner.
    const getStatus = (playerOne, playerTwo) => {
        if (checkWinDiagonal(playerOne.getSymbol()) ||
                checkWinVertical(playerOne.getSymbol()) || checkWinHorizontal(playerOne.getSymbol())) {
            return 1;
        }
        else if (checkWinDiagonal(playerTwo.getSymbol()) ||
                checkWinVertical(playerTwo.getSymbol()) || checkWinHorizontal(playerTwo.getSymbol())) {
            return -1;
        }
        else if (isComplete()) {
            return 0;
        }
        else {
            return null;
        }
    }

    const getCopy = () => {
        let newBoard = [];
        let newRow;

        board.forEach(row => {
            newRow = [];

            row.forEach(place => newRow.push(place));

            newBoard.push(newRow);
        });

        return newBoard;
    }

    const setBoard = (newBoard) => {
        board = newBoard;
    }

    const removeSymbol = (i, j) => {
        board[i][j] = '';
    }

    return {
        getBoard,
        resetBoard,
        populateBoard,
        isComplete,
        isPositionOcupied,
        getStatus,
        getCopy,
        setBoard,
        removeSymbol
    }
}

const DisplayController = (function() {
    const boardContainer = document.querySelector('.board-container');
    const playerMenu = document.querySelector('.menu-wrapper');
    const tiles = document.querySelectorAll('.tile');
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

    const disableTiles = () => {
        tiles.forEach(tile => tile.classList.add('disabled'));
    }

    const enableTiles = () => {
        tiles.forEach(tile => tile.classList.remove('disabled'));  
    }

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
                tiles[counter].textContent = board[i][j];

                counter++;
            }
        }
    }

    const displayBoardElement = (i, j, symbol) => {
        for (let k = 0; k < tiles.length; k++) {
            if (tiles[k].id == i.toString()+j.toString()) {
                tiles[k].textContent = symbol;
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
            toggleGameInfoClass, togglePlayerMenu, disableTiles, enableTiles};
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
    let gameBoard = GameBoard();
    let playerOne, playerTwo;
    let isPlayerOneTurn = true;
    let winner = '';

    const resetBoardBtn = document.querySelector('#restart');
    resetBoardBtn.addEventListener('click', restartGame);

    const tiles = document.querySelectorAll('.tile');

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

        if (playerOne.getName() == 'human1' || playerTwo.getName() == 'human2') {
            tiles.forEach(tile => tile.addEventListener('click', getPlayerMovement));
            DisplayController.disableTiles();
        }

        DisplayController.togglePlayerMenu();
        restartGame();
    }

    function playGame() {
        let gameStatus = gameBoard.getStatus(playerOne, playerTwo);

        DisplayController.updateGameInfo(`Player ${isPlayerOneTurn? playerOne.getSymbol(): playerTwo.getSymbol()}'s turn`);

        if (gameStatus == null) {
            if (isPlayerOneTurn) {
                if (playerOne.getName() == 'human1') {
                    DisplayController.enableTiles();
                }
                else if (playerOne.getName() == 'boteasy1') {
                    Bot.easyBotPlay(gameBoard);
                }
                else if (playerOne.getName() == 'bothard1') {
                    Bot.hardBotPlay(gameBoard);
                }
            }
            else {
                if (playerTwo.getName() == 'human2') {
                    DisplayController.enableTiles();
                }
                else if (playerTwo.getName() == 'boteasy2') {
                    Bot.easyBotPlay(gameBoard);
                }
                else if (playerTwo.getName() == 'bothard2') {
                    Bot.hardBotPlay(gameBoard);
                }
            }
        }
        else if (gameStatus == 1) {
            winner = playerOne.getSymbol()
        }
        else if (gameStatus == -1) {
            winner = playerTwo.getSymbol();
        }
    
        if (winner != '') {
            DisplayController.updateGameInfo(`${winner} won the game`);
            DisplayController.toggleGameInfoClass('show-winner', 'add');
        }
        else if (gameStatus == 0) {
            DisplayController.updateGameInfo('It´s a draw!');
            DisplayController.toggleGameInfoClass('show-tie', 'add');
        }
    }

    function restartGame() {
        gameBoard.resetBoard();
        DisplayController.displayAllBoard(gameBoard.getBoard());

        isPlayerOneTurn = true;
        winner = '';

        DisplayController.toggleGameInfoClass('show-tie', 'remove');
        DisplayController.toggleGameInfoClass('show-winner', 'remove');
        DisplayController.updateGameInfo(`Player ${isPlayerOneTurn? playerOne.getSymbol(): playerTwo.getSymbol()
            }'s turn`);

        playGame();
    }

    function getPlayerMovement(e) {
        let ij = e.target.id.split('');

        if (!gameBoard.isPositionOcupied(ij[0], ij[1]) && winner == '') {
            gameBoard.populateBoard(ij[0], ij[1], `${isPlayerOneTurn? playerOne.getSymbol() :
                playerTwo.getSymbol()}`);
            DisplayController.displayBoardElement(ij[0], ij[1], `${isPlayerOneTurn? playerOne.getSymbol() :
                playerTwo.getSymbol()}`);

                isPlayerOneTurn = !isPlayerOneTurn;
                DisplayController.disableTiles;
        }

        playGame();
    }

    const getPlayerOne = () => {
        return playerOne;
    }

    const getPlayerTwo = () => {
        return playerTwo;
    }

    const getIsPlayerOneTurn = () => {
        return isPlayerOneTurn;
    }

    const togglePlayerOneTurn = () => {
        isPlayerOneTurn = !isPlayerOneTurn;
    }

    return {restartGame, getPlayerOne, getPlayerTwo, getIsPlayerOneTurn, playGame, togglePlayerOneTurn};
})()

const Bot = (function() {
    const easyBotPlay = (gameBoard) => {
        let playerOne = GameFlow.getPlayerOne();
        let playerTwo = GameFlow.getPlayerTwo();
        let isPlayerOneTurn = GameFlow.getIsPlayerOneTurn();
        let isPosValid = false;
        let posI;
        let posJ;

        while(!isPosValid) {
            posI = Math.floor(Math.random() * 3);
            posJ = Math.floor(Math.random() * 3);

            if (!gameBoard.isPositionOcupied(posI, posJ)) {
                isPosValid = true;
            }
        }

        gameBoard.populateBoard(posI, posJ, `${isPlayerOneTurn? playerOne.getSymbol() :
            playerTwo.getSymbol()}`);
        DisplayController.displayBoardElement(posI, posJ, `${isPlayerOneTurn? playerOne.getSymbol() :
            playerTwo.getSymbol()}`);

        GameFlow.togglePlayerOneTurn()
        GameFlow.playGame();
    }

    function minimax(board, depth, isMaxPlayer) {
        let playerOne = GameFlow.getPlayerOne();
        let playerTwo = GameFlow.getPlayerTwo();

        let result = board.getStatus(playerOne, playerTwo);

        if (result != null) {
            return result;
        }

        let bestScore = isMaxPlayer? -Infinity : Infinity;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (!board.isPositionOcupied(i, j)) {
                    board.populateBoard(i, j, `${isMaxPlayer? playerOne.getSymbol() : playerTwo.getSymbol()}`);

                    if (isMaxPlayer) {
                        let score = minimax(board, depth + 1, false);
                        if (score > bestScore) {
                            bestScore = score;
                        }
                    }
                    else {
                        let score = minimax(board, depth + 1, true);
                        if (score < bestScore) {
                            bestScore = score;
                        }
                    }

                    board.removeSymbol(i, j);
                }
            }
        }
        
        return bestScore;
    }
    
    const hardBotPlay = (gameBoard) => {
        let isMaxPlayer = GameFlow.getIsPlayerOneTurn(); // 'X' is playerOne so if it is playerOne's turn it's maximizing.
        let playerSymbol = isMaxPlayer? GameFlow.getPlayerOne().getSymbol() :  GameFlow.getPlayerTwo().getSymbol();

        let boardCopy = GameBoard();
        boardCopy.setBoard(gameBoard.getCopy());

        let playerOne = GameFlow.getPlayerOne();
        let playerTwo = GameFlow.getPlayerTwo();
    
        let bestScore = isMaxPlayer? -Infinity : Infinity;
        let posI, posJ;
    
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {   
                if (!boardCopy.isPositionOcupied(i, j)) {
                    boardCopy.populateBoard(i, j, playerSymbol);
                    if (isMaxPlayer) {
                        let score = minimax(boardCopy, 0, false);
                        if (score > bestScore) {
                            bestScore = score;
                            posI = i;
                            posJ = j;
                        }
                    }
                    else {
                        let score = minimax(boardCopy, 0, true);
                        if (score < bestScore) {
                            bestScore = score;
                            posI = i;
                            posJ = j;
                        }
                    }
                    boardCopy.removeSymbol(i, j);
                }
            }
        }

        gameBoard.populateBoard(posI, posJ, `${isMaxPlayer? playerOne.getSymbol() : playerTwo.getSymbol()}`);
        DisplayController.displayBoardElement(posI, posJ, `${isMaxPlayer? playerOne.getSymbol() : playerTwo.getSymbol()}`);
    
        GameFlow.togglePlayerOneTurn();
        GameFlow.playGame();    
    }

    return {easyBotPlay, hardBotPlay};
})()