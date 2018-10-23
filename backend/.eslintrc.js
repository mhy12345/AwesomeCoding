module.exports = {
	"extends": "eslint:recommended",
	env: {
		"es6": true, // 支持新的 ES6 全局变量，同时自动启用 ES6 语法支持
		"node": true // 启动node环境

	},
	rules: {
		'no-undef': 'warn',
		'no-console': 'warn',
		'no-unused-vars': 'off',
	}
};
