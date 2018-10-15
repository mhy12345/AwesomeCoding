// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
	"extends": "eslint-config-airbnb",

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
    'vue'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
	'indent': 'warn',
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
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}
