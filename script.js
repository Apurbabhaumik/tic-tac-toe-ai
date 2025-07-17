// Create animated background particles
function createParticles() {
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.width = Math.random() * 20 + 5 + 'px';
        particle.style.height = particle.style.width;
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        document.body.appendChild(particle);
    }
}

// Game state
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let playerScore = 0;
let aiScore = 0;

const statusElement = document.getElementById('status');
const restartButton = document.getElementById('restart');
const boardElement = document.getElementById('board');
const playerScoreElement = document.getElementById('player-score');
const aiScoreElement = document.getElementById('ai-score');

// Winning combinations
const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// Initialize game
function initGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    statusElement.textContent = 'Your turn! Click any cell';
    createBoard();
}

// Create board
function createBoard() {
    boardElement.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.index = i;
        cell.addEventListener('click', handleCellClick);
        boardElement.appendChild(cell);
    }
}

// Handle cell click
function handleCellClick(event) {
    const index = parseInt(event.target.dataset.index);
    
    if (board[index] !== '' || !gameActive || currentPlayer !== 'X') {
        return;
    }

    makeMove(index, 'X');
    
    if (gameActive && currentPlayer === 'O') {
        statusElement.textContent = 'AI is thinking...';
        setTimeout(() => {
            const aiMove = getBestMove();
            makeMove(aiMove, 'O');
        }, 500);
    }
}

// Make move
function makeMove(index, player) {
    board[index] = player;
    const cell = boardElement.children[index];
    cell.textContent = player;
    cell.classList.add(player.toLowerCase());
    
    const winner = checkWinner();
    if (winner) {
        gameActive = false;
        highlightWinningCells(winner.combination);
        if (winner.player === 'X') {
            playerScore++;
            playerScoreElement.textContent = playerScore;
            statusElement.textContent = '🎉 You won! Congratulations!';
        } else {
            aiScore++;
            aiScoreElement.textContent = aiScore;
            statusElement.textContent = '🤖 AI wins! Better luck next time!';
        }
    } else if (board.every(cell => cell !== '')) {
        gameActive = false;
        statusElement.textContent = '🤝 It\'s a tie! Great game!';
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        if (currentPlayer === 'X') {
            statusElement.textContent = 'Your turn!';
        }
    }
}

// Check winner
function checkWinner() {
    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return { player: board[a], combination };
        }
    }
    return null;
}

// Highlight winning cells
function highlightWinningCells(combination) {
    combination.forEach(index => {
        boardElement.children[index].classList.add('winning-cell');
    });
}

// Minimax algorithm
function minimax(newBoard, player) {
    const availableMoves = newBoard.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
    
    const winner = checkWinnerBoard(newBoard);
    if (winner === 'X') return { score: -10 };
    if (winner === 'O') return { score: 10 };
    if (availableMoves.length === 0) return { score: 0 };

    const moves = [];
    
    for (let i = 0; i < availableMoves.length; i++) {
        const move = {};
        move.index = availableMoves[i];
        newBoard[availableMoves[i]] = player;
        
        if (player === 'O') {
            const result = minimax(newBoard, 'X');
            move.score = result.score;
        } else {
            const result = minimax(newBoard, 'O');
            move.score = result.score;
        }
        
        newBoard[availableMoves[i]] = '';
        moves.push(move);
    }
    
    let bestMove;
    if (player === 'O') {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    
    return moves[bestMove];
}

// Check winner for board state
function checkWinnerBoard(board) {
    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}

// Get best move for AI
function getBestMove() {
    const result = minimax([...board], 'O');
    return result.index;
}

// Event listeners
restartButton.addEventListener('click', initGame);

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    initGame();
});