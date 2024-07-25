


const { execFileSync } = require('child_process');

function execCmd(cmd, ...args) {
	try {
		// Execute the command with the provided arguments
		const output = execFileSync(cmd, args, { encoding: 'utf8' });
		return output.trim();
	} catch (error) {
		// Return the error message if the command fails
		return `cmd: ${cmd}, args: ${args}, Error: ${error.message}`;
	}
}

//cd to pages
process.chdir('./pages');
console.log(process.cwd());
// Example usage
const results = execCmd('list', 'r', '?', '.md');
console.log(results);

process.chdir('..');
console.log(process.cwd());



function meta(cnt) {
	const line = cnt.split('\n')[0];
	const split = line.split(';;');
	return `
		<title>${split[0]}</title>
		<meta property="og:title" content="${split[0]}" >
		<meta property="og:site_name" content="dde.dev">
		<meta property="og:url" content="https://dde.dev">
		<meta property="og:description" content="${split[1]}">
		<meta property="og:type" content="profile">
	`
}

function readFiles(paths) {
	const result = {}
	paths.map((path) => {
		const p = execCmd('fsio', 'name', path);
		try {
			const data = execCmd('fsio', 'read', path);
			const fixed = p.replaceAll(".part", "")
			console.log(fixed)
			result[fixed] = data;
		} catch (error) {
			console.error(`Error reading file at ${path}:`, error);
			result[p] = null;
		}
	});

	return result;
}



function parse(obj, cnt) {
	return `
	<!DOCTYPE html>
	<html>
	<head>
		${obj.head}
		${cnt.meta}
	</head>
	<body>
	<header>
		${obj.header}
	</header>
	<main>
		${cnt.main}
	</main>
	<footer>
		${obj.footer}
	</footer>
	</body>
	</html>
	`
}

const fs = require('fs');


process.chdir('./parts');
console.log(process.cwd());

const result = execCmd('list');
console.log(result);
const paths = result.split('\n');
const obj = readFiles(paths);
console.log(obj);

process.chdir('..');

console.log(process.cwd());

console.log(results);


results.split('\n').forEach((file) => {
	let n = execCmd('fsio', 'name', file);
	let dir = execCmd('fsio', 'dir', file);
	dir = dir.replaceAll("./", "").replaceAll(".", "");
	n = n.replaceAll("./", "");
	console.log(n, file, dir);


	const tar = `./compiled/${dir}/${n}.html`.replace("//", "/").replace("././", "./");
	console.log(tar)
	file = `./pages/${file}`
	execCmd('mdtohtml', file, tar);
	const m = meta(execCmd('fsio', 'read', file))

	const cnt = {
		"meta": m,
		"main": execCmd('fsio', 'read', tar),
	}

	const fin = parse(obj, cnt);
	const out = `./${dir}/${n}.html`.replace("//", "/").replace("././", "./");
	console.log(out, fin);
	fs.writeFileSync(out, fin);
});
