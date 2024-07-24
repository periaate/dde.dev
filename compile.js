


const { execFileSync } = require('child_process');

function execCmd(cmd, ...args) {
	try {
		// Execute the command with the provided arguments
		const output = execFileSync(cmd, args, { encoding: 'utf8' });
		return output.trim();
	} catch (error) {
		// Return the error message if the command fails
		return `Error: ${error.message}`;
	}
}

//cd to pages
process.chdir('./pages');
// Example usage
const result = execCmd('list', 'pages', 'r', '?', '.md');
console.log(result);

process.chdir('..');

result.split('\n').forEach((file) => {
	const n = execCmd('fsio', 'name', file);
	const dir = execCmd('fsio', 'dir', file);
	console.log(n);


	const tar = `./compiled/${dir}/${n}.html`.replace("//", "/");
	execCmd('mdtohtml', file, tar);

	const cnt = {
		"meta": meta(execCmd('fsio', 'read', file)),
		"main": execCmd('fsio', 'read', tar),
	}

	const fin = parse(cnt);
	const out = `./${dir}/${n}.html`.replace("//", "/");


});

const meta = (cnt) => {
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

const fs = require('fs').promises;

/**
	* Reads the contents of the files at the given paths.
	* @param {string[]} paths - Array of file paths.
	* @returns {Promise<Object>} - A promise that resolves to an object with paths as keys and file contents as values.
	*/
	async function readFiles(paths) {
		const result = {};

		await Promise.all(paths.map(async (path) => {
			try {
				const data = await fs.readFile(path, 'utf8');
				result[path] = data;
			} catch (error) {
				console.error(`Error reading file at ${path}:`, error);
				result[path] = null;
			}
		}));

		return result;
	}

// Example usage
(async () => {
	const paths = result.split('\n');
	const contents = await readFiles(paths);
	console.log(contents);
})();

const parse = (obj) => (cnt) => {
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
	`
}



