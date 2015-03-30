window.onload = function() {

	/*
	First game in JS / HTML5.
	Simple one player pong game.
	Mostly procedural with a bit of OOP.
	 (c) Andrew Sargeant 2015
	 */

	var canvas = document.getElementById("canvas"),
		context = canvas.getContext("2d"),
		width = canvas.width = window.innerWidth,
		height = canvas.height = window.innerHeight,
		paddle = particle.create(width / 2, height - 10, 0, 0),
		ball = particle.create(width/2, height/2, width/150, Math.random()*Math.PI*2),
		circleRadius = ((width < height)? width : height)/2.5,
		paddleWidth = circleRadius/3, //should be half the circle radius
		paddleHeight = 8,
		ballRadius = 8,
		mappedAngle = 0,
		horz = 0,
		leftDown = false,
		rightDown = false,
		paddleSpeed = 20,
		numHits = 0,
		highscore = 0;

	paddle.x -= paddleWidth/2;
	paddle.y -= paddleHeight/2;


	update();

	window.addEventListener("resize", onWindowResize);


	/*** EVENTS ***/

	/*
	Window Resize
	-------------
	Called whenever the window size changes.
	Resets our vars for width and height.
	Adjusts game space
	*/
	function onWindowResize()
	{
		width = canvas.width = window.innerWidth;
		height = canvas.height = window.innerHeight;
		circleRadius = ((width < height)? width : height)/2.5;
		paddleWidth = circleRadius/3;
	}

	//Two control methods - mouse or keyboard
	document.body.addEventListener("mousemove", onMouseMove);
	document.body.addEventListener("keydown", onKeyDown);
	document.body.addEventListener("keyup", onKeyUp);

	/*
	On Mouse Move
	-------------
	Called whenever the mouse moves.
	Sets the var for mapped horizontal to whatever the mouseX is.
	*/
	function onMouseMove(event)
	{

		//get a normalised sum of mouse x value
		horz = event.clientX;
	}

	function onKeyDown(event)
	{
		
		if(event.keyCode == 37)
		{
			leftDown = true;
		}
		if(event.keyCode == 39)
		{
			rightDown = true;
		}

	}

	function onKeyUp(event)
	{
		if(event.keyCode == 37)
		{
			leftDown = false;
		}
		if(event.keyCode == 39)
		{
			rightDown = false;
		}

	}

	function reset()
	{
		ball.x = width/2;
		ball.y = height/2;

		if(numHits > highscore)
			highscore = numHits;

		numHits = 0;

		var ballVelocity = vector.create(ball.vx, ball.vy);
		ballVelocity.setLength(9);
		ball.vx = ballVelocity.getX();
		ball.vy = ballVelocity.getY();
	}

	

	function updatePaddle()
	{

		if(leftDown)
		{
			horz -= paddleSpeed;
		}

		if(rightDown)
		{
			horz += paddleSpeed;
		}

		mappedAngle = utils.map(horz, 0, width, 0, Math.PI * 3);
		if(mappedAngle > Math.PI*2)
		{
			mappedAngle -= Math.PI*2;
		}

		paddle.x = width / 2 + Math.cos(mappedAngle) * circleRadius;
		paddle.y = height / 2 + Math.sin(mappedAngle) * circleRadius;

		mappedAngle-=Math.PI/2;
	}


	function update() {

		updatePaddle();


		collisionDetection();
		ball.update();
		checkEndGame();

		render();

		requestAnimationFrame(update);
	}

	function collisionDetection()
	{
		if(utils.circleInRotatedRect(ball.x, ball.y, ballRadius, paddle.x, paddle.y, paddleWidth, paddleHeight*2, -mappedAngle))
		{

			//calculate the angle of incidence
			var velocity = vector.create(ball.vx, ball.vy);

			var normalAngle = mappedAngle+Math.PI/2;
			var reflection = velocity.getAngle() - normalAngle + Math.PI;

			velocity.setAngle(velocity.getAngle()-reflection);
			velocity.setLength(velocity.getLength()*1.001);

			ball.vy = velocity.getY();
			ball.vx = velocity.getX();

			numHits++;
			

		}
	}

	function checkEndGame()
	{
		if(ball.x <= -ballRadius || ball.x >= width+ballRadius)
		{
			//ball.vx*=-1;
			reset();
		}
		if(ball.y <= -ballRadius || ball.y >= height+ballRadius)
		{
			//ball.vy*=-1;
			reset();
		}
	}

	function render()
	{
		context.clearRect(0, 0, width, height);
		drawUI();
  		drawPaddle();
  		drawBall();
	}

	function drawUI()
	{
		context.font = "bold 30px Arial";
  		context.textAlign = "center";
  		context.fillStyle = "#bbbbbb";
  		context.fillText(highscore, width/2, height/2 + 40);

		context.fillStyle = "#000000";
  		context.font = "bold 60px Arial";
  		context.fillText(numHits, width/2, height/2);
	}

	function drawPaddle()
	{
		//draw the players paddle
		context.save()
		context.translate(paddle.x, paddle.y);
		context.rotate(mappedAngle);

		context.beginPath();
      	context.rect(-paddleWidth/2, -paddleHeight/2, paddleWidth, paddleHeight);
      	context.fill();

		context.restore();
	}

	function drawBall()
	{
		context.beginPath();
		context.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2, false);
		context.fill();
	}

}