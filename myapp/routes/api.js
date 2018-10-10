var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var moment = require('moment');

router.get('*',function(req,res,next) {
	var result = {
		status : 'FAILED.',
		details : 'NO API MATCH!'
	}
	res.send(JSON.stringify(result));
});

module.exports = router;
