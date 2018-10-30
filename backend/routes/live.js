// 直播页面的api
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var getConnection = require('../utils/funcs').getConnection;
var doSqlQuery = require('../utils/funcs').doSqlQuery;

var log4js = require("log4js");
var log4js_config = require("../configures/log.config.js").runtime_configure;
log4js.configure(log4js_config);
var logger = log4js.getLogger('log_file');

router.post('/send_message', function (req, res, next) {
	// decide if the user has logged in
	logger.info('[post] send message\n', req.body);
	if (typeof req.session.user_id === 'undefined') {
		res.send(JSON.stringify({
			status: 'FAILED.',
			details: 'USER OFFLINE.'
		}));
		logger.error('Not login.');
	}
	res.send(JSON.stringify({
		status: 'SUCCESS.'
	}));
	logger.info('[res]');
});

module.exports = router;
