// DOM Elements
const boardElement = document.getElementById("board");
const statusText = document.getElementById("statusText");
const difficultySelect = document.getElementById("difficulty");

const playerScoreElement = document.getElementById("playerScore");
const aiScoreElement = document.getElementById("aiScore");
const victoryScreen = document.getElementById("victoryScreen");
const victoryTitle = document.getElementById("victoryTitle");
const victoryText = document.getElementById("victoryText");
const playAgainBtn = document.getElementById("playAgainBtn");
const undoBtn = document.getElementById("undoBtn");
const musicToggleBtn = document.getElementById("musicToggleBtn");
const soundToggleBtn = document.getElementById("soundToggleBtn");
const particleContainer = document.getElementById("particleContainer");

// Novos Elementos - Menu e Drive
const menuToggle = document.getElementById("menuToggle");
const menuContainer = document.getElementById("menuContainer");
const driveInput = document.getElementById("driveUrl");
const loadDriveBtn = document.getElementById("loadDriveMusic");

// Game State
let board = [];
let currentPlayer = "player"; // "player" or "ai"
let selectedPiece = null; // { row, col }
let moveHistory = []; // Stores board states for undo

// Score and Storage
const STORAGE_KEY = "joabe_play_damas_save";
const SCORES_STORAGE_KEY = "joabe_play_scores";
const MUSIC_STORAGE_KEY = "joabe_play_music_state";
const SOUND_STORAGE_KEY = "joabe_play_sound_state";

let playerScore = 0;
let aiScore = 0;

// Audio
const backgroundMusic = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"); // Example music
const moveAudio = new Audio("https://www.soundjay.com/buttons/button-1.mp3"); // Example move sound
const captureAudio = new Audio("https://www.soundjay.com/misc/fart-01.mp3"); // Example capture sound
const victoryAudio = new Audio("https://www.soundjay.com/misc/applause-01.mp3"); // Example victory sound

backgroundMusic.loop = true;
let isMusicOn = true;
let isSoundOn = true;

// --- Core Game Logic ---

function createInitialBoard() {
    board = Array(8).fill(null).map(() => Array(8).fill(null));

    // Player pieces (bottom)
    for (let r = 5; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if ((r + c) % 2 !== 0) { // Dark squares
                board[r][c] = { player: "player", king: false };
            }
        }
    }

    // AI pieces (top)
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 8; c++) {
            if ((r + c) % 2 !== 0) { // Dark squares
                board[r][c] = { player: "ai", king: false };
            }
        }
    }
}

function renderBoard() {
    boardElement.innerHTML = ""; // Clear board

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.classList.add((row + col) % 2 === 0 ? "light" : "dark");
            cell.dataset.row = row;
            cell.dataset.col = col;

            // Highlight possible moves for selected piece
            if (selectedPiece) {
                const captures = getCaptures(selectedPiece.row, selectedPiece.col);
                for (const move of captures) {
                    if (move.toRow === row && move.toCol === col) {
                        cell.classList.add("highlight");
                    }
                }
                // Also highlight non-capture moves if no captures are mandatory
                if (!playerMustCapture(currentPlayer)) {
                    const normalMoves = getSimpleMoves(selectedPiece.row, selectedPiece.col); 
                    for (const move of normalMoves) {
                        if (move.toRow === row && move.toCol === col) {
                            cell.classList.add("highlight");
                        }
                    }
                }
            }

            const piece = board[row][col];
            if (piece) {
                const pieceElement = document.createElement("div");
                pieceElement.classList.add("piece", piece.player);
                if (piece.king) {
                    pieceElement.classList.add("king");
                }
                if (selectedPiece && selectedPiece.row === row && selectedPiece.col === col) {
                    pieceElement.classList.add("selected");
                }
                cell.appendChild(pieceElement);
            }

            cell.addEventListener("click", cellClick);
            boardElement.appendChild(cell);
        }
    }
}

function insideBoard(row, col) {
    return (row >= 0 && row < 8 && col >= 0 && col < 8);
}

function getCaptures(row, col) {
    const piece = board[row][col];
    if (!piece) return [];

    const captures = [];
    const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];

    if (piece.king) {
        for (const [dr, dc] of directions) {
            let r = row + dr;
            let c = col + dc;
            let enemyFound = false;
            let enemyRow;
            let enemyCol;

            while (insideBoard(r, c)) {
                const target = board[r][c];

                if (target) {
                    if (target.player === piece.player) {
                        break; 
                    }
                    if (enemyFound) {
                        break; 
                    }
                    enemyFound = true;
                    enemyRow = r;
                    enemyCol = c;
                } else {
                    if (enemyFound) {
                        captures.push({
                            toRow: r,
                            toCol: c,
                            captureRow: enemyRow,
                            captureCol: enemyCol
                        });
                    }
                }
                r += dr;
                c += dc;
            }
        }
    } else { 
        for (const [dr, dc] of directions) {
            const enemyRow = row + dr;
            const enemyCol = col + dc;
            const jumpRow = row + (dr * 2);
            const jumpCol = col + (dc * 2);

            if (insideBoard(jumpRow, jumpCol)) {
                const enemy = board[enemyRow][enemyCol];
                if (enemy && enemy.player !== piece.player && !board[jumpRow][jumpCol]) {
                    captures.push({
                        toRow: jumpRow,
                        toCol: jumpCol,
                        captureRow: enemyRow,
                        captureCol: enemyCol
                    });
                }
            }
        }
    }
    return captures;
}

function playerMustCapture(player) {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (piece && piece.player === player) {
                if (getCaptures(r, c).length) {
                    return true;
                }
            }
        }
    }
    return false;
}

function promoteIfNeeded(piece, row) {
    if (piece.player === "player" && row === 0) {
        piece.king = true;
    }
    if (piece.player === "ai" && row === 7) {
        piece.king = true;
    }
}

function saveHistory() {
    moveHistory.push(JSON.stringify(board));
    if (moveHistory.length > 30) {
        moveHistory.shift(); 
    }
}

function attemptMove(fromRow, fromCol, toRow, toCol) {
    const piece = board[fromRow][fromCol];
    if (!piece) return;
    if (board[toRow][toCol]) return;

    const captures = getCaptures(fromRow, fromCol);
    const mustCapture = playerMustCapture(currentPlayer);

    let captureMove = null;
    for (const move of captures) {
        if (move.toRow === toRow && move.toCol === toCol) {
            captureMove = move;
            break;
        }
    }

    if (captureMove) {
        saveHistory();
        board[toRow][toCol] = piece;
        board[fromRow][fromCol] = null;
        board[captureMove.captureRow][captureMove.captureCol] = null;
        playCaptureSound(captureMove.captureRow, captureMove.captureCol); 
        promoteIfNeeded(piece, toRow);

        selectedPiece = { row: toRow, col: toCol };
        const nextCaptures = getCaptures(toRow, toCol);

        if (nextCaptures.length) {
            renderBoard();
            checkVictory();
            saveGame();
            return; 
        }

        selectedPiece = null;
        switchTurn();
        checkVictory();
        saveGame();
        renderBoard();
        return;
    }

    if (mustCapture) {
        return; 
    }

    if (piece.king) {
        const rowDiff = Math.abs(toRow - fromRow);
        const colDiff = Math.abs(toCol - fromCol);
        if (rowDiff !== colDiff) {
            return; 
        }
        const dr = (toRow - fromRow) / rowDiff;
        const dc = (toCol - fromCol) / colDiff;
        for (let i = 1; i < rowDiff; i++) {
            if (board[fromRow + i * dr][fromCol + i * dc]) {
                return; 
            }
        }
    } else { 
        let dir = piece.player === "player" ? -1 : 1;
        if (toRow !== fromRow + dir) {
            return; 
        }
        if (Math.abs(toCol - fromCol) !== 1) {
            return; 
        }
    }

    saveHistory();
    board[toRow][toCol] = piece;
    board[fromRow][fromCol] = null;
    playMoveSound(); 
    promoteIfNeeded(piece, toRow);
    selectedPiece = null;
    switchTurn();
    checkVictory();
    saveGame();
    renderBoard();
}

function cellClick(event) {
    const row = parseInt(event.currentTarget.dataset.row);
    const col = parseInt(event.currentTarget.dataset.col);
    const piece = board[row][col];

    if (selectedPiece) {
        attemptMove(selectedPiece.row, selectedPiece.col, row, col);
    } else if (piece) {
        if (piece.player === currentPlayer) {
            const mustCapture = playerMustCapture(currentPlayer);
            if (mustCapture) {
                if (!getCaptures(row, col).length) {
                    return;
                }
            }
            selectedPiece = { row, col };
            renderBoard();
        }
    }
}

// --- Score and Victory System ---

function updateScore() {
    playerScoreElement.textContent = playerScore;
    aiScoreElement.textContent = aiScore;
    localStorage.setItem(SCORES_STORAGE_KEY, JSON.stringify({ player: playerScore, ai: aiScore }));
}

function loadScore() {
    const saved = localStorage.getItem(SCORES_STORAGE_KEY);
    if (!saved) return;
    const data = JSON.parse(saved);
    playerScore = data.player || 0;
    aiScore = data.ai || 0;
    updateScore();
}

function checkVictory() {
    let playerPieces = 0;
    let aiPieces = 0;
    let playerHasMoves = false;
    let aiHasMoves = false;

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (!piece) continue;

            if (piece.player === "player") {
                playerPieces++;
                if (getCaptures(r, c).length > 0 || getSimpleMoves(r, c).length > 0) {
                    playerHasMoves = true;
                }
            } else {
                aiPieces++;
                if (getCaptures(r, c).length > 0 || getSimpleMoves(r, c).length > 0) {
                    aiHasMoves = true;
                }
            }
        }
    }

    if (playerPieces === 0 || !playerHasMoves) {
        showVictory("IA");
        return true;
    }
    if (aiPieces === 0 || !aiHasMoves) {
        showVictory("VOCÊ");
        return true;
    }
    return false;
}

function showVictory(winner) {
    victoryScreen.classList.remove("hidden");
    victoryTitle.textContent = winner + " VENCEU";
    if (winner === "VOCÊ") {
        playerScore++;
    } else {
        aiScore++;
    }
    updateScore();
    victoryText.textContent = "Fim da partida";
    victoryAudio.currentTime = 0;
    if (isSoundOn) victoryAudio.play();
}

playAgainBtn.addEventListener("click", () => {
    victoryScreen.classList.add("hidden");
    resetGame();
    saveGame();
});

undoBtn.addEventListener("click", () => {
    if (!moveHistory.length) return;
    board = JSON.parse(moveHistory.pop());
    selectedPiece = null;
    currentPlayer = "player"; 
    statusText.textContent = "Sua vez";
    renderBoard();
    saveGame();
});

// --- Game Save/Load ---

function saveGame() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
        board, currentPlayer, playerScore, aiScore, moveHistory
    }));
}

function loadGame() {
    const save = localStorage.getItem(STORAGE_KEY);
    if (!save) {
        createInitialBoard();
        return;
    }
    const data = JSON.parse(save);
    board = data.board;
    currentPlayer = data.currentPlayer;
    playerScore = data.playerScore;
    aiScore = data.aiScore;
    moveHistory = data.moveHistory || []; 
    updateScore();
    statusText.textContent = currentPlayer === "player" ? "Sua vez" : "IA pensando...";
}

function resetGame() {
    selectedPiece = null;
    currentPlayer = "player";
    moveHistory = [];
    createInitialBoard();
    renderBoard();
    saveGame();
}

// --- AI Logic ---

function getDifficulty() {
    return difficultySelect.value;
}

function getAllPieces(player) {
    const pieces = [];
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (piece && piece.player === player) {
                pieces.push({ row: r, col: c, piece });
            }
        }
    }
    return pieces;
}

function getSimpleMoves(row, col) {
    const piece = board[row][col];
    if (!piece) return [];

    const moves = [];
    if (piece.king) {
        const dirs = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
        for (const [dr, dc] of dirs) {
            let r = row + dr;
            let c = col + dc;
            while (insideBoard(r, c) && !board[r][c]) {
                moves.push({ toRow: r, toCol: c });
                r += dr;
                c += dc;
            }
        }
    } else {
        const dir = piece.player === "player" ? -1 : 1; 
        for (const dc of [-1, 1]) {
            const r = row + dir;
            const c = col + dc;
            if (insideBoard(r, c) && !board[r][c]) {
                moves.push({ toRow: r, toCol: c });
            }
        }
    }
    return moves;
}

function getAllPossibleMoves() {
    const moves = [];
    const pieces = getAllPieces("ai");

    for (const item of pieces) {
        const captures = getCaptures(item.row, item.col);
        for (const cap of captures) {
            moves.push({ type: "capture", fromRow: item.row, fromCol: item.col, ...cap });
        }
    }

    if (moves.length) {
        return moves; 
    }

    for (const item of pieces) {
        const normals = getSimpleMoves(item.row, item.col);
        for (const move of normals) {
            moves.push({ type: "move", fromRow: item.row, fromCol: item.col, toRow: move.toRow, toCol: move.toCol });
        }
    }
    return moves;
}

function easyAI() {
    const moves = getAllPossibleMoves();
    if (!moves.length) {
        showVictory("VOCÊ");
        return;
    }
    const move = moves[Math.floor(Math.random() * moves.length)];
    executeAIMove(move);
}

function mediumAI() {
    const moves = getAllPossibleMoves();
    if (!moves.length) {
        showVictory("VOCÊ");
        return;
    }
    const captures = moves.filter(m => m.type === "capture");
    if (captures.length) {
        executeAIMove(captures[Math.floor(Math.random() * captures.length)]);
        return;
    }
    const normalMoves = moves.filter(m => m.type === "move");
    if (normalMoves.length) {
        executeAIMove(normalMoves[Math.floor(Math.random() * normalMoves.length)]);
    } else {
        easyAI();
    }
}

function evaluateBoard() {
    let score = 0;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (!piece) continue;

            let value = piece.king ? 5 : 1; 
            if (!piece.king) {
                if (piece.player === "ai") {
                    value += r * 0.1; 
                } else {
                    value += (7 - r) * 0.1; 
                }
            }

            if (piece.player === "ai") {
                score += value;
            } else {
                score -= value;
            }
        }
    }
    return score;
}

function hardAI() {
    const moves = getAllPossibleMoves();
    if (!moves.length) {
        showVictory("VOCÊ");
        return;
    }

    let bestMove = null;
    let bestScore = -Infinity; 

    for (const move of moves) {
        const clone = JSON.parse(JSON.stringify(board)); 
        simulateMove(move);
        const score = evaluateBoard();
        board = JSON.parse(JSON.stringify(clone)); 

        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
    }
    executeAIMove(bestMove);
}

function simulateMove(move) {
    const piece = board[move.fromRow][move.fromCol];
    board[move.toRow][move.toCol] = piece;
    board[move.fromRow][move.fromCol] = null;

    if (move.type === "capture") {
        board[move.captureRow][move.captureCol] = null;
    }
    promoteIfNeeded(piece, move.toRow); 
}

function executeAIMove(move) {
    setTimeout(() => {
        saveHistory(); 
        const piece = board[move.fromRow][move.fromCol];
        board[move.toRow][move.toCol] = piece;
        board[move.fromRow][move.fromCol] = null;

        if (move.type === "capture") {
            board[move.captureRow][move.captureCol] = null;
            playCaptureSound(move.captureRow, move.captureCol);
        } else {
            playMoveSound();
        }

        promoteIfNeeded(piece, move.toRow);

        selectedPiece = { row: move.toRow, col: move.toCol };
        const nextCaptures = getCaptures(move.toRow, move.toCol);

        if (nextCaptures.length && move.type === "capture") {
            statusText.textContent = "IA fazendo múltiplas capturas...";
            let bestNextCapture = null;
            let bestNextScore = -Infinity;
            for (const nextCap of nextCaptures) {
                const clone = JSON.parse(JSON.stringify(board));
                simulateMove({ type: "capture", fromRow: move.toRow, fromCol: move.toCol, ...nextCap });
                const score = evaluateBoard();
                board = JSON.parse(JSON.stringify(clone));
                if (score > bestNextScore) {
                    bestNextScore = score;
                    bestNextCapture = { type: "capture", fromRow: move.toRow, fromCol: move.toCol, ...nextCap };
                }
            }
            if (bestNextCapture) {
                executeAIMove(bestNextCapture); 
                return;
            }
        }

        selectedPiece = null; 
        currentPlayer = "player";
        statusText.textContent = "Sua vez";
        if (!checkVictory()) {
            saveGame();
            renderBoard();
        }
    }, 600); 
}

function switchTurn() {
    currentPlayer = currentPlayer === "player" ? "ai" : "player";

    if (currentPlayer === "player") {
        statusText.textContent = "Sua vez";
        return;
    }

    statusText.textContent = "IA pensando...";
    const level = getDifficulty();

    setTimeout(() => {
        if (checkVictory()) return; 

        if (level === "easy") {
            easyAI();
        } else if (level === "medium") {
            mediumAI();
        } else {
            hardAI();
        }
    }, 500);
}

// --- Visuals, Audio, Optimizations ---

function explodeParticles(row, col) {
    if (!isSoundOn) return; 

    const cellElement = boardElement.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    if (!cellElement) return;

    const rect = cellElement.getBoundingClientRect();
    const boardRect = boardElement.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2 - boardRect.left;
    const centerY = rect.top + rect.height / 2 - boardRect.top;

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement("div");
        particle.classList.add("particle");
        const size = Math.random() * 8 + 4; 
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${centerX - size / 2}px`;
        particle.style.top = `${centerY - size / 2}px`;

        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 50 + 20; 
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;

        particle.style.setProperty('--dx', `${dx}px`);
        particle.style.setProperty('--dy', `${dy}px`);
        particle.style.animationDuration = `${Math.random() * 0.5 + 0.5}s`; 

        particleContainer.appendChild(particle);

        particle.addEventListener('animationend', () => {
            particle.remove();
        });
    }
}

function playMoveSound() {
    if (isSoundOn) {
        moveAudio.currentTime = 0;
        moveAudio.play().catch(e => console.log("Move sound play failed:", e));
    }
}

function playCaptureSound(row, col) {
    if (isSoundOn) {
        captureAudio.currentTime = 0;
        captureAudio.play().catch(e => console.log("Capture sound play failed:", e));
    }
    explodeParticles(row, col);
}

function playBackgroundMusic() {
    if (isMusicOn) {
        backgroundMusic.play().catch(e => console.log("Music play failed:", e));
    } else {
        backgroundMusic.pause();
    }
}

function toggleMusic() {
    isMusicOn = !isMusicOn;
    if (isMusicOn) {
        musicToggleBtn.textContent = "🎵 Música: ON";
        playBackgroundMusic();
    } else {
        musicToggleBtn.textContent = "🔇 Música: OFF";
        backgroundMusic.pause();
    }
    localStorage.setItem(MUSIC_STORAGE_KEY, isMusicOn);
}

function toggleSound() {
    isSoundOn = !isSoundOn;
    if (isSoundOn) {
        soundToggleBtn.textContent = "🔊 Sons: ON";
    } else {
        soundToggleBtn.textContent = "🔕 Sons: OFF";
    }
    localStorage.setItem(SOUND_STORAGE_KEY, isSoundOn);
}

function loadMusicState() {
    const savedState = localStorage.getItem(MUSIC_STORAGE_KEY);
    if (savedState !== null) {
        isMusicOn = JSON.parse(savedState);
    }
    musicToggleBtn.textContent = isMusicOn ? "🎵 Música: ON" : "🔇 Música: OFF";
}

function loadSoundState() {
    const savedState = localStorage.getItem(SOUND_STORAGE_KEY);
    if (savedState !== null) {
        isSoundOn = JSON.parse(savedState);
    }
    soundToggleBtn.textContent = isSoundOn ? "🔊 Sons: ON" : "🔕 Sons: OFF";
}

// --- Lógica do Novo Menu ---
menuToggle.addEventListener("click", () => {
    menuContainer.classList.toggle("menu-open");
});

// --- Lógica de Música do Google Drive ---
loadDriveBtn.addEventListener("click", () => {
    let url = driveInput.value.trim();
    if (!url) {
        alert("Cole um link do Google Drive.");
        return;
    }

    const match = url.match(/\/d\/(.*?)\//);
    if (!match) {
        alert("Link inválido. Copie o link completo de compartilhamento (com a seção /d/).");
        return;
    }

    const fileId = match[1];
    const directUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

    backgroundMusic.src = directUrl;
    backgroundMusic.play().then(() => {
        isMusicOn = true;
        musicToggleBtn.textContent = "🎵 Música: ON";
        localStorage.setItem(MUSIC_STORAGE_KEY, isMusicOn);
    }).catch(err => {
        console.error("Erro ao tocar do Drive:", err);
        alert("Erro ao reproduzir. O link pode estar privado ou o formato não é suportado pelo navegador.");
    });
});

// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
    loadScore();
    loadGame();
    loadMusicState();
    loadSoundState();
    renderBoard();
    playBackgroundMusic(); 
});

musicToggleBtn.addEventListener("click", toggleMusic);
soundToggleBtn.addEventListener("click", toggleSound);
