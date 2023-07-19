
console.log("Design inspired by https://p5aholic.me/")

const canvas = document.createElement('canvas');
const w = 128;
const h = 128;
canvas.width = w;
canvas.height = h;
const ctx = canvas.getContext('2d');

var style = document.createElement('style');
document.head.appendChild(style);

blobs = []

async function generateNoise() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); 

	var imageData = ctx.createImageData(w, h);
	for(let i = 0; i < imageData.data.length; i++){
		const value = Math.random() * 120;
		imageData.data[i] = value;
		imageData.data[i+1] = value;
		imageData.data[i+2] = value;
		imageData.data[i+3] = value;
	}
	ctx.putImageData(imageData, 0, 0);
	return new Promise(resolve => {
		canvas.toBlob(blob => {
			resolve(URL.createObjectURL(blob));
		}, 'image/png');
	});
}


while (blobs.length < 10) {
	blobs.push(generateNoise())
}


Promise.all(blobs).then((values) => {
	let blobi = 0
	setInterval(() => {
		blobURL = values[blobi]
		blobi = (blobi + 1) % values.length
		style.innerHTML = `
		.noise-filter {
			background-image: url(${blobURL});
			background-repeat: repeat;
			transition: background-image 0.048s ease-in-out;
			opacity: 0.15;
		}`;
	}, 64)
})


document.addEventListener('mousemove', function(event) {
	const ball = document.getElementById('ball');
	ball.style.opacity = 1;
	let mouseX = 0;
	let mouseY = 0;

	document.addEventListener('mousemove', function(event) {
		mouseX = event.pageX;
		mouseY = event.pageY;
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

