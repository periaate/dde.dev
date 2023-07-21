
console.log("Design inspired by https://p5aholic.me/")


document.addEventListener('mousemove', () => {
	const ball = document.createElement('div');
	// set id
	ball.id = "ball";
	document.getElementById("container").appendChild(ball);
	// document.body.appendChild(ball);
	ball.style.opacity = 1;
	let mouseX = 0;
	let mouseY = 0;

	document.addEventListener('mousemove', (e) => {
		mouseX = e.pageX;
		mouseY = e.pageY;
	});
	const speed = 0.5;

	setInterval(() => {
		const ballX = ball.offsetLeft + ball.clientHeight / 2;
		const ballY = ball.offsetTop + ball.clientHeight / 2;
		const offset = window.innerHeight / 30 ;
		const deltaX = mouseX - ballX - offset;
		const deltaY = mouseY - ballY - offset;
	
		ball.style.left = ball.offsetLeft + deltaX * speed + 'px';
		ball.style.top = ball.offsetTop + deltaY * speed + 'px';
	}, 64);
} , {once: true});

