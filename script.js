// console.log(JSON.parse(JSON.stringify(arr)));

// variables
const TILESIZE = 50;
	// default 100-150
const GAMETICK = 150;

let xv;
let yv;
let coords;
let delayedCoords;
let moves;
let appleCoords;
let score = 0;

let moved;

let running;

// creates visible board
let grid = document.querySelector('.grid');
for (let x = 0; x < 225; x++) {
	let tile = document.createElement('div');
	tile.className = 'tile';
	grid.append(tile);
}

// creates score div
let scoreDiv = document.querySelector('.score');
scoreDiv.innerText = 'SCORE: ' + score;

// game over div
let gameOverDiv = document.querySelector('.gameover');

// paused div
let pausedDiv = document.querySelector('.paused');

// css calculations

resetGame();

// functions
function resetGame() {
	score = 0;
	scoreDiv.innerText = 'SCORE: ' + score;
	coords = [[7, 7]];
	moves = [];
	xv = 1;
	yv = 0;
	running = true;
	pausedDiv.hidden = true;
	gameOverDiv.hidden = true;
	blurGame(false);
	if (document.querySelectorAll('.apple').length > 0) {
		for (let apple of document.querySelectorAll('.apple')) {
			apple.remove();
		}
	}
	spawnApple();
	if (document.querySelectorAll('.segment').length > 0) {
		for (let seg of document.querySelectorAll('.segment')) {
			seg.remove();
		}
	}
	for (let c=0;c<5;c++) {
		addSegment();
	}
	delayedCoords = coords.slice();

}

function changeDir(input) {
	moved = true;
	if (input == 'ArrowUp' && yv != 1) {
		xv=0;
		yv=-1;
	}
	else if (input == 'ArrowDown' && yv != -1) {
		xv=0;
		yv=1;
	}
	else if (input == 'ArrowRight' && xv != -1) {
		xv=1;
		yv=0;
	}
	else if (input == 'ArrowLeft' && xv != 1) {
		xv=-1;
		yv=0;
	}
	else {
		moved = false;
	}
}

function moveSnake() {
	let segs = document.querySelectorAll('.segment');
	delayedCoords = coords;
	for (let c = coords.length-1; c >= 0; c--) {
		if (c>0) {
			coords[c] = coords[c-1].slice();
		}
		else if (c==0) {
			coords[0][0] += xv;
			coords[0][1] += yv;
		}
		//segs[c].style.marginLeft = coords[c][0] * TILESIZE + 'px';
		//segs[c].style.marginTop = coords[c][1] * TILESIZE + 'px';
	}
	if (checkCollision()) {
		console.log('game over');
		blurGame(true);
		gameOverDiv.hidden = false;
		
	}
	else {
		for (let c = 0; c < coords.length; c++) {
			setMargin(segs[c], coords[c]);
		}
	}
}

function spawnApple() {
	while (true) {
		let x = Math.floor(Math.random() * 15);
		let y = Math.floor(Math.random() * 15);
		if (!coords.some(function(coord) {coord == [x,y]})) {
			appleCoords = [x, y];
			break;
		};
	}
	let apple = document.createElement('div');
	grid.prepend(apple);
	apple.className = 'apple';
	setMargin(apple, appleCoords);
}

function setMargin(div, coords) {
	div.style.marginLeft = coords[0] * TILESIZE + 'px';
	div.style.marginTop = coords[1] * TILESIZE + 'px';
}

function addSegment() {
	let seg = document.createElement('div');
	grid.append(seg);
	seg.className = 'segment';
	if (document.querySelectorAll('.segment').length > coords.length) {
		coords.push(coords.at(-1));
	}
	setMargin(seg, coords.at(-1));
}

function compare(arr1, arr2) {
	if (arr1.length == arr2.length) {
		for (let c = 0; c < arr1.length; c++) {
			if (arr1[c] != arr2[c]) {
				return false;
			}
		}
		return true;
	}
	else {return false;}
}

function checkCollision() {
	let collision = false;
	for (let seg of coords.slice(1)) {
		if (seg[0] == coords[0][0] && seg[1] == coords[0][1]) {
			collision = true;
		}
	}
	if ([-1, 15].includes(coords[0][0]) || [-1, 15].includes(coords[0][1])) {collision = true;}

	return collision;
}

// true = blur, false = unblur
function blurGame(toggle) {
	let toggleList = document.querySelectorAll('.segment, .apple');
	for (let element of toggleList) {
		if (toggle) {
			element.classList.add('blurred');
		}
		else {element.classList.remove('blurred');}
	}
}

// player input
document.addEventListener('keydown', function(event) {
	let input = event.code;

	if (input == 'Escape') {
		if (running && gameOverDiv.hidden) {
			blurGame(true)
			pausedDiv.hidden = false;
			running=false;
		}
		else if (!running && gameOverDiv.hidden) {
			blurGame(false)
			pausedDiv.hidden = true;
			running = true;
		}

		if (!gameOverDiv.hidden) {
			resetGame();
		}
	}

	if (input == 'ArrowUp' || input == 'ArrowDown' || input == 'ArrowRight' || input == 'ArrowLeft') {
		moves.push(input);
	}
});

// game loop
let gameLoop = setInterval(function() {
	if (running && gameOverDiv.hidden) {
		while(true) {
			if (moves.length == 0) {break;};
			changeDir(moves[0]);
			moves = moves.slice(1);
			if (moved) {break;};
		}
		moveSnake();

		// apple collision check
		if (compare(coords[0], appleCoords)) {
			score += 1;
			scoreDiv.innerText = 'SCORE: ' + score;
			document.querySelector('.apple').remove();
			spawnApple();
			addSegment();
		}
	}
}, GAMETICK);