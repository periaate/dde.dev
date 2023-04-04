
const beginBounce = (id) => {
	const el = document.getElementById(id);
	let x = window.innerWidth / 2;
	let y = window.innerHeight / 2;
	let xSpeed = Math.random() * 0.8 + 0.1; // Random speed between 0.1 and 0.9
	let ySpeed = 1 - xSpeed; // Ensure the total speed equals 1

	// Randomize initial direction
	if (Math.random() < 0.5) xSpeed = -xSpeed;
	if (Math.random() < 0.5) ySpeed = -ySpeed;

	const speedMultiplier = 3; // Adjust this value to change the animation speed

	const calcSpeed = (axisSpeed) => {
		const minSpeed = 0.4;
		const maxSpeed = 0.6;
		if (axisSpeed > maxSpeed) {
			return maxSpeed;
		} else if (axisSpeed < minSpeed) {
			return minSpeed;
		}
		return axisSpeed;
	};

	const bounce = () => {
		const width = el.clientWidth;
		const height = el.clientHeight;
		const windowWidth = window.innerWidth;
		const windowHeight = window.innerHeight;

		if (x + width >= windowWidth || x <= 0) {
			xSpeed = -xSpeed * (1 + (Math.random() * 0.2 - 0.1)); // Add random variance
			xSpeed = calcSpeed(Math.abs(xSpeed)) * Math.sign(xSpeed);
			ySpeed = calcSpeed(Math.abs(ySpeed)) * Math.sign(ySpeed);
			ySpeed = Math.sign(ySpeed) * (1 - Math.abs(xSpeed)); // Recalculate ySpeed
		}

		if (y + height >= windowHeight || y <= 0) {
			ySpeed = -ySpeed * (1 + (Math.random() * 0.2 - 0.1)); // Add random variance
			ySpeed = calcSpeed(Math.abs(ySpeed)) * Math.sign(ySpeed);
			xSpeed = calcSpeed(Math.abs(xSpeed)) * Math.sign(xSpeed);
			xSpeed = Math.sign(xSpeed) * (1 - Math.abs(ySpeed)); // Recalculate xSpeed
		}

		x += xSpeed * speedMultiplier;
		y += ySpeed * speedMultiplier;

		el.style.left = x + 'px';
		el.style.top = y + 'px';

		requestAnimationFrame(bounce);
	};
	bounce();
};

window.addEventListener('load', () => {
    beginBounce("bouncing-image");
    beginBounce("bouncing-text");
	spin();
});


let n = 0;
spin = () => {
	const tar = document.getElementById("css");
	n += 0.3;
	tar.innerHTML = `
	body {background-image: linear-gradient(${n}deg,hsl(128, 43%, 19%) 0%,hsl(158deg 91% 17%) 50%,hsl(171deg 96% 20%) 100%);}`
	requestAnimationFrame(spin);
}

// Yes, I know, my website is computationally expensive. Based huh. 😎