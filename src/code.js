const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let gameInterval;

let x, y, cx, cy, dcx, dcy, vx, vy, releaseAngle;

let vel = 5;

let ballz = [];

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
	ballz = [];
	drawBall(x, y, ballColor, ballRadius);

	for(let i = 0; i < 10; i++){
		ballz.push({x, y, vx, vy});
	}

	drawRect(canvas.width / 4, 0, canvas.width / 2, 10, 'blue');
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

function drawRect(x, y, dx, dy, color){
	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.fillRect(x, y, dx, dy);
	ctx.closePath();
}

function cutCircle(ctx, x, y, radius){
	ctx.globalCompositeOperation = 'destination-out';
	ctx.arc(x, y, radius, 0, Math.PI*2, true);
	ctx.fill();
}

function drawAim(finX, finY, numBalls){
	numBalls += 1;
	for(i = 1; i <= numBalls; i++){
		ballX = ballz[0].x - (i * (ballz[0].x - finX) / numBalls);
		ballY = ballz[0].y - (i * (ballz[0].y - finY) / numBalls);
		drawBall(ballX, ballY, 'red', 5);
	}

}

function startAiming(event){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	dcx = event.offsetX;
	dcy = event.offsetY;

	drawBall(ballz[0].x, ballz[0].y, ballColor, ballRadius);
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

	releaseAngle = Math.atan((ballz[0].y - dcy)/(dcx - ballz[0].x));

	if(releaseAngle > 0){
		ballz.forEach(function(ball){
			ball.vx = vel * Math.cos(releaseAngle);
			ball.vy = -vel * Math.sin(releaseAngle);
		});
		//vx = vel * Math.cos(releaseAngle);
		//vy = -vel * Math.sin(releaseAngle);
	}else{
		ballz.forEach(function(ball){
			ball.vx = -vel * Math.cos(releaseAngle);
			ball.vy = vel * Math.sin(releaseAngle);
		});
	}

	//console.log(releaseAngle);
}


function gameLoop(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawRect(canvas.width / 4, 0, canvas.width / 2, 10, 'blue');
	ballz.forEach(function(ball){
		setTimeout(function(){
			drawBall(ball.x, ball.y, ballColor, ballRadius);
			if(ball.x + ball.vx < ballRadius || ball.x + ball.vx > canvas.width - ballRadius){
				ball.vx = -ball.vx;
				//console.log("vx = " + ball.vx);
			}
			if(ball.y + ball.vy < ballRadius){
				ball.vy = -ball.vy;
				//console.log("vy = " + ball.vy);
			}else if(ball.y + ball.vy > canvas.height - ballRadius){
				ball.vx = 0;
				ball.vy = 0;
			}
			var ballsMoving = ballz.every(function(ball){
				if(ball.vx == 0 && ball.vy == 0){
					return true
				}
			})
			if(ballsMoving){
					canvas.addEventListener('mousedown', addEventListeners);
					clearInterval(gameInterval);
					gameRun = true;
				}
			ball.x += ball.vx;
			ball.y += ball.vy;
		}, ballz.indexOf(ball) * 100);
	})
}