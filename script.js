// ==========================================
// GET HTML ELEMENTS
// ==========================================

const cells =
    document.querySelectorAll(".cell");

const statusText =
    document.getElementById("statusText");

const restartBtn =
    document.getElementById("restartBtn");

const scoreX =
    document.getElementById("scoreX");

const scoreO =
    document.getElementById("scoreO");

const result =
    document.getElementById("result");

const resultTitle =
    document.getElementById("resultTitle");

const resultMessage =
    document.getElementById("resultMessage");

const playerMode =
    document.getElementById("playerMode");

const aiMode =
    document.getElementById("aiMode");

const oLabel =
    document.getElementById("oLabel");


// ==========================================
// GAME VARIABLES
// ==========================================

let board = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
];

let currentPlayer = "X";

let gameActive = true;

let vsAI = false;

let xScore = 0;

let oScore = 0;


// ==========================================
// WINNING COMBINATIONS
// ==========================================

const winningCombinations = [

    [0, 1, 2],

    [3, 4, 5],

    [6, 7, 8],

    [0, 3, 6],

    [1, 4, 7],

    [2, 5, 8],

    [0, 4, 8],

    [2, 4, 6]

];


// ==========================================
// CELL CLICK
// ==========================================

cells.forEach(function (cell) {

    cell.addEventListener(
        "click",
        handleCellClick
    );

});


function handleCellClick(event) {

    const index =
        Number(event.target.dataset.index);


    // Stop if cell already used

    if (board[index] !== "") {

        return;

    }


    // Stop if game finished

    if (!gameActive) {

        return;

    }


    // AI mode:
    // only allow X to play

    if (vsAI && currentPlayer !== "X") {

        return;

    }


    makeMove(index, currentPlayer);


    const resultStatus =
        checkGame();


    if (resultStatus) {

        finishGame(resultStatus);

        return;

    }


    switchPlayer();


    // AI Move

    if (
        vsAI &&
        currentPlayer === "O" &&
        gameActive
    ) {

        setTimeout(
            aiMove,
            450
        );

    }

}


// ==========================================
// MAKE MOVE
// ==========================================

function makeMove(index, player) {

    board[index] = player;

    cells[index].textContent = player;

    cells[index].classList.add(
        player.toLowerCase()
    );

}


// ==========================================
// SWITCH PLAYER
// ==========================================

function switchPlayer() {

    currentPlayer =
        currentPlayer === "X"
            ? "O"
            : "X";


    if (vsAI && currentPlayer === "O") {

        statusText.textContent =
            "🤖 AI is thinking...";

    } else {

        statusText.textContent =
            `Player ${currentPlayer}'s Turn`;

    }

}


// ==========================================
// CHECK GAME
// ==========================================

function checkGame() {

    for (
        let combination of winningCombinations
    ) {

        const [a, b, c] =
            combination;


        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {

            return {
                winner: board[a],

                combination:
                    combination

            };

        }

    }


    // Check draw

    if (!board.includes("")) {

        return {
            draw: true
        };

    }


    return null;

}


// ==========================================
// FINISH GAME
// ==========================================

function finishGame(gameResult) {

    gameActive = false;


    if (gameResult.draw) {

        statusText.textContent =
            "🤝 It's a Draw!";

        resultTitle.textContent =
            "It's a Draw!";

        resultMessage.textContent =
            "Great game! Try again.";

        result.querySelector(
            "#resultIcon"
        ).textContent = "🤝";

        result.classList.remove(
            "hidden"
        );

        return;

    }


    const winner =
        gameResult.winner;


    // Highlight winning cells

    gameResult.combination.forEach(
        function (index) {

            cells[index].classList.add(
                "winner"
            );

        }
    );


    // Update score

    if (winner === "X") {

        xScore++;

        scoreX.textContent =
            xScore;

    } else {

        oScore++;

        scoreO.textContent =
            oScore;

    }


    // Status

    if (vsAI && winner === "O") {

        statusText.textContent =
            "🤖 AI Wins!";

        resultTitle.textContent =
            "AI Wins!";

        resultMessage.textContent =
            "Better luck next time.";

    } else {

        statusText.textContent =
            `🎉 Player ${winner} Wins!`;

        resultTitle.textContent =
            `Player ${winner} Wins!`;

        resultMessage.textContent =
            "Excellent move!";

    }


    result.querySelector(
        "#resultIcon"
    ).textContent = "🏆";


    result.classList.remove(
        "hidden"
    );

}


// ==========================================
// AI MOVE
// ==========================================

function aiMove() {

    if (!gameActive) {

        return;

    }


    const availableMoves = [];


    board.forEach(
        function (value, index) {

            if (value === "") {

                availableMoves.push(index);

            }

        }
    );


    if (availableMoves.length === 0) {

        return;

    }


    // Try to win

    let move =
        findBestMove("O");


    // Block player

    if (move === null) {

        move =
            findBestMove("X");

    }


    // Take center

    if (
        move === null &&
        board[4] === ""
    ) {

        move = 4;

    }


    // Random available move

    if (move === null) {

        const randomIndex =
            Math.floor(
                Math.random() *
                availableMoves.length
            );

        move =
            availableMoves[randomIndex];

    }


    makeMove(move, "O");


    const resultStatus =
        checkGame();


    if (resultStatus) {

        finishGame(resultStatus);

        return;

    }


    switchPlayer();

}


// ==========================================
// FIND BEST AI MOVE
// ==========================================

function findBestMove(player) {

    for (
        let combination
        of winningCombinations
    ) {

        const [a, b, c] =
            combination;


        const values = [
            board[a],
            board[b],
            board[c]
        ];


        const playerCount =
            values.filter(
                value =>
                    value === player
            ).length;


        const emptyIndex =
            combination.find(
                index =>
                    board[index] === ""
            );


        if (
            playerCount === 2 &&
            emptyIndex !== undefined
        ) {

            return emptyIndex;

        }

    }


    return null;

}


// ==========================================
// NEW GAME
// ==========================================

function resetGame() {

    board = [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        ""
    ];


    currentPlayer = "X";

    gameActive = true;


    cells.forEach(
        function (cell) {

            cell.textContent = "";

            cell.classList.remove(
                "x",
                "o",
                "winner"
            );

        }
    );


    result.classList.add(
        "hidden"
    );


    statusText.textContent =
        "Player X's Turn";

}


restartBtn.addEventListener(
    "click",
    resetGame
);


// ==========================================
// PLAYER VS PLAYER
// ==========================================

playerMode.addEventListener(
    "click",
    function () {

        vsAI = false;

        playerMode.classList.add(
            "active"
        );

        aiMode.classList.remove(
            "active"
        );

        oLabel.textContent =
            "Player O";

        resetGame();

    }
);


// ==========================================
// PLAYER VS AI
// ==========================================

aiMode.addEventListener(
    "click",
    function () {

        vsAI = true;

        aiMode.classList.add(
            "active"
        );

        playerMode.classList.remove(
            "active"
        );

        oLabel.textContent =
            "AI";

        resetGame();

    }
);