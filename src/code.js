const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let gameInterval;

let x, y, cx, cy, dcx, dcy, vx, vy, releaseAngle;

let ballz = [];

let vel = 5;

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
	clearInterval(gameInterval);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	x = canvas.width / 2;
	y = canvas.height - 10;
	drawBall(x, y, ballColor, ballRadius);
	ballz.push({x, y, vx, vy});
	x -= 100;
	ballz.push({x, y, vx, vy});

	ballz.forEach(function(ball){
		console.log(ball.x);
	});

	drawRect();
	canvas.addEventListener('mousedown', addEventListeners);
}

function addEventListeners(){
	canvas.addEventListener('mousemove', startAiming);
	canvas.addEventListener('mouseup', release);
}

function removeEventListeners(){
	canvas.removeEventListener('mousedown', addEventListeners);
	canvas.removeEventListener('mousemove', startAiming);
	canvas.removeEventListener('mouseup', release);
}

function drawBall(x, y, color, ballRadius){
	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.arc(x, y, ballRadius, 0, 2 * Math.PI);
	ctx.fill();
	ctx.closePath();
}

function drawRect(){
	ctx.beginPath();
	ctx.fillStyle = "blue";
	ctx.fillRect(canvas.width / 4, 0, canvas.width / 2, 10);
	ctx.closePath();
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
	dcx = event.offsetX;
	dcy = event.offsetY;

	console.log(dcx, dcy);

	drawBall(x, y, ballColor, ballRadius);
	drawRect();
	drawAim(dcx, dcy, 3);

}

function release(){
	if(gameRun){
		gameInterval = setInterval(gameLoop, 10);
		gameRun = false;
	}
	
	removeEventListeners();

	let ydist = y - dcy;
	let xdist = dcx - x;

	releaseAngle = Math.atan((y - dcy)/(dcx - x));

	if(releaseAngle > Math.PI/4){
		ballz.forEach(function(ball){
			ball.vx = vel * Math.cos(releaseAngle);
			ball.vy = -vel * Math.sin(releaseAngle);
		})
		//vx = vel * Math.cos(releaseAngle);
		//vy = -vel * Math.sin(releaseAngle);
	}else{
		vx = -vel * Math.cos(releaseAngle);
		vy = vel * Math.sin(releaseAngle);
	}

	//console.log(releaseAngle);
}

//function addBall()

function gameLoop(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawRect();

	ballz.forEach(function(ball){
		drawBall(ball.x, ball.y, ballColor, ballRadius);
		if(ball.x + ball.vx < ballRadius || ball.x + ball.vx > canvas.width - ballRadius){
			ball.vx = -ball.vx;
			console.log("vx = " + ball.vx);
		}
		if(ball.y + ball.vy < ballRadius){
			ball.vy = -ball.vy;
			console.log("vy = " + ball.vy);
		}else if(ball.y + ball.vy > canvas.height - ballRadius){
			ball.vx = 0;
			ball.vy = 0;
			canvas.addEventListener('mousedown', addEventListeners);
			clearInterval(gameInterval);
			gameRun = true;
		}
		ball.x += ball.vx;
		ball.y += ball.vy;
	})
	//ball staying in the canvas rules
}