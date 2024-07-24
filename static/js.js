
// load local storage
const load = name => { return localStorage.getItem(name) ?? 'user'; }

// save local storage
const save = name => data => { localStorage.setItem(name, data); }

class ThemeToggle extends HTMLElement {
	constructor() {
		super();
		const pref = load('theme');
		this.setAttribute('data-theme', pref);
	}

	connectedCallback() { this.addEventListener('click', this.toggleTheme); }
	disconnectedCallback() { this.removeEventListener('click', this.toggleTheme); }

	toggleTheme() {
		const dtheme = this.getAttribute('data-theme');
		const theme =
			dtheme === 'user' ? 'dark' :
			dtheme === 'dark' ? 'light' :
			'user';
		this.setAttribute('data-theme', theme);
		save('theme')(theme);
	}
}

customElements.define('theme-toggle', ThemeToggle);
