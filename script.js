const cells = document.querySelectorAll('.cell');
const message = document.querySelector('.message');
const restartButton = document.getElementById('restart');
const clickSound = document.getElementById('click-sound');
const winSoundX = document.getElementById('x-win-sound');
const winSoundO = document.getElementById('o-win-sound');
const restartSound = document.getElementById('restart-sound');
const settingsButton = document.getElementById('settings-button');
const settingsMenu = document.getElementById('settings-menu');
const muteSoundCheckbox = document.getElementById('mute-sound');
let isXTurn = true;
let board = ["", "", "", "", "", "", "", "", ""];
let soundMuted = false;

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// Toggle settings menu visibility
settingsButton.addEventListener('click', () => {
    settingsMenu.style.display = settingsMenu.style.display === 'none' ? 'block' : 'none';
});

// Mute/unmute sound based on checkbox
muteSoundCheckbox.addEventListener('change', (event) => {
    soundMuted = event.target.checked;
});

// Check for a winner
function checkWinner() {
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            highlightWinningCells(combination);

            // Play winning sound based on winner (X or O)
            if (!soundMuted) {
                if (board[a] === "X") {
                    winSoundX.currentTime = 0; // Reset sound to start
                    winSoundX.play();          // Play X winning sound
                } else if (board[a] === "O") {
                    winSoundO.currentTime = 0; // Reset sound to start
                    winSoundO.play();          // Play O winning sound
                }
            }
            
            return board[a];
        }
    }
    return board.includes("") ? null : "draw";
}

// Highlight the winning cells with a glow and animation effect
function highlightWinningCells(combination) {
    combination.forEach(index => {
        cells[index].classList.add('win'); // Apply winning animation
    });
}

// Handle cell clicks
function handleClick(event) {
    const index = event.target.getAttribute('data-index');
    if (!board[index]) {
        board[index] = isXTurn ? "X" : "O";
        event.target.textContent = board[index];
        event.target.classList.add('rgb-glow');  // Add RGB glow effect on tap

        if (!soundMuted) {
            clickSound.currentTime = 0;  // Reset sound to start
            clickSound.play();           // Play click sound
        }

        isXTurn = !isXTurn;
        
        const result = checkWinner();
        if (result) {
            message.textContent = result === "draw" ? "It's a draw!" : `${result} wins!`;
            
            cells.forEach(cell => cell.removeEventListener('click', handleClick));
            restartButton.style.display = "block";
        }
    }
}

// Reset the game
function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    isXTurn = true;
    message.textContent = "";

    if (!soundMuted) {
        restartSound.currentTime = 0; // Reset sound to start
        restartSound.play();          // Play restart sound
    }

    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove('glow', 'rgb-glow', 'win');  // Remove all effects on reset
        cell.addEventListener('click', handleClick);
    });
    restartButton.style.display = "block";
}

// Initialize the game
cells.forEach(cell => cell.addEventListener('click', handleClick));
restartButton.addEventListener('click', resetGame);