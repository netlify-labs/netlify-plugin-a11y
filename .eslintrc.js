const { overrides } = require('@netlify/eslint-config-node')
module.exports = {
	env: {
		node: true,
	},
	parserOptions: {
		ecmaVersion: '2020',
	},
	overrides: [...overrides],
	extends: 'prettier',
	rules: {},
}
