const { overrides } = require('@netlify/eslint-config-node')
module.exports = {
	env: {
		commonjs: true,
		es6: true,
	},
	parserOptions: {
		ecmaVersion: '2019',
	},
	overrides: [...overrides],
	extends: 'prettier',
	rules: {},
}
