window.onload = function() {
	var canvas = document.getElementById("canvas"),
		context = canvas.getContext("2d"),
		width = canvas.width = window.innerWidth,
		height = canvas.height = window.innerHeight,
		paddle = particle.create(width / 2, height - 10, 0, 0),
		ball = particle.create(width/2, height/2, 2, -Math.PI/2),
		circleRadius = ((width < height)? width : height)/3,
		paddleWidth = circleRadius/2, //should be half the circle radius
		paddleHeight = paddleWidth/10,
		ballRadius = paddleWidth/10,
		mappedAngle = 0;

	paddle.x -= paddleWidth/2;
	paddle.y -= paddleHeight/2;


	update();

	document.body.addEventListener("mousemove", onMouseMove);

	function onMouseMove(event)
	{

		//map the client x to the circular motion

		//get a normalised sum of mouse x value
		mappedAngle = utils.map(event.clientX, 0, width, 0, Math.PI * 4);

		paddle.x = width / 2 - paddleWidth/2 + Math.cos(mappedAngle) * 200;
		paddle.y = height / 2 - paddleHeight/2 + Math.sin(mappedAngle) * 200;

		//rotate to face middle

	}


	function update() {
		context.clearRect(0, 0, width, height);

		//check the ball bounce
		//console.log("In rect: " + utils.circleInRotatedRect(ball.x, ball.y, 8, paddle.x, paddle.y, paddleWidth, paddleHeight, mappedAngle - Math.PI/2);

		if(utils.circleInRotatedRect(ball.x, ball.y, 8, paddle.x, paddle.y, paddleWidth, paddleHeight, mappedAngle))
		{
			//window.alert("Hit");
			ball.dy *=-1;
		}
		ball.update();

		//draw the players paddle
		context.save()
		context.translate(paddle.x + paddleWidth/2, paddle.y + paddleHeight/2);
		context.rotate(mappedAngle-Math.PI/2);

		context.beginPath();
      	context.rect(-paddleWidth/2, -paddleHeight/2, paddleWidth, paddleHeight);
      	context.fill();

		context.restore();
		
		context.beginPath();
		context.arc(ball.x, ball.y, 8, 0, Math.PI * 2, false);
		context.fill();

		requestAnimationFrame(update);
	}

}