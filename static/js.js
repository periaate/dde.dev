
class ThemeToggle extends HTMLElement {
	constructor() {
		super();
		this.setAttribute('data-theme', localStorage.getItem('theme') ?? 'user');
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
		localStorage.setItem('theme', theme);
	}
}

customElements.define('theme-toggle', ThemeToggle);
