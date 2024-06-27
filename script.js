// script.js

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let isGameActive = true;
let isAgainstAI = false;
const cells = document.querySelectorAll(".cell");
const resetButton = document.getElementById("reset");
const modeButton = document.getElementById("mode");
const resultModal = document.getElementById("resultModal");
const resultMessage = document.getElementById("resultMessage");
const closeModal = document.getElementsByClassName("close")[0];

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]
];

const checkWin = (boardToCheck) => {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (boardToCheck[a] && boardToCheck[a] === boardToCheck[b] && boardToCheck[a] === boardToCheck[c]) {
            return true;
        }
    }
    return false;
};

const checkTie = (boardToCheck) => {
    return boardToCheck.every(cell => cell !== "");
};

const minimax = (newBoard, player) => {
    let availableSpots = newBoard.map((val, idx) => val === "" ? idx : null).filter(val => val !== null);

    if (checkWin(newBoard)) {
        return {score: player === "O" ? -10 : 10};
    } else if (checkTie(newBoard)) {
        return {score: 0};
    }

    let moves = [];
    for (let i = 0; i < availableSpots.length; i++) {
        let move = {};
        move.index = availableSpots[i];
        newBoard[availableSpots[i]] = player;

        if (player === "O") {
            let result = minimax(newBoard, "X");
            move.score = result.score;
        } else {
            let result = minimax(newBoard, "O");
            move.score = result.score;
        }

        newBoard[availableSpots[i]] = "";
        moves.push(move);
    }

    let bestMove;
    if (player === "O") {
        let bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
};

const handleCellClick = (e) => {
    const index = e.target.getAttribute('data-index');

    if (board[index] !== "" || !isGameActive) {
        return;
    }

    makeMove(index, currentPlayer);

    if (checkWin(board)) {
        showResultModal(`${currentPlayer} wins!`);
        isGameActive = false;
        return;
    } else if (checkTie(board)) {
        showResultModal("It's a tie!");
        isGameActive = false;
        return;
    } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        if (isAgainstAI && currentPlayer === "O") {
            const bestMove = minimax(board, currentPlayer);
            makeMove(bestMove.index, currentPlayer);
            if (checkWin(board)) {
                showResultModal(`${currentPlayer} wins!`);
                isGameActive = false;
                return;
            } else if (checkTie(board)) {
                showResultModal("It's a tie!");
                isGameActive = false;
                return;
            } else {
                currentPlayer = "X";
            }
        }
    }
};

const makeMove = (index, player) => {
    board[index] = player;
    cells[index].textContent = player;
};

const resetGame = () => {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    isGameActive = true;
    cells.forEach(cell => cell.textContent = "");
};

const toggleMode = () => {
    isAgainstAI = !isAgainstAI;
    modeButton.textContent = isAgainstAI ? "Switch to Multiplayer" : "Switch to AI Opponent";
    resetGame();
};

const showResultModal = (message) => {
    resultMessage.textContent = message;
    resultModal.style.display = "block";
};

closeModal.onclick = () => {
    resultModal.style.display = "none";
    resetGame();
};

window.onclick = (event) => {
    if (event.target == resultModal) {
        resultModal.style.display = "none";
        resetGame();
    }
};

cells.forEach(cell => cell.addEventListener("click", handleCellClick));
resetButton.addEventListener("click", resetGame);
modeButton.addEventListener("click", toggleMode);
