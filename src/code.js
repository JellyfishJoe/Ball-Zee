const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let gameInterval;

let x, y, cx, cy, dcx, dcy, vx, vy;

let gameRun = true;

let ballRadius = 10;
let ballColor = 'black';
/*
canvas.addEventListener('mousedown', function(){
	startAiming();
	body.addEventListener('mousemove', startAiming);
});
*/
function startGame(){
	x = canvas.width / 2;
	y = canvas.height - 15;
	drawBall(x, y);
	canvas.addEventListener('mousedown', function(){
		canvas.addEventListener('mousemove', startAiming);
		canvas.addEventListener('mouseup', shoot);
	});
	console.log('start');
}

function drawBall(x, y, color, ballRadius){
	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.arc(x, y, ballRadius, 0, 2 * Math.PI);
	ctx.fill();
	ctx.closePath();

	//console.log("drawn");
}

function drawAim(finX, finY, numBalls){
	numBalls += 1;
	for(i = 1; i <= numBalls; i++){
		ballX = x - (i * (x - finX) / numBalls);
		ballY = y - (i * (y - finY) / numBalls);
		drawBall(ballX, ballY, 'red', 5);
	}

}

function startAiming(event){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	let cx = event.offsetX - canvas.width / 2;
	let cy = canvas.height - event.offsetY + 1;
	dcx = event.offsetX;
	dcy = event.offsetY;

	console.log(dcx, dcy);

	drawBall(x, y, ballColor, ballRadius);
	drawAim(dcx, dcy, 3);

}

function shoot(){
	if(gameRun){
		gameInterval = setInterval(gameLoop, 10);
		gameRun = false;
	}
	canvas.removeEventListener('mousemove', startAiming);
	vx = cx;
	vy = cy;
	
}

function gameLoop(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBall(x, y, ballColor, ballRadius);

	//ball staying in the canvas rules
	if(x + vx < ballRadius || x + vx > canvas.width - ballRadius){
		vx = -vx;
	}

	if(y + vy < ballRadius || y + vy > canvas.height - ballRadius){
		vy = -vy;
	}

	x += vx;
	y += vy;
	console.log(x, y);
	//console.log("running");
}