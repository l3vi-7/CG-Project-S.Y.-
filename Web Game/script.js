var origBoard ;
const huPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]

const cells = document.querySelectorAll('.cell');


startGame();

function startGame(){
    document.querySelector('.endgame').style.display = "none";
    origBoard = Array.from(Array(9).keys());
    // console.log(origBoard)
    for(var i=0; i < cells.length ; i++){
        cells[i].innerHTML = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click' , turnClick, false);
    }
}

function turnClick(square){
    if(typeof(origBoard[square.target.id]) == 'number'){
        turn(square.target.id, huPlayer)
        if(!checkTie())
            turn(bestSpot(), aiPlayer)
    }
}

function turn(squareId, player){
    origBoard[squareId] = player;
    document.getElementById(squareId).innerHTML = player;
    let gameWon = checkWin(origBoard, player)
    if(gameWon){ gameOver(gameWon)}
}


function checkWin(board, player){
    for(var i = 0; i<winCombos.length; i++){
        if(board[winCombos[i][0]] ===  player && board[winCombos[i][1]] === player && board[winCombos[i][2]] === player){
            return { index : i, player: player};
        }
    }
    return null;
}
function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
}

function gameOver(gameWon){
    for(let index of winCombos[gameWon.index]){
        document.getElementById(index).style.backgroundColor = (gameWon.player === huPlayer ? "blue" : "red");
    }
    for(var i = 0; i<cells.length ; i++){
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player === huPlayer ? "You won!" : "You Lose!");
    // decleareWinner(gameWon.player === huPlayer ? "You won!" : gameWon.player === aiPlayer ? "You Lose!" : "Its a draw!");
}

function emptySpots(board){
    const emptySpots = [];
    for(var i = 0; i<board.length; i++){
        if(board[i] !== "O"  && board[i] !== "X"){
            emptySpots.push(i);
        }
    }
    return emptySpots;
}
// function emptySpots(board){
//     return  board.filter(s => s != "O" && s != "X");
//   }

function bestSpot(){
    // return emptySpots()[0];
    var obj = minmax(origBoard, aiPlayer);
    console.log(obj)
    return obj.index;
}

function checkTie(){
    if(emptySpots(origBoard).length == 0){
        for(var i = 0; i<cells.length ; i++){
            cells[i].removeEventListener('click', turnClick, false);
            cells[i].style.backgroundColor = 'green';
        }
        declareWinner("Its a tie!");
        return true;
    }
    return false;
}



function minmax(newBoard, player) {
	var availSpots = emptySpots(newBoard);

	if (checkWin(newBoard, huPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == aiPlayer) {
			var result = minmax(newBoard, huPlayer);
			move.score = result.score;
		} else {
			var result = minmax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}

