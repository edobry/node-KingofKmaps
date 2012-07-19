var fs = require("fs");
var stdin = process.stdin, stdout = process.stdout;

var player1 = {};
var player2 = {};
var currPlayer = function (){ return (turn % 2 != 0) ? player1 : player2; };

var grid = [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "];

var turn = 0;
var lastMove = {};


function start(){
	stdout.write("Welcome to King Of Kmaps!\n\nPlease select a game mode:\n 1) H v H\n 2) H v M\n 3) M v M\n\n");
	
	prompt("Mode: ", function (input){
		input = input.toString().trim();
		switch(input){
			case "1": case "1)":
				var p2 = "";
				prompt("\n\nLocal (l) or Remote (r)? ", function (input){
					input = input.toString().trim();
					switch(input){
						case "l":
							setupGame("human", "human");
							break;
						case "r":
							p2 = "remote";
							prompt("\nAre you the host (h) or the client (c)? ", function (input){
								input = input.toString().trim();
								switch(input){
									case "h":
										stdout.write("Waiting for connection...\n");
										io = require('socket.io').listen(8080);
										require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  											stdout.write('Give the client this address: '+ add + ":8080");
											io.sockets.on('connection', function (socket) {
												stdout.write("Client connected!");
												remote = socket;
												remote.on('disconnect', function () {
													stdout.write("Client disconnected");
												});

												setupGame("human", "remote");
											});
										})
										break;
									case "c":
										prompt("Address: ", function (input){
											stdout.write("Connecting...\n");
											io = require('socket.io-client');
											remote = io.connect(input.toString().trim());
											if(remote){
												stdout.write("Connected!\n");
												setupGame("remote", "human");
											}
										});
										break;
								}
							});
							
							break;
						default:
							process.exit(1);
					}
				})
				break;
			case "2": case "2)":
				setupGame("human","machine");
				break;
			case "3": case "3)":
				setupGame("machine","machine");
				break;
		}
	});
}

function setupGame(p1, p2){
	function humanMove(){
		stdout.write("\n");
		prompt("x: ", function(input){
			x = parseInt(input.toString().trim());
			prompt("y: ", function(input){
				y = parseInt(input.toString().trim());
				
				makeMove(x, y);
				nextTurn();
			});
		});
	}

	function remoteMove(){
		stdout.write("Waiting...");
		remote.once("move made", function (move){
			makeMove(move.x, move.y);
			nextTurn();
		});
		remote.emit("move made", {"x": lastMove.x, "y": lastMove.y});
	}
	
	function machineMove(){
		var playPos = 0;
		for(i = 0; i < grid.length; i++){
			if(grid[i] === " "){
				playPos = i;
				break;
			}
		}
		x = playPos > 8 ? playPos - (8*(playPos % 8)) : playPos;
		y = playPos < 8 ? 0 : playPos % 8;
		makeMove(x, y);
		nextTurn();
	}

	var actions = {"human": humanMove, "machine": machineMove, "remote": remoteMove};

	player1 = {"type": p1, "symbol": 0, "makeMove": actions[p1]};
	player2 = {"type": p2, "symbol": 1, "makeMove": actions[p2]};
	
	stdout.write("\n\nPlayer 1: " + player1.type);
	stdout.write("\nPlayer 2: " + player2.type + "\n\n");
	
	nextTurn();
}

function prompt(question, callback){
	stdout.write(question);
	stdin.resume();
	stdin.setEncoding('utf8');
	stdin.once("data", function(input){
		stdin.pause();
		callback(input);
	});
}

function nextTurn(){
	if(turn < 32){
		stdout.write("______________________________________________________\n\n");
		stdout.write("Turn " + ++turn + ":\n"); 
		
		stdout.write("\nPlayer " + currPlayer().type + "'s turn:\n");

		currPlayer().makeMove();
	}
	else{
		gameOver();
	}
}

function makeMove(x, y){
	lastMove.x = x, lastMove.y = y;
	grid[x+(8*y)] = currPlayer().symbol;
	displayGrid();
}

function gameOver(){
	stdout.write("Game Over!");
	process.exit();
}

function randomNum(){
	return 4;
}

function displayGrid(){
	var board = fs.readFileSync("board","utf8");
	var output = "";
	
	var pos = 0;
	for(i = 0; i < board.length; i++){
		if(board[i] != "#")
			output += board[i];
		else{
			output += grid[pos++]
		}
	}
	
	stdout.write("\n\n" + output + "\n\n");
}
start();