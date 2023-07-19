
console.log("Design inspired by https://p5aholic.me/")


document.addEventListener('mousemove', () => {
	const ball = document.getElementById('ball');
	ball.style.opacity = 1;
	let mouseX = 0;
	let mouseY = 0;

	document.addEventListener('mousemove', (e) => {
		mouseX = e.pageX;
		mouseY = e.pageY;
	});
	const speed = 0.5;

	setInterval(() => {
		const ballX = ball.offsetLeft + ball.clientWidth / 2;
		const ballY = ball.offsetTop + ball.clientHeight / 2;
		const deltaX = mouseX - ballX-64;
		const deltaY = mouseY - ballY-64;
	
		ball.style.left = ball.offsetLeft + deltaX * speed + 'px';
		ball.style.top = ball.offsetTop + deltaY * speed + 'px';
	}, 64);
} , {once: true});

