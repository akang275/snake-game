// creates visible board
let grid = document.querySelector('.grid');
for (let x = 0; x < 225; x++) {
	let tile = document.createElement('div');
	tile.className = 'tile';
	grid.append(tile);
}

// creates snake div
let segObjList = new Array();
let head = new Snake(300, 300, 'snake up');
segObjList.push(head);

let segDivList = document.querySelectorAll('.snake');
grid.append(document.createElement('div'))
segDivList[0].className = segObjList[0].classes;


let snake = document.createElement('div');
snake.className = 'snake up';
grid.append(snake);
let snakeX = 300;
let snakeY = 300;
snake.style.marginLeft = snakeX + 'px';
snake.style.marginTop = snakeY + 'px';

addSegment();

// creates score div
let score = 0;
let scoreDiv = document.querySelector('.score');
scoreDiv.innerText = 'Score: ' + score;

// functions
function changeDir(input) {
	if (input == 'ArrowUp') {
		snake.className = 'snake up';
	}
	else if (input == 'ArrowDown') {
		snake.className = 'snake down';
	}
	else if (input == 'ArrowRight') {
		snake.className = 'snake right';
	}
	else if (input == 'ArrowLeft') {
		snake.className = 'snake left';
	}
}

function findTile(input) {
	let searching = setInterval(function() {
		if (snakeX%50==0&&snakeY%50==0) {
			changeDir(input);
			clearInterval(searching);
		}
	}, 1);
}

function addSegment() {
	let segment = document.createElement('div');
	let lastSegment = segmentList.slice(-1);
	segment.className = lastSegment.className;
	segment.style.marginLeft = lastSegment.style.marginLeft;
	segment.style.marginTop = lastSegment.style.marginTop;
	grid.append(segment);
}

class Segment {
	constructor(x, y, classes) {
		this.x = x;
		this.y = y;
		this.classes = classes;
	}
}

// player input
document.addEventListener('keydown', function(event) {
	let input = event.code;

	if (input == 'Escape') {
		if (running) {running=false;}
		else {running = true};
	}

	if ((input == 'ArrowUp' || input == 'ArrowDown')&&snake.classList.contains('right')) {
		if (snakeX%50<=10) {
			snakeX -= snakeX%50;
			changeDir(input);
		}
		else {
			findTile(input);
		}
	}
	else if ((input == 'ArrowUp' || input == 'ArrowDown')&&snake.classList.contains('left')) {
		if (snakeX%50>=40) {
			snakeX += 50 - snakeX%50;
			changeDir(input);
		}
		else {
			findTile(input);
		}
	}
	else if ((input == 'ArrowRight' || input == 'ArrowLeft')&&snake.classList.contains('up')) {
		if (snakeY%50>=40) {
			snakeY += 50 - snakeY%50;
			changeDir(input);
		}
		else {
			findTile(input);
		}
	}
	else if ((input == 'ArrowRight' || input == 'ArrowLeft')&&snake.classList.contains('down')) {
		if (snakeY%50<=10) {
			snakeY -= snakeY%50;
			changeDir(input);
		}
		else {
			findTile(input);
		}
	}
});

function moveSegments() {
	for (let x = 1; x < segmentList.length; x++) {
		segmentList[x].marginLeft = segmentList[x-1].marginLeft - 50;
	}
}

// game loop

let running = true;
let GAMETICK = 5;
let counter = 0;
let speed = 1;

let gameLoop = setInterval(function() {
	if (running) {
		
		counter += 1;


		snake.style.marginLeft = snakeX + 'px';
		snake.style.marginTop = snakeY + 'px';
		if (snake.classList.contains('right')) {
			snakeX += speed;
			snake.style.marginLeft = snakeX + 'px';
		}
		if (snake.classList.contains('left')) {
			snakeX -= speed;
			snake.style.marginLeft = snakeX + 'px';
		}
		if (snake.classList.contains('up')) {
			snakeY -= speed;
			snake.style.marginTop = snakeY + 'px';
		}
		if (snake.classList.contains('down')) {
			snakeY += speed;
			snake.style.marginTop = snakeY + 'px';
		}
	}
}, GAMETICK);