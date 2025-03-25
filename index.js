const cells = document.querySelectorAll(".cell");
const restartButton = document.getElementById("restart");
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameOver = false;

const checkWin = (player) => {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  return winPatterns.some((pattern) =>
    pattern.every((index) => board[index] === player)
  );
};

const checkDraw = () => {
  return board.every((cell) => cell !== "");
};

const minimax = (board, depth, isMaximizing) => {
  if (checkWin("O")) return 10 - depth;
  if (checkWin("X")) return depth - 10;
  if (checkDraw()) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = "O";
        best = Math.max(best, minimax(board, depth + 1, false));
        board[i] = "";
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = "X";
        best = Math.min(best, minimax(board, depth + 1, true));
        board[i] = "";
      }
    }
    return best;
  }
};

const findBestMove = () => {
  let bestVal = -Infinity;
  let bestMove = -1;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = "O";
      let moveVal = minimax(board, 0, false);
      board[i] = "";

      if (moveVal > bestVal) {
        bestMove = i;
        bestVal = moveVal;
      }
    }
  }
  return bestMove;
};

const botPlay = () => {
  let bestMove = findBestMove();
  board[bestMove] = "O";
  cells[bestMove].textContent = "O";
};

let playerWin = 0;
let tie = 0;
let botWin = 0;

const updateGame = () => {
  if (checkWin("X")) {
    alert("Игрок победил!");
    gameOver = true;
    playerWin++;

  } else if (checkWin("O")) {
    alert("Бот победил!");
    gameOver = true;
    botWin++;

  } else if (checkDraw()) {
    alert("Ничья!");
    gameOver = true;
    tie++;
  }
};

const playerMove = (e) => {
  if (gameOver) return;
  const index = e.target.dataset.index;

  if (board[index] === "") {
    board[index] = "X";
    e.target.textContent = "X";
    updateGame();

    if (!gameOver) {
      currentPlayer = "O";
      botPlay();
      currentPlayer = "X";
      updateGame();
    }
  }
};

const restartGame = () => {
  board = ["", "", "", "", "", "", "", "", ""];
  gameOver = false;
  currentPlayer = "X";
  cells.forEach((cell) => (cell.textContent = ""));
};
function handleShortcut(event) {
  if (event.key === "R") {
    event.preventDefault();
    restartGame();
  }
}
document.addEventListener("keydown", handleShortcut);

cells.forEach((cell) => cell.addEventListener("click", playerMove));
restartButton.addEventListener("click", restartGame);

