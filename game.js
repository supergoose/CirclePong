window.onload = function() {
	var canvas = document.getElementById("canvas"),
		context = canvas.getContext("2d"),
		width = canvas.width = window.innerWidth,
		height = canvas.height = window.innerHeight,
		paddle = particle.create(width / 2, height - 10, 0, 0),
		ball = particle.create(width/2, height/2, 9, Math.random()*Math.PI*2),
		circleRadius = ((width < height)? width : height)/3,
		paddleWidth = 100, //should be half the circle radius
		paddleHeight = 8,
		ballRadius = 5,
		mappedAngle = 0,
		horz = 0,
		leftDown = false,
		rightDown = false,
		paddleSpeed = 20,
		numHits = 0;

	paddle.x -= paddleWidth/2;
	paddle.y -= paddleHeight/2;


	update();

	document.body.addEventListener("mousemove", onMouseMove);
	document.body.addEventListener("keydown", onKeyDown);
	document.body.addEventListener("keyup", onKeyUp);

	function reset()
	{
		ball.x = width/2;
		ball.y = height/2;

		paddleSpeed = 20;
		numHits = 0;

		var ballVelocity = vector.create(ball.vx, ball.vy);
		ballVelocity.setLength(9);
		ball.vx = ballVelocity.getX();
		ball.vy = ballVelocity.getY();
	}

	function loadXMLDoc()
	{
		var xmlhttp;
		if (window.XMLHttpRequest)
		{// code for IE7+, Firefox, Chrome, Opera, Safari
		  	xmlhttp=new XMLHttpRequest();
		}
		else
		{// code for IE6, IE5
		  	xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		}
		xmlhttp.onreadystatechange=function()
		{
		  	if (xmlhttp.readyState==4 && xmlhttp.status==200)
		    {
		    	///document.getElementById("myDiv").innerHTML=xmlhttp.responseText;
		    	//put the response text into a local variable
		    }
		}
		xmlhttp.open("GET","ajax_info.txt",true);
		xmlhttp.send();
	}

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

		context.clearRect(0, 0, width, height);

		if(utils.circleInRotatedRect(ball.x, ball.y, ballRadius, paddle.x, paddle.y, paddleWidth, paddleHeight*2, -mappedAngle))
		{
			

			//calculate the angle of incidence
			var velocity = vector.create(ball.vx, ball.vy);

			var normalAngle = mappedAngle+Math.PI/2;
			var reflection = velocity.getAngle() - normalAngle + Math.PI;

			velocity.setAngle(velocity.getAngle()-reflection);
			//velocity.setLength(velocity.getLength()*1.1);

			ball.vy = velocity.getY();
			ball.vx = velocity.getX();

			paddleSpeed *=1.01;
			numHits++;
			

		}

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


		ball.update();

		//UI
  		context.font = "bold 60px Times";
  		context.fillText(numHits, width/2, height/2);

		//draw the players paddle
		context.save()
		context.translate(paddle.x, paddle.y);
		context.rotate(mappedAngle);

		context.beginPath();
      	context.rect(-paddleWidth/2, -paddleHeight/2, paddleWidth, paddleHeight);
      	context.fill();

		context.restore();
		
		context.beginPath();
		context.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2, false);
		context.fill();


		requestAnimationFrame(update);
	}

}