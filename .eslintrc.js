const { overrides } = require('@netlify/eslint-config-node')
module.exports = {
	env: {
		node: true,
	},
	parserOptions: {
		ecmaVersion: '2019',
	},
	overrides: [...overrides],
	extends: 'prettier',
	rules: {},
}
