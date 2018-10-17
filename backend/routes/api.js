var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var moment = require('moment');
var dbConfigure = require('../configures/database.config.js');

router.get('/info', function(req, res, next) {
	res.status(200).send(JSON.stringify({
		status:'SUCCESS.',
		db_cfg:dbConfigure}));
});

router.get('*', function(req, res, next) {
	var result = {
		status : 'FAILED.',
		details : 'NO API MATCH!'
	};
	res.status(404).send(JSON.stringify(result));
});

module.exports = router;
