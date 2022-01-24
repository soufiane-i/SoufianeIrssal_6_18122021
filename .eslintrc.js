module.exports = {
	'env': {
		'browser': true,
		'es2021': true
	},
	'extends': ['eslint:recommended','prettier'
	],
	'parserOptions': {
		'ecmaVersion': 'latest'
	},
	'rules': {
		'prettier/prettier': [
			'error'
		],
		'indent': [
			'error',
			'tab'
		],
		'linebreak-style': [
			'error',
			'windows'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'never'
		]
	}
}
