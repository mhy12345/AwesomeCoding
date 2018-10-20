// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',//解析器，这里我们使用babel-eslint

  parserOptions: {
  sourceType: 'module'//类型为module，因为代码使用了使用了ECMAScript模块

  },
  env: {
    browser: true,
  },
	"extends": "eslint:recommended",

	/*
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential', 
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],*/
  // required to lint *.vue files
  plugins: [
    'vue',
	'html',
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
	'indent': 'off',
	'camelcase': 'warn',
	'quotes': 'off',
	'prefer-template': 'off',
	'no-var': 'off',
	'curly': 'warn',
	'nonblock-statement-body-position': 'warn',
	'no-multi-spaces': 'warn',
	'object-curly-newline': 'warn',
	'vars-on-top': 'warn',
	'no-restricted-syntax': 'warn',
	'object-curly-spacing': 'warn',
	'semi': 'warn',
	'space-before-function-paren': 'warn',
	'brace-style': 'warn',
	'no-undef': 'warn',
	'no-console': 'off',
	'no-unused-vars': 'warn',
	'no-redeclare': 'warn',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },
	settings: {
		    'html/html-extensions': ['.html', '.vue'],
		    'html/indent': '+2',
	},
}
