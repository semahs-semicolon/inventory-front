module.exports = {
	root: true,
	plugins: ['@typescript-eslint'],
	extends: ['eslint:recommended', 'prettier', 'plugin:svelte/recommended', 'plugin:@typescript-eslint/recommended'],
	overrides: [{ files: ['*.svelte']}],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	}
};
