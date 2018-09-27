var express = require('express');
var connection = require('../utils/database');
var router = express.Router();

/* GET home page. */
router.get('/show_table', function(req, res, next) {
	sql = 'SELECT * from ' + req.query.table_name;
	text = '>>>>> ' + sql + '<br/>';

	connection.query(sql, function (error, results, fields) {
		if (error) {
			text += "ERROR ... " + error;
			res.send(text);
		}else {
			console.log(results);
			for (var i=0;i<results.length;i++) {
				text += JSON.stringify(results[i]) + "<br/>";
			}
			res.send(text);
		}
	});
});

router.get('/do_query', function(req,res,next) {
	sql = req.query.sql;
	connection.query(sql, function (error, results, fields) {
		if (error) {
			text += "ERROR ... " + error;
			res.send(text);
		}else {
			res.send("Success.");
		}
	});

});

module.exports = router;
