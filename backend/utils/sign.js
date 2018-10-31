var async = require('async');
var mysql = require('mysql');
var mysql_initializer = require('./mysql_initializer');
var mysql_config = require('../configures/database.config.js');

var log4js = require("log4js");
var log4js_config = require("../configures/log.config.js").runtime_configure;
log4js.configure(log4js_config);
var logger = log4js.getLogger('log_file')

function getSign(Params) {
	let arr = [];
	for(let i in Params) {
		arr.push(i);
	}
	arr.sort();
	let str = '';
}

module.exports = {
	getSign
};
